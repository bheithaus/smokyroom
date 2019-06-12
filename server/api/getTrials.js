// object navigation path to the Trials Collection
const trialsFromRequest = (request) => request.db.connection.collection('trials');

const getTrials = (request, response, n) => {
  console.log('got request to get Trials:');
  const pmTrialsCollection = trialsFromRequest(request);

  // find trials without data object attached
  pmTrialsCollection.find({}, { data: 0 }).toArray((err, trials) => {
    if (err) {
      return n(err);
    }

    const trialNames = trials.map(trial => trial._id);
    response.json(trialNames);
  });
};


module.exports = getTrials;
