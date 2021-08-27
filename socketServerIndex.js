
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


        console.log(data.toString('hex'))
        answerLogin(data.toString('hex'))




        buf = Buffer.from('000880018a1122334403', 'hex');
        connection.write(buf)
        //eject power bank


    });
});


let port = 4000
let host = '164.132.59.129'
server.listen(port, host, () => {

    console.log("waiting for a connection"); // prints on start
});


function answerLogin(connection, data){
    let buf
    switch (data){
        case "0020600188112233445566778802330011524c334830383230303736383031323100":  //login
            buf = Buffer.from('00086001011122334401', 'hex');
            connection.write(buf)
            break;
        case "0007 61 01 00 11223344": //heartBit
            buf = Buffer.from('0007 61 01 00 11223344', 'hex');
            connection.write(buf)
            break;
    }
}