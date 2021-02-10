// Simple cookie manager
// by Cis Clazing

export default class CookieManager {
	constructor(domain) {
		this.domain = domain;
		this.cookies = {}
	}

	get(key) {
		this.collect();
		if (this.cookies[key] !== undefined) return this.cookies[key]
		return null;
	}

	getAll() {
		this.collect();
		return this.cookies;
	}

	collect() {
		this.cookies = {};
		let tempArr = document.cookie.split("; ");
		for (let val of tempArr) {
			let s = val.split("=");
			this.cookies[s[0]] = s[1];
		}
	}

	set(key, value) {
		let domain = (this.domain !== undefined) ? "domain="+this.domain+";":"";
		document.cookie = key+"="+value+"; path=/;" + domain;
	}

	delete(key) {
		document.cookie = key+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
	}
}
