class TcpClient{

    constructor(boxId, connection) {
        this.boxId = boxId
        this.connection = connection
        this.isBusy = true
    }
    setBusy(isBusy){
        console.log("stat changed to " + isBusy)
        this.isBusy = isBusy
    }
}

module.exports = TcpClient