const {ConnectionOperations} = require("../ConnectionOperations");
const ExpressMiddlewares = {

    StationLoginValidator : async (clientsList, req, res, next) => {
        let {boxId} = req.params
        let client = await ConnectionOperations.getClientByBoxId(clientsList, boxId)
        if (client == false){
            console.log(clientsList)
            res.send({finalResult: false, error: "Station not logged in"})
        }
        else{
            req.client = client
            req.boxId = boxId
            next()
        }
    }
}

module.exports = ExpressMiddlewares