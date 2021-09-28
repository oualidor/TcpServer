const axios = require("axios")
const HttpRequestHandler = {
    async GET(URL, adminToken) {
        try{
            URL.replace(/[^a-zA-Z0-9]/g, "")
            const request  = await axios({url: URL, method: "get", responseType: 'json'})
            const data = await request.data;
            return data
        }catch (error){
            console.log(error)
            return {finalResult: false, error: error}
        }
    },


    async  POST(URL, DATA, token) {

        try{
            const response  = await axios.post( URL ,DATA)
            const data = await response.data;
            return data
        }catch (error){
            return {finalResult: false, error: error}
        }

    }
}




module.exports = {HttpRequestHandler}