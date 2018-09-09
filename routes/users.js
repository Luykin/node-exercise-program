const express = require('express');
const router = express.Router();
const utilRouter = require('../util/router');
const mode = require('../mysql/mode');
const CryptoJS = require("crypto-js");
const statusCode = require('../util/statusCode');
const middleware = require('./middleware');
/* GET users listing. */
// router.get('/', function(req, res, next) {
//     res.send('respond with a resource');
// });
// 用户注册
router.post('/register', (req, res, next) => {
    return middleware.necessaryParameters(req, res, next, ['userName', 'userPassword']);
}, (req, res, next) => {
    const reqBody = req.body;
    reqBody.userPassword = CryptoJS.MD5(reqBody.userPassword).toString()
    mode.User.findOrCreate({
        where: {
            userName: req.body.userName
        },
        defaults: reqBody
    })
    .then((data) => {
            // console.log(data.getDataValue())
            if (data[1]) {
                const ret = data[0].dataValues;
                ret.token = utilRouter.newToken({
                    id: ret.id
                });
                delete ret.userPassword;
                delete ret.id;
                res.send(ret);
            } else {
                res.status(422).send(statusCode[422]);
            }
        })
    .catch((err) => {
        console.log(err)
        res.sendStatus(500);
    })
});
// 用户登录
router.post('/login', (req, res, next) => {
    return middleware.necessaryParameters(req, res, next, ['userName', 'userPassword']);
}, (req, res, next) => {
    const reqBody = req.body;
    reqBody.userPassword = CryptoJS.MD5(reqBody.userPassword).toString()
    mode.User.findAll({
        where: {
            userName: reqBody.userName,
            userPassword: reqBody.userPassword
        },
        include: [{
            model: mode.Article,
            as: 'originalArticle'
        }, {
            model: mode.Article,
            as: 'collect_articles'
        }],
        attributes: {
            exclude: ['userPassword']
        }
    })
    .then((data) => {
        if (data[0]) {
                // console.log(data[0])
                const ret = data[0].dataValues;
                ret.token = utilRouter.newToken({
                    id: ret.id
                });
                res.send(ret);
            } else {
                res.status(404).send(statusCode[404]);
            }
        })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
});

// 用户信息
router.post('/info', (req, res, next) => {
    return middleware.necessaryParameters(req, res, next, ['token']);
}, (req, res, next) => {
    return middleware.tokenValidity(req, res, next, req.body.token);
}, (req, res, next) => {
    mode.User.findAll({
        where: {
            id: req._tokenValidityId,
        },
        include: [{
            model: mode.Article,
            as: 'article'
        }],
        attributes: {
            exclude: ['userPassword']
        }
    })
    .then((data) => {
        if (data[0]) {
            const ret = data[0].dataValues;
            ret.token = utilRouter.newToken({
                id: ret.id
            });
            res.send(ret);
        } else {
            res.status(422).send(statusCode[422]);
        }
    })
    .catch((err) => {
        res.sendStatus(500);
    })
})

//更新用户信息
router.post('/updata', (req, res, next) => {
    return middleware.necessaryParameters(req, res, next, ['token']);
}, (req, res, next) => {
    return middleware.tokenValidity(req, res, next, req.body.token);
}, (req, res, next) => {
    const reqBody = req.body;
    if (reqBody.userPassword) {
        reqBody.userPassword = CryptoJS.MD5(reqBody.userPassword).toString()
    }
    delete reqBody.token;
    if (Object.keys(reqBody).length > 0) {
        mode.User.update(reqBody, {
            where: {
                id: req._tokenValidityId
            },
            fields: ['userPassword', 'userInfo', 'userIcon', 'realName', 'userTencent', 'userWeChat', 'userGihub']
        }).then((data) => {
            res.send(200);
        }).catch((err) => {
            res.sendStatus(500);
        })
    } else {
        res.status(412).send(statusCode[412]);
    }
})

// 收藏文章
router.post('/collect', (req, res, next) => {
    return middleware.necessaryParameters(req, res, next, ['token', 'articleId']);
}, (req, res, next) => {
    return middleware.tokenValidity(req, res, next, req.body.token);
}, (req, res, next) => {
    const reqBody = req.body;
    mode.UserArticle.findOrCreate({
        where: {
            userId: req._tokenValidityId,
            articleId: parseInt(reqBody.articleId)
        },
        defaults: {
            userId: req._tokenValidityId,
            articleId: parseInt(reqBody.articleId)
        }
    })
    .then((data) => {
        if (data[1]) {
            res.send(200);
        } else {
            res.status(422).send(statusCode[422]);
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

// 取消收藏
router.post('/cancelCollect', (req, res, next) => {
    return middleware.necessaryParameters(req, res, next, ['token', 'articleId']);
}, (req, res, next) => {
    return middleware.tokenValidity(req, res, next, req.body.token);
}, (req, res, next) => {
    const reqBody = req.body;
    mode.UserArticle.destroy({
        where: {
            userId: req._tokenValidityId,
            articleId: parseInt(reqBody.articleId)
        }
    })
    .then((data) => {
        res.send(200);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send(err);
    })
})

module.exports = router;