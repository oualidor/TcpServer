class TcpClient{

    constructor(boxId, connection) {
        this.boxId = boxId
        this.connection = connection
        this.isBusy = true
    }
    setStat(isBusy){
     this.isBusy = isBusy
    }
}

module.exports = TcpClient