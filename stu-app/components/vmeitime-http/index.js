/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */
export default {
	config: {
		baseUrl: "http://192.168.1.104:8081/",
		data: {},
		header: {
			'Content-Type':'application/x-www-form-urlencoded',
			"userToken": uni.getStorageSync("userStuToken") || '',
			"requestType": "2"
		},
		method: "GET",
		dataType: "json",
		/* 如设为json，会对返回的数据做一次 JSON.parse */
		responseType: "text",
		success() {},
		fail() {},
		complete() {}
	},
	request(options) {
		if (!options) {
			options = {}
		}
		options.baseUrl = options.baseUrl || this.config.baseUrl
		options.dataType = options.dataType || this.config.dataType
		options.url = options.baseUrl + options.url
		options.data = options.data || {}
		options.method = options.method || this.config.method

		return new Promise((resolve, reject) => {
			let _config = null

			options.complete = (response) => {
				let statusCode = response.statusCode
				if (statusCode === 200) { //成功
					//判断当前登录用户是否超时
					if(response.header.sessionstatus && 'TIMEOUT' === response.header.sessionstatus){
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: '登录超时,请重新登录.',
							complete: function(){
								uni.reLaunch({
									url: '/pages/login/login',
								});
							}
						});
						return;
					}else if(response.header.sessionstatus && 'NOAUTHPOINT' === response.header.sessionstatus){
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: '您不具备该权限.'
						});
						return;
					}
					//请求成功
					resolve(response.data);
				} else {
					//请求失败
					resolve({
						bean: "",
						error: "0",
						returnCode: -9999,
						returnMessage: "请求失败!",
						rows: "",
						total: 0
					});
				}
			}

			_config = Object.assign({}, this.config, options)
			_config.requestId = new Date().getTime()
			_config.header.userToken = uni.getStorageSync("userStuToken") || ''

			//发起请求
			uni.request(_config);
		});
	},
	get(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	post(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	put(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	},
	delete(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	}
}
