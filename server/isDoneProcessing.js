const sensors = require('./sensorPositions')

// output format
const csvData = {
  sensors: sensors,
  readings: {}
}

// object navigation path to the Trials Collection
const trialsFromRequest = (request) => {
  return request.db.connection.collection('trials')
}

let trials
const isDoneProcessing = (request, response, n) => {
  const trialName = request.params.trialName;
  // TODO enforce trialName is safe to query DB
  console.log('got request to get PM reading data for trial :', request.params.trialName);

  if (!trials) {
    trials = trialsFromRequest(request)
  }

  console.log('trials', trialName)

  trials.findOne({
    _id: trialName,
  }).then((data) => {
    response.json({
      isDoneProcessing: !!data
    });
  }).catch((err) => console.log(err))


}


module.exports = isDoneProcessing;
