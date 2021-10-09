const {SetVoiceQueries} = require("../Structures/SetVoiceQueries");
const {QueryAPNQueries} = require("../Structures/QueryAPNQueries");
const {RentPowerBankQueries} = require("../Structures/RentPowerBankQueries");
const {ConsoleMsgs} = require("../Apis/ConsoleMsgs");
const {ConnectionEvents} = require("../Apis/ConnectionEvents");
const {BACKEND_SERVER} = require("../Apis/Config");
const {HttpRequestHandler} = require("../Apis/HttpRequestHandler");
const {ConnectionOperations} = require("../Apis/ConnectionOperations");
const {PowerBanksInfoQueries} = require("../Structures/PowerBanksInfoQueries");

const StationRouters  = {
    QueryInfo : async (req, res, clientsList) => {
        let {boxId} = req.params
        let client = await ConnectionOperations.getClientByBoxId(clientsList, boxId)
        if(client == false){
            ConsoleMsgs.error("Query info found Client busy")
            res.send({finalResult: false, error: "Station not logged or busy"})
        }else {
            try{
                ConsoleMsgs.success("Query info found Client found free")
                await client.setBusy(true)
                let connection  = client.connection
                if (connection.write(PowerBanksInfoQueries.serverQuery("0007", "01", "8a", "11223344"))) {
                    ConnectionEvents.QueryInfo(clientsList, client, res)
                } else {
                    client.setBusy(false)
                    res.send({finalResult: false, error: "Failed to send request to station"})
                }
            }catch (e){
                client.setBusy(false)
                res.send({finalResult: false, error: "Error while sending request to the station"})
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
                    if (rs.data.powerBanksList.length > 0) {
                        client.setBusy(true)
                        let connection = client.connection
                        if (connection.write(RentPowerBankQueries.serverRequest("0008", "01", "8a", "11223344", rs.data.powerBanksList[0].slot))) {
                            ConnectionEvents.Rent(clientsList, client, res)
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
            }
        } catch (error) {
            res.send({finaResult: false, error: "could not query station for info"})
        }
    },

    QueryAPN :  async (req, res, clientsList) => {
        let {boxId, APNIndex} = req.params
        let client = ConnectionOperations.getClientByBoxId(clientsList, boxId)
        try {
            if (client == false) {
                ConsoleMsgs.error("QueryAPN found Client busy")
                res.send({finalResult: false, error: "Station not logged in or busy"})
            } else {
                ConsoleMsgs.success("QueryAPN found Client found free")
                await client.setBusy(true)
                let connection = client.connection
                if (connection.write(QueryAPNQueries.serverRequest("8a", APNIndex))) {
                    ConnectionEvents.QueryAPN(clientsList, client, res)
                } else {
                    client.setBusy(false)
                    res.send({finaResult: false, error: "could not send rent request"})
                }
            }
        } catch (error) {
            client.setBusy(false)
            res.send({finaResult: false, error: "could not query station for info"})
        }
    },

    SetVoice : async (req, res, clientsList) => {
        try {
            let { boxId, level } = req.params
            level = parseInt(level)
            let client = await ConnectionOperations.getClientByBoxId(clientsList, boxId)
            if (client == false) {
                res.send({finalResult: false, error: "Station not logged in"})
            } else {
                client.setBusy(true)
                let connection = client.connection
                if(connection.write(SetVoiceQueries.serverRequest(level))) {
                    ConnectionEvents.Rent(clientsList, client, res)
                }
                else {
                    client.setBusy(false)
                    res.send({finalResult: false, error: "could not send rent request"})
                }
            }
        } catch (error) {
            res.send({finaResult: false, error: "could not query station for info"})
        }
    },
}



module.exports = {StationRouters}