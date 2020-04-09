var AWS = require('aws-sdk');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

class S3DownloadObject{


  async getS3object(fileKey) {
    let bucket_name = process.env.AWS_BUCKET_NAME;
    console.log(bucket_name);
    AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: process.env.AWS_REGION});

    var s3 = new AWS.S3();
    // Create the parameters for getting the object of a specific key
    var fileParams = {
      Bucket : bucket_name,
      Key: fileKey
    };
    // A filestream is initiated and its result is streamed to the frontend modules and then to the client
    var fileStream = await s3.getObject(fileParams).createReadStream();
    return fileStream;

  }

}
//the module is exported as S3DownloadObject so as its class and functions to be callable by the other modules
module.exports = S3DownloadObject
