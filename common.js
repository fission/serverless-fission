/* eslint no-console:0 */
//
// Use a Custom Resource Definition to extend the Kubernetes API and the client.
//
var exports = module.exports = {};
let fs = require('fs');
const path = require('path');

exports.delete_env = async function(client, env_name, nmspace) {

    const del_env = await client.apis['fission.io'].v1.namespaces(nmspace).environments(env_name).delete();
    console.log("Fission envirnment ", del_env['body']['details']['name'], " deleted");
}
exports.delete_fn = async function(client, fn_name, nmspace) {
    const del_fn = await client.apis['fission.io'].v1.namespaces(nmspace).functions(fn_name).delete();
    console.log("Fission function ", del_fn['body']['details']['name'], " deleted");
}
exports.fn_code = async function(client, fn_name, nmspace) {

    const fn_data = await client.apis['fission.io'].v1.namespaces(nmspace).functions(fn_name).get();
    const pkg_name = fn_data['body']['spec']['package']['packageref']['name'];
    const pkg_namespace = fn_data['body']['spec']['package']['packageref']['namespace'];
    const pkg_data = await client.apis['fission.io'].v1.namespaces(pkg_namespace).packages(pkg_name).get();
    const pkg_code = pkg_data['body']['spec']['deployment']['literal'];
    const pkg_decode = new Buffer(pkg_code, 'base64');
    console.log("Code for", fn_name, "in", nmspace, ":\n");
    console.log(pkg_decode.toString());
}
exports.fn_info = async function(client, fn_name, nmspace) {
    const fn_info = await client.apis['fission.io'].v1.namespaces(nmspace).functions(fn_name).getStream();
    console.log("Detailed logs and Information for", fn_name, "in ", nmspace, ":\n");
    console.log(fn_info);
}

exports.create_env = async function(client, env_name, nmspace, img) {
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
    const envs = await client.apis['fission.io'].v1.namespaces(nmspace).environments.post({
        body: env
    });
    console.log("Fission environment ", envs['body']['metadata']['name'], " created");
}

async function create_func(client, funcname, env_name, pkg_name, nmspace) {

    const fn = {
        apiVersion: 'fission.io/v1',
        kind: 'Function',
        metadata: {
            clusterName: '',
            name: funcname,
            namespace: nmspace,
        },
        spec: {
            InvokeStrategy: {
                ExecutionStrategy: ['poolmgr'],
                StrategyType: 'execution'
            },
            configmaps: null,
            environment: {
                name: env_name,
                namespace: nmspace,
            },
            package: {
                packageref: {
                    namespace: nmspace,
                    name: pkg_name['metadata']['name'],
                    resourceVersion: pkg_name['metadata']['resourceVersion'],
                }
            },
            resources: {},
            secrets: null
        }
    }
    const fns = await client.apis['fission.io'].v1.namespaces(nmspace).functions.post({
        body: fn
    });
    console.log("Fission function ", fns['body']['metadata']['name'], " created");
}

async function create_pkgs(client, archive, new_name, nmspace, env_name) {
    const pkg = {
        apiVersion: 'fission.io/v1',
        kind: 'Package',
        metadata: {
            clusterName: '',
            name: new_name,
            namespace: nmspace
        },
        spec: {
            deployment: archive,
            environment: {
                name: env_name,
                namespace: nmspace
            },
            source: {
                checksum: {}
            }
        }
    }
    const pkgs = await client.apis['fission.io'].v1.namespaces(nmspace).packages.post({
        body: pkg
    });
    return pkgs;
}
function makeid() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function get_contents(filePath, cb) {
    fs.readFile(filePath, {
        encoding: 'utf-8'
    }, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            cb(data);
        }
    });
}
exports.create_func_pkg = async function(client, name, env_name, code, nmspace) {
    const filename = code;
    // if http or https download to temp dir
    let parentDir = path.resolve(process.cwd(), '.');
    const filePath = path.join(parentDir, filename);
    get_contents(filePath, async function(data) {
        const archive = {
            type: 'literal',
            literal: Buffer(data).toString('base64'),
            checksum: {}
        }
        const new_name = name + "-" + "js" + makeid();
        const pkg_name = await create_pkgs(client, archive, new_name, nmspace, env_name);
        create_func(client, name, env_name, pkg_name['body'], nmspace);
    });
}
