const config = require('./config.json')
const Bot = require('./bot.js');
const { log } = require('./other');

/*
	КОД Говно, советую написать свой с 0 или юзать другие либы :)
	Выложил на гитхаб просто так для кого то мб подойдет
	TODO: Рефакторинг
*/

function rand(min, max) {
	return Math.random() * (max - min) + min;
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

let bot1 = null
loadAccount = async () => {
	bot1 = new Bot({token: config.accounts[0].token, limit_buy: config.accounts[0].limit_buy, fetters: config.accounts[0].fetters})
	main()
}
main = async () => {
	try {
		let rid = Math.ceil( rand(1,646412830) )
		await bot1.buySlave(rid, config.accounts[0].upgrade)
		await sleep(2500+(rand(1,2)*1000))
			main();
	} catch (e) {
		console.log(e);
		main();
	}
}
loadAccount()

numFormat = (n) => {
    return String(n).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1 ')
}

info = () => {
	setInterval(async () => {
		let res = await bot1.request({ body: '/start' })
		res =  JSON.parse(res)
		log('\x1b[44m['+res.me.id+'] Баланс: ' + numFormat(res.me.balance) + ' Рабов: ' + numFormat(res.me.slaves_count) + ' Доход: ' + numFormat(res.me.slaves_profit_per_min) + ' ТОП: ' + numFormat(res.me.rating_position));
	}, config.infomeInterval*1000)
}
if(config.infome)
	info()