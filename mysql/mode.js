const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'nodeapp', // 数据库名
    'root', // 用户名
    '123456', // 用户密码
    {
        'dialect': 'mysql', // 数据库使用mysql
        'host': 'localhost', // 数据库服务器ip
        'port': 3306
    }
);

const User = sequelize.define(
    'user', {
        userName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        userPassword: {
            type: Sequelize.STRING,
            allowNull: false
        },
        userIcon: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userInfo: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updateTime: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        tableName: 'user',
        timestamps: false,
        freezeTableName: true
    }
);
// User.sync({ alter: true });
// sequelize.sync()
//     .then((res) => {
//         console.log('数据库同步成功')
//     }).catch(error => {
//         console.log(error)
//     })
module.exports = {
    User,
    sequelize
};