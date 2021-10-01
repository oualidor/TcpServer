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

    PowerBankQuery : (clientsList, connection, res) =>{
        if(connection)
        connection.removeAllListeners("data")
        ConsoleMsgs.success("Setting data event to wait for query info only")
        connection.on("data", data => {
            try {
                data = data.toString("hex")
                console.log(data)
                let cmd = RequestOperations.CmdExtractor(data)
                if (cmd != undefined) {
                    if (cmd == CMDs.PowerBankInfo) {
                        connection.removeAllListeners("data")
                        ConnectionEvents.General(clientsList, connection)

                        ConsoleMsgs.success("Query info caught, Setting data event to general and sending data to user")
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
                ConsoleMsgs.error(error)
                res.send({finalResult: false, error: "Request failed due to intern error"})
            }

        })
    },

    Rent: (clientsList, connection, res)=>{
        connection.on("data", data => {
            data = data.toString('hex');
            let cmd = RequestOperations.CmdExtractor(data)
            if (cmd != undefined) {
                if (cmd == CMDs.RentPowerBank) {
                    try{
                        ConsoleMsgs.success("Rent power bank answer caught successfully")
                        ConsoleMsgs.success("Setting data event to normal after power bank return only")
                        connection.removeAllListeners("data")
                        ConnectionEvents.General(clientsList, connection)
                        res.send({finalResult: true, data: RentPowerBankQueries.StationAnswer(data)})
                    }catch (e){
                        res.send({finalResult: false, error: e})
                    }

                } else {
                    console.log("Ignoring data cause waiting for rent results only")
                }
            }
        })
    },

    QueryAPN: (clientsList, connection, res)=>{
        connection.on("data", data => {
            data = data.toString('hex');
            let cmd = RequestOperations.CmdExtractor(data)
            if (cmd != undefined) {
                if (cmd == CMDs.QueryAPN) {
                    try{
                        ConsoleMsgs.success("Query APN answer caught successfully")
                        ConsoleMsgs.success("Setting data event to normal after Query APN only")
                        connection.removeAllListeners("data")
                        ConnectionEvents.General(clientsList, connection)
                        console.log(data)
                        res.send({finalResult: true, data: QueryAPNQueries.stationAnswer(data)})
                    }catch (e){
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


