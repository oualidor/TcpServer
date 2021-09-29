const Converter = require("../Apis/Coverter")
const CMDs = require( "../Apis/CMDs");
const {dexToPackLen} = require("../Apis/Coverter");
const {TCP_SESSIONS_TOKEN, TCP_VERSION} = require("../Apis/Config");


const LoginAnswer = (CheckSum, Result) => {
    let PackLen = dexToPackLen((CMDs.login+TCP_VERSION+CheckSum+TCP_SESSIONS_TOKEN+Result).length)
    return (PackLen+CMDs.login+TCP_VERSION+CheckSum+TCP_SESSIONS_TOKEN+Result);

};


module.exports = { LoginAnswer }