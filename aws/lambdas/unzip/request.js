// define our target API as a "service"
const externalService = new aws.Service({

    // the API base URL
    endpoint: 'https://aprovecho-smoky-room.herokuapp.com/',

    // don't parse API responses
    // (this is optional if you want to define shapes of all your endpoint responses)
    convertResponseTypes: false,

    // and now, our API endpoints
    apiConfig: {
        metadata: {
            protocol: 'rest-json' // we assume our API is JSON-based
        },
        operations: {
            // post upload completed
            NewTrialUploaded: {
                http: {
                    method: 'POST',
                    // note the placeholder in the URI
                    requestUri: '/uploaded/{trialName}'
                },
                input: {
                    type: 'structure',
                    required: [ 'trialName' ],
                    members: {
                        'trialName': {
                            // all kinds of validators are available
                            type: 'string',
                            // include it in the call URI
                            location: 'uri',
                            // this is the name of the placeholder in the URI
                            locationName: 'trialName'
                        }
                    }
                }
            }
        }
    }
});

// disable aws region related login in the SDK
externalService.isGlobalEndpoint = true;

// and now we can call our target API!
exports.handler = function(event, context, callback) {

    // note how the methods on our service are defined after the operations
    externalService.authenticate({
        login: 'admin@example.com',
        password: 'SecretPassword!'
    }, (err, data) => {

        if (err) {
            console.error('>>> login error:', err);
            return callback(err);
        }

        externalService.createAccount({
            auth: `Bearer ${data.authToken}`,
            data: {
                firstName: 'John',
                lastName: 'Silver'
            }
        }, (err, data) => {

            if (err) {
                console.error('>>> operation error:', err);
                return callback(err);
            }

            console.log('new record:', data);

            callback();
        });
    });
};
