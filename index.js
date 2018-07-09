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

const fissionProvider = require('./provider/fissionProvider');
const fissionDeploy = require('./deploy/fissionDeploy');
const fissionCreate = require('./create/fissionCreate');
const fissionInfo = require('./info/fissionInfo');
const fissionInvoke = require('./invoke/fissionInvoke');
const fissionRollback = require('./rollback/fissionRollback');
const fissionPrint = require('./print/fissionPrint');

class fissionplugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

   this.serverless.pluginManager.addPlugin(fissionProvider);
   this.serverless.pluginManager.addPlugin(fissionDeploy);
   this.serverless.pluginManager.addPlugin(fissionCreate);
   this.serverless.pluginManager.addPlugin(fissionInvoke);
   this.serverless.pluginManager.addPlugin(fissionPrint);
   this.serverless.pluginManager.addPlugin(fissionInfo);
   this.serverless.pluginManager.addPlugin(fissionRollback);
  }
}
module.exports = fissionplugin;
