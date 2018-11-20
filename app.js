const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const NeDB = require('nedb');
const bodyParser = require('body-parser');
const service = require('feathers-nedb');

const db = new NeDB({
  filename: './data/messages.db',
  autoload: true
});

var port = process.env.PORT || 3030;

var app = express(feathers())
  // Configure REST and real-time capabilities
  .configure(express.rest())
  .configure(socketio())
  // Setup REST endpoints to parse json
  .use(bodyParser.json())
  // add a messages API endpoint
  .use('/messages', service({ Model: db }))
  // Host the current folder static content
  .use('/', express.static(__dirname))
  .use(express.errorHandler())
  .use(express.urlencoded({ extended: true }));

app.service('messages').hooks({
  before: {
    create (context) {
        context.data.createdAt = new Date();
        return context;
    },
    find (context) {
      context.params.query.$sort = { createdAt: 1 };
      return context;
    }
  },
  after: {
    find (context) {
      var size = context.result.length;
      if (size < 10) { size = 10; }
      context.result = context.result.slice(size - 10, size)
      return context;
    }
  }
});

//app.service('messages').create({
//  text: 'Message created on server'
//  }).then(message => console.log('Created message', message));

app.listen(port, () => {
  console.log(`Feathers server listening on port ${port}`);
  });

