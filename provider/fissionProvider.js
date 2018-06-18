'use strict';

const providerName = 'fission';

class fissionProvider {
	static getProviderName(){
		return provideName;
	}
	constructor(serverless) {
		this.serverless = serverless;
		this.provider = this;
		this.serverless.setProvider(providerName, this);
	}
}

module.exports = fissionProvider;
