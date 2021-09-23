const HttpRequestHandler = {
    async GET(URL) {
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };
        try{
            const response = await fetch(URL, requestOptions);
            const data = await response.json();
            return data
        }catch (error){
            return {finalResult: false, error: error}
        }
    },


    async  POST(URL, DATA) {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(DATA)
        };
        try{
            const response = await fetch(URL, requestOptions);
            const data = await response.json();
            return data
        }catch (error){
            return {finalResult: false, error: error}
        }

    }
}




module.exports = {HttpRequestHandler}