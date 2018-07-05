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

class fissionDeploy {
	constructor(serverless,options) {
	this.serverless = serverless;
	this.options = options || {};
	this.provider = this.serverless.getProvider('fission');
	var errorCallback = function(data) {console.log(data);};
	var dataCallback=function(data) {console.log(data);};
	nrc.run('fission env create --name python --image fission/python-env', {onError: errorCallback, onData: dataCallback});
	nrc.run('fission function create --name hello --env python --code hello.py --url /hello --method GET', { onError: errorCallback, onData: dataCallback });
	console.log('You can access your function by calling "curl $FISSION_ROUTER/hello" and get its ip address with "echo $FISSION_ROUTER".');                                                                                                        }                          
	}
//	console.log("Hello World");
//	nrc.run('fission env create --name python --image USER/python-env');
//	nrc.run('fission env create --name python --image USER/python-env'.then(function(exitCodes) {
//	 
//	}, function(err) {
//	  console.log('Command failed to run with error: ', err);
//	}););

}

module.exports = fissionDeploy;
