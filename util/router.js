const jwt = require('jsonwebtoken');
const secret = 'luoyukun'; //撒盐：加密的时候混淆

function parameterVerification(body, parameter) {
    let ret = true
    for (let i = 0; i < parameter.length; i++) {
        if (parameter[i] in body) {} else {
            ret = false
            break;
        }
    }
    return ret
}

function newToken(data) {
    //jwt生成token
    const token = jwt.sign(data, secret, {
        expiresIn: 60 * 60 //秒到期时间
    });
    return token
}
module.exports = {
    parameterVerification,
    newToken
}