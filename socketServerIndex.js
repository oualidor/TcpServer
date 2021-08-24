
const net = require("net"); // import net

// create the server
let server = net.createServer(connection => {
    // run all of this when a client connects
    console.log("new connection");

    connection.on("data", data => {
        // run this when data is received
        if (data == undefined || data == null) {
            return;
        }

        const dataArgs = data.toString().split(" "); // splits the data into spaces

        if (dataArgs.length === 0) { // in case there is no command
            connection.write("ERROR no data");
            return; // prevents other code from running
        }
        const command = dataArgs[0]; // gets the command
        if (command === "ADD") { // add command
            if (dataArgs.length !== 3) { // in case there aren't enough arguments
                connection.write("ERROR incorrect number of arguments");
                return;
            }

            const op1 = parseInt(dataArgs[1]); // first number
            const op2 = parseInt(dataArgs[2]); // second number
            const result = (op1 + op2).toString(); // result as a string

            if (result === "NaN") { // in case the inputs aren't numbers
                connection.write("ERROR invalid number");
                return;
            }

            connection.write("RESULT " + result);
            return; // end
        } else { // invalid command
            connection.write("ERROR invalid command");
            return;
        }
    });
});


// look for a connection on port 50,000
server.listen(50000, () => {
    console.log("waiting for a connection"); // prints on start
});