import {
	addr
} from '@/config.js'
export const keyUser = 'user'
export const keyWeChatUser = 'wechat-user'
export const keyMenu = 'menu'
export const keyReaderSetting = 'reader-setting'
export const keySysInfo = 'sys-info'
export const keySign = 'sign'

export const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export const timestampToDate = (timestamp) => {
	let date = new Date(timestamp * 1000)
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	return [year, month, day].map(formatNumber).join('/')
}

export const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

export const now = () => {
	return parseInt(new Date().getTime() / 1000)
}

export const toTimestamp = t => {
	return parseInt(new Date(t).getTime() / 1000)
}

export const relativeTime = t => {

	let timestamp = toTimestamp(t)
	let n = now()
	let diff = n - timestamp
	let minute = 60;
	let hour = minute * 60;
	let day = hour * 24;
	let month = day * 30;

	let monthC = diff / month;
	let dayC = diff / day;
	let hourC = diff / hour;
	let minC = diff / minute;

	if (monthC > 12) {
		return parseInt(monthC / 12) + " 年前";
	} else if (monthC >= 1) {
		return parseInt(monthC) + " 月前";
	} else if (dayC >= 1) {
		return parseInt(dayC) + " 天前";
	} else if (hourC >= 1) {
		return parseInt(hourC) + " 小时前";
	} else if (minC >= 1) {
		return parseInt(minC) + " 分钟前";
	}
	return '刚刚';
}

export const clearUser = () => {
	uni.setStorageSync(keyUser, '{}')
}

export const setUser = (user) => {
	uni.setStorageSync(keyUser, JSON.stringify(user))
}

export const getUser = () => {
	try {
		var value = uni.getStorageSync(keyUser)
		if (value) {
			return JSON.parse(value)
		}
	} catch (e) {
		// Do something when catch error
		console.log(e)
		return {}
	}
}

export const setWeChatUser = (user) => {
	uni.setStorageSync(keyWeChatUser, JSON.stringify(user))
}

export const getWeChatUser = () => {
	try {
		var value = uni.getStorageSync(keyWeChatUser)
		if (value) {
			return JSON.parse(value)
		}
	} catch (e) {
		// Do something when catch error
		console.log(e)
		return {}
	}
}

export const getToken = () => {
	let user = getUser()
	if (user && user.token != undefined) {
		return user.token
	}
	return ""
}

export const redirectTo = (uriWithDecode) => {
	// 带问号的，用 redirectTo，不带问号的，用switchTab
	if (uriWithDecode.indexOf("?") > -1) {
		uni.redirectTo({
			url: uriWithDecode,
		})
	} else {
		uni.switchTab({
			url: uriWithDecode,
		})
	}
}

//添加事件结束
Promise.prototype.finally = function(callback) {
	var Promise = this.constructor;
	return this.then(
		function(value) {
			Promise.resolve(callback()).then(
				function() {
					return value;
				}
			);
		},
		function(reason) {
			Promise.resolve(callback()).then(
				function() {
					throw reason;
				}
			);
		}
	);
}

export const _getVersion = () => {
	let version = getSysInfo().appVersion
	if (version != undefined && version != "") return version
	return ''
}

// 只有请求结果返回 200 的时候，才会resolve，否则reject
export const request = (api, params = {}, method = "GET", header = {}) => {
	return new Promise(function(resolve, reject) {
		if (!header["content-type"]) {
			header["content-type"] = "application/json"
		}

		if (method.toUpperCase() == 'POST') header["content-type"] = "application/x-www-form-urlencoded"

		let token = getToken()
		if (token) header['authorization'] = token

		header['x-version'] = _getVersion()

		uni.request({
			url: api,
			data: params,
			method: method,
			header: header,
			success: function(res) {
				if (res.statusCode == 200) {
					resolve(res.data);
				} else {
					if (res.statusCode == 401) clearUser()
					reject(res);
				}
			},
			fail: function(err) {
				reject(err)
			}
		})
	});
}

export const loading = (title) => {
	title = title ? title : '玩命加载中...'
	uni.showLoading({
		title: title,
		mask: false,
	})
}

export const toastError = (content) => {
	uni.showToast({
		title: content,
		icon: 'none',
		duration: 3000
	})
}

export const toastSuccess = (content) => {
	uni.showToast({
		title: content,
	})
}

export const formatView = (view) => {
	if (view > 10000) {
		view = (view / 10000).toFixed(1) + "w"
	} else if (view > 1000) {
		view = (view / 1000).toFixed(1) + "k"
	}
	return view
}


function isEmail(email) {
	let pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
	return pattern.test(email);
}

export const _findChildren = (menu, pid) => {
	let children = []
	let left = []
	for (let i = 0; i < menu.length; i++) {
		if (menu[i].pid == pid) {
			children.push(menu[i])
		} else {
			left.push(menu[i])
		}
	}
	return left, children
}

export const menuToTree = (menu) => {
	// 来自这篇博客，谢谢: https://blog.csdn.net/u013373006/article/details/82108873
	menu.forEach(function(item) {
		delete item.children;
	});
	var map = {};
	menu.forEach(function(item) {
		map[item.id] = item;
	});
	var val = [];
	menu.forEach(function(item) {
		var parent = map[item.pid];
		if (parent) {
			(parent.children || (parent.children = [])).push(item);
		} else {
			val.push(item);
		}
	});
	return val;
}

export const menuSortIds = (menuTree) => {
	let docs = []
	for (let i in menuTree) {
		docs.push(menuTree[i].id)
		if (menuTree[i].children) {
			docs = docs.concat(menuSortIds(menuTree[i].children))
		}
	}
	return docs
}

export const menuTreeReaded = (menuTree, docId) => {
	for (let i in menuTree) {
		if (menuTree[i].id == docId) {
			menuTree[i].readed = true
			break
		}
		if (menuTree[i].children) {
			menuTree[i].children = menuTreeReaded(menuTree[i].children, docId)
		}
	}
	return menuTree
}

export const setReaderSetting = (obj) => {
	uni.setStorageSync(keyReaderSetting, JSON.stringify(obj))
}

export const getReaderSetting = () => {
	let val = uni.getStorageSync(keyReaderSetting)
	if (!val) {
		return {
			themeIndex: 0,
			fontIndex: 0
		}
	}
	val = JSON.parse(val)
	if (val.themeIndex == undefined) val.themeIndex = 0
	if (val.fontIndex == undefined) val.fontIndex = 0
	return val
}

export const setSysInfo = (obj) => {
	uni.setStorageSync(keySysInfo, JSON.stringify(obj))
}

export const formatReading = (seconds) => {
	let reading = {
		hour: 0,
		min: 0,
	}
	let hour = 3600
	if (seconds <= 0) {
		return reading
	}
	reading.hour = parseInt(seconds / hour)
	reading.min = parseInt((seconds - (hour * reading.hour)) / 60)
	return reading
}

export const getSysInfo = () => {
	let sysInfo = uni.getSystemInfoSync()
	if (sysInfo.model && sysInfo.model.indexOf('iPhone') !== -1) {
		sysInfo.titleBarHeight = 44
	} else {
		sysInfo.titleBarHeight = 48
	}
	return sysInfo
}

export const setSignedAt = (timestamp) => {
	// timestamp = 0 表示重置签到时间
	if (timestamp == 0 || timestamp > getSignedAt()) uni.setStorageSync(keySign, timestamp)
}

export const getSignedAt = () => {
	let signedAt = uni.getStorageSync(keySign) || 0
	return parseInt(signedAt)
}

export const isSignedToday = () => {
	return timestampToDate(now()) == timestampToDate(getSignedAt())
}

// 如果是绝对地址，直接返回
// 如果是相对地址，拼接上图片服务器地址
export const joinImage = (url) => {
	if (!url) return ''
	// 地址中带有 // ，即表示绝对的链接地址
	if (url.indexOf('//') >= 0) {
		return url
	}
	if (url.indexOf('/') === 0) {
		return addr + url
	}
	return addr + '/' + url
}

export const formatBytes = (bytes, decimals = 2) => {
	if (!+bytes) return '0 Bytes'

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return `${(bytes / Math.pow(k, i)).toFixed(dm)} ${sizes[i]}`
}

export default {
	formatTime,
	now,
	toTimestamp,
	relativeTime,
	request,
	loading,
	toastError,
	toastSuccess,
	setUser,
	setWeChatUser,
	clearUser,
	getUser,
	getWeChatUser,
	getToken,
	menuToTree,
	menuSortIds,
	menuTreeReaded,
	setReaderSetting,
	getReaderSetting,
	isEmail,
	getSysInfo,
	formatView,
	formatReading,
	setSignedAt,
	getSignedAt,
	isSignedToday,
	redirectTo,
	joinImage,
	formatBytes,
}