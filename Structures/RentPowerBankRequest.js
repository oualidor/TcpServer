const CMDs = require( "../Apis/CMDs");

const RentPowerBankRequest = (PackLen, Version, CheckSum, Token, slot) => {

    return Buffer.from(PackLen+CMDs.RentPowerBank+Version+CheckSum+Token+slot, "hex");

};

const RentPowerBankResult = (data) => {
    return ({
        length: parseInt(data.substr(0, 4), 16 ) *2,
        slot: data.substr(18, 2),
        result: data.substr(20,2),
        powerBankId: data.substr(22, 16)
    })
};

//module.exports = {RentPowerBankRequest, RentPowerBankResult}
const axios = require('axios').default;
async function test() {

    try {
        let rs = await axios({
            url: 'http://localhost:8080/Admin/Station/getAll/0/9999',
            method: "get",
            responseType: 'json'
        })
        console.log(rs.data)

    } catch (e) {
        console.log(e)
    }
}

test()



