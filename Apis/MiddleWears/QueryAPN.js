const {ExpressResult} = require("../../Structures/ExpressResult");
const QueryAPN = {
    dataValidator: (req, res, next) => {
        let valid = true
        let  error = ""
        let acceptedIndexes = ["00", "01", "02", "03", "04"]
        let {boxId, APNIndex} = req.params
        if (acceptedIndexes.includes(APNIndex) == false){
            valid = false
            error = error + "/ wrong index"
        }
        if(boxId == null || boxId == undefined || boxId.length == 0 || boxId.length == undefined ){
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

