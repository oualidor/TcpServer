const RequestOperations = require("../Apis/RequestOperations");
const {QueryAPNQueries} = require("../Structures/QueryAPNQueries");
const {CMDs} = require("../Apis/CMDs");
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
            res.send({finalResult: false, error: "Station not logged in"})
        }else {
            let connection  = client.connection
            try{
                if (connection.write(PowerBanksInfoQueries.serverQuery("0007", "01", "8a", "11223344"))) {
                    ConsoleMsgs.debug("PowerBanksInfoQueries sent ")
                    ConnectionEvents.PowerBankQuery(clientsList, connection, res)
                } else {
                    res.send({finalResult: false, error: "Failed to send request to station"})
                }
            }catch (e){
                console.log(e)
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
                    let connection = client.connection
                    if (rs.data.powerBanksList.length > 0) {
                        if (connection.write(RentPowerBankQueries.serverRequest("0008", "01", "8a", "11223344", rs.data.powerBanksList[0].slot))) {
                            ConsoleMsgs.success("Power Banks request sent to user and compatible listener is on")
                            connection.on("data", data => {
                                data = data.toString('hex');
                                let cmd = RequestOperations.CmdExtractor(data)
                                if (cmd != undefined) {
                                    if (cmd == CMDs.RentPowerBank) {
                                        try{
                                            ConsoleMsgs.success("Rent power bank answer caught successfully")
                                            ConsoleMsgs.success("Setting data event to normal after power bank return only")
                                            connection.removeAllListeners("data")
                                            connection.on("data", data => {
                                                data = data.toString('hex')
                                                ConnectionEvents.General(clientsList, connection, data)
                                            })
                                            res.send({finalResult: true, data: RentPowerBankQueries.StationAnswer(data)})
                                        }catch (e){
                                            res.send({finalResult: false, error: e})
                                        }

                                    } else {
                                        console.log("Ignoring data cause waiting for rent results only")
                                    }
                                }
                            })
                        } else {
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

    QueryAPN :  (req, res, clientsList) => {
        try {
            let { boxId, APNIndex } = req.params
            let client =  ConnectionOperations.getClientByBoxId(clientsList, boxId)
            if (client == false) {
                res.send({finalResult: false, error: "Station not logged in"})
            } else {
                let connection = client.connection
                if (connection.write(QueryAPNQueries.serverRequest("8a", APNIndex))){
                    ConsoleMsgs.success("Query APN request sent to user and compatible listener is on")
                    connection.on("data", data => {
                        data = data.toString('hex');
                        let cmd = RequestOperations.CmdExtractor(data)
                        if (cmd != undefined) {
                            if (cmd == CMDs.QueryAPN) {
                                try{
                                    ConsoleMsgs.success("Query APN answer caught successfully")
                                    ConsoleMsgs.success("Setting data event to normal after Query APN only")
                                    connection.removeAllListeners("data")
                                    connection.on("data", data => {
                                        data = data.toString('hex')
                                        ConnectionEvents.General(clientsList, connection, data)
                                    })
                                    console.log(data)
                                    res.send({finalResult: true, data: QueryAPNQueries.stationAnswer(data)})
                                }catch (e){
                                    res.send({finalResult: false, error: "intern error"})
                                }
                            } else {
                                console.log("Ignoring data cause waiting for Query APN results only")
                            }
                        }
                    })
                } else {
                    res.send({finaResult: false, error: "could not send rent request"})
                }
            }
        } catch (error) {
            res.send({finaResult: false, error: "could not query station for info"})
        }
    }

    }



module.exports = {StationRouters}