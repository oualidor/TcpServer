const {HeartBitAnswer} = require("../Structures/HeartBitAnswer");

const RequestOperations = require("./RequestOperations");
const {HttpRequestHandler} = require("./HttpRequestHandler");
const {BACKEND_SERVER} = require("./Config");
const {CMDs} = require("./CMDs");
const {ReturnPowerBank} = require("../Structures/ReturnPowerBank");
const {ConsoleMsgs} = require("./ConsoleMsgs");
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
            ConsoleMsgs.success("answer sent to station")
            let currentClient =  await ConnectionOperations.getClientByConnection(clientsList, connection)
            if(currentClient != false){
                let url = BACKEND_SERVER + 'Admin/Station/returnPowerBank/'
                let reqData = {
                    "StationId": currentClient.boxId,
                    "clientId": "1",
                    "powerBankId": "8"
                }
                let rs = await HttpRequestHandler.POST(url, reqData)
                if (rs.finalResult == true) {
                    ConsoleMsgs.success("Transaction recorded")
                }else {
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

async function getRentAnswer(data) {
    console.log(data)
}

async function getPBQueryAnswer(data) {
    console.log("power bank info coming")
    console.log(data)
}

const RequestEvents = {
    answerRequest : async (clientsList, connection, data) => {
        let buf
        let cmd = RequestOperations.CmdExtractor(data)
        if (cmd != undefined) {
            console.log(cmd + " request entered, trying to answer")
            if (CmdExtractor(data) === CMDs.login) {
                ConsoleMsgs.error("Refusing login cause of forbidden time")
            } else {
                if (await ConnectionOperations.isValid(clientsList, connection)) {
                    switch (cmd) {
                        case CMDs.heartBit:
                            answerHeartBit(connection)
                            break
                        case CMDs.PowerBankInfo:
                            getPBQueryAnswer(data)
                            break
                        case CMDs.RentPowerBank:
                            getRentAnswer(data)
                            break
                        case CMDs.ReturnPowerBank:
                            let stationRequest = await ReturnPowerBank.stationRequest(data)
                            answerPowerBankReturn(clientsList, connection, stationRequest, "01")
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


module.exports = {RequestEvents}