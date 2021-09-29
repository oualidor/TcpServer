const CMDs = require("./CMDs")
function CmdExtractor(data){
    let cmd = data.substr(4, 2)
    return cmd

}

function sendData(connection, dataString, encoding){
    let buf = Buffer.from(dataString, 'hex');
    if(connection.write(buf)) return true
    return false
}


module.exports = { CmdExtractor, sendData}

