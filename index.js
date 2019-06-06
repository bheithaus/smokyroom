// Load ENV variables in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const path = require('path')
const app = express()

// Custom Route Handlers
const processTrialData = require('./server/processTrialData')
const retrieveTrialData = require('./server/retrieveTrialData')
const signS3 = require('./server/signS3')

// MongoDB
const MongoClient = require('mongodb').MongoClient
const mongoClient = new MongoClient(process.env.MONGODB_URI)
const DB_NAME = 'smoke-data'
let dbConnection;

// open connection to mongoDB
mongoClient.connect(function(err) {
  if (err) {
    return console.log('mongo error', err)
  }

  console.log('Connected successfully to database')

  dbConnection = mongoClient.db(DB_NAME)
})

// close mongoDB connection when app closes
process.on('SIGINT', function() {
  mongoClient.close(function () {
    console.log('MongoDB disconnected on app termination')
    process.exit(0)
  })
})

// sign request for s3 upload from client
// for uploading zip file
app.get('/sign-s3', signS3)

// static server
app.use('/', express.static(path.join(__dirname, '/src')))

// attach database connection
app.use((request, response, next) => {
  request.dbConnection = dbConnection
  next()
})

app.use('/trial-data/:trialName', retrieveTrialData)

//  on data upload (called from AWS Lambda)
app.use('/uploaded/:trialName', processTrialData)

app.listen(process.env.PORT, () => console.log(`Listening on ${ process.env.PORT }`))
