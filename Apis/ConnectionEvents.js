const RequestOperations = require("./RequestOperations");
const CMDs = require("./CMDs");
const {ConsoleMsgs} = require("./ConsoleMsgs");
const {RequestEvents} = require("./RequestEvents");
const {PowerBankQueries} = require("../Structures/PowerBankQueries");
const ConnectionEvents = {
    General : (clientsList, connection, data) =>{
        connection.removeAllListeners("data")
        // run this when data is received
        if (data == undefined || data == null) {console.log("no data found")}
        const dataArgs = data.toString().split(" "); // splits the data into spaces
        if (dataArgs.length === 0) { // in case there is no command
            console.log("data length 0")
            return; // prevents other code from running
        }
        RequestEvents.answerRequest(clientsList, connection, data).then(r=>{})
    },

    PowerBankQuery : (clientsList, connection, res) =>{
        connection.removeAllListeners("data")
        ConsoleMsgs.success("Setting data event to wait for query info only")
        connection.on("data", data => {
            data = data.toString("hex")
            let cmd = RequestOperations.CmdExtractor(data)
            if (cmd != undefined) {
                if (cmd == CMDs.PowerBankInfo) {
                    connection.on("data", data => {
                        data = data.toString('hex')
                        ConnectionEvents.General(clientsList, connection, data)

                    })
                    ConsoleMsgs.success("Query info caught, Setting data event to general and sending data to user")
                    res.send({finalResult: true, data: PowerBankQueries.PowerBankQueryResult(data)})
                } else {
                    console.log("ignoring data cause waiting for query info only")
                }
            }
        })
    }
}

module.exports = {ConnectionEvents}


