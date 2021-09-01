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
            case CMDs.login:
                return LoginRequest(data)
            break
            case CMDs.heartBit:
                return "hihihi"
        }
    }
}

module.exports = {cmdExtractor: CmdExtractor, RequestClassifier: RequestOperations}

