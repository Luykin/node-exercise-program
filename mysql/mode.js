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
        realName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userPassword: {
            type: Sequelize.STRING,
            allowNull: false
        },
        userIcon: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userTencent: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userWeChat: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userGihub: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userGrade: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
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
        timestamps: true,
        freezeTableName: true
    }
    );
const Article = sequelize.define(
    'article', {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        content: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        tableName: 'article',
        timestamps: true,
        freezeTableName: true
    });
const UserArticle = sequelize.define(
    'UserArticle', {
        status: {
            type: Sequelize.STRING,
            allowNull: true
        },
    })

Article.belongsTo(User);
User.hasMany(Article, {
    as: 'originalArticle'
})

Article.belongsToMany(User, {
    through: 'UserArticle',
    as: 'collector'
});
User.belongsToMany(Article, {
    through: 'UserArticle',
    as: 'collect_articles'
});
// User.sync({alter:true})
// UserArticle.sync({alter:true})
// Article.sync({alter:true})
// sequelize.sync() 
// console.log(sequelize.modelManager.models)
module.exports = {
    User,
    Article,
    UserArticle,
    sequelize
};