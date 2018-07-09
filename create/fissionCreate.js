'use strict';

const Bbpromise = require('bluebird');
var nrc = require('node-run-cmd');

class fissionCreate {
	constructor(serverless,options) {
	this.serverless = serverless;
	this.options = options || {};
	this.provider = this.serverless.getProvider('fission');
	this.hooks = {
		'create:create' : () => Bbpromise.bind(this).then(this.create),
	};
}
	
	
create() {
	var errorCallback = function(data){
		console.log(data);
	}
	var dataCallback = function(data){
		console.log(data);
	}
	nrc.run('fission env create --name python --image fission/python-env', {onError: errorCallback, onData: dataCallback});
	}
}

module.exports = fissionCreate;
