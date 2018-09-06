const mysql = require('mysql');

const connection = (configure) => {
	let data = {
		host: 'localhost',
		user: 'root',
		password: '123456'
	}
	if (configure && Object.prototype.toString.call(configure) === '[object Object]') {
		data = Object.assign(data, configure)
	}
	return mysql.createConnection(data);
}
module.exports = connection;