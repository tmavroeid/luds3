var express = require('express');
var router = express.Router();
// Require controller modules.
var s3_controller = require('../controllers/s3_controller');
// The middleware functions that will handle the request about downloding the S3 object is handled by the s3_controller.js
// Here the request about download is routed to the s3_controller and its function named s3_download_object_get
// By invoking the endpoint "/download/:key", the parameter key indicates the object which is to downloaded
router.get('/:key(*)', s3_controller.s3_download_object_get);



module.exports = router;
