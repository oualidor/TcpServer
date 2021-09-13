const Converter = require("./Coverter")
const CMDs = require( "../Apis/CMDs");


const PowerBankQuery = (PackLen, Version, CheckSum, Token) => {

    return (PackLen+CMDs.PowerBankInfo+Version+CheckSum+Token);

};


module.exports = { PowerBankQuery }