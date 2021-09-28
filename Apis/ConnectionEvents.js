const RequestOperations = require("./RequestOperations");
const CMDs = require("./CMDs");
const {RequestEvents} = require("./RequestEvents");
const {PowerBankQueries} = require("../Structures/PowerBankQueries");
const ConnectionEvents = {
    General : (clientsList, connection, data) =>{
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
        connection.on("data", data => {
            data = data.toString("hex")
            let cmd = RequestOperations.CmdExtractor(data)
            if (cmd != undefined) {
                if (cmd == CMDs.PowerBankInfo) {
                    console.log("setting data trigger to normal")
                    connection.removeAllListeners("data")
                    connection.on("data", data => {
                        data = data.toString('hex')
                        console.log(this)
                        this.General(clientsList, connection, data)
                    })
                    res.send({finalResult: true, data: PowerBankQueries.PowerBankQueryResult(data)})
                } else {
                    console.log("ignoring data cause waiting for specific")
                }
            }
        })
    }
}

module.exports = {ConnectionEvents}


