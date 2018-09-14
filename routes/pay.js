const express = require('express');
const router = express.Router();
const utilRouter = require('../util/router');
const mode = require('../mysql/mode');
const CryptoJS = require("crypto-js");
const statusCode = require('../util/statusCode');
const middleware = require('./middleware');
const https = require("https");
const querystring = require("querystring");
const xml2js = require('xml2js');

const options = {
	hostname: 'api.mch.weixin.qq.com',
	port: '443',
	path: '/pay/unifiedorder',
	method: 'POST',
	headers: {
		'Content-Type': 'application/xml'
	}
}

function getSign(data) {
	let sortedKeys = Object.keys(data).sort()
	let signStr = ''
	for (let item in sortedKeys) {
		const key = sortedKeys[item]
		signStr += key + '=' + data[key] + '&'
	}
	signStr += 'key=' + '82cde2383f6839ee8a99d1d8e6ba8a7e'
	const sign = CryptoJS.MD5(signStr).toString().toUpperCase()
	console.log(sign)
	return sign
}
// 支付
router.post('/', (req, res, next) => {
	return middleware.necessaryParameters(req, res, next, ['appid', 'mch_id', 'nonce_str', 'body', 'out_trade_no', 'total_fee', 'spbill_create_ip', 'notify_url', 'trade_type', 'openid']);
}, (req, res, next) => {
	const builder = new xml2js.Builder();
	let optionsData = {
		appid: req.body.appid, // 小程序ID
		mch_id: req.body.mch_id, //商户号
		nonce_str: req.body.nonce_str, // 随机字符串
		body: req.body.body, // 商品描述
		out_trade_no: req.body.out_trade_no, //商户订单号
		total_fee: req.body.total_fee, //标价金额
		spbill_create_ip: req.body.spbill_create_ip, // 终端IP
		notify_url: req.body.notify_url, // 通知地址
		trade_type: req.body.trade_type,// 交易类型
		openid: req.body.openid // 用户标识
	}
	optionsData.sign = getSign(optionsData)
    const reqBody = builder.buildObject(optionsData); //querystring.stringify(req.body); 
    const httpreq = https.request(options, (httpres) => {
    	httpres.on("data", function(chunk) {
    		const optionParser = {
    			explicitArray : false,
    			ignoreAttrs: true
    		}
    		xml2js.parseString(chunk, optionParser, (err, result) => {
    			if (err) {
    				res.send(err);
    			} else {
    				res.send(result.xml ? result.xml : result);
    			}
    		})
    	})
    	httpres.on("end", function() {
    		console.log("请求完毕")
    	});
    	console.log(httpres.statusCode)
    })
    httpreq.on("error", function(err) {
    	console.log(err.message);
    	res.send(err);
    })
    httpreq.write(reqBody);
    httpreq.end();
  });

module.exports = router;