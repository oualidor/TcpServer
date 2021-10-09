const {CMDs} = require( "../Apis/CMDs");
const {dexToPackLen} = require("../Apis/Coverter");
const {TCP_SESSIONS_TOKEN, TCP_VERSION} = require("../Apis/Config");

const SetVoiceQueries = {
    serverRequest : (level) => {
        level = parseInt(level)
        level = "0"+level.toString(16)
        let PackLen = dexToPackLen((CMDs.login + TCP_VERSION + level + TCP_SESSIONS_TOKEN + level).length)
        console.log(PackLen + CMDs.SetVoice + TCP_VERSION + level + TCP_SESSIONS_TOKEN + level)
        return Buffer.from(PackLen + CMDs.SetVoice + TCP_VERSION + level + TCP_SESSIONS_TOKEN + level, "hex");
    },

    stationAnswer : (data) => {
        return ({
            length: parseInt(data.substr(0, 4), 16 *2),
            cmd: data.substr(4, 2),
            version: data.substr(6, 2),
            checkSum: data.substr(8, 2),
            token: data.substr(10, 8)
        })
    }
}

module.exports = { SetVoiceQueries }