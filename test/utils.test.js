/* eslint-env jest */
const path = require('path')
const { getS3object, upload, deleteKey, download, listObjects, bytesToNiceFormat, getS3directorylisting } = require(path.join(__dirname, '../logic/utils'))
const AWS = require('./__mock__/aws.js')

jest.mock('aws-sdk', () => {
  const AWS = require('./__mock__/aws.js')
  return AWS
})
jest.mock('conf', () => {
  const Conf = jest.fn().mockImplementation(() => {
    return {
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

describe('upload', function () {
  beforeEach(() => {
    jest.resetModules()
    process.env.AWS_BUCKET_NAME = 'test'
  })

  test('should return true', async () => {
    const filepath = await upload('myimages', __dirname+'/__mock__/test.jpg', 'purple')
    expect(filepath).toBe('purple/test.jpg')
  })

  test('should return error', async () => {
    const res = await upload('myimages', __dirname+'/__mock__/test.jpg', 'red')
    expect(res.message).toBe('Whoops!')
  })
})

describe('deleteKey', function () {
  beforeEach(() => {
    jest.resetModules()
    process.env.AWS_BUCKET_NAME = 'test'
  })

  test('should return true', async () => {
    const success = await deleteKey('myimages', 'purple/test.jpg')
    expect(success).toBe(true)
  })

  test('should return error', async () => {
    const res = await deleteKey('myimages', 'yellow/test.jpg')
    expect(res.message).toBe('Whoops!')
  })

  test('headObject: should return error', async () => {
    const res = await deleteKey('myimages', 'red/test.jpg')
    expect(res.message).toBe('Whoops!')
  })
})


describe('getS3directorylisting', function () {
  beforeEach(() => {
    jest.resetModules()
    process.env.AWS_BUCKET_NAME=null
  })

  test('should return true', async () => {
    const objects = await getS3directorylisting('myimages')
    expect(objects[0]).toBe('purple')
    expect(objects[2]).toBe('sk/lkn.tmp')
    expect(objects.length).toBe(3)
  })

  test('should return error', async () => {
    const res = await getS3directorylisting('wrong')
    expect(res.message).toBe('Whoops!')
  })

})

describe('bytesToNiceFormat', function () {
  beforeEach(() => {
    jest.resetModules()
  })

  test('should return KB', async () => {
    const res = await bytesToNiceFormat(100000)
    expect(res).toBe('98 KB')
  })

})

describe('listObjects', function () {
  beforeEach(() => {
    jest.resetModules()
  })

  test('should return objects', async () => {
    const params = {
      Bucket: 'myimages'
    }
    const s3 = new AWS.S3({ params })
    const objects = await listObjects(params, s3)
    expect(objects[0]).toBe('purple')
    expect(objects[2]).toBe('sk/lkn.tmp')
    expect(objects.length).toBe(3)
  })

  test('should return error', () => {
    const params = {
      Bucket: 'wrong'
    }
    const s3 = new AWS.S3({ params })
    listObjects(params, s3)
    .catch((err)=>{
      expect(err).toBe('Whoops!')
    })
    
  })
})