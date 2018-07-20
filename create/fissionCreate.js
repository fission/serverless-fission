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
let env_create = require("../common.js");
const config = require('kubernetes-client').config;
const client = new Client({
    config: config.fromKubeconfig(),
    version: '1.9'
});
class fissionCreate {
    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;
        this.provider = this.serverless.getProvider('fission');
        this.commands = {
            create: {
                lifecycleEvents: [
                    'functions'
                ],
                options: {
                    template: {
                        usage: 'Specify the environment name (e.g. "--template python")',
                        shortcut: 'env',
                        required: true
                    },
                    img: {
                        usage: 'Specify the environment you want to deploy in (e.g. "--img python")',
                        shortcut: 'img',
                        required: true
                    },
                    nmspace: {
                        usage: 'Specify the namspace in which you want to deploy the environment. (e.g. "--nmspace default")',
                        shortcut: 'nm',
                        default: 'dev'
                    }
                }
            },
        };
        this.hooks = {
            'create:functions': this.createFunction.bind(this)
        };
    }

    async createFunction() {
        const all = await client.apis['apiextensions.k8s.io'].v1beta1.customresourcedefinitions.get();

        for (let i in all['body']['items']) {
            let item = all['body']['items'][i];
            client.addCustomResourceDefinition(item);
        }
        const env_name = this.options.template;
        const nmspace = this.options.nmspace;
        const img = this.options.img;
        env_create.create_env(client, env_name, nmspace, img);
    }
}

module.exports = fissionCreate;
