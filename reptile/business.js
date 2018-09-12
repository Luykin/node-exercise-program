const spider = require('./index');
const mode = require('../mysql/mode');

const news = (fireDate, num, userId, url) => {
	(async() => {
		console.log('__________抓取头条新闻开始__________' + fireDate)
		let list = await spider(url , ".title-box[ga_event='article_title_click'] a")
		list = list.slice(0, num)
		try {
			await mode.Article.destroy({
				where:{
					userId: userId
				}
			})
		} catch(e) {
			console.log(e)
		}
		for (let i = 0; i < list.length; i++) {
			let result = await spider(list[i].href, 'article, .article-box')
			try {
				const moderet = await mode.Article.create({
					title: list[i].html || null,
					content: result[0].html || null,
					userId: userId,
				})
			} catch (e) {
				console.log(e)
			}
		}
		console.log('__________抓取头条新闻结束__________' + fireDate)
	})()
}

module.exports = {
	news
};