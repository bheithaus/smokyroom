const express = require('express')
const path = require('path')
const app = express()

// parse CSVs
const csvData = require('./server/loadCSVData')

// Load ENV variables in development
console.log('No value for PORT yet:', process.env.PORT);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

console.log('Now the value for PORT is:', process.env.PORT);

// static server
app.use('/', express.static(path.join(__dirname, '/src')))

app.use('/csv', (request, response) => {
  response.json(csvData)
})

app.listen(process.env.PORT, () => console.log(`Listening on ${ process.env.PORT }`))
