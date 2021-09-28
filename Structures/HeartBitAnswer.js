const CMDs = require("../Apis/CMDs");
const HeartBitAnswer = (PackLen, Version, CheckSum, Token) => {
    return Buffer.from(PackLen+CMDs.login+Version+CheckSum+Token, 'hex');
};

module.exports = {HeartBitAnswer}
