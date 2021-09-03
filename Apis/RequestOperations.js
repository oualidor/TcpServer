const LoginRequest = require( "../Structures/LoginRequest");

const CMDs = require("./CMDs")
function CmdExtractor(data){
    let cmd = data.substr(4, 2)
    return cmd

}
function RequestOperations(data){
    let cmd = CmdExtractor(data)
    if(cmd != undefined){
        switch (cmd){
            case CMDs:
                return LoginRequest.LoginRequest(data)
            break
            case CMDs.heartBit:
                return "hihihi"
        }
    }
}
async function connectionToClient(clientsList, connection) {
    if ((clientsList == undefined) || (clientsList.length == 0)) return false
    let found = false;
    let position = undefined
    await clientsList.map((con, index) => {
        if ((con.boxId == connection.boxId)) {
            found = true;
            position = index
        }
    })
    if (!found) return false
    return clientsList[position]
}

module.exports = { CmdExtractor,  RequestOperations, connectionToClient}

