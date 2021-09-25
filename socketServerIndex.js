const {HOST, TCP_PORT, EXPRESS_PORT} = require("./Apis/Config");

const net = require("net"); // import net
let clientsList = []
let server = net.createServer(connection => {
    console.log("Client handshake detected ");
    connection.on("data", data => {
        data = data.toString("hex")
        ConnectionEvents.General(clientsList, connection, data)
    });
    connection.on("end", ()=>{
        console.log("client disconnected")
        clientsList = clientsList.filter(client => client.connection != connection)
    })
});

server.listen(TCP_PORT, HOST, () => {
    console.log(`TCP RUNNING on PORT: `+ TCP_PORT); // prints on start
});

server.on("end", ()=>{
    console.log("closed")
} )


let app = require("./app")
const {ConnectionEvents} = require("./Apis/ConnectionEvents");
const {StationRouters} = require("./routes/StationRouters");


app.listen(EXPRESS_PORT, () => {
    console.log(`EXPRESS RUNNING on PORT ${EXPRESS_PORT}.`)
});

app.get("/Station/QueryInfo/:boxId", (req, res)=>{ StationRouters.getInfo(req, res, clientsList)})
app.get("/Station/test", (req, res)=>{StationRouters.test(req, res,)})
app.get("/Station/rent/:boxId", (req, res)=>{StationRouters.rentPowerBank(req, res, clientsList, ConnectionEvents.General)})