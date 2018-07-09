'use strict';
const Bbpromise = require('bluebird');
var nrc = require('node-run-cmd');

class fissionInvoke {
	constructor(serverless,options) {
	this.serverless = serverless;
	this.options = options || {};
	this.provider = this.serverless.getProvider('fission');
	this.hooks = {
		'invoke:invoke': () => Bbpromise.bind(this).then(this.invoke);
	}
	}

	invoke {
	var errorCallback = function(data) {
		  console.log(data);
	};
	var dataCallback=function(data) {
		console.log(data);
	};
	nrc.run('curl $FISSION_ROUTER/hello', { onError: errorCallback, onData: dataCallback });
	console.log('You can access your function by calling "curl $FISSION_ROUTER/hello" and get its ip address with "echo $FISSION_ROUTER".');
}

module.exports = fissionInvoke;
