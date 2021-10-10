const Converter = require("../Apis/Coverter")
const {stringToHex} = require("../Apis/Coverter");
const {CMDs} = require("../Apis/CMDs");
const {dexToPackLen} = require("../Apis/Coverter");
const {TCP_SESSIONS_TOKEN, TCP_VERSION} = require("../Apis/Config");


const SetServerQueries = {
    serverRequest : (address, port, heartBit) => {
        address = stringToHex(address)+"00"
        let addressLen = dexToPackLen(address.length)

        port = stringToHex(port)+"00";
        let portLen = dexToPackLen(port.length)
        heartBit = parseInt(heartBit)
        heartBit = heartBit.toString(16)
        if(heartBit.length < 2){
            heartBit = "0"+heartBit
        }
        let CheckSum = "8a"

        let result = CMDs.setServerAddress+ TCP_VERSION+ CheckSum + TCP_SESSIONS_TOKEN+addressLen+ address + portLen+ port+ heartBit
        let PackLen = dexToPackLen(result.length)
        result = PackLen+result;
        return Buffer.from(result, "hex");
    },
    stationAnswer : (data) => {
        return ({
            length: parseInt(data.substr(0, 4), 16)*2,
            cmd: data.substr(4, 2),
            version: data.substr(6, 2),
            checkSum: data.substr(8, 2),
            token: data.substr(10, 8),

        })
    }
}




module.exports = SetServerQueries