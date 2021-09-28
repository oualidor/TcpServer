const net = require("net");
const EventEmitter = require('events')
const {LoginAnswer} = require("./Structures/LoginAnswer");
const {LoginRequest} = require("./Structures/LoginRequest");
const {HttpRequestHandler} = require("./Apis/HttpRequestHandler");
const {BACKEND_SERVER} = require("./Apis/Config");
const {ConsoleMsgs} = require("./Apis/ConsoleMsgs");
const {HOST, TCP_PORT} = require("./Apis/Config");
const {ConnectionEvents} = require("./Apis/ConnectionEvents"); // import net


class SocketServer extends EventEmitter{
    constructor() {
        super();

        this.clientsList = []
        let server = net.createServer(connection => {
            console.log("Client handshake detected ");
            connection.once("data", (data)=>{
                data = data.toString("hex")
                let loginRequest = LoginRequest(data)
                this.answerLogin(this.clientsList, connection, loginRequest)
                connection.on("data", data => {
                    data = data.toString("hex")
                    ConnectionEvents.General(this.clientsList , connection, data)
                });
            })


            connection.on("error", (error)=>{
                ConsoleMsgs.debug(error)
            })
            connection.on("connect", ()=>{
                ConsoleMsgs.debug("connect triggered")
            })
            connection.on("end", ()=>{
                console.log("Connection ended, client disconnected")
                //remove client
                this.removeClientByConnection(connection)
            })

            connection.on("timeout", ()=>{
                ConsoleMsgs.debug("connect timout")
            })

            connection.on("lookup", (error, address, family, host)=>{
                ConsoleMsgs.debug("connect lookup")
            })
            connection.on("drain",  ()=>{
                ConsoleMsgs.debug("connect drain")
            })
            connection.on("close", (hadError)=>{
                ConsoleMsgs.debug("connect close")
            })

        });
        server.on("connection", socket => {
            ConsoleMsgs.debug("Server connection")
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
            ConsoleMsgs.debug("Server listening")
        })
    }

    async  answerLogin(clientsList, connection, loginRequest) {
        let currentConnectionBoxId = loginRequest.boxId
        try {
            let url = BACKEND_SERVER + 'Admin/Station/getOneByPublicId/' + currentConnectionBoxId
            let rs = await HttpRequestHandler.GET(url)
            if (rs.finalResult == true) {
                this.addClient({boxId: currentConnectionBoxId, connection: connection})
                let answer = LoginAnswer("0008", "01", '01', '11223344', "01")
                try{
                    connection.write(Buffer.from(answer, 'hex'))
                    ConsoleMsgs.success("Client logged in successfully")
                }catch (e){
                    ConsoleMsgs.error("could not write data to station")
                }
            } else {
                console.log(rs)
                ConsoleMsgs.error("Refusing station login due an error while communication with back end")
                let answer = LoginAnswer("0008", "01", '01', '11223344', "00")
                connection.write(Buffer.from(answer, 'hex'))
            }
        } catch (error) {
            ConsoleMsgs.error("Refusing station login due an error")
            let answer = LoginAnswer("0008", "01", '01', '11223344', "00")
            connection.write(Buffer.from(answer, 'hex'))
        }
    }
    addClient(client){
        this.clientsList.push(client)
        this.emit("listUpdate")
    }

    removeClientByConnection(connection){
        this.clientsList = this.clientsList.filter(client => {
            console.log(connection)
            if(client.connection == connection) return false
            return true
        })
        console.log(this.clientsList)
        this.emit("listUpdate")
    }
}

module.exports = {SocketServer}





