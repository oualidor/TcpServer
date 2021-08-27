
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
        console.log(data)

    });
});