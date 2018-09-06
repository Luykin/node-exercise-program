
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const route = app => {
	app.use('/', indexRouter);
	app.use('/users', usersRouter);
}

module.exports = route;