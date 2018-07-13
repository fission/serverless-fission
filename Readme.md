
# Fission Serverless Plugin

This plugin brings [Fission](https://github.com/fission/fission) support within the [Serverless Framework](https://github.com/serverless).



## Pre requisites

Make sure you have a fission running and fission-cli is installed. You can find the installation intructions [here](https://docs.fission.io/0.8.0/installation/installation/).

You can install serverless with npm,
```bash
$ npm install serverless -g
```

## Try out the example

Clone repo and check the example function
```bash
$ git clone https://github.com/infracloudio/serverless-fission/
$ cd examples/test-examples
$ cat serverless.yml
service: hello

provider:
  name: fission
  runtime: python2.7

plugins:
  - serverless-fission

functions:
  hello:
    description: 'Hello function'
    handler: handler.hello
```

Download dependencies
```bash
$ npm install ../
```

Deploy function.
```bash
$ serverless deploy
You can access your function by calling "curl $FISSION_ROUTER/hello" and get its ip address with "echo $FISSION_ROUTER".
Serverless: Packaging service...
Serverless: Excluding development dependencies...
environment 'python' created

1 environment(s) are present in this ns: default. All these envs share the same service account token, with previleges to view secrets 
of all the functions referencing them. Envs can be created in different ns if isolation is needed   

function 'hello' created
```

The function will be deployed to Kubernetes via fission.
```bash
$ fission function list
NAME  UID                                  ENV    EXECUTORTYPE MINSCALE MAXSCALE MINCPU MAXCPU MINMEMORY MAXMEMORY TARGETCPU             
hello 2b0f9c51-7459-11e8-a089-080027cdd0a9 python poolmgr      0        1        0      0      0         0         80         
$ kubectl get pods --all-namespaces
NAMESPACE          NAME                                                              READY     STATUS        RESTARTS   AGE   
fission-function   python-2b073331-7459-11e8-a089-080027cdd0a9-5h3iitxq-66b4c56lrb   2/2       Running       0          15s             
fission-function   python-2b073331-7459-11e8-a089-080027cdd0a9-5h3iitxq-66b4c5vzpv   2/2       Running       0          15s             
fission-function   python-2b073331-7459-11e8-a089-080027cdd0a9-5h3iitxq-66b4cn8psk   2/2       Running       0          15s  

```

Now you will be able to call the function:
```bash
$ curl $FISSION_ROUTER/hello
hello world
```

If you are using minikube, you can call the function through HTTP and the Node Port in which function is running:
```bash
$ curl  http://$(minikube ip):31314/hello
hello world
```
Demo:
[![asciicast](https://asciinema.org/a/uhBySeyWY8tvqAIbIlaTmLwSA.png)](https://asciinema.org/a/uhBySeyWY8tvqAIbIlaTmLwSA)

