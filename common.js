/* eslint no-console:0 */
//
// Use a Custom Resource Definition to extend the Kubernetes API and the client.
//
var exports = module.exports = {};
var fs = require('fs');

var path = require('path');

exports.delete_env = async function (client, env_name, nmspace) {
    
    var del_env = await client.apis['fission.io'].v1.namespaces(nmspace).environments(env_name).delete();
    console.log(del_env);
}
exports.delete_fn = async function (client, fn_name, nmspace) {

    var del_fn = await client.apis['fission.io'].v1.namespaces(nmspace).functions(fn_name).delete();
    console.log(del_fn);
}


 exports.create_env = async function (client,env_name,nmspace,img) {
    const env = {
        apiVersion: 'fission.io/v1',
        kind: 'Environment',
        metadata: {
            name: env_name,
            namespace: nmspace,
        },
        spec: {
            TerminationGracePeriod: 360,
            builder: {},
            keeparchive: false,
            poolsize: 1,
            resources: {},
            runtime: {
                functionendpointport: 0,
                image: img,
                loadendpointpath: '',
                loadendpointport: 0
            },
        version: 1
        }
    }
    const envs = await client.apis['fission.io'].v1.namespaces('default').environments.post({body: env});
    console.log('Environments:', envs);
   // return envs;
}

async function create_func(client,funcname,env_name,pkg_name) {
    
    const fn = {
        apiVersion: 'fission.io/v1',
        kind: 'Function',
        metadata: {
            clusterName: '',
            name: funcname,
            namespace: 'default',
        },
        spec: {
            InvokeStrategy: {
                ExecutionStrategy: ['poolmgr'],
                StrategyType: 'execution'
            },
            configmaps: null,
            environment: {
                name: env_name,
                namespace: 'default',
            },
            package: {
                packageref: {
                    namespace: 'default',
                    name: pkg_name['metadata']['name'],
                    resourceVersion: pkg_name['metadata']['resourceVersion'],
       }
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
    const pkgs = await client.apis['fission.io'].v1.namespaces('default').packages.post({ body: pkg});
    return pkgs;
}

function get_contents(filePath, cb) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (err) {
            console.log(err);
        }
        cb(data);
    });
}
exports.create_func_pkg = async function (client,env_name,code,name) {
    const filename = code;
    // if http or https download to temp dir
    const filePath = path.join(__dirname, filename);
    console.log("test2");
    get_contents(filePath, async function (data) {
        console.log("test3");
        const archive = {
            type: 'literal',
            literal: Buffer(data).toString('base64'),
            checksum: {}
        }
        var pkg_name = await create_pkgs(client, archive);
        create_func(client,name, env_name, pkg_name['body']);
    });
}
