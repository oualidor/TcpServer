const  LoginRequest  =  require("./Structures/LoginRequest")
const RequestOperations = require("./Apis/RequestOperations");
const CMDs =  require("./Apis/CMDs");

const net = require("net"); // import net

// create the server
let server = net.createServer(connection => {
    // run all of this when a client connects
    console.log("Station connected ");

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
        answerRequest(data.toString('hex'))


    });
});


let port = 4000
let host = '164.132.59.129'
server.listen(port, host, () => {

    console.log("waiting for a connection"); // prints on start
});


function answerRequest(connection, data){
    let buf
    let cmd = RequestOperations.CmdExtractor(data)
    if(cmd != undefined){
        console.log(cmd + " request entered, trying to answer")
        switch (cmd){
            case CMDs.login:
                let request =  LoginRequest(data)
                answerLogin(connection, buf, request)
                break
            case CMDs.heartBit:
                answerHeartBit(connection, buf, null)
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