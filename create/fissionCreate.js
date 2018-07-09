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