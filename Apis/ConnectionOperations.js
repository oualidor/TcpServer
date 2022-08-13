const ConnectionOperations = {

    isValid : async (clientsList, connection)=> {
        if ((clientsList == undefined) || (clientsList.length == 0)) return false
        for (let i=0; i<clientsList.length; i++){
            let client = clientsList[i]
            if(client.connection == connection) return true
        }
        return false
    },

    getClientByBoxId :  (clientsList, boxId)=> {
        try{
            if ((clientsList == undefined) || (clientsList.length == 0)) return false
            for (let i=0; i<clientsList.length; i++){
                let client = clientsList[i]
                if(client.boxId == boxId ){
                    if (client.isBusy) return false
                    return client
                }
            }
            return false
        }catch (e){
            return false
        }
    },
    getClientByConnection :  (clientsList, connection)=> {
        try{
            if ((clientsList == undefined) || (clientsList.length == 0)) return false
            for (let i=0; i<clientsList.length; i++){
                let client = clientsList[i]
                if(client.connection == connection) return client
            }
            return false
        }catch (e){
            return false
        }
    }

}

module.exports = {ConnectionOperations}