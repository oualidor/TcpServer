const net = require("net");
const EventEmitter = require('events')
const {ExpressServer} = require("./ExpressServer");
const {ClientsListOperations} = require("./Apis/ClientsListOperations");
const { Worker } = require('worker_threads')
const {HOST, TCP_PORT} = require("./Apis/Config");
const {ConnectionEvents} = require("./Apis/ConnectionEvents"); // import net


class SocketServer extends EventEmitter{
    constructor() {
        super();
        if (SocketServer._instance) {
            throw new Error('Foo already has an instance!!!');
        }else {

            this.clientsList = []
            let server = net.createServer(connection => {
                console.log("Client handshake detected ");
                connection.on("data", data => {
                    data = data.toString("hex")
                    ConnectionEvents.General(this.clientsList , connection, data)
                });
                connection.on("end", ()=>{
                    console.log("client disconnected")
                    //remove client
                    this.removeClientByConnection(connection)
                })
            });


            server.listen(TCP_PORT, HOST, () => {
                console.log(`TCP RUNNING on PORT: `+ TCP_PORT); // prints on start
            });
            server.on("end", ()=>{
                console.log("closed")
            } )
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





