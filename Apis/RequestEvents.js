const {HeartBitAnswer} = require("../Structures/HeartBitAnswer");
const RequestOperations = require("./RequestOperations");
const {HttpRequestHandler} = require("./HttpRequestHandler");
const {BACKEND_SERVER} = require("./Config");
const CMDs= require("./CMDs");
const {ReturnPowerBank} = require("../Structures/ReturnPowerBank");
const ConsoleMsgs = require("./ConsoleMsgs");
const {CmdExtractor} = require("./RequestOperations");
const {ConnectionOperations} = require("./ConnectionOperations");
function answerHeartBit (connection){
    try {
        connection.write(HeartBitAnswer("0007", "01", '00', '11223344'))
    }catch (err){
        ConsoleMsgs.error("Failed to send heart Bit answer")
    }

}

async function answerPowerBankReturn(clientsList, connection, stationRequest, result) {
    try {
        let serverAnswer = await ReturnPowerBank.serverAnswer("01", "fa", "11223344", stationRequest.slot, result)
        if (connection.write(serverAnswer)) {
            let currentClient =  await ConnectionOperations.getClientByConnection(clientsList, connection)
            if(currentClient != false){
                let url = BACKEND_SERVER + 'Admin/Station/returnPowerBank/'
                let reqData = {
                    "stationId": currentClient.boxId,
                    "clientId": "0",
                    "powerBankId": stationRequest.powerBankId
                }
                let rs = await HttpRequestHandler.POST(url, reqData)
                if (rs.finalResult == true) {
                }else {
                    //TODO Write heavy log
                    ConsoleMsgs.error(JSON.stringify(rs))
                }
            }else {
                ConsoleMsgs.error("could not send answer to station")
            }
        } else {
            ConsoleMsgs.error("could not send answer to station")
        }
    } catch (e) {
        ConsoleMsgs.error(e)
    }
}


const RequestEvents = {
    answerRequest : async (clientsList, connection, data) => {
        let cmd = RequestOperations.CmdExtractor(data)
        if (cmd != undefined) {
            if (CmdExtractor(data) === CMDs.login) {
                ConsoleMsgs.error("Refusing login cause of forbidden time")
            } else {
                if (await ConnectionOperations.isValid(clientsList, connection)) {
                    switch (cmd) {
                        case CMDs.heartBit:
                            answerHeartBit(connection)
                            break
                        case CMDs.ReturnPowerBank:
                            let ReturnPowerBankStationRequest = ReturnPowerBank.stationRequest(data)
                            await answerPowerBankReturn(clientsList, connection, ReturnPowerBankStationRequest, "01")
                            break
                    }
                } else {
                    console.log("Operation no permitted")
                    connection.end();
                }
            }
        }
    },
}


module.exports = RequestEvents