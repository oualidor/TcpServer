const {HeartBitAnswer} = require("../Structures/HeartBitAnswer");

const RequestOperations = require("./RequestOperations");
const CMDs = require("./CMDs");
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

async function answerPowerBankReturn(connection, stationRequest) {
    try {
        let serverAnswer = await ReturnPowerBank.serverAnswer("01", "fa", "11223344", stationRequest.slot, "01")
        if (connection.write(serverAnswer)) {
            ConsoleMsgs.success("answer sent to station")
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
                            console.log(data)
                            let stationRequest = await ReturnPowerBank.stationRequest(data)
                            answerPowerBankReturn(connection, stationRequest)
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