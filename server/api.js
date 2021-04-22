const express = require('express');
const uri = process.env.DB_CONNECTION;
const MongoClient = require('mongodb').MongoClient;

var database = null;
var donors = null;

const router = express.Router();
 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect( async () =>{
    try {
        database = await client.db('myWaitlist');
        donors = await database.collection('donors');
      }catch(err){
          console.log(err);
      }
});

module.exports = router;