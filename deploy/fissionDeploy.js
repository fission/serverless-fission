/*
 Copyright 2018 Infracloud Technologies.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
'use strict';

var nrc = require('node-run-cmd');
var fs = require('fs');
const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
var func = require('../testfunc.js');
class fissionDeploy {
	constructor(serverless,options) {
	this.serverless = serverless;
	this.options = options || {};
	this.provider = this.serverless.getProvider('fission');
		this.commands = {
			deploy: {
				lifecycleEvents: [
					'deploy'
				],
				options: {
					env: {
						usage: 'Specify the environment you want to deploy in (e.g. "--env python")',
						shortcut: 'env',
						required: true
					},
					code: {
						usage: 'Specify the file containing the function to deploy. (e.g. "--code index.js")',
						shortcut: 's',
						required: true
					},
					name: {
						usage: 'Specify the function name. (e.g. "--name test")',
						shortcut: 'name',
						required: true
					}
				}
			},
		};
	this.hooks = {
	'deploy:deploy': () => Bbpromise.bind(this).then(this.deploy),
	};
}
	deploy() {
		var env_name = this.options.env;
		var code = this.options.code;
		const client = new Client({ config: config.fromKubeconfig(), version: '1.9' });
		func.create_func_pkg(client,name,env_name,code);
	console.log('You can access your function by calling "curl $FISSION_ROUTER/hello" and get its ip address with "echo $FISSION_ROUTER".');
	}
}

module.exports = fissionDeploy;
