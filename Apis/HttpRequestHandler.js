const axios = require("axios")
const {BACKEND_SERVER} = require("./Config");


const ENDPOINT = BACKEND_SERVER + "Guest/adminLogin"
let adminToken = ''
try {
    axios.post(ENDPOINT, {mail: "walid.khial@gmail.com"}).then(response => {
        const data = response.data;
        adminToken = data.token
    })

}catch (e){

}





const HttpRequestHandler = {
    async GET(URL) {
        try{
            URL.replace(/[^a-zA-Z0-9]/g, "")
            const request  = await axios({url: URL, method: "get",  headers: {'Content-Type': 'application/json', authorization: 'Bearer ' + adminToken}})
            const data = await request.data;
            return data
        }catch (error){
            return {finalResult: false, error: error}
        }
    },


    async  POST(URL, DATA) {
        try{
            const response  = await axios(
                {
                    url: URL,
                    method: "post",
                    responseType: 'json',
                    headers: {'Content-Type': 'application/json', authorization: 'Bearer ' + adminToken},
                    data: DATA,
                })
            const data = await response.data;
            return data
        }catch (error){
            return {finalResult: false, error: error}
        }
    }
}




module.exports = {HttpRequestHandler}