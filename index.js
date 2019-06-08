// Load ENV variables in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const path = require('path')
const app = express()
const STATIC_DIRECTORY = path.join(__dirname, '/src')

// Custom Route Handlers
const processTrialData = require('./server/processTrialData')
const retrieveTrialData = require('./server/retrieveTrialData')
const signS3 = require('./server/signS3')

// sign request for s3 upload from client
// for uploading zip file
app.get('/sign-s3', signS3)

// static server
app.use('/', express.static(STATIC_DIRECTORY))

// attach database connection
app.use((request, response, next) => {
  request.dbConnection = dbConnection
  next()
})

app.use('/trial-data/:trialName', retrieveTrialData)

//  on data upload (called from AWS Lambda)
app.use('/uploaded/:trialName', processTrialData)

app.listen(process.env.PORT, () => console.log(`Listening on ${ process.env.PORT }`))
