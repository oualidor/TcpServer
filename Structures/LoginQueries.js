const Converter = require("../Apis/Coverter")
const CMDs= require( "../Apis/CMDs");
const {dexToPackLen} = require("../Apis/Coverter");
const {TCP_SESSIONS_TOKEN, TCP_VERSION} = require("../Apis/Config");


const LoginQueries = {
    serverAnswer : (CheckSum, Result) => {
        let PackLen = dexToPackLen((CMDs.login + TCP_VERSION + CheckSum + TCP_SESSIONS_TOKEN + Result).length)
        return Buffer.from(PackLen + CMDs.login + TCP_VERSION + CheckSum + TCP_SESSIONS_TOKEN + Result, "hex");
    },
    stationRequest : (data) => {
        return ({
            length: parseInt(data.substr(0, 4), 16 *2),
            cmd: data.substr(4, 2),
            version: data.substr(6, 2),
            checkSum: data.substr(8, 2),
            token: data.substr(10, 8),
            random: data.substr(18, 8),
            magic: data.substr(26, 4),
            boxIdLength: parseInt(data.substr(30, 4), 16)*2,
            encryptedBoxId: data.substr(34, this.boxIdLength),
            boxId: Converter.hexToString(data.substr(34, this.boxIdLength)).replace(/[^a-zA-Z0-9]/g, "")
        })
    }
}




module.exports = { LoginQueries }