const Converter = require("../Apis/Coverter");
const CMDs = require("../Apis/CMDs");
const ReturnPowerBank = {
    serverAnswer : (PackLen, Version, CheckSum, Token, Slot, Result)=>{
        console.log(PackLen+CMDs.ReturnPowerBank+Version+CheckSum+Token+Slot+Result)
        return Buffer.from(PackLen+CMDs.ReturnPowerBank+Version+CheckSum+Token+Slot+Result);
    },
    stationRequest:  (data)=>{
        return ({
            length: parseInt(data.substr(0, 4), 16 *2),
            checkSum: data.substr(8, 2),
            slot: data.substr(18, 2),
            powerBankId: Converter.hexToString(data.substr(20, 16))
        })
    }
}

module.exports = {ReturnPowerBank}