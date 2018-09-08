const express = require('express');
const router = express.Router();
const util = require('util');
// const connection = require('../mysqlConfig');
// const CryptoJS = require("crypto-js");
const mode = require('../mysql/mode');
/* GET home page. */
router.get('/', function(req, res, next) {
    mode.User.findAndCount({
            offset: 0,
            limit: 10
        })
        .then((ret) => {
            res.status(200).send(ret);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        })
    // res.sendStatus(200);
});

module.exports = router;