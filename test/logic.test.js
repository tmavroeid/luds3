/* eslint-env jest */
const path = require('path')
const { getS3object, download, upload, bytesToNiceFormat, getS3directorylisting } = require(path.join(__dirname, '../logic/utils'))

jest.mock('aws-sdk', () => {
  const AWS = require('./__mock__/aws.js')
  return AWS
})
jest.mock('conf', () => {
  const Conf = jest.fn().mockImplementation(() => {
    return{
      get: jest.fn((param1) => {
        return {
          accessKeyId: 'jiFVbfdaisbn23iya1sBN0', 
          secretAccessKey: 'fkojadfoiunauinfdiuna', 
          region: 'eu-central-1'
        }
      })
    }
   
  })
  return Conf
})
jest.mock('../common/logger')
jest.mock('winston')

describe('getObject', function () {
  beforeEach(() => {
    jest.resetModules()
    process.env.AWS_BUCKET_NAME = 'test'
  })

  test('should return true', async () => {
    const success = await getS3object('test')
    expect(success).toBe(true)
  })
})