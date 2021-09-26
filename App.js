const {SocketServer} = require("./SocketServer");
const {ExpressServer} = require("./ExpressServer");



let clientsList = []

socketServer = new SocketServer()
expressServer = new ExpressServer()
expressServer.on("listUpdate", ()=>{
    console.log("data updated by express")
    clientsList = expressServer.clientsList
    socketServer.clientsList = clientsList
})

socketServer.on("listUpdate", ()=>{
    console.log("data updated by tcp")
    clientsList = socketServer.clientsList
    expressServer.clientsList = clientsList
    console.log(clientsList)
})
