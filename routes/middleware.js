const utilRouter = require('../util/router');
const statusCode = require('../util/statusCode');

function necessaryParameters(req, res, next, data) {
	if (utilRouter.parameterVerification(req.body, data)) {
		next();
	} else {
		res.status(412).send(statusCode[412]);
	}
}
function tokenValidity(req, res, next, token) {
	const user = utilRouter.verifyToken(token)
	if (user && user.id) {
		req._tokenValidityId = user.id
		next();
	} else {
		res.status(413).send(statusCode[413]);
	}
}
module.exports = {
	necessaryParameters,
	tokenValidity
};