# luds3
This is a CLI tool that enables fast content listing of S3 buckets. Also, it allows to easily upload, download and delete files.

<h1 align="center">
  <img width="400" src="https://raw.githubusercontent.com/tmavroeid/luds3/0.0.4/img/luds3.png" alt="luds3 header">
  <br/>
</hr>

[![Github license](https://img.shields.io/github/license/tmavroeid/luds3)](https://img.shields.io/github/license/tmavroeid/corellia)
[![GitHub Release](https://img.shields.io/github/release/tmavroeid/luds3.svg)](https://github.com/tmavroeid/corellia/releases)
[![Github Issues](https://img.shields.io/github/issues/tmavroeid/luds3)](https://img.shields.io/github/issues/tmavroeid/luds3)
[![coverage](https://raw.githubusercontent.com/tmavroeid/luds3/0.0.4/coverage/badge-functions.svg)](https://raw.githubusercontent.com/tmavroeid/luds3/0.0.4/coverage/badge-functions.svg)

##### Table of Contents
- [Installation](#installation)  
- [Getting Started](#getting-started)  
- [Prerequisites](#prerequisites)
- [Usage](#usage)
- [Examples](#examples)
- [Development](#development)
- [License](#license)
- [Technologies](#technologies)

## Installation

```
npm install luds3
```

## Getting Started
By running the `--help`, the `luds3` will print out all required to get you started:

```
trantor@guy:~/$ luds3 --help
Usage: luds3 [options] [command]

Options:
  -h, --help                 display help for command

Commands:
  set-credentials [options]  Setup aws IAM user credentials to access S3 resources.
  get-credentials            Get user credentials for IAM user.
  run-api [options]          Deploys the api to list and download items from the bucket param.
  list [options]             Lists all items and folders inside a bucket.
  download [options]         Downloads file from S3 bucket.
  upload [options]           Uploads file in S3 bucket.
  delete [options]           Deletes file in S3 bucket.
  help [command]             display help for command
```
## Prerequisites
`luds3` requires an `IAM` account with full privileges to access the S3 resources where the S3 buckets to perform all operations, reside. 

## Usage
`luds3` consists of the following commands:

- The `set-credentials` command will help you setup the **ACCESS KEY**, **SECRET ACCESS KEY** and **REGION**.
- The `list` command will iterate over a chosen `bucket` and list all items
- The `download` command will download a chosen item with a specific `prefix` from inside a `bucket`
- The `upload` command will upload an item from local storage inside a chosen `bucket`
- The `delete` command will delete an item in a chosen `bucket`
- The `run-server` command will deploy an express server which will list at `localhost:8008` the items of a bucket giving the opportunity to download any of them.

## Examples

List:

```
trantor@guy:~/$ luds3 list -bucket mymages
2022-12-21 23:03:39 info: Valid S3 bucket.
2022-12-21 23:03:40 info: blue/
2022-12-21 23:03:40 info: blue/pexels-anjana-c-674010.jpg -- 1018 KB
2022-12-21 23:03:40 info: green/
2022-12-21 23:03:40 info: green/pexels-pixabay-414102.jpg -- 229 KB
2022-12-21 23:03:40 info: purple/
2022-12-21 23:03:40 info: purple/term-bg-1-3d6355ab.jpg -- 43 KB
2022-12-21 23:03:40 info: purple/test.jpg -- 1018 KB
2022-12-21 23:03:40 info: red/
2022-12-21 23:03:40 info: red/pexels-pixabay-206359.jpg -- 569 KB
2022-12-21 23:03:40 info: test.jpg -- 1018 KB
2022-12-21 23:03:40 info: yellow/
```

Delete:

```
luds3 delete -bucket mymages -key purple/test.jpg
```

Upload:

```
luds3 upload -bucket mymages -filepath /home/guy/Documents/test/test.jpg -prefix purple
```

Download:

```
luds3 download -bucket mymages -key blue/pexels-anjana-c-674010.jpg
```

Run-Server:
```
luds3 run-server -bucket mymages
```

## Development
Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/]. Having NPM installed, several dependencies should be installed as described in the next section.


Using NPM, install system specific software dependencies enclosed to package.json.

```
npm install
```
## License
MIT -- take a look [LICENSE](LICENSE.md)

## Technologies
* [Nodejs](https://nodejs.org/en/)
* [AWS-SDK for Nodejs](https://aws.amazon.com/sdk-for-node-js/)
* [Expressjs](https://expressjs.com/)
* [Handlebarsjs](https://handlebarsjs.com/)
