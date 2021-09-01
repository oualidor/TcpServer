
const  LoginRequest  =  require("./Structures/LoginRequest")
const RequestOperations = require("./Apis/RequestOperations");
const CMDs =  require("./Apis/CMDs");

const net = require("net"); // import net
let currentConnections = []
// create the server
let server = net.createServer(connection => {
    // run all of this when a client connects
    let allowed = false;
    console.log("Station connected ");
    currentConnections.push(connection)
    connection.on("data", data => {
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


    });
    connection.on("end", ()=>{
        console.log("client disconnected")

        
    })
});


let port = 4000
//let host = 'localhost'
let host = '164.132.59.129'
server.listen(port, host, () => {

    console.log("waiting for a connection"); // prints on start
});

server.on("end", ()=>{
    console.log("closed")
} )


function answerRequest(connection, data){
    let buf
    let cmd = RequestOperations.CmdExtractor(data)
    if(cmd != undefined){
        console.log(cmd + " request entered, trying to answer")
        switch (cmd){
            case CMDs.login:
                let request =  LoginRequest.LoginRequest(data)
                answerLogin(connection, buf, request)
                break
            case CMDs.heartBit:
                answerHeartBit(connection, buf, null)
                break
            case CMDs.RentPowerBank:
                getRentAnswer(data)
                break
        }
    }
}

function answerLogin(connection, buf, request){
    buf = Buffer.from('00086001011122334401', 'hex');
    connection.write(buf)
}

function answerHeartBit(connection, buf, request){
    buf = Buffer.from('000761010011223344', 'hex');
    connection.write(buf)
}

function getRentAnswer(data){
    console.log(data)
}

function sendData(connection, dataString, encoding){
    let buf = Buffer.from(dataString, 'hex');
    connection.write(buf)
}


let app = require("./app")


app.listen(3000, () => {
    console.log(`Sez back end runing on  3000.`)
});
app.get("/", (req, res)=>{
    res.send("running")
})
app.get("/rent", async (req, res)=>{
    await sendData(currentConnections[0], "000865018a1122334400", null)
    res.send("request sent")
})