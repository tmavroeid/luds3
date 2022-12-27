const express = require('express')
const router = express.Router()
const { s3listing, s3download, apiS3listing, apiS3download } = require('../controllers/index')
// The middleware functions that will handle the request about listing the S3 object is handled by the s3_controller.js
// Here the request about listing is routed to the s3_controller and its function named s3_directory_listing_get

/**
 * @swagger
 * /list:
 *   get:
 *     summary: Retrieve all objects inside the prefixes of a bucket
 *     responses:
 *       200:
 *          description: A list with all objects
 *       400:
 *          description: Invalid bucket
 */
router.get('/list', s3listing)

/**
 * @swagger
 * /list:
 *   get:
 *     summary: Download a file/folder (key) from a bucket
 *     responses:
 *       200:
 *          description: OK
 *       400:
 *          description: Invalid bucket
 */
router.get('/download/:key(*)', s3download)

/**
 * @swagger
 * /list:
 *   get:
 *     summary: Retrieve all objects inside the prefixes of a bucket
 *     responses:
 *       200:
 *          description: A list with all objects
 *       400:
 *          description: Invalid bucket
 */
router.get('/api/list', apiS3listing)

/**
 * @swagger
 * /list:
 *   get:
 *     summary: Download a file/folder (key) from a bucket
 *     responses:
 *       200:
 *          description: OK
 *       400:
 *          description: Invalid bucket
 */
router.get('/api/download/:key(*)', apiS3download)

module.exports = router
