const express = require('express');
const router = express.Router();
const utilRouter = require('../util/router');
const mode = require('../mysql/mode');
const CryptoJS = require("crypto-js");
const statusCode = require('../util/statusCode');
const middleware = require('./middleware');

// 获取文章列表
router.get('/', (req, res, next) => {
	mode.Article.findAndCount({
		offset: 0,
		limit: 10,
		include: [{
			model: mode.User
		}]
	})
	.then((data) => {
		res.status(200).send(data);
	})
	.catch((err) => {
		console.log(err)
		res.status(500).send(err);
	})
});

//增加文章
router.post('/add', (req, res, next) => {
	return middleware.necessaryParameters(req, res, next, ['token', 'title', 'content']);
}, (req, res, next) => {
	return middleware.tokenValidity(req, res, next, req.body.token);
}, (req, res, next) => {
	mode.Article.create({
		title: req.body.title,
		content: req.body.content,
		userId: req._tokenValidityId,
	})
	.then((data) => {
		res.send(data);
	})
	.catch((err) => {
		console.log(err)
		res.status(500).send(err);
	})
});

module.exports = router;