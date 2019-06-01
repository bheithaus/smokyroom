const express = require('express')
const app = express()

// process CSVs
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

// Get sensors
const csvDb = new CsvDb(csvPaths.sensors, csvLabels.sensors)
csvDb.get().then((data)=> {
  // set data on readings object
  csvData.sensors = data;
},
(err) => {
  console.warn('CSV PARSING ERROR', err)
})

// Loop through all the files in the csv directory
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
          csvData.readings[file.replace('.csv', '')] = data;
        },
        (err) => {
          console.log(err)
        })
      }
    });
  });
});

// static server
app.use('/', express.static(__dirname))

app.use('/csv', (request, response) => {
  response.json(csvData)
})

app.listen(3000)

console.log('APP LIVE AND LISTENING  ----   http://localhost:3000')
