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
let func = require('../common.js');
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
						usage: 'Specify the environment you want to delete (e.g. "--env python")',
						shortcut: 'env',
						required: true
					},
					nmspace: {
						usage: 'Specify the namespace where the environment is deployed (e.g. "--nmspace default")',
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
	async rollbackFunction() {
         const all = await client.apis['apiextensions.k8s.io'].v1beta1.customresourcedefinitions.get();

                for (let i in all['body']['items']) {
                    let item = all['body']['items'][i];
                     client.addCustomResourceDefinition(item);
                }
	const env_name = this.options.env;
	const nmspace = this.options.nmspace;
	func.delete_env(client, env_name, nmspace);
	}
}

module.exports = fissionRollback;
