const mongoose = require('mongoose')
const Server = require('mongodb-memory-server').MongoMemoryServer

const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

/**
 * Connects to the database
 */
 module.exports = async function connect() {
    const mongod = await Server.create();
  
    return mongoose.connect(mongod.getUri(), { useUnifiedTopology: true, useNewUrlParser: true });
}