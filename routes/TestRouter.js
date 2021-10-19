let express = require('express');
const ConnectionEvents = require("../Apis/ConnectionEvents");
const PowerBanksInfoQueries = require("../Structures/PowerBanksInfoQueries");
let TestRouter = express.Router();

/* GET users listing. */
TestRouter.get( "/QueryInfo/:boxId", async (req, res, clientsList) => {
      let client = req.client
      try{
        await client.setBusy(true)
        let connection  = client.connection
        if (connection.write(PowerBanksInfoQueries.serverQuery("0007", "01", "8a", "11223344"))) {
          ConnectionEvents.ServerFirst(clientsList, client, res)
        } else {
          client.setBusy(false)
          res.send({finalResult: false, error: "Failed to send request to station"})
        }
      }catch (error){
        client.setBusy(false)
        res.send({finalResult: false, error: "Error while sending request to the station"})
      }

    },
);

module.exports = TestRouter;
