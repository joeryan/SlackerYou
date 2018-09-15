const feathers = require('@feathersjs/feathers');
var bodyParser = require('body-parser');
var db = require('feathers-nedb');

var app = feathers()
  // Configure REST and real-time capabilities
  .configure(feathers.rest())
  .configure(feathers.socketio())
  // Setup REST endpoints to parse json
  .use(bodyParser.json())
  // add a messages API endpoint
  .use('/messages', db(messages))
  // Host the current folder static content
  .use('/', feathers.static(__dirname));

app.listen(3030);

