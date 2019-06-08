const sensors = require('./sensorPositions')

// output format
const csvData = {
  sensors: sensors,
  readings: {}
}

const retrieveTrialData = (request, response, n) => {
  const trialName = request.params.trialName;
  // TODO enforce trialName is safe to query DB
  console.log('got request to get PM reading data for trial :', request.params.trialName);

  const pmTrialsCollection = request.db.connection.collection('trials')

  pmTrialsCollection.findOne({
    _id: trialName,
  }).then((trialData) => {
    csvData.readings = trialData.data;
    csvData.trialName = trialName;

    response.json(csvData);
  }).catch((err) => {
    n(err)
  })
}


module.exports = retrieveTrialData;
