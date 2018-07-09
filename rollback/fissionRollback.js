'use strict';
const Bbpromise = require('bluebird');
var nrc = require('node-run-cmd');

class fissionRollback {
	constructor(serverless,options) {
	this.serverless = serverless;
	this.options = options || {};
	this.provider = this.serverless.getProvider('fission');
	this.hooks = {
		'rollback:rollback': () => Bbpromise.bind(this).then(this.rollback)
	}
	}
	rollback {	
	var errorCallback = function(data) {
		  console.log(data);
	};
	var dataCallback=function(data) {
		console.log(data);
	};
	nrc.run('fission env delete --name python', {onError: errorCallback, onData: dataCallback});
	}
}

module.exports = fissionRollback;
