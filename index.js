#! /usr/bin/env node
const { program } = require('commander')
const path = require('path')
const logger = require('./common/logger')
const { setupCredentials, getCredentials, listing, downloadFile, uploadFile, deploy } = require(path.join(__dirname, '/luds3.js'))

program
  .command('set-credentials')
  .requiredOption('-accesskey, --accesskey <value>', 'The access key for IAM user.')
  .requiredOption('-secretkey, --secretkey <value>', 'The secret access key for IAM user.')
  .option('-region, --region <value>', 'The region where S3 buckets reside.')
  .description('Setup aws IAM user credentials to access S3 resources.')
  .action(setupCredentials)

program
  .command('get-credentials')
  .description('Get user credentials for IAM user.')
  .action(getCredentials)

program
  .command('run-api')
  .requiredOption('-bucket, --bucket <value>', 'The bucket to list all items.')
  .description('Deploys the api to list and download items from the bucket param.')
  .action(deploy)

program
  .command('list')
  .requiredOption('-bucket, --bucket <value>', 'The bucket to list all items.')
  .description('Lists all items and folders inside a bucket.')
  .action(listing)

program
  .command('download')
  .requiredOption('-bucket, --bucket <value>', 'The bucket from which to download the selected item (key).')
  .requiredOption('-key, --key <value>', 'The item (key) to download.')
  .description('Downloads file from S3 bucket.')
  .action(downloadFile)

program
  .command('upload')
  .requiredOption('-bucket, --bucket <value>', 'The bucket to which the selected item will be uploaded.')
  .requiredOption('-filepath, --filepath <value>', 'The absolute filepath for the selected file.')
  .requiredOption('-prefix, --prefix <value>', 'The destination folder path (prefix) in the bucket to save the file.')
  .description('Uploads file in S3 bucket.')
  .action(uploadFile)

program.parse()
