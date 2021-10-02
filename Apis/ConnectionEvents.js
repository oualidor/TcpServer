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

    QueryInfo : (clientsList, client, res) =>{
        let connection = client.connection
        connection.removeAllListeners("data")
        connection.on("data", async data => {
            try {
                data = data.toString("hex")
                let cmd = RequestOperations.CmdExtractor(data)
                if (cmd != undefined) {
                    if (cmd == CMDs.PowerBankInfo) {
                        res.send({finalResult: true, data: PowerBanksInfoQueries.PowerBankQueryResult(data)})
                        await client.setBusy(false)
                        ConnectionEvents.General(clientsList, connection)
                    } else {
                        console.log("ignoring data cause waiting for query info only")
                    }
                }else {
                    ConsoleMsgs.error("Cmd is undefined, kicking out teh client")
                    connection.terminate()
                    res.send({finalResult: false, error: "Operation result in kicking gout teh client fro un allowed request"})
                }
            }catch (error){
                await client.setBusy(false)
                ConsoleMsgs.error(error)
                res.send({finalResult: false, error: "Request failed due to intern error"})
            }
        })
    },

    Rent: (clientsList, client, res)=>{
        let connection = client.connection
        connection.removeAllListeners("data")
        connection.on("data", data => {
            data = data.toString('hex');
            let cmd = RequestOperations.CmdExtractor(data)
            if (cmd != undefined) {
                if (cmd == CMDs.RentPowerBank) {
                    try{
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
        connection.removeAllListeners("data")
        connection.on("data", data => {
            data = data.toString('hex');
            let cmd = RequestOperations.CmdExtractor(data)
            if (cmd != undefined) {
                if (cmd == CMDs.QueryAPN) {
                    try{
                        res.send({finalResult: true, data: QueryAPNQueries.stationAnswer(data)})
                        client.setBusy(false)
                        ConnectionEvents.General(clientsList, connection)
                    }catch (e){
                        client.setBusy(false)
                        res.send({finalResult: false, error: "intern error"})
                        ConnectionEvents.General(clientsList, connection)
                    }
                } else {
                    console.log("Ignoring data cause waiting for Query APN results only")
                }
            }else{
                ConsoleMsgs.error("Cmd is undefined, kicking out teh client")
                connection.terminate()
                res.send({finalResult: false, error: "Operation result in kicking gout teh client fro un allowed request"})
            }
        })
    }
}

module.exports = {ConnectionEvents}


