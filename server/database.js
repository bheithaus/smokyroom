// MongoDB
const MongoClient = require('mongodb').MongoClient


console.log('env', process.env)

const mongoClient = new MongoClient(process.env.MONGODB_URI)
const DB_NAME = 'heroku_dx74bbhf'
const db = {};

// open connection to mongoDB
mongoClient.connect(function(err) {
  if (err) {
    return console.log('mongo error', err)
  }

  console.log('Connected successfully to database')

  db.connection = mongoClient.db(DB_NAME)
})

// close mongoDB connection when app closes
process.on('SIGINT', function() {
  mongoClient.close(function () {
    console.log('MongoDB disconnected on app termination')
    process.exit(0)
  })
})

module.exports = db
