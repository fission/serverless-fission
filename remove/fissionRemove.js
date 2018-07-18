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
class fissionRemove {
    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options || {};
        this.provider = this.serverless.getProvider('fission');
        this.commands = {
            remove: {
                lifecycleEvents: [
                    'functions'
                ],
                options: {
                    fn: {
                        usage: 'Specify the name of the function to be deleted (e.g. "--name hello_world")',
                        shortcut: 'env',
                        required: true
                    },
                    nmspace: {
                        usage: 'Specify the namespace where the function is deployed. (e.g. "--nmspace default")',
                        shortcut: 'nm',
                        default: 'dev'
                    }
                }
            },
        };
        this.hooks = {
            'remove:functions': this.removeFunction.bind(this)
        };
    }
   async removeFunction() {
        const all = await client.apis['apiextensions.k8s.io'].v1beta1.customresourcedefinitions.get();

                for (var i in all['body']['items']) {
                    var item = all['body']['items'][i]
                    client.addCustomResourceDefinition(item);
                }
        var fn_name = this.options.fn;
        var nmspace = this.options.nmspace;
        func.delete_fn(client, fn_name, nmspace);
    }
}

module.exports = fissionRemove;
