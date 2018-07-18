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
var http = require('http');
class fissionInvoke {
	constructor(serverless,options) {
	this.serverless = serverless;
	this.options = options || {};
	this.provider = this.serverless.getProvider('fission');
		this.commands = {
			invoke: {
				lifecycleEvents: [
					'functions'
				],
				options: {
					router: {
						usage: 'Specify the router ip (e.g. "--router $FISSION_ROUTER")',
						shortcut: 'ip',
						required: true
					},
					ports: {
						usage: 'Specify the exposed port number. (e.g. "--ports 31314")',
						shortcut: 'p',
						default: '8443'
					},
					fnname: {
						usage: 'Specify the name of the function you wanna call. (e.g. "--fnname hello_world")',
						shortcut: 'f',
						default: '8443'
					}
					
				}
			},
		};
		this.hooks = {
			'invoke:functions': this.invokeFunction.bind(this)
		};
	}

	invokeFunction() {
		var options = {
			host: this.options.router,
			port: this.options.ports,
			path: this.options.fnname
		};

		http.get(options, function (res) {
			console.log("Got response: " + res);
		}).on('error', function (e) {
			console.log("Got error: " + e.message);
		});
}
}
module.exports = fissionInvoke;
