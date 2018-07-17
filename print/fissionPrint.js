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
//var fs = require('fs');
//path = require('path');
const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const client = new Client({ config: config.fromKubeconfig(), version: '1.9' });
class fissionPrint {
	constructor(serverless,options) {
	this.serverless = serverless;
	this.options = options || {};
	this.provider = this.serverless.getProvider('fission');
		this.commands = {
			print: {
				lifecycleEvents: [
					'functions'
				],
				options: {
					fn: {
						usage: 'Specify the environment you want to deploy in (e.g. "--env python")',
						shortcut: 'fn',
						required: true
					},
					nmspace: {
						usage: 'Specify the environment you want to deploy in (e.g. "--env python")',
						shortcut: 'nmspace',
						required: true
					}
				}
			},
		};
	this.hooks = {
		'print:functions': () => this.printFunction.bind.this(),
	}
	}
		
	async printFunction() {
		var nmspace = this.options.nmspace;
		var fn_name = this.options.fn;
		var fn_spec = await client.apis['fission.io'].v1.namespaces(nmspace).functions(fn_name).get();
		var pkg_

	}
}
module.exports = fissionPrint;
