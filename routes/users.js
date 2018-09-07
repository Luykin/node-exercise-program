const express = require('express');
const router = express.Router();
const utilRouter = require('../util/router');
const mode = require('../mysql/mode');
const CryptoJS = require("crypto-js");
const statusCode = require('../util/statusCode');
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
// 用户注册
router.post('/register', function(req, res, next) {
    const mustParameter = ['userName', 'userPassword']
    if (utilRouter.parameterVerification(req.body, mustParameter)) {
        const reqBody = req.body;
        reqBody.userPassword = CryptoJS.MD5(reqBody.userPassword).toString()
        mode.User.findOrCreate({ where: { userName: req.body.userName }, defaults: reqBody })
            .then((data) => {
            	if (data[1]) {
            		const ret = data[0]
            		ret.token = utilRouter.newToken({userName: data[0].userName})
            		delete ret.userPassword;
            		console.log(ret);
            		res.send(ret);
            	} else {
            		res.status(422).send(statusCode[422]);
            	}
            })
            .catch((err) => {
                console.log(err)
                res.status(404).send(err);
            })
    } else {
        res.status(412).send(statusCode[412]);
    }
});
// // 用户登录
// router.post('/login', function(req, res, next) {
//     const mustParameter = ['user_name', 'user_password']
//     if (utilRouter.parameterVerification(req.body, mustParameter)) {
//         const nodeMysql = connection({
//             database: 'nodeapp'
//         })
//         const reqBody = req.body;
//         reqBody.user_password = CryptoJS.MD5(reqBody.user_password).toString()
//         nodeMysql.table('user').where(reqBody).select()
//             .then((data) => {
//                 if (data.length > 0) {
//                     delete data[0].user_password;
//                     //jwt生成token
//                     const token = jwt.sign({
//                         'user_id': data[0].id
//                     }, secret, {
//                         expiresIn: 60 * 2 //秒到期时间
//                     });
//                     data[0].token = token;
//                     res.status(200).send(data[0]);
//                 } else {
//                     res.status(404).send(statusCode[404]);
//                 }
//             })
//             .catch((err) => {
//                 res.status(404).send(err);
//             })
//     } else {
//         res.status(412).send(statusCode[412]);
//     }
// });

// router.post('/info', function(req, res, next) {
//     const mustParameter = ['token']
//     if (utilRouter.parameterVerification(req.body, mustParameter)) {
//         jwt.verify(req.body.token, secret, function(err, decoded) {
//         	if (err) {
//         		res.status(413).send(statusCode[413]);
//         	} else {
//         		res.status(200).send(decoded);
//         	}
//         });
//     } else {
//         res.status(412).send(statusCode[412]);
//     }
// })

module.exports = router;