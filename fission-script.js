/* eslint no-console:0 */
//
// Use a Custom Resource Definition to extend the Kubernetes API and the client.
//
var fs = require('fs');
    path = require('path');
const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;


async function log_resource(resource) {
    var resources = await resource
    for (var i in resources) {
        item = resources[i]
        console.log(item);
    }
}

async function list_fns(client) {
    const fns = await client.apis['fission.io'].v1.namespaces('default').functions.get();
    return fns['body']['items'];
}

async function list_envs(client) {
    const envs = await client.apis['fission.io'].v1.namespaces('default').environments.get();
    return envs['body']['items'];
}

async function list_pkgs(client) {
    const pkgs = await client.apis['fission.io'].v1.namespaces('default').packages.get();
    return pkgs['body']['items'];
}

async function list_httptriggers(client) {
    const pkgs = await client.apis['fission.io'].v1.namespaces('default').httptriggers.get();
    return pkgs['body']['items'];
}


async function get_env(client) {
}

async function delete_env(client) {
}

async function create_env(client) {
    const env = {
        apiVersion: 'fission.io/v1',
        kind: 'Environment',
        metadata: {
            name: 'node',
            namespace: 'default',
        },
        spec: {
            TerminationGracePeriod: 360,
            builder: {},
            keeparchive: false,
            poolsize: 1,
            resources: {},
            runtime: {
                functionendpointport: 0,
                image: 'fission/node-env:0.4.0',
                loadendpointpath: '',
                loadendpointport: 0
            },
        version: 1
        }
    }
    const envs = await client.apis['fission.io'].v1.namespaces('default').environments.post({body: env});
    console.log('Environments:', envs);
}

async function create_func(client) {
    const fn = {
        apiVersion: 'fission.io/v1',
        kind: 'Function',
        metadata: {
            clusterName: '',
            name: 'test',
            namespace: 'default',
        },
        spec: {
            InvokeStrategy: {
                ExecutionStrategy: ['poolmgr'],
                StrategyType: 'execution'
            },
            configmaps: null,
            environment: {
                name: 'node',
                namespace: 'default'
            },
            package: {
                packageref: []
            },
            resources: {
            },
            secrets: null
        }
    }
    const fns = await client.apis['fission.io'].v1.namespaces('default').functions.post({body: fn});
    console.log('Functions:', fns);
}

async function create_pkgs(client, archive) {
    const pkg = {
        apiVersion: 'fission.io/v1',
        kind: 'Package',
        metadata: {
            clusterName: '',
            name: 'test-js-yc0r',
            namespace: 'default'
        },
        spec: {
            deployment: archive,
            environment: {
                name: 'node',
                namespace: 'default'
            },
           source: {
                checksum: {}
            }
        }
    }
    console.log(pkg)
    const pkgs = await client.apis['fission.io'].v1.namespaces('default').packages.post({ body: pkg});
    console.log('Packages:', pkgs);
}

function get_contents(filePath, cb) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (err) {
            console.log(err);
        }
        cb(data);
    });
}

async function main() {
  try {
    const client = new Client({ config: config.fromKubeconfig(), version: '1.9' });

    //
    // Create the CRD with the Kubernetes API
    //
    const all = await client.apis['apiextensions.k8s.io'].v1beta1.customresourcedefinitions.get();

    for (var i in all['body']['items']) {
        item = all['body']['items'][i]
        client.addCustomResourceDefinition(item);
    }
    const filename = 'hello.js';
    // if http or https download to temp dir
    const filePath = path.join(__dirname, filename);
    get_contents(filePath, function(data) {
        const archive = {
            type: 'literal',
            literal: Buffer(data).toString('base64'),
            checksum: {}
        }
        create_pkgs(client, archive);
    });

   // create_func(client);
    log_resource(list_pkgs(client));
  } catch (err) {
    console.error('Error: ', err);
  }
}

main();
