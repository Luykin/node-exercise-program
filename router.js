
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/article');
var payRouter = require('./routes/pay');

const route = app => {
	app.use('/index', indexRouter);
	app.use('/users', usersRouter);
	app.use('/article', articleRouter);
	app.use('/pay', payRouter);
}

module.exports = route;