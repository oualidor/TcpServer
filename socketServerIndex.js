const axios = require('axios').default;
const publicIp = require('public-ip');
const  {LoginRequest}  =  require("./Structures/LoginRequest")
const  {LoginAnswer}  =  require("./Structures/LoginAnswer")
const RequestOperations = require("./Apis/RequestOperations");
const CMDs =  require("./Apis/CMDs");
const {HOST, TCP_PORT, EXPRESS_PORT,  BACKEND_SERVER} = require("./Apis/Config");

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
        clientsList = clientsList.filter(client => client.connection != connection)
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
    answerRequest(connection, data).then(r=>{})

}

server.listen(TCP_PORT, HOST, () => {
    console.log(`TCP RUNNING on PORT: `+ TCP_PORT); // prints on start
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
            await answerLogin(connection, loginRequest)
        } else {
            if (await ConnectionOperations.isValid(clientsList, connection)) {
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
        let url  = BACKEND_SERVER+'Admin/Station/getOne/'+currentConnectionBoxId
        let rs = await HttpRequestHandler.GET(url)
        if(rs.finalResult ){
            console.log("Client logged in successfully")
            await clientsList.push(TcpClient(currentConnectionBoxId, connection))
            console.log(clientsList.length)
            let answer = LoginAnswer("0008", "01", '01', '11223344', "01")
            connection.write(Buffer.from(answer, 'hex'))
        }else {
            console.log("Refusing station login due an error while communication with back end")
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



let app = require("./app")


const {ConnectionOperations} = require("./Apis/ConnectionOperations");

const {HttpRequestHandler} = require("./Apis/HttpRequestHandler");
const {TcpClient} = require("./Structures/TcpClient");
const {StationRouters} = require("./routes/StationRouters");
const {CmdExtractor} = require("./Apis/RequestOperations");


app.listen(EXPRESS_PORT, () => {
    console.log(`EXPRESS RUNNING on PORT ${EXPRESS_PORT}.`)
});
app.get("/Test", (req, res)=>{
    res.send("running")
})
app.use("/rent/:boxId", async (req, res)=>{


})

app.get("/Station/QueryInfo/:boxId", (req, res)=>{StationRouters.getInfo(req, res, clientsList, NormalDataEvent)})
app.get("/Station/test", (req, res)=>{StationRouters.test(req, res,)})
app.get("/Station/rent/:boxId", (req, res)=>{StationRouters.rentPowerBank(req, res, clientsList, NormalDataEvent)})