const RequestOperations = require("./RequestOperations");
const CMDs = require("./CMDs");
const {ConsoleMsgs} = require("./ConsoleMsgs");
const {LoginRequest} = require("../Structures/LoginRequest");
const {CmdExtractor} = require("./RequestOperations");
const {LoginAnswer} = require("../Structures/LoginAnswer");
const {TcpClient} = require("../Structures/TcpClient");
const {HttpRequestHandler} = require("./HttpRequestHandler");
const {BACKEND_SERVER} = require("./Config");
const {ConnectionOperations} = require("./ConnectionOperations");

async function answerLogin(clientsList, connection, loginRequest) {
    let currentConnectionBoxId = loginRequest.boxId
    try {
        let url = BACKEND_SERVER + 'Admin/Station/getOneByPublicId/' + currentConnectionBoxId
        let rs = await HttpRequestHandler.GET(url)
        if (rs.finalResult == true) {
            ConsoleMsgs.success("Client logged in successfully")
            expressServer.addClient({boxId: currentConnectionBoxId, connection: connection})
            let answer = LoginAnswer("0008", "01", '01', '11223344', "01")
            try{
                connection.write(Buffer.from(answer, 'hex'))
            }catch (e){
                ConsoleMsgs.error("could not write data to station")
            }


        } else {
            console.log(rs)
            ConsoleMsgs.error("Refusing station login due an error while communication with back end")
            let answer = LoginAnswer("0008", "01", '01', '11223344', "00")
            connection.write(Buffer.from(answer, 'hex'))
        }
    } catch (error) {
        ConsoleMsgs.error(error)
        ConsoleMsgs.error("Refusing station login due an error")
        let answer = LoginAnswer("0008", "01", '01', '11223344', "00")
        connection.write(Buffer.from(answer, 'hex'))
    }
}

async function answerHeartBit (connection, buf, request){
    buf = Buffer.from('000761010011223344', 'hex');
    connection.write(buf)
}

async function answerPowerBankReturn(connection, buf, request){
    buf = Buffer.from('00096601fa112233440001', 'hex');
    connection.write(buf)
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
                let loginRequest = LoginRequest(data)
                await answerLogin(clientsList, connection, loginRequest)
            } else {
                if (await ConnectionOperations.isValid(clientsList, connection)) {
                    switch (cmd) {
                        case CMDs.heartBit:
                            answerHeartBit(connection,  null)
                            break
                        case CMDs.PowerBankInfo:
                            getPBQueryAnswer(data)
                            break
                        case CMDs.RentPowerBank:
                            getRentAnswer(data)
                            break
                        case CMDs.ReturnPowerBank:
                            answerPowerBankReturn(connection, buf, null)
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