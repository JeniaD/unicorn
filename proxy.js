// proxy.js
const { Proxy } = require('http-mitm-proxy');
const proxy = new Proxy();

let logs = [];
let isIntercepting = false;

proxy.onError((ctx, err) => {
	console.error('Proxy error:', err);
});

proxy.onRequest((ctx, callback) => {
	if(isIntercepting){
		let requestData = {
			url: ctx.clientToProxyRequest.url,
			method: ctx.clientToProxyRequest.method,
			headers: ctx.clientToProxyRequest.headers,
			time: new Date()
		};
		logs.push(requestData);
	}
	callback();
});

function startProxy() {
	proxy.listen({ port: 8000 });
	console.log('Proxy listening on port 8000');
}

function getLogs() {
	return logs;
}

function setIntercepting(value) {
  isIntercepting = value;
  console.log(`Intercepting is now ${value ? 'ON' : 'OFF'}`);
}

module.exports = { startProxy, getLogs, setIntercepting };

