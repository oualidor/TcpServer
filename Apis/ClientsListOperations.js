const ClientsListOperations = {
    addClient: (worker, clientsList, client)=>{
        worker.on("message", (data)=>{
            clientsList = data
        })
        worker.postMessage({operation: "add", entry: client})
    },
    removeClientByConnection: (worker, clientsList, connection)=>{
        worker.on("message", (data)=>{
            clientsList = data
        })
        worker.postMessage({operation: "remove", entry: connection})
    },


}


module.exports = { ClientsListOperations }