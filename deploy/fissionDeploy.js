'use strict';

var nrc = require('node-run-cmd');

class fissionDeploy {
	constructor(serverless,options) {
	this.serverless = serverless;
	this.options = options || {};
	this.provider = this.serverless.getProvider('fission');
	this.hooks = {
	'deploy:deploy': () => Bbpromise.bind(this).then(this.deploy),
	};
}
	deploy() {
	var errorCallback = function(data) {
		console.log(data);
	}
	var dataCallback = function(data) {
		console.log(data);
	}
	nrc.run('fission function create --name hello --env python --code hello.py --url /hello --method GET', { onError: errorCallback, onData: dataCallback });
	console.log('You can access your function by calling "curl $FISSION_ROUTER/hello" and get its ip address with "echo $FISSION_ROUTER".');
	}
}

module.exports = fissionDeploy;
