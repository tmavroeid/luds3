var express = require('express');
var router = express.Router();
// Require controller modules.
var s3_controller = require('../controllers/s3_controller');
// The middleware functions that will handle the request about listing the S3 object is handled by the s3_controller.js
// Here the request about listing is routed to the s3_controller and its function named s3_directory_listing_get
 router.get('/', s3_controller.s3_directory_listing_get);



module.exports = router;
