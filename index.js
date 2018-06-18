'use strict';

const fissionProvider = require('./provider/fissionProvider');
const fissionDeploy = require('./deploy/fissionDeploy');

class fissionplugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.serverless.pluginManager.addPlugin(fissionProvider);
    this.serverless.pluginManager.addPlugin(fissionDeploy);
  }

}

module.exports = fissionplugin;
