const ConsoleMsgs = require("./Apis/ConsoleMsgs");
const YitLogger = require("./Apis/YitLogger");
const {HttpRequestHandler} = require("./Apis/HttpRequestHandler");
const {BACKEND_SERVER} = require("./Apis/Config");
const {SocketServer} = require("./SocketServer");
const {ExpressServer} = require("./ExpressServer");

async function adminLogin(mail, password) {
    let endpoint = BACKEND_SERVER + "Guest/adminLogin"
    return await HttpRequestHandler.POST(endpoint, {'mail': mail, 'password': password})
}

async function main(){
    let adminLoginResult = await adminLogin('admin@cbc-altec.dz', '0099')
    if(adminLoginResult.finalResult === true){
        ConsoleMsgs.success("Logged In as admin")

        let adminToken = adminLoginResult.token
        console.log("Attempting to start the server ...")
        let clientsList = []

        let socketServer = new SocketServer()
        let expressServer = new ExpressServer(adminToken)

        expressServer.on("listUpdate", ()=>{
            clientsList = expressServer.clientsList
            socketServer.clientsList = clientsList
        })

        socketServer.on("listUpdate", ()=>{
            clientsList = socketServer.clientsList
            expressServer.clientsList = clientsList
        })
    }else {
        ConsoleMsgs.heavyError("Login Fails, closing the system")
    }
}

main().then(()=>{})

