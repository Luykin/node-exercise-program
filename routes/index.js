var express = require('express');
var router = express.Router();
var util = require('util');

const connection = require('../mysqlConfig');
/* GET home page. */
router.get('/', function(req, res, next) {
	let page;
	let num;
	console.log(isNaN(parseInt(req.query.page)))
	console.log(parseInt(req.query.page))
	if (req.query.page && !isNaN(parseInt(req.query.page))) {
		page = parseInt(req.query.page)
	} else {
		page = 0
	}
	if (req.query.num && !isNaN(parseInt(req.query.num))) {
		num = parseInt(req.query.num)
	} else {
		num = 10
	}
	console.log('访问的页数与每页数量：'+ page + ',' + num)
	const nodeMysql = connection({
		database: 'world'
	})
	nodeMysql.connect();
	nodeMysql.query(`SELECT * FROM city WHERE id >= ${page * num} and id < ${(page + 1) * num} ORDER BY ID`, (err, result) => {
		if (err) {
			// res.send(JSON.stringify(err));
			console.log(err);
			res.status(404).send('Not Found');
			return
		} else {
			res.send(JSON.stringify(result));
		}
	})
	nodeMysql.end();
});

module.exports = router;