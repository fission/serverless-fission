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
class fissionInfo {
	constructor(serverless,options) {
	this.serverless = serverless;
	this.options = options || {};
	this.provider = this.serverless.getProvider('fission');
		this.commands = {
			info: {
				lifecycleEvents: [
					'functions'
				],
				options: {
					fn: {
						usage: 'Specify the function name (e.g. "--fn hello_world")',
						shortcut: 'fn',
						required: true
					},
					nmspace: {
						usage: 'Specify the namespace the function is deployed in (e.g. "--nmspace default")',
						shortcut: 'nmspace',
						required: true
					}
				}
			},
		};
	this.hooks = {
	'info:functions': this.infoFunction.bind(this)
	}

	}
	async infoFunction() {
		const all = await client.apis['apiextensions.k8s.io'].v1beta1.customresourcedefinitions.get();

		for (let i in all['body']['items']) {
			let item = all['body']['items'][i]
			client.addCustomResourceDefinition(item);
		}
		const nmspace = this.options.nmspace;
		const fn_name = this.options.fn;
		func.fn_info(client, fn_name, nmspace);

}
}
module.exports = fissionInfo;
