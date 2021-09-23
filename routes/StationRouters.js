const express = require('express');
const RequestOperations = require("../Apis/RequestOperations");
const CMDs = require("../Apis/CMDs");
const {RentPowerBankResult} = require("../Structures/RentPowerBankRequest");
const {RentPowerBankRequest} = require("../Structures/RentPowerBankRequest");
const {PowerBankQueryResult} = require("../Structures/PowerBankQuery");
const {PowerBankQuery} = require("../Structures/PowerBankQuery");
const router = express.Router();
const StationRouters  = {
    getInfo : (req, res, connection, NormalDataEvent)=>{
        if(connection.write(PowerBankQuery("0007", "01", "8a", "11223344"))) {
            connection.on("data", data => {
                data = data.toString("hex")
                let cmd = RequestOperations.CmdExtractor(data)
                if (cmd != undefined) {
                    if(cmd == CMDs.PowerBankInfo){
                        console.log("setting data trigger to normal")
                        connection.removeAllListeners("data")
                        connection.on("data", data=>{
                            data = data.toString('hex')
                            NormalDataEvent(this.connection, data)
                        })
                        res.send({finalResult: true, data: PowerBankQueryResult(data)})
                    }else {
                        console.log("ignoring data cause waiting for specific")
                    }
                }
            })
        }else {
            res.send({finalResult: false, error: "Failed to send request to station"})
        }
    },
    rentPowerBank : async (req, res, connection, NormalDataEvent) => {
        let requestAddress = 'http://164.132.59.129:3000/queryPowerBankInfo'
        try {
            const request = await axios({url: requestAddress, method: "get", responseType: 'json'})
            let rs = request.data
            if (rs.finalResult == true) {
                if (rs.data.powerBanksList.length > 0) {
                    if (connection.write(RentPowerBankRequest("0008", "01", "8a", "11223344", rs.data.powerBanksList[0].slot))) {
                        connection.on("data", data => {
                            data = data.toString('hex');
                            let cmd = RequestOperations.CmdExtractor(data)
                            if (cmd != undefined) {
                                if (cmd == CMDs.RentPowerBank) {
                                    console.log("setting data trigger to normal")
                                    connection.removeAllListeners("data")
                                    connection.on("data", data => {
                                        data = data.toString('hex')
                                        NormalDataEvent(connection, data)
                                    })
                                    res.send({finalResult: true, data: RentPowerBankResult(data)})
                                } else {
                                    console.log("Ignoring data cause waiting for rent results only")
                                }
                            }
                        })
                    } else {
                        res.send({finaResult: false, error: "could not send rent request"})
                    }
                } else {
                    res.send({finaResult: false, error: "no available power banks on station"})
                }
            } else {
                res.send({finaResult: false, error: rs.error})
            }
        } catch (error) {
            res.send({finaResult: false, error: "could not query station for info"})
        }
    }
    ,
        test : (req, res) => {
            res.send({finalResult: true, error: "Test work"})
        }
    }



module.exports = {StationRouters}