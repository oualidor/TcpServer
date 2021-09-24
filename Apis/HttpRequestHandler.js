const axios = require("axios")
const HttpRequestHandler = {
    async GET(URL) {
        try{
            const response  = await axios({url: URL, method: "get", responseType: 'json'})
            const data = await response.data;
            return data
        }catch (error){
            return {finalResult: false, error: error}
        }
    },


    async  POST(URL, DATA) {
        try{
            const response  = await axios.post( URL,  "POST",DATA)
            const data = await response.data;
            return data
        }catch (error){
            return {finalResult: false, error: error}
        }

    }
}




module.exports = {HttpRequestHandler}