/* eslint-env jest */

module.exports = {
  config: {
    update () {
      return true
    }
  },
  S3: function () {
    return {
      getObject: function (params) {
        return {
          createReadStream: jest.fn().mockImplementation((value) => {
            switch (params.Key) {
              case '0xd5e099c71b797516c10ed0f0d895f429c27811239832492184923841':
                return Promise.reject(new Error('Whoops!'))
              default:
                return Promise.resolve(true)
            }
          })
        }
      },
      listObjectsV2: function () {
        return {
            promise : function (param1) {
              return Promise.resolve({ Contents: ['purple','yellow/ok.png','sk/lkn.tmp'], IsTruncated: false, NextContinuationToken: 'fsdfwf7asy6xf6a' })
          }
        }
      },
      upload: function (params) {
        return {
            promise : function () {
              switch (params.Key) {
                case 'red/test.jpg':
                  return Promise.reject(new Error('Whoops!'))
                default:
                  return Promise.resolve({ Location: params.Key })
              }
          }
        }
      },
      deleteObject: function (params) {
        return {
            promise : function () {
              switch (params.Key) {
                case 'yellow/test.jpg':
                  return Promise.reject(new Error('Whoops!'))
                default:
                  return Promise.resolve(true)
              }
          }
        }
      },
      headObject: function (params) {
        return {
            promise : function () {
              switch (params.Key) {
                case 'red/test.jpg':
                  return Promise.reject(new Error('Whoops!'))
                default:
                  return Promise.resolve(true)
              }
          }
        }
      },
      headBucket: function (params) {
        return {
            promise : function () {
              switch (params.Bucket) {
                case 'wrong':
                  return Promise.reject(new Error('Whoops!'))
                default:
                  return Promise.resolve(true)
              }
          }
        }
      },
    }
  }
}
