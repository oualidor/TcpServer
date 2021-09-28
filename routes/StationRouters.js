const express = require('express');
const RequestOperations = require("../Apis/RequestOperations");
const CMDs = require("../Apis/CMDs");
const {ConnectionEvents} = require("../Apis/ConnectionEvents");
const {BACKEND_SERVER} = require("../Apis/Config");
const {HttpRequestHandler} = require("../Apis/HttpRequestHandler");
const {ConnectionOperations} = require("../Apis/ConnectionOperations");
const {RentPowerBankResult} = require("../Structures/RentPowerBankRequest");
const {RentPowerBankRequest} = require("../Structures/RentPowerBankRequest");
const {PowerBankQuery} = require("../Structures/PowerBankQuery");
const StationRouters  = {
    QueryInfo : async (req, res, clientsList) => {
        let {boxId} = req.params
        let client = await ConnectionOperations.getClientByBoxId(clientsList, boxId)
        if(client == false){
            res.send({finalResult: false, error: "Station not logged in"})
        }else {
            let connection  = client.connection
            try{
                if (connection.write(PowerBankQuery("0007", "01", "8a", "11223344"))) {
                    ConnectionEvents.PowerBankQuery(clientsList, connection, res)
                } else {
                    res.send({finalResult: false, error: "Failed to send request to station"})
                }
            }catch {
                res.send({finalResult: false, error: "Failed to send request to station"})
            }
        }

    },
    rentPowerBank : async (req, res, clientsList) => {
        try {
            let { boxId } = req.params
            let client = await ConnectionOperations.getClientByBoxId(clientsList, boxId)
            if (client == false) {
                res.send({finalResult: false, error: "Station not logged in"})
            } else {
                let requestAddress = BACKEND_SERVER+'Admin/Station/getRealTimeInfo/'+boxId
                const rs = await HttpRequestHandler.GET(requestAddress)
                if (rs.finalResult == true) {
                    let connection = client.connection
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
                                            ConnectionEvents.General(connection, data)
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
                }
                else {
                    console.log(rs)
                    res.send({finaResult: false, error: "error while communicating with back end"})
                }
            }
        } catch (error) {
            res.send({finaResult: false, error: "could not query station for info"})
        }
    }
    ,
        test : (req, res, clientsList) => {
            res.send({finalResult: true, data: clientsList})
            //res.send({finalResult: true, error: "Test work"})
        }
    }



module.exports = {StationRouters}