'use strict';
require('dotenv').config();
const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

const helmet = require('helmet')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(
  helmet.frameguard({
    action: "sameorigin",
  })
);
// Sets "X-DNS-Prefetch-Control: off"
app.use(
  helmet.dnsPrefetchControl({
    allow: false,
  })
);
// Sets "Referrer-Policy: origin"
app.use(
  helmet.referrerPolicy({
    policy: "same-origin",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route('/b/:board/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/board.html');
  });
app.route('/b/:board/:threadid')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/thread.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });


const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);

//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

async function conn() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  return mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
}

//Start our server and tests!
conn().then(() => {
  app.listen(process.env.PORT || 3000, function () {
    console.log('Your app is listening on port 3000');
    if(process.env.NODE_ENV==='test') {
      console.log('Running Tests...');
      setTimeout(function () {
        try {
          runner.run();
        } catch(e) {
          console.log('Tests are not valid:');
          console.error(e);
        }
      }, 1500);
    }
  });
})

module.exports = app; //for testing
