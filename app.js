const express = require('express');
// const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const next = require('./next');

// Put in place textbook middlewares for express.
if (process.env.NODE_ENV !== 'production') {
  // app.use(logger('dev'));
  // Load ENV variables in development
  require('dotenv').config()
}

const app = express();
// Custom Route Handlers
const processTrialData = require('./server/api/processTrialData')
const getTrials = require('./server/api/getTrials')
const getTrialData = require('./server/api/getTrialData')
const isDoneProcessing = require('./server/api/isDoneProcessing')
const signS3 = require('./server/api/signS3')

const db = require('./server/database')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// static server
app.use('/', express.static(path.join(__dirname, 'public')));

// attach database connection
console.log('how is that running so much?')
app.use((request, response, n) => {
  // TODO - theres got to be a betttter way!
  if (!request.db) {
    request.db = db
  }
  console.log('request @ time ', Date.now())

  n()
})

const start = async (port) => {
  // Couple Next.js with our express server.
  // app and handle from "next" will now be available as req.app and req.handle.
  await next(app);

  // sign request for s3 upload from client
  // for uploading zip file
  //
  // TODO -- ASAP -- move routes into object
  // and standardize with /api/
  app.get('/api/sign-s3', signS3)
  app.get('/api/trials', getTrials)
  app.get('/api/trial-data/:trialName', getTrialData)
  //  on data upload (called from AWS Lambda)
  app.get('/api/trial-uploaded/:trialName', processTrialData)
  app.get('/api/is-processing-complete/:trialName', isDoneProcessing)

  // Normal routing, if you need it.
  // Use your SSR logic here.
  // Even if you don't do explicit routing the pages inside app/pages
  // will still get rendered as per their normal route.
  app.get('/main', (req, res) => req.app.render(req, res, '/', {
    routeParam: req.params.routeParam
  }));

  app.listen(port, () => console.log(`Up & Listening on ${ port }`));
};

// Start the express server.
start(process.env.PORT);
