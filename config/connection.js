const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'Centum';

let db;

module.exports.connect = (callback) => {
  MongoClient.connect(url, { useUnifiedTopology: true })
    .then((client) => {
      db = client.db(dbName);
      console.log("Database connected");
      callback();
    })
    .catch(err => {
      console.error("DB Connection Error:", err);
    });
};

module.exports.get = () => db;