const Converter = require("./Coverter")


const LoginRequest = (data) => {

    return ({
        length: parseInt(data.substr(0, 4), 16 *2),
        boxIdLength: parseInt(data.substr(30, 4), 16)*2,
        boxId: Converter.hexToString(data.substr(32, this.boxIdLength))
    })

}

export default LoginRequest

