var S3DirectoryIndexer = require("../logic/s3directoryindexer");
var S3directoryindexer = new S3DirectoryIndexer;

var S3DownloadObject = require("../logic/s3_download")
var S3downloadobject = new S3DownloadObject;
// The s3_controller handles the operation of listing and downloading S3 objects by intercting with the /logic scripts

// This is the controller function enabling the listing of all the objects (keys) in a bucket
exports.s3_directory_listing_get = async function(req, res, next) {

  try{
    await S3directoryindexer.getS3directorylisting().then((results)=>{

      res.render('index', { results });

     }).catch((err)=>{
       console.log(err);
       res.status(400).send(err);
     });
   }catch(err){
     console.log(err);
   }
}

//this is the controller enabling the process of downloding a file
exports.s3_download_object_get = async function(req, res, next) {
  console.log('edw controller')
  try{
    res.attachment(req.params.key);
    await S3downloadobject.getS3object(req.params.key).then((result)=>{


      result.pipe(res);

     }).catch((err)=>{
       console.log(err);
       res.status(400).send(err);
     });
   }catch(err){
     console.log(err);
   }
}
