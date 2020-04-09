# REST API for S3 Operations



##### Table of Contents  
- [Introduction](#introduction)
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)
- [Usage](#usage)
- [Technologies](#technologies)

## Introduction
This is a REST API for S3 operations such as listing and downloading objects in-browser.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
The ___app.js___ file holds the structure of the web API and makes it available. The _route_ folder contains the scripts that route the requests to the appropriate controller function. The _controller_ folder contains the scripts handling the requests which are addressed to two endpoints. The _logic_ folder contains the core scripts implementing the functionalities which are provided through the endpoints.

### Prerequisites
Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/]. Having NPM installed, several dependencies should be installed as described in the next section.


Using NPM, install system specific software dependencies enclosed to package.json.

```
npm install
```

## Usage

To test code follow the steps:

1: Open a command prompt or shell terminal after installing the dependencies.

2: Create into the root directory a ___.env___ file containing the following:

```
AWS_ACCESS_KEY_ID="....."
AWS_SECRET_ACCESS_KEY="....."
AWS_REGION="...."
AWS_BUCKET_NAME="....."

```

3: Enter the following command in order to instantiate the app and deploy the web API.
```
node ./bin/www
```
4: When the objects of a S3 bucket are listed, then they are presented as links that can be clicked in order to automatically invoke the second endpoint and download the file.

5:The following endpoints can be invoked at browser:
```
http://localhost:3000/list
http://localhost:3000/download/[KEY]
```
6: The ___KEY___ in the second endpoint is passed as a parameter in the body of the request and not as a parameter in the _URL_.

## Technologies
* [Nodejs](https://nodejs.org/en/)
* [AWS-SDK for Nodejs](https://aws.amazon.com/sdk-for-node-js/)
* [Expressjs](https://expressjs.com/)
* [Handlebarsjs](https://handlebarsjs.com/)
