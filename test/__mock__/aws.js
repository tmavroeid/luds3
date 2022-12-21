/* eslint-env jest */
const AWS = {
  config: function () {
    return {
      update: function (options, allowUnknownKeys) {
        allowUnknownKeys = allowUnknownKeys || false
        options = this.extractCredentials(options)
        return Promise.resolve(true)
      }
    }
  },
  S3: function () {
    return {
      getObject: jest.fn().mockImplementation((param1) => {
        switch (param1) {
          case '0xd5e099c71b797516c10ed0f0d895f429c27811239832492184923841':
            return Promise.reject(new Error('Whoops!'))
          default:
            return Promise.resolve(true)
        }
      }),
      listObjectsV2: jest.fn().mockImplementation((value) => {
        switch (value) {
          case '0xd5e099c71b797516c10ed0f0d895f429c2781146':
            return false
          default:
            return true
        }
      }),
      headBucket: jest.fn().mockImplementation((value) => {
        switch (value) {
          case '0xd5e099c71b797516c10ed0f0d895f429c2781146':
            return false
          default:
            return true
        }
      })
    }
  },
  utils: {
    isAddress: jest.fn().mockImplementation((value) => {
      switch (value) {
        case '0xd5e099c71b797516c10ed0f0d895f429c2781146':
          return false
        default:
          return true
      }
    }),
    getAddress: (param1) => { return param1 },
    parseEther: () => { return 10000000000000000000 },
    formatUnits: () => { return 10 },
    Interface: function (abi) {
      return {
        encodeFunctionData: (param1, param2) => {
          return '0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000'
        }
      }
    }
  }
}

module.exports = {
  AWS
}
