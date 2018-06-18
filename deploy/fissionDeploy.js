'use strict';

var nrc = require('node-run-cmd');

class fissionDeploy {
	constructor(serverless,options) {
	this.serverless = serverless;
	this.options = options || {};
	this.provider = this.serverless.getProvider('fission');
	}
	nrc.run('fission env create --name python --image USER/python-env'.then(function(exitCodes) {
	 
	}, function(err) {
	  console.log('Command failed to run with error: ', err);
	}););

}

module.exports = fissionDeploy;
