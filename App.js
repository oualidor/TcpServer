const {HttpRequestHandler} = require("./Apis/HttpRequestHandler");
const {BACKEND_SERVER} = require("./Apis/Config");
const {SocketServer} = require("./SocketServer");
const {ExpressServer} = require("./ExpressServer");
async function adminLogin(mail) {
    let endpoint = BACKEND_SERVER + "Admin/login"
    let rs = await HttpRequestHandler.POST(endpoint, {'mail': mail})
    return rs
}
async function main(){
    let adminLoginResult = await adminLogin('walid.khial@gmail.com')
    if(adminLoginResult.finalResult === true){

        console.log("Logged In as admin")
        let adminToken = adminLoginResult.token
        console.log("Attempting to start the server ...")
        let clientsList = []

        let socketServer = new SocketServer()
        let expressServer = new ExpressServer(adminToken)
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
    }
}

main().then(()=>{})

