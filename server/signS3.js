// AWS upload zip files
const aws = require('aws-sdk')
aws.config.region = 'us-west-2'
const s3 = new aws.S3()
const S3_BUCKET_ZIP = process.env.S3_BUCKET_ZIP

// sign s3
module.exports = (req, res) => {
  const fileName = req.query['file-name']
  const fileType = req.query['file-type']

  const s3Params = {
    Bucket: S3_BUCKET_ZIP,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  }

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err)
      return res.end()
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET_ZIP}.s3.amazonaws.com/${fileName}`
    }
    res.write(JSON.stringify(returnData))
    res.end()
  })
}
