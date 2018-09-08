
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/article');

const route = app => {
	app.use('/', indexRouter);
	app.use('/users', usersRouter);
	app.use('/article', articleRouter);
}

module.exports = route;