const  {LoginRequest}  =  require("./Structures/LoginRequest")
const  {LoginAnswer}  =  require("./Structures/LoginAnswer")
const RequestOperations = require("./Apis/RequestOperations");
const CMDs =  require("./Apis/CMDs");

const net = require("net"); // import net
let clientsList = []
// create the server
let server = net.createServer(connection => {
    // run all of this when a client connects
    let allowed = false;
    console.log("Station connected ");

    connection.on("data", data => {
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


    data = data.toString('hex')
    answerRequest(connection, data)

}




let port = 4000
//let host = 'localhost'
let host = '164.132.59.129'
server.listen(port, host, () => {
    console.log("server listening on port: {$port}"); // prints on start
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
    console.log("adding box :::: " + currentConnectionBoxId)
    await clientsList.push({connection, loggedIn: true, boxId: currentConnectionBoxId})
    let answer = LoginAnswer("0008", "01", '01', '11223344', "01")
    connection.write(Buffer.from(answer, 'hex'))
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
const {connectionToClient} = require("./Apis/RequestOperations");
const {ConnectionValidator} = require("./Apis/RequestOperations");
const {CmdExtractor} = require("./Apis/RequestOperations");
const {stringToHex} = require("./Structures/Coverter");


app.listen(3000, () => {
    console.log(`Sez back end runing on  3000.`)
});
app.get("/", (req, res)=>{
    res.send("running")
})
app.get("/rent/:boxId", async (req, res)=>{
    let {boxId} = req.params;
    let found=false;
    await clientsList.map((conn)=>{
        console.log(conn.boxId)
        console.log(boxId)
        if(conn.boxId == boxId){
            found = true
        }else {
            console.log("wrong")
        }
    });
    if(found){
        res.send("box "+ boxId + "found")
    }else {
        res.send("box "+ boxId + "not found")
    }
    /*if (await sendData(clientsList[0].connection, "000865018a1122334400", null)){
        res.send("request sent")
    }else {
        res.send("wrong")
    }*/
})

app.get("/queryPowerBankInfo", async (req, res)=>{
    let answered  = false
    let buf = Buffer.from("000764018a11223344", 'hex');
    let connection = clientsList[0].connection
    if(connection.write(buf)) {
        connection.on("data", data => {
            let cmd = RequestOperations.CmdExtractor(data)
            if (cmd != undefined) {
                if(cmd == CMDs.PowerBankInfo){
                    res.send(data.toString("hex"))
                }else {
                    console.log("ignoring data cause waiting for specific")
                }
            }
        })
    }else {
        res.send("Failed to send request to station")
    }
    return false


    if (await sendData(clientsList[0].connection, "000764018a11223344", null)){
            res.send("request sent")
    }else {
        res.send("wrong")
    }
})