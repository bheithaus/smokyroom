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





const fs = require('fs')
const path = require('path')
const CsvDb = require('./csv-db')
const csvLabels = require('./csv/parser')

const csvPaths = {
  sensors: path.join(__dirname, './csv/sensors/positions.csv'),
  readings: path.join(__dirname, './csv/particulate-matter')
}

const csvData = {
  sensors: [],
  readings: {}
}

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = process.env.MONGODB_URI;

// Database Name
const dbName = 'smoke-data';

// Create a new MongoClient
const client = new MongoClient(url);

const aws = require('aws-sdk')
const S3_BUCKET_PM_READINGS = process.env.S3_BUCKET_PM_READINGS
aws.config.region = 'us-west-2'
const s3 = new aws.S3()

const s3Params = {
  Bucket: S3_BUCKET_PM_READINGS,
  Delimiter: '/'
}

// get Directories
// s3.listObjects(s3Params, (err, directories) => {
//   if (err) {
//     return console.log('s3 error', err);
//   }

//   console.log('s3 directories', directories);

//   directories.CommonPrefixes.forEach((directory) => {
//     s3.listObjects(Object.assign({}, s3Params, directory), (err, directory) => {
//       if (err) {
//         return console.log('s3 error', err);
//       }
//       console.log('s3 data', directory);

//       directory.Contents.forEach((file) => {
//         s3.getObject({
//           Bucket: S3_BUCKET_PM_READINGS,
//           Key: file.Key,
//         }, (err, data) => {
//           if (err) {
//             return console.log(err)
//           }
//           let lines = data.Body.toString('utf-8');
//           console.log('got file ', lines.split('\n'));
//             // typeof data ==='string'&& data.split('\n'));
//         })
//       })
//     })
//   })
// })

  // s3.getSignedUrl('putObject', s3Params, (err, data) => {
  //   if(err){
  //     console.log(err)
  //     return res.end()
  //   }
  //   const returnData = {
  //     signedRequest: data,
  //     url: `https://${S3_BUCKET_ZIP}.s3.amazonaws.com/${fileName}`
  //   }
  //   res.write(JSON.stringify(returnData))
  //   res.end()
  // })


// Get sensors
const csvDb = new CsvDb(csvPaths.sensors, csvLabels.sensors)
csvDb.get().then((data)=> {
  // set data on readings object
  csvData.sensors = data;
},
(err) => {
  console.warn('CSV PARSING ERROR', err)
})


  fs.readdir(csvPaths.readings, (err, files) => {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }

    files.forEach((file, index) => {
      // Make one pass and make the filepath complete
      const fromPath = path.join(csvPaths.readings, file);

      fs.stat(fromPath, (error, stat) => {
        if (error) {
          console.error("Error stating file.", error);
          return;
        }

        if (stat.isFile()) {
          console.log("'%s' is a file.", fromPath);
          const csvDb = new CsvDb(fromPath, csvLabels.readings)
          csvDb.get().then((data)=> {
            // set data on readings object
            let fileName = file.replace('.csv', '')
            csvData.readings[fileName] = data;

            // collection.insertOne({
            //   fileName,
            //   data
            // });
          },
          (err) => {
            console.log(err)
          })
        }
      });
    });
  });


module.exports = csvData;
