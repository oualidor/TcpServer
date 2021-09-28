const express = require('express');
const EventEmitter = require('events')
const path = require('path');
const cookieParser = require('cookie-parser');
const yitLogger  = require('./Apis/yitLogger')
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


  setRouters(){
    this.app.get("/HeartBitExpress", (req, res)=>{
      res.send({finalResult: true, result: "Test work"})
    })
    this.app.get("/Station/QueryInfo/:boxId", (req, res)=>{ StationRouters.QueryInfo(req, res, this.clientsList)})
    this.app.get("/Station/rent/:boxId", (req, res)=>{StationRouters.rentPowerBank(req, res, this.clientsList)})
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