// object navigation path to the Trials Collection
const trialsFromRequest = (request) => request.db.connection.collection('trials');

let trials;
const isDoneProcessing = (request, response) => {
  const { trialName } = request.params;
  // TODO enforce trialName is safe to query DB
  console.log('got request to get PM reading data for trial :', request.params.trialName);

  if (!trials) {
    trials = trialsFromRequest(request);
  }

  console.log('trials', trialName);

  trials.findOne({
    _id: trialName,
  }).then((data) => {
    response.json({
      isDoneProcessing: !!data
    });
  }).catch((err) => console.log(err));
};


module.exports = isDoneProcessing;
