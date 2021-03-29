const request = require('request')
const jconfig = require('./config.json')
const { log } = require('./other')

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
} 

function rand(min, max) {
	return Math.random() * (max - min) + min;
}

numFormat = (n) => {
    return String(n).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1 ')
}

class Bot {
	constructor (config){
		this.token = config.token || null
		this.limit_buy = config.limit_buy || 200000
		this.needFetters = config.fetters || false
	}

	request (query) {
		if(jconfig.debugging)
			console.log(query);
		return new Promise((res, err) => {
            request({
				url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0' + ( query.body ? query.body : '' ),
				method: query.json ? 'POST' : 'GET',
				headers: {
					"Content-Type": "application/json",
					"User-agent": "Mozilla/5.0",
					'authorization': this.token,
					'origin': 'https://prod-app7794757-c1ffb3285f12.pages-ac.vk-apps.com',
					'referer': 'https://prod-app7794757-c1ffb3285f12.pages-ac.vk-apps.com/'
				},
				body: JSON.stringify(query.json) || JSON.stringify({})
			}, (e, r, b) => {
				if(e)
					return err(e);
				let error = null
				try {
					error = JSON.parse(b);
				} catch (e) {
					error = b
					console.log(e);
				}
				if(error.error)
					console.log(error)
				return res(b)
			})
        })
	}

	async User (id) {
		if (!id) {
			console.log('Error not found ID');
		}
		let res = await this.request({ body: '/user?id='+id })
		let data = JSON.parse(res)
		if(jconfig.infomsg)
			log('vk.id/'+data.id+' Баланс: ' + numFormat(data.balance) + ' Рабов: ' + numFormat(data.slaves_count) + ' Доход: ' + numFormat(data.slaves_profit_per_min) + ' Цена: ' +
			numFormat(data.price));
		return data
	}

	async getSlaves (id) {
		if (!id) {
			console.log('Error not found ID');
		}
		let res = await this.request({ body: '/slaveList?id='+id })
		let data = JSON.parse(res)
		return data
	}

	async setJob (id, job_name) {
		if(jconfig.infomsg)
			log('Поставил новую работу id: ' + id + ' название: ' + job_name)
		return this.request({ body: '/jobSlave', json: {slave_id: id, name: job_name} })
	}

	async maxSlave ( id, count ) {
		let slave = await this.User(id);
		for (let i = 0; i < count; i++) {
			if(slave.profit_per_min < 1000) {
				await sleep(1800)
				await this.request({ body: '/saleSlave', json: {slave_id: id} })
				await sleep(800)
				await this.request({ body: '/buySlave', json: {slave_id: id} })
			}
		}
		await sleep(1000+(rand(1,2)*1000))
		this.setJob(id, jconfig.names[Math.floor(Math.random() * jconfig.names.length)])
		await sleep(800)
		if(this.needFetters){
			this.buyFetters(id)
		}
	}

	async buySlave (id, needmax) {
		let slave = await this.User(id);
		if(slave.price <= (!needmax ? 1e50 : this.limit_buy)){
			await this.request({ body: '/buySlave', json: {slave_id: Number(id)} })
			if(jconfig.infomsg)
				log('\x1b[32m\x1b[1mКупил раба id: ' + id)
			if(needmax)
				await this.maxSlave(id, 16)
			else
				await this.setJob(id, jconfig.names[Math.floor(Math.random() * jconfig.names.length)])
		}else{
			return log('Сильно дорогой для нас :(');
		}
	}
	
	async buyFetters (id) {
		let res = await this.request({ body: '/buyFetter', json: {slave_id: id} })
		res = JSON.parse(res)
		if(jconfig.infomsg)
			console.log('[+] Купили оковы для vk.com/id'+res.id+' Доход: '+res.profit_per_min+' Цена оков: '+res.fetter_price);
	}
}

module.exports = Bot;