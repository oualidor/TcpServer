const net = require("net");
const EventEmitter = require('events')
const TcpClient = require("./Structures/TcpClient");
const {ConnectionOperations} = require("./Apis/ConnectionOperations");
const {LoginQueries} = require("./Structures/LoginQueries");
const {LoginAnswer} = require("./Structures/LoginQueries");
const {HttpRequestHandler} = require("./Apis/HttpRequestHandler");
const {BACKEND_SERVER} = require("./Apis/Config");
const ConsoleMsgs = require("./Apis/ConsoleMsgs");
const {HOST, TCP_PORT} = require("./Apis/Config");
const ConnectionEvents = require("./Apis/ConnectionEvents"); // import net


class SocketServer extends EventEmitter{
    constructor() {
        super();

        this.clientsList = []
        let server = net.createServer();
        server.on("connection", socket => {
            ConsoleMsgs.success("Client handshake")
            socket.once("data", (data)=>{
                data = data.toString("hex")
                let loginStationRequest = LoginQueries.stationRequest(data)
                this.answerLogin(this.clientsList, socket, loginStationRequest).then(r => {
                    if(r !== false){
                        ConnectionEvents.General(this.clientsList , socket)
                    }else {
                        socket.terminate()
                    }
                })
            })
            socket.on("error", (error)=>{

            })
            socket.on("connect", ()=>{

            })
            socket.on("end", ()=>{
                console.log("Connection ended, client disconnected")
                //remove client
                this.removeClientByConnection(socket)
            })
            socket.on("timeout", ()=>{

            })
            socket.on("lookup", (error, address, family, host)=>{

            })
            socket.on("drain",  ()=>{

            })
            socket.on("close", (hadError)=>{

            })
        })

        server.once('error', function(err) {
            console.log(err)
            if (err.code === 'EADDRINUSE') {
            delete this
            }
            if (err.code === 'EADDRNOTAVAIL') {
                server.listen(TCP_PORT, "localhost", () => {
                    console.log(`TCP RUNNING on PORT: `+ TCP_PORT); // prints on start
                });
            }else {

            }

        });

        server.listen(TCP_PORT, HOST, () => {
            console.log(`TCP RUNNING on PORT: `+ TCP_PORT); // prints on start
        });

        server.on("close", ()=>{
            console.log("closed")
        } )

        server.on("listening", ()=>{

        })
    }

    async  answerLogin(clientsList, connection, loginRequest) {
        let currentConnectionBoxId = loginRequest.boxId
        try {
            let url = BACKEND_SERVER + 'Admin/Station/getOneByPublicId/' + currentConnectionBoxId
            let rs = await HttpRequestHandler.GET(url)
            if (rs.finalResult == true) {
                let newClient = new TcpClient(currentConnectionBoxId, connection)
                let answer = LoginQueries.serverAnswer("01", "01")
                try{
                    if(connection.write(answer)){
                        newClient.setBusy(false)
                        this.addClient(newClient)
                        ConsoleMsgs.success("Client logged in successfully")
                        return true
                    }else {
                        ConsoleMsgs.error("Could not send login answer to Station")
                        this.removeClientByConnection(connection)
                        return false
                    }
                }catch (e){
                    ConsoleMsgs.error("could not write data to station")
                    return false
                }
            } else {
                console.log(rs)
                ConsoleMsgs.error("Refusing station login due an error while communication with back end")
                let answer = LoginAnswer("0008", "01", '01', '11223344', "00")
                connection.write(Buffer.from(answer, 'hex'))
                return false
            }
        }catch (error) {
            ConsoleMsgs.error("Refusing station login due an error")
            let answer = LoginAnswer("0008", "01", '01', '11223344', "00")
            connection.write(Buffer.from(answer, 'hex'))
            return false
        }
    }

    addClient(client){
        this.clientsList.push(client)
        this.emit("listUpdate")
    }

    removeClientByConnection(connection){
        this.clientsList = this.clientsList.filter(client => {
            if(client.connection == connection) return false
            return true
        })
        this.emit("listUpdate")
    }
}

module.exports = {SocketServer}





