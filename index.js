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
