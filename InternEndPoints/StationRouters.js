const express = require('express');
const seq = require('sequelize');
const bcrypt = require('bcrypt');
const router = express.Router();
const Station = require('../Schemas/Station');
const Validator = require("../Apis/dataValidator");
const {sendData} = require("../Apis/RequestOperations");

const  AdminStationRouters = {
        queryStationPowerBankInfo: router.post('/queryPowerBankInfo', async (req, res) => {
            const {id} = req.body
            let connection
            if (await sendData(connection, "000764018a11223344", null)){
                res.send("request sent")
            }else {
                res.send("wrong")
            }
        })
}

module.exports = AdminStationRouters;














