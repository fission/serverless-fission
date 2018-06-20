# Fission Serverless Plugin

This plugin brings [Fission](https://github.com/fission/fission) support within the [Serverless Framework](https://github.com/serverless).



## Pre requisites

Make sure you have a kubernetes endpoint running and fission-cli is installed. You can find the installation intructions [here](https://docs.fission.io/0.8.0/installation/installation/).

Once you have fission running in your cluster you can install serverless
```bash
$ npm install serverless -g
```

## Try out the example

Clone this repo and check the example function
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
environment 'python' created
function 'hello' created
route created: GET /hello -> hello
Serverless: Packaging service...
Serverless: Excluding development dependencies...
```

The function will be deployed to k8s via fission.
```bash
$ kubectl get pods --all-namespaces
```

Now you will be able to call the function:
```bash
$ curl $FISSION_ROUTER/hello
hello world
```



If you are using minikube you can call directly the function through HTTP and the Node Port in which the function is running:
```bash
$ curl  http://192.168.99.100:31314
hello world
```


