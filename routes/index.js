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
        limit: 10,
        where: {
            userGrade: {
                $gte: 1000
            }
        },
        attributes: {
            exclude: ['userPassword', 'id']
        }
    })
    .then((data) => {
        if (data.rows[0]) {
            res.status(200).send(data.rows[0]);
        } else {
            res.send(404);
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
    // res.sendStatus(200);
});

module.exports = router;