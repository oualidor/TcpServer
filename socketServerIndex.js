const axios = require('axios').default;

const  {LoginRequest}  =  require("./Structures/LoginRequest")
const  {LoginAnswer}  =  require("./Structures/LoginAnswer")
const RequestOperations = require("./Apis/RequestOperations");
const CMDs =  require("./Apis/CMDs");
let TCP_PORT = 4000
//let host = 'localhost'
let TCP_HOST = '164.132.59.129'
let EXPRESS_PORT = 3000
const net = require("net"); // import net
let clientsList = []
let server = net.createServer(connection => {
    // run all of this when a client connects
    let allowed = false;
    console.log("Station connected ");

    connection.on("data", data => {
        data = data.toString("hex")
        NormalDataEvent(connection, data)
    });
    connection.on("end", ()=>{
        console.log("client disconnected")
    })
});

function NormalDataEvent(connection, data){
    // run this when data is received
    if (data == undefined || data == null) {
        console.log("no data found")
    }

    const dataArgs = data.toString().split(" "); // splits the data into spaces

    if (dataArgs.length === 0) { // in case there is no command
        console.log("data length 0")
        return; // prevents other code from running
    }
    answerRequest(connection, data)

}


server.listen(TCP_PORT, TCP_HOST, () => {
    console.log("server listening on port: {$TCP_PORT}"); // prints on start
});

server.on("end", ()=>{
    console.log("closed")
} )

async function answerRequest(connection, data) {
    let buf
    let cmd = RequestOperations.CmdExtractor(data)
    if (cmd != undefined) {
        console.log(cmd + " request entered, trying to answer")
        if (CmdExtractor(data) == CMDs.login) {
            let loginRequest = LoginRequest(data)
            answerLogin(connection, loginRequest)
        } else {
            let client = await connectionToClient(clientsList, connection)
            if (client != false) {
                if (client.loggedIn == true) {
                    switch (cmd) {
                        case CMDs.heartBit:
                            answerHeartBit(connection, buf, null)
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
                    console.log("closing connection for no loggIn")
                    connection.end
                }
            } else {
                console.log(client)
                console.log("Operation no permitted")
                connection.end();
            }
        }
    }
}

async function answerLogin(connection, loginRequest) {
    let currentConnectionBoxId = loginRequest.boxId
    try{
        let rs = await HttpRequestHandler.GET(BACKEND_SERVER+"Admin/Station/getOne/"+currentConnectionBoxId)
        if(rs.finalResult ){
            await clientsList.push(TcpClient(currentConnectionBoxId, connection))
            let answer = LoginAnswer("0008", "01", '01', '11223344', "01")
            connection.write(Buffer.from(answer, 'hex'))
        }else {
            console.log("Refusing station login due an error while communication with back end")
            console.log(rs.error)
            let answer = LoginAnswer("0008", "01", '01', '11223344', "00")
            connection.write(Buffer.from(answer, 'hex'))
        }
    }catch (error){
        console.log("Refusing station login due an error")
        let answer = LoginAnswer("0008", "01", '01', '11223344', "00")
        connection.write(Buffer.from(answer, 'hex'))
    }
}

function answerHeartBit(connection, buf, request){
    buf = Buffer.from('000761010011223344', 'hex');
    connection.write(buf)
}

function answerPowerBankReturn(connection, buf, request){
    buf = Buffer.from('00096601fa112233440001', 'hex');
    connection.write(buf)
}

function getRentAnswer(data){
    console.log(data)
}

function getPBQueryAnswer(data){
    console.log("power bank info coming")
    console.log(data)
}

function sendData(connection, dataString, encoding){
    let buf = Buffer.from(dataString, 'hex');
    if(connection.write(buf)) return true
    return false
}


let app = require("./app")
const {BACKEND_SERVER} = require("./Apis/Config");
const {HttpRequestHandler} = require("./Apis/HttpRequestHandler");
const {TcpClient} = require("./Structures/TcpClient");
const {StationRouters} = require("./routes/StationRouters");
const {connectionToClient} = require("./Apis/RequestOperations");
const {CmdExtractor} = require("./Apis/RequestOperations");


app.listen(EXPRESS_PORT, () => {
    console.log(`Sez back end running on ${EXPRESS_PORT}.`)
});
app.get("/", (req, res)=>{
    res.send("running")
})
app.use("/rent/:boxId", async (req, res)=>{


})

app.get("/Station/QueryInfo", (req, res)=>{StationRouters.getInfo(req, res, clientsList, NormalDataEvent)})
app.get("/Station/test", (req, res)=>{StationRouters.test(req, res,)})
app.get("/Station/rent/:boxId", (req, res)=>{StationRouters.rentPowerBank(req, res, clientsList, NormalDataEvent)})