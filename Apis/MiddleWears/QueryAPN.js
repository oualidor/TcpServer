const {ExpressResult} = require("../../Structures/ExpressResult");
const QueryAPN = {
    dataValidator: (req, res, next) => {
        let valid = true
        let acceptedIndexes = ["00", "01", "02", "03", "04"]
        let {stationId, index} = req.params
        if (!acceptedIndexes.includes(index)) valid = false
        if(stationId == null || stationId == undefined || stationId.length == 0 || stationId.length == undefined ) valid =false
        if(valid){
            next()
        }else {
            res.send(ExpressResult(false, "wrong index"))
        }
    }
}

module.exports = QueryAPN

