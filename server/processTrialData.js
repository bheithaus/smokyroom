// PSEUDOCODE FLOW

// When new ZIP is uploaded onto S3, unzipped into CSV files,
// then call this endpoint on our server (from S3)
//
// parameters
//
// folder name - name of folder to be processed
//
//
//
// when called, check for having already
// processed that folder (existing record in DB)
//
// then get csv's and process them into one large entry
// per trial
//
//

const CSVParser = require('./parse-csv/parser')
const aws = require('aws-sdk')
aws.config.region = 'us-west-2'
const s3 = new aws.S3()

const S3_BUCKET_PM_READINGS = process.env.S3_BUCKET_PM_READINGS
const s3Params = {
  Bucket: S3_BUCKET_PM_READINGS,
  Delimiter: '/'
}

const csvData = {
  sensors: [],
  readings: {}
}

const processTrialData = (request, response) => {
  const trialName = request.params.trialName;

  console.log('got request to initiate CSV parsing', request.params.trialName);

  // TODO enforce request originates from my AWS lambda

  const pmTrialsCollection = request.db.connection.collection('trials')
  const cleanRegExp = /.*\/|.csv/g;

  // get trial directory from s3
  s3.listObjects({
    Bucket: S3_BUCKET_PM_READINGS,
    Delimiter: '/',
    Prefix: `${trialName}/`,
  }, (err, directory) => {
    if (err) {
      return console.log('s3 error', err)
    }
    console.log('s3 data', directory)

    if (!directory.Contents.length) {
      return console.log('No files found for trialName :', trialName);
    }

    const trialPMReadings = {}
    const parser = new CSVParser()

    const csvFileRequests = directory.Contents.map((file) => {
      return new Promise((resolve, reject) => {
        s3.getObject({
          Bucket: S3_BUCKET_PM_READINGS,
          Key: file.Key,
        }, (err, data) => {
          if (err) {
            console.log(err)
            return reject(err)
          }

          console.log('s3 file', file);

          const csvText = data.Body.toString('utf-8')
          const pmData = parser.toJSON(csvText)

          trialPMReadings[file.Key.replace(cleanRegExp, '')] = pmData

          console.log('regexp worked?', file.Key.replace(cleanRegExp, ''))

          resolve()
        })
      })
    })

    // when all s3 CSV files are loaded and parsed
    Promise.all(csvFileRequests)
      .then((params) => {
        // console.log('resolved', params)
        // console.log('insert into DB', trialName, trialPMReadings);

        pmTrialsCollection.update({
            _id: trialName,
          },
          {
            _id: trialName,
            data: trialPMReadings
          },
          {
            upsert: true
          })
        })
  })

  response.json({
    started: true,
    trialName: request.params.trialName
  })
}

module.exports = processTrialData
