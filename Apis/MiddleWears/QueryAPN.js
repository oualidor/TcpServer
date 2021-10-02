const {ExpressResult} = require("../../Structures/ExpressResult");
const QueryAPN = {
    dataValidator: (req, res, next) => {
        let valid = true
        let  error = ""
        let acceptedIndexes = ["00", "01", "02", "03", "04"]
        let {stationId, index} = req.params
        if (acceptedIndexes.includes(index) == false){
            valid = false
            error = error + "/ wrong index"
        }
        if(stationId == null || stationId == undefined || stationId.length == 0 || stationId.length == undefined ){
            valid =false
            error = error + "/ wrong station ID"
        }
        if(valid){
            next()
        }else {
            res.send(ExpressResult(false, error))
        }
    }
}

module.exports = QueryAPN

