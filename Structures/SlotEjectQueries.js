const CMDs= require( "../Apis/CMDs");


const SlotEjectQueries = {
    serverRequest : (PackLen, Version, CheckSum, Token, slot) => {
        return Buffer.from(PackLen+CMDs.SlotEject+Version+CheckSum+Token+slot, "hex");
    },

    StationAnswer : (data) => {
        return ({
            length: parseInt(data.substr(0, 4), 16 ) *2,
            slot: data.substr(18, 2),
            result: data.substr(20,2),
            powerBankId: data.substr(22, 16)
        })

    }
}



module.exports = SlotEjectQueries




