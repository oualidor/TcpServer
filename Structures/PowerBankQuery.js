const Converter = require("./Coverter")
const CMDs = require( "../Apis/CMDs");


const PowerBankQuery = (PackLen, Version, CheckSum, Token) => {

    return Buffer.from(PackLen+CMDs.PowerBankInfo+Version+CheckSum+Token, "hex");

};

const PowerBankQueryResult = (data) => {
    let remainingPowerBanksNumber = data.substr(18, 2)
    let powerBanksList = []
    for(let i=1; i<=remainingPowerBanksNumber; i++){
        let slot =  data.substr(20*i, 2)
        let powerBankId =  data.substr(20*i+2, 16)
        let powerLevel=  data.substr(20*i+18, 2)
        let powerBank = {slot, powerBankId, powerLevel}
        powerBanksList.push(powerBank)
    }

    return ({
        length: parseInt(data.substr(0, 4), 16 ) *2,
        remainingPowerBanksNumber: remainingPowerBanksNumber,
        powerBanksList
    })

};



module.exports = { PowerBankQuery, PowerBankQueryResult}