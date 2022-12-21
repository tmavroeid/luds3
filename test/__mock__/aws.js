/* eslint-env jest */

module.exports = {
  config: {
    update () {
      return true
    }
  },
  S3: function () {
    return {
      getObject: function (param1) {
        return {
          createReadStream: jest.fn().mockImplementation((value) => {
            switch (param1) {
              case '0xd5e099c71b797516c10ed0f0d895f429c27811239832492184923841':
                return Promise.reject(new Error('Whoops!'))
              default:
                return Promise.resolve(true)
            }
          })
        }
      },
      listObjectsV2: function (param1) {
        return Promise.resolve(true)
      },
      headBucket: jest.fn().mockImplementation((value) => {
        switch (value) {
          case '0xd5e099c71b797516c10ed0f0d895f429c2781146':
            return false
          default:
            return true
        }
      })
    }
  }
}
