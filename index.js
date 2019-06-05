const express = require('express')
const path = require('path')
const app = express()

// parse CSVs
const csvData = require('./server/loadCSVData')

// static server
app.use('/', express.static(path.join(__dirname, '/src')))

app.use('/csv', (request, response) => {
  response.json(csvData)
})

app.listen(process.env.PORT, () => console.log(`Listening on ${ process.env.PORT }`))
