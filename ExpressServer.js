const express = require('express');
const EventEmitter = require('events')
const path = require('path');
const cookieParser = require('cookie-parser');
const yitLogger  = require('./Apis/yitLogger')
const QueryAPN = require("./Apis/MiddleWears/QueryAPN");
const {EXPRESS_PORT} = require("./Apis/Config");
const {ConnectionEvents} = require("./Apis/ConnectionEvents");
const {StationRouters} = require("./routes/StationRouters");

class ExpressServer extends EventEmitter {
  constructor(adminToken) {
    super()
    this.adminToken = adminToken
    this.clientsList = []
    this.app = express();
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'ejs');
    this.app.use(yitLogger);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());

    this.app.once('error', function(err) {
      if (err.code === 'EADDRINUSE') {
        delete this
      }
    });

    this.app.listen(EXPRESS_PORT, () => {
      console.log(`EXPRESS RUNNING on PORT ${EXPRESS_PORT}.`)
    });

    this.setRouters()
  }


  async setRouters(){
    this.app.get("/HeartBitExpress", (req, res)=>{res.send({finalResult: true, result: "Test work"})})

    this.app.post("/Station/SetServer/:boxId", (req, res)=>{
      res.send({finalResult: true, data: req.body})
      //StationRouters.SetServer(req, res, this.clientsList)
    })

    this.app.get("/Station/QueryInfo/:boxId", (req, res)=>{ StationRouters.QueryInfo(req, res, this.clientsList)})

    this.app.get("/Station/rent/:boxId", async (req, res)=>{await StationRouters.rentPowerBank(req, res, this.clientsList)})

    this.app.get("/Station/QueryAPN/:boxId/:APNIndex", QueryAPN.dataValidator, (req, res)=>{StationRouters.QueryAPN(req, res, this.clientsList)})

    this.app.get("/Station/SetVoice/:boxId/:level",  (req, res)=>{StationRouters.SetVoice(req, res, this.clientsList).then(r => {})})
  }

  addClient(client){
    this.clientsList.push(client)
    this.emit("listUpdate")
  }

  removeClientByConnection(connection){
    this.clientsList = this.clientsList.filter(client => {
      if(client.connection == connection) return false
      return true
    })
    this.emit("listUpdate")
  }
}

module.exports = {ExpressServer}