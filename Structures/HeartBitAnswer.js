const {CMDs} = require("../Apis/CMDs");
const HeartBitAnswer = (PackLen, Version, CheckSum, Token) => {
    return Buffer.from(PackLen+CMDs.heartBit+Version+CheckSum+Token, 'hex');
};

module.exports = {HeartBitAnswer}
