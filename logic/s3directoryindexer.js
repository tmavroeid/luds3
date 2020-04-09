//const inquirer  = require('./lib/inquirer');
const empty = require('is-empty');
const chalk = require('chalk');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');


class S3DirectoryIndexer{



  async getS3directorylisting() {
      // This array is used by the bytestoniceformat function.
      const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      var s3_objects = [];
      // The pendingRecursive counter is created to hold the number of recursions made and how many are pending, it it made for debugging purposes.
      var pendingRecursive = 0;
      let bucket_name = process.env.AWS_BUCKET_NAME;
      console.log(bucket_name);
      AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: process.env.AWS_REGION});

      var s3 = new AWS.S3();
      var s3bucket = new AWS.S3({params: {Bucket: bucket_name}})
      // Create the parameters for calling listObjects
      var bucketParams = {
        Bucket : bucket_name,
        Delimiter: '/'
      };

      var s3checkbucket = s3bucket.headBucket({Bucket: bucket_name}).promise();

      // this is the function used to convert the size that the s3 objects have in bytes to nice readable format
      function bytestoniceformat(x){

        let l = 0, n = parseInt(x, 10) || 0;

        while(n >= 1024 && ++l){
            n = n/1024;
        }
        //include a decimal point and a tenths-place digit if presenting
        //less than ten of KB or greater units
        return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
      }

      // This is the function that recursivelly lists the objects (e.g. folders, files) inside a bucket
      // The objects of its folder inside the bucket are amended to the array, s3_objects, which is finally returned to the first call of the function and then to the frontend modules
      // The s3_objects array holds tuples of key-value pairs. Each tuple contains a key and its size.
      async function listObjects(bucketParams, s3){
          let size;
          return new Promise ((resolve, reject) => {
             s3.listObjectsV2(bucketParams, (err, data) => {
               if (err) {
             	   console.log("Error", err);
                 reject(err)
               } else {
                 //console.log("success", data)
                 if(!empty(data.Contents)){
                   pendingRecursive--;
                     // The items refer to each key which is parsed, meaning every folder and file.
                     data.Contents.forEach(item => {
                       // By checking the size of each item, we can differentiate the files from the folders. Each folder has size of 0 bytes.
                       if(item.Size==0){
                         //By uncommenting the following console.logs, the results can be logged in the console
                         //console.log(chalk.blue.bold(item.Key));
                       }else{
                         //console.log(chalk.cyan.italic(item.Key));
                       }
                       size = bytestoniceformat(item.Size);
                       s3_objects.push({Key: item.Key, Size: size});
                       //console.log(item.Key);
                      });


                  }else{

                    pendingRecursive--;

                  }
                  // The data.CommonPrefixes refers to the folders contained inside a folder or the bucket itself.
                  if(!empty(data.CommonPrefixes)){
                      data.CommonPrefixes.map(function(commonPrefix) {
                       var prefix = commonPrefix.Prefix;
                       bucketParams.Prefix = prefix;

                       pendingRecursive++;
                       resolve(listObjects(bucketParams, s3));
                    });
                  }else{

                    resolve(s3_objects);
                    console.log(pendingRecursive);

                  }
                }

              });
              console.log(pendingRecursive)
            });


      }

      // If the bucket is valid, then the listObjects function is invoked to initiate the listing
      return s3checkbucket.then(async(result) => {
        console.log("This is a valid S3 bucket.");
        pendingRecursive = 1;
        return await listObjects(bucketParams, s3);

      }).catch(function(err) {
        console.log("This isn't a valid s3 bucket.");
        console.log(err);
      })



    }


}
//the module is exported as S3DirectoryIndexer so as its class and functions to be callable by the other modules
module.exports = S3DirectoryIndexer
