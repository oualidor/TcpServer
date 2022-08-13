const Converter = require("../Apis/Coverter")
const CMDs= require("../Apis/CMDs");
const {dexToPackLen} = require("../Apis/Coverter");
const {TCP_SESSIONS_TOKEN, TCP_VERSION} = require("../Apis/Config");


const QueryAPNQueries = {
    serverRequest : (CheckSum, index) => {
        let result = CMDs.QueryAPN + TCP_VERSION + CheckSum + TCP_SESSIONS_TOKEN + index
        let PackLen = dexToPackLen(result.length)
        result = PackLen+result;
        return Buffer.from(result, "hex");
    },
    stationAnswer : (data) => {
        let MCCMNCLen = parseInt(data.substr(22, 4), 16) * 2;
        let cryptedMCCMNC = data.substr(26, MCCMNCLen);

        let APNLen = parseInt(data.substr(26+MCCMNCLen+2, 2), 16) * 2;
        let cryptedAPN =  data.substr(26+ MCCMNCLen + 4, APNLen)
        return ({
            length: parseInt(data.substr(0, 4), 16)*2,
            cmd: data.substr(4, 2),
            version: data.substr(6, 2),
            checkSum: data.substr(8, 2),
            token: data.substr(10, 8),
            index: data.substr(18, 2),
            isValid: data.substr(20, 2) == 0 ?  true: false,

            MCCMNCLen: MCCMNCLen,
            cryptedMCCMNC: cryptedMCCMNC,
            MCCMNC: Converter.hexToString(cryptedMCCMNC),

            APNLen: APNLen,
            cryptedAPN: cryptedAPN,
            APN: Converter.hexToString(cryptedAPN),
            //boxId: Converter.hexToString(data.substr(34, this.boxIdLength)).replace(/[^a-zA-Z0-9]/g, "")
        })
    }
}




module.exports = { QueryAPNQueries }