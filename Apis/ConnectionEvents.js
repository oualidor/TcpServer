const RequestOperations = require("./RequestOperations");
const SetServerQueries = require("../Structures/SetServerQueries");
const {SetVoiceQueries} = require("../Structures/SetVoiceQueries");
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
            if (data == undefined || data == null) {console.log("no data found")}
            const dataArgs = data.toString().split(" "); // splits the data into spaces
            if (dataArgs.length === 0) { // in case there is no command
                console.log("data length 0")
                return; // prevents other code from running
            }
            RequestEvents.answerRequest(clientsList, connection, data).then(r=>{})
        })

    },

    ServerFirst: (clientsList, client, res)=>{
        let connection = client.connection
        connection.removeAllListeners("data")
        connection.on("data", async data => {
            data = data.toString('hex');
            let cmd = RequestOperations.CmdExtractor(data)
            if (cmd != undefined) {
                try{
                    switch (cmd){
                        case CMDs.setServerAddress:
                            res.send({finalResult: true, data: SetServerQueries.stationAnswer(data)})
                            await client.setBusy(false)
                            ConnectionEvents.General(clientsList, connection)
                            break;
                        case CMDs.PowerBankInfo:
                            res.send({finalResult: true, data: PowerBanksInfoQueries.PowerBankQueryResult(data)})
                            await client.setBusy(false)
                            ConnectionEvents.General(clientsList, connection)
                            break;
                        case CMDs.RentPowerBank:
                            res.send({finalResult: true, data: RentPowerBankQueries.StationAnswer(data)})
                            client.setBusy(false)
                            ConnectionEvents.General(clientsList, connection)
                            break;
                        case CMDs.QueryAPN:
                            res.send({finalResult: true, data: QueryAPNQueries.stationAnswer(data)})
                            client.setBusy(false)
                            ConnectionEvents.General(clientsList, connection)
                            break;
                        case CMDs.SetVoice:
                            res.send({finalResult: true, data: SetVoiceQueries.stationAnswer(data)})
                            client.setBusy(false)
                            ConnectionEvents.General(clientsList, connection)
                            break;
                        default:
                            console.log("Ignoring data cause waiting for Specific")
                    }
                }
                catch (error){
                    client.setBusy(false)
                    res.send({finalResult: false, error: "intern error"})
                    ConnectionEvents.General(clientsList, connection)
                }
            }else{
                ConsoleMsgs.error("Cmd is undefined, kicking out teh client")
                connection.terminate()
                res.send({finalResult: false, error: "Operation result in kicking gout teh client fro un allowed request"})
            }
        })
    }
}

module.exports = ConnectionEvents


