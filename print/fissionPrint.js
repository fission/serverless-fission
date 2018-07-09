'use strict';
const Bbpromise = require('bluebird');
var nrc = require('node-run-cmd');

class fissionPrint {
	constructor(serverless,options) {
	this.serverless = serverless;
	this.options = options || {};
	this.provider = this.serverless.getProvider('fission');
	this.hooks = {
		'print:print': () => Bbpromise.bind(this).then(this.print),
	}
	}
		
	print {
	var errorCallback = function(data) {
		  console.log(data);
	};
	var dataCallback=function(data) {
		console.log(data);
	};
	nrc.run('fission function get --name hello', {onError: errorCallback, onData: dataCallback});
	}
}
module.exports = fissionPrint;
