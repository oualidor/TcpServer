const Converter = require("./Coverter")
const CMDs = require( "../Apis/CMDs");


const LoginAnswer = (PackLen, Version, CheckSum, Token, Result) => {

    return (PackLen+CMDs.login+Version+CheckSum+Token+Result);

};


module.exports = { LoginAnswer }