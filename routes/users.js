var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log('用户页面')
	res.send('respond with a resource');
});
router.get('/index', function(req, res, next) {
	console.log('用户2页面index')
	res.send('respond2 with a resource index');
});

module.exports = router;