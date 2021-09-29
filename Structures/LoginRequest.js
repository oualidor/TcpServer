const Converter = require("../Apis/Coverter")


const LoginRequest = (data) => {

    return ({
        length: parseInt(data.substr(0, 4), 16 *2),
        cmd: data.substr(4, 2),
        version: data.substr(6, 2),
        checkSum: data.substr(8, 2),
        token: data.substr(10, 8),
        random: data.substr(18, 8),
        magic: data.substr(26, 4),
        boxIdLength: parseInt(data.substr(30, 4), 16)*2,
        encryptedBoxId: data.substr(34, this.boxIdLength),
        boxId: Converter.hexToString(data.substr(34, this.boxIdLength)).replace(/[^a-zA-Z0-9]/g, "")
    })

};


module.exports = { LoginRequest }