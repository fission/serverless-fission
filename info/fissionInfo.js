'use strict';
const Bbpromise = require('bluebird');
var nrc = require('node-run-cmd');

class fissionInfo {
	constructor(serverless,options) {
	this.serverless = serverless;
	this.options = options || {};
	this.provider = this.serverless.getProvider('fission');
	this.hooks = {
	'info:info': () => Bbpromise.bind(this).then(this.info)
	}
	
	}
	info {
	var errorCallback = function(data) {
		  console.log(data);
	};
	var dataCallback=function(data) {
		console.log(data);
	};
	nrc.run('fission function logs --name hello', {onError: errorCallback, onData: dataCallback});

}

module.exports = fissionInfo;
