const Converter = require("../Apis/Coverter");
const CMDs= require("../Apis/CMDs");
const {dexToPackLen} = require("../Apis/Coverter");
const ReturnPowerBank = {
    serverAnswer : (Version, CheckSum, Token, Slot, Result)=>{
        let PackLen = CMDs.ReturnPowerBank+Version+CheckSum+Token+Slot+Result
        PackLen = dexToPackLen(PackLen.length)
        return Buffer.from(PackLen+CMDs.ReturnPowerBank+Version+CheckSum+Token+Slot+Result, "hex");
    },
    stationRequest:  (data)=>{
        return ({
            length: parseInt(data.substr(0, 4), 16 *2),
            checkSum: data.substr(8, 2),
            slot: data.substr(18, 2),
            powerBankId: data.substr(20, 16)
        })
    }
}


module.exports = {ReturnPowerBank}