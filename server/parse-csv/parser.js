const config = require('./config')
const CSVLabels = require('./labels')

class CsvParser {
  constructor(fields = CSVLabels.readings, conf = { failIfNotExists: false }) {
    this.fields = fields;
    this.conf = conf;
  }

  // output data object with string CSV string file input
  toJSON(input) {
    if (input === '') {
      return { data: [] };
    }

    const lines = input.split(config.lineSeparator);

    let fields;
    let metadata,
        min = 0,
        max = 0;

    if (this.fields === null) {
      fields = lines
        .shift()
        .split(config.delimiter)
        .map(field => field.trim());
      if (fields[fields.length - 1] === '') {
        fields.pop();
      }
    } else {
      fields = this.fields;
    }
    const result = [];

    if (Array.isArray(lines) && lines.length > 0) {
      // remove metadata lines from CSV
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(fields[0])) {
          // found start of stuff
          metadata = lines.splice(0, i + 1);
          break;
        }
      }

      for (let i = 0; i < lines.length; i++) {
        result[i] = {};
        let cols = lines[i].split(config.delimiter);

        for (let j = 0; j < fields.length; j++) {
          // parse int for special case only of PM
          if (fields[j] === CSVLabels.pm) {
            let pm = parseInt(cols[j]);
            result[i][fields[j]] = pm;

            // find highest and lowest PM readings for this sensor
            if (pm < min) {
              // min
              min = pm;
            } else if (pm > max) {
              // max
              max = pm;
            }
          } else {
            result[i][fields[j]] = cols[j];
          }
        }
      }
    }

    return {
      meta: {
        min,
        max,
        sensorOutputHeader: metadata
      },
      data: result
    };
  }
}

module.exports = CsvParser
