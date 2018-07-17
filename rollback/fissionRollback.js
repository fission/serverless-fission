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
const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
var func = require('../common.js');
const client = new Client({ config: config.fromKubeconfig(), version: '1.9' });
class fissionRollback {
	constructor(serverless,options) {
	this.serverless = serverless;
	this.options = options || {};
	this.provider = this.serverless.getProvider('fission');
		this.commands = {
			rollback: {
				lifecycleEvents: [
					'functions'
				],
				options: {
					env: {
						usage: 'Specify the environment you want to deploy in (e.g. "--env python")',
						shortcut: 'env',
						required: true
					},
					nmspace: {
						usage: 'Specify the file containing the function to deploy. (e.g. "--code index.js")',
						shortcut: 'nm',
						default: 'dev'
					}
				}
			},
		};
	this.hooks = {
		'rollback:functions': this.rollbackFunction.bind(this)
	};
	}
	rollbackFunction() {	
	var env_name = this.options.env;
	var nmspace = this.options.nmspace;
	func.delete_env(client,env_name,nmspace);
	}
}

module.exports = fissionRollback;
