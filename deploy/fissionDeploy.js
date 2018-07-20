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
const client = new Client({ config: config.fromKubeconfig(), version: '1.9' });
let func = require('../common.js');
class fissionDeploy {
	constructor(serverless,options) {
	this.serverless = serverless;
	this.options = options || {};
	this.provider = this.serverless.getProvider('fission');
		this.commands = {
			deploy: {
				lifecycleEvents: [
					'functions'
				],
				options: {
					template: {
						usage: 'Specify the name of the function you want to deploy in (e.g. "--template hello_world")',
						shortcut: 'fn',
						required: true
					},
					env: {
						usage: 'Specify the environment you want to deploy in (e.g. "--env python")',
						shortcut: 'fn',
						required: true
					},
					code: {
						usage: 'Specify the file containing the function to deploy. (e.g. "--code index.js")',
						shortcut: 's',
						default: 'dev'
					}
				}
			},
		};
		this.hooks = {
			'deploy:functions': this.deployFunction.bind(this)
		};
}
	async deployFunction() {
        const all = await client.apis['apiextensions.k8s.io'].v1beta1.customresourcedefinitions.get();

                for (let i in all['body']['items']) {
                    let item = all['body']['items'][i];
                    client.addCustomResourceDefinition(item);
                }
		const env_name = this.options.env;
		const code = this.options.code;
                const name = this.options.template;
		func.create_func_pkg(client, name, env_name, code);

	}
}

module.exports = fissionDeploy;
