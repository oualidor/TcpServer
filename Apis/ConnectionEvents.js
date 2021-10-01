const RequestOperations = require("./RequestOperations");
const {QueryAPNQueries} = require("../Structures/QueryAPNQueries");
const {RentPowerBankQueries} = require("../Structures/RentPowerBankQueries");
const {CMDs} = require("./CMDs");
const {ConsoleMsgs} = require("./ConsoleMsgs");
const {RequestEvents} = require("./RequestEvents");
const {PowerBanksInfoQueries} = require("../Structures/PowerBanksInfoQueries");
const ConnectionEvents = {
    General : (clientsList, connection) =>{
        connection.removeAllListeners("data")
        ConsoleMsgs.success("General Event ON")
        connection.on("data", data => {
            data = data.toString('hex')
            // run this when data is received
            if (data == undefined || data == null) {console.log("no data found")}
            const dataArgs = data.toString().split(" "); // splits the data into spaces
            if (dataArgs.length === 0) { // in case there is no command
                console.log("data length 0")
                return; // prevents other code from running
            }
            RequestEvents.answerRequest(clientsList, connection, data).then(r=>{})
        })

    },

    PowerBankQuery : (clientsList, client, res) =>{
        let connection = client.connection
        connection.removeAllListeners("data")
        connection.on("data", data => {
            try {
                data = data.toString("hex")
                let cmd = RequestOperations.CmdExtractor(data)
                if (cmd != undefined) {
                    if (cmd == CMDs.PowerBankInfo) {
                        connection.removeAllListeners("data")
                        ConnectionEvents.General(clientsList, connection)
                        client.setBusy(false)
                        res.send({finalResult: true, data: PowerBanksInfoQueries.PowerBankQueryResult(data)})
                    } else {
                        console.log("ignoring data cause waiting for query info only")
                    }
                }else {
                    ConsoleMsgs.error("Cmd is undefined, kicking out teh client")
                    connection.terminate()
                    res.send({finalResult: false, error: "Operation result in kicking gout teh client fro un allowed request"})
                }
            }catch (error){
                client.setBusy(false)
                ConsoleMsgs.error(error)
                res.send({finalResult: false, error: "Request failed due to intern error"})
            }
        })
    },

    Rent: (clientsList, client, res)=>{
        let connection = client.connection
        connection.on("data", data => {
            data = data.toString('hex');
            let cmd = RequestOperations.CmdExtractor(data)
            if (cmd != undefined) {
                if (cmd == CMDs.RentPowerBank) {
                    try{
                        connection.removeAllListeners("data")
                        client.setBusy(false)
                        ConnectionEvents.General(clientsList, connection)

                        res.send({finalResult: true, data: RentPowerBankQueries.StationAnswer(data)})
                    }catch (e){
                        client.setBusy(false)
                        res.send({finalResult: false, error: e})
                    }
                } else {
                    console.log("Ignoring data cause waiting for rent results only")
                }
            }else{
                ConsoleMsgs.error("Cmd is undefined, kicking out teh client")
                connection.terminate()
                res.send({finalResult: false, error: "Operation result in kicking gout teh client fro un allowed request"})
            }
        })
    },

    QueryAPN: (clientsList, client, res)=>{
        let connection = client.connection
        connection.on("data", data => {
            data = data.toString('hex');
            let cmd = RequestOperations.CmdExtractor(data)
            if (cmd != undefined) {
                if (cmd == CMDs.QueryAPN) {
                    try{
                        connection.removeAllListeners("data")
                        client.setBusy(false)
                        ConnectionEvents.General(clientsList, connection)
                        res.send({finalResult: true, data: QueryAPNQueries.stationAnswer(data)})
                    }catch (e){
                        client.setBusy(false)
                        res.send({finalResult: false, error: "intern error"})
                    }
                } else {
                    console.log("Ignoring data cause waiting for Query APN results only")
                }
            }
        })
    }
}

module.exports = {ConnectionEvents}


