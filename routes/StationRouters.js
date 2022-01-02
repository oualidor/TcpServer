const SetServerQueries = require("../Structures/SetServerQueries");
const {SetVoiceQueries} = require("../Structures/SetVoiceQueries");
const {QueryAPNQueries} = require("../Structures/QueryAPNQueries");
const {RentPowerBankQueries} = require("../Structures/RentPowerBankQueries");
const ConnectionEvents = require("../Apis/ConnectionEvents");
const {BACKEND_SERVER} = require("../Apis/Config");
const {HttpRequestHandler} = require("../Apis/HttpRequestHandler");
const PowerBanksInfoQueries = require("../Structures/PowerBanksInfoQueries");
const e = require("express");

const StationRouters  = {
    SetServer : async (req, res, clientsList) => {
        try{
            let { client } = req
            let { address, port, heartBit }  = req.body
            await client.setBusy(true)
            let connection = client.connection
            let data = SetServerQueries.serverRequest(address, port, heartBit)
            if(connection.write(data)) ConnectionEvents.ServerFirst(clientsList, client, res)
            else{
                client.setBusy(false)
                res.send({finalResult: false, error: "could not send rent request"})
            }
        }
        catch(error){
            console.log(error)
            res.send({finaResult: false, error: "Request failed"})
        }
    },

    QueryInfo : async (req, res, clientsList) => {
        let { client } = req
        try{
            await client.setBusy(true)
            let connection  = client.connection
            if (connection.write(PowerBanksInfoQueries.serverQuery("0007", "01", "8a", "11223344"))) {
                ConnectionEvents.ServerFirst(clientsList, client, res)
            } else {
                client.setBusy(false)
                res.send({finalResult: false, error: "Failed to send request to station"})
            }
        }catch (error){
            client.setBusy(false)
            res.send({finalResult: false, error: "Error while sending request to the station"})
        }
    },

    rentPowerBank : async (req, res, clientsList) => {
        try {
            let { client, boxId} = req
                let requestAddress = BACKEND_SERVER+'Admin/Station/getRealTimeInfo/'+boxId
                const rs = await HttpRequestHandler.GET(requestAddress)
                if (rs.finalResult === true){
                    console.log(rs)
                    if (rs.data.powerBanksList.length > 0) {
                        client.setBusy(true)
                        let connection = client.connection
                        if (connection.write(RentPowerBankQueries.serverRequest("0008", "01", "8a", "11223344", rs.data.powerBanksList[0].slot))) {
                            ConnectionEvents.ServerFirst(clientsList, client, res)
                        } else {
                            client.setBusy(false)
                            res.send({finalResult: false, error: "could not send rent request"})
                        }
                    } else {
                        res.send({finaResult: false, error: "no available power banks on station"})
                    }
                }
                else {
                    console.log(rs)
                    res.send({finaResult: false, error: "error while communicating with back end"})
                }

        } catch (error) {
            console.log(error)
            res.send({finaResult: false, error: "could not query station for info"})
        }
    },

    QueryAPN :  async (req, res, clientsList) => {
        try {
            let { client, boxId} = req
            let { APNIndex } = req.params
            await client.setBusy(true)
            let connection = client.connection
            if (connection.write(QueryAPNQueries.serverRequest("8a", APNIndex))) {
                ConnectionEvents.ServerFirst(clientsList, client, res)
            } else {
                client.setBusy(false)
                res.send({finaResult: false, error: "could not send rent request"})
            }

        } catch (error) {

            res.send({finaResult: false, error: "could not query station for info"})
        }
    },

    SetVoice : async (req, res, clientsList) => {
        try {
            let { level } = req.params, {client} = req
            level = parseInt(level)
            client.setBusy(true)
            let connection = client.connection
            if(connection.write(SetVoiceQueries.serverRequest(level))) {
                ConnectionEvents.ServerFirst(clientsList, client, res)
            }
            else {
                client.setBusy(false)
                res.send({finalResult: false, error: "could not send rent request"})
            }
        } catch (error) {
            res.send({finaResult: false, error: "could not query station for info"})
        }
    },
}



module.exports = {StationRouters}
