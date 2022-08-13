const { workerData, parentPort } = require('worker_threads')
let clientsList = []
parentPort.on("message", (msg) =>{
    switch (msg.operation){
        case "add":
            clientsList.push(msg.entry)
        case "get":
            parentPort.postMessage(clientsList)
    }
})