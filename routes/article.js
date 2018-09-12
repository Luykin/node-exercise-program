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
		limit: 15,
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
// 新增文章
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
// 查询userid的文章
router.post('/user_article', (req, res, next) => {
	return middleware.necessaryParameters(req, res, next, ['userIdList']);
}, (req, res, next) => {
	(async() => {
		let ret = []
		let userIdList = req.body.userIdList.split(',')
		for(let i = 0; i<userIdList.length;i++) {
			const data = {
				offset: 0,
				limit: 5,
				where: {
					userId: userIdList[i]
				}
			}
			if (parseInt(req.body.no_cantent) === 1) {
				data.attributes = {
					exclude: ['content']
				}
			}
			try {
				const result = await mode.Article.findAndCount(data);
				ret.push(result)
			} catch (err) {
				console.log(err)
			}
		}
		res.send(ret);
	})()
})
// 查询id=?的文章
router.post('/article_content', (req, res, next) => {
	return middleware.necessaryParameters(req, res, next, ['articleId']);
}, (req, res, next) => {
	(async() => {
		try {
			const reult = await mode.Article.findById(req.body.articleId);
			res.send(reult);
		} catch (err) {
			console.log(err);
			res.send(500);
		}
	})()
})

module.exports = router;