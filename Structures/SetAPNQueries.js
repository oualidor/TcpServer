const Converter = require("../Apis/Coverter")
const {stringToHex} = require("../Apis/Coverter");
const CMDs= require("../Apis/CMDs");
const {dexToPackLen} = require("../Apis/Coverter");
const {TCP_SESSIONS_TOKEN, TCP_VERSION} = require("../Apis/Config");


const SetAPNQueries = {
    serverRequest : (CheckSum,  isValid, index,  MCCMNC,  APN,  Username,  Password) => {
        isValid ? isValid = "00":isValid ="01"
        MCCMNC = stringToHex(MCCMNC)+"00"
        let MCCMNCLen = dexToPackLen(MCCMNC.length)

        APN = stringToHex(APN)+"00";
        let APNLen = dexToPackLen(APN.length)

        Username = stringToHex(Username)+"00"
        let UsernameLen = dexToPackLen(Username.length)

        Password = stringToHex(Password)+"00"
        let PasswordLen = dexToPackLen(Password.length)

        let result = CMDs.SetAPN+ TCP_VERSION+ CheckSum + TCP_SESSIONS_TOKEN+index+ isValid+ MCCMNCLen+ MCCMNC+ APNLen+ APN+ UsernameLen+ Username+ PasswordLen+ Password
        let PackLen = dexToPackLen(result.length)
        result = PackLen+result;
        console.log(result)
        return Buffer.from(result, "hex");
    },
    stationAnswer : (data) => {
        let MCCMNCLen = parseInt(data.substr(22, 4), 16) * 2;
        let encryptedMMC = data.substr(26, MCCMNCLen);

        let APNLen = parseInt(data.substr(26+MCCMNCLen+2, 2), 16) * 2;
        let encryptedAPN =  data.substr(26+ MCCMNCLen + 4, APNLen)
        return ({
            length: parseInt(data.substr(0, 4), 16)*2,
            cmd: data.substr(4, 2),
            version: data.substr(6, 2),
            checkSum: data.substr(8, 2),
            token: data.substr(10, 8),
            result: data.substr(18, 2),

        })
    }
}




module.exports = { SetAPNQueries }