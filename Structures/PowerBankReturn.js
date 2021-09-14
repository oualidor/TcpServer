const Converter = require("./Coverter")
const CMDs = require( "../Apis/CMDs");


const PowerBankReturnRequest = (data) => {

    return ({
        length: parseInt(data.substr(0, 4), 16 *2),
        slot: data.substr(18, 2),
        powerBankId: Converter.hexToString(data.substr(20, 16))
    })

};
module.exports = {PowerBankReturnRequest}