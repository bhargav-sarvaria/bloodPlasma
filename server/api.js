const express = require('express');
const uri = process.env.DB_CONNECTION;
const MongoClient = require('mongodb').MongoClient;
const SMS_KEY = process.env.SMS_KEY;
const SMS_URL = "https://www.fast2sms.com/dev/bulk";
const axios = require('axios');
// var GeoPoint = require('geopoint');

var database = null;
var donors = null;
var requests = null;

const router = express.Router();
 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect( async () =>{
    try {
        database = await client.db('myWaitlist');
        donors = await database.collection('donors');
        requests = await database.collection('requests');
      }catch(err){
          console.log(err);
      }
});

const sendMessage = async (mobile_no) => {

    var promise = await new Promise( (resol, reject) => {
      axios.post(SMS_URL, {
        sender_id: 'CHKSMS',
        language: 'english',
        route: 'p',
        numbers: mobile_no,
        message: 'Hi we have found a potential person who might require your blood plasma.'
      }, {
        headers: { "authorization" : SMS_KEY, "Content-Type" : 'application/json', "Cache-Control" : 'no-cache' }
      })
      .then((response) => {
        if(response.data.hasOwnProperty('message') && response.data.message == 'SMS sent successfully.'){
          resol(true);
        }else{
          resol(false)
        }
      }, (error) => { 
        console.log(error.message);
        resol(false);
      });
    });
    return promise;
}

router.post('/addDonor', async (req, res) => {
    try{
        var donorObj = req.body;

        donors.findOne( { mobile_no: req.body.mobile_no } , async function(err, result){
            if (err) res.json({ message: 'Unable to submit you information'});
            if(result == null){ 
                donors.insertOne(donorObj, function(err, result) {
                    if (err) res.json({ message: 'Unable to submit your information'});
                    if(result.hasOwnProperty('insertedCount')){
                        if(result.insertedCount){
                            res.json({success: true, 'message': 'Successfully added your information, you will be able to see requests after 14 days of testing negative'});
                        }else{
                            res.json({success: false, message:'Unable to submit your information'});
                        }
                    }
                });
            }else{
                res.json({success: false, message:'Mobile number is already registered'});
            }
        });
    }catch(err){
        res.json({success: false, message:'Unable to submit your information'});
    } 
});

router.post('/addRequest', async (req, res) => {
    try{
        var requestObj = req.body;

        requests.findOne( { mobile_no: req.body.mobile_no } , async function(err, result){
            if (err) res.json({ message: 'Unable to submit you information'});
            if(result == null){ 
                requests.insertOne(requestObj, function(err, result) {
                    if (err) res.json({ message: 'Unable to submit your information'});
                    if(result.hasOwnProperty('insertedCount')){
                        if(result.insertedCount){
                            res.json({success: true, 'message': 'Successfully and securely added your Request'});
                        }else{
                            res.json({success: false, message:'Unable to submit your information'});
                        }
                    }
                });
            }else{
                res.json({success: false, message:'We already have a request with given number'});
            }
        });
    }catch(err){
        res.json({success: false, message:'Unable to submit your information'});
    } 
});

router.post('/getDonor', async (req, res) => {
    try{
        var obj = getDonor(parseInt(req.body.mobile_no));
        obj.then( obj => {
            if(obj['success']){
                res.json({success: true, donor: obj['donor']});
            }else{
                res.json({error: true, message:'Couldn\'t find mentioned Number'});
            }
        }).catch( err=>{
            res.json({error: true, message:'Couldn\'t find mentioned Number'});
        });
    }catch(err){
        res.json({error: true, message:'Couldn\'t find mentioned Number'});
    } 
});

const getDonor = async (mobile_no) => {

    var promise = await new Promise( (resol, reject) => {
        donors.findOne({mobile_no: parseInt(mobile_no)}, function(err, result) {
            if (err) resol({success: false});
            if(result != null){ 
                resol({success: true, donor: result});
            }else{
                resol({success: false});
            }
        });
    });
    return promise;
}

router.post('/getRequest', async (req, res) => {
    try{
        await requests.findOne({mobile_no: parseInt(req.body.mobile_no)}, function(err, result) {
            if (err) res.json({success: false, message:'Couldn\'t find mentioned Number'});
            if(result == null){ 
                res.json({success: false, message:'Couldn\'t find mentioned Number'});
            }else{
                res.json({success: true, donor: result});
            }
        });
    }catch(err){
        res.json({error: true, message:'Couldn\'t find mentioned Number'});
    } 
});

router.post('/getRequests', async (req, res) => {
    try{
        var obj = getDonor(parseInt(req.body.mobile_no));
        obj.then( obj => {
            if(obj['success']){
                var donor = obj['donor'];

                var daysDifference = Math.abs(new Date().getTime() - new Date(donor['recovery_date']).getTime());
                daysDifference = Math.ceil(daysDifference / (1000 * 3600 * 24));

                if(daysDifference > 14){
                    var query = {
                        blood_group: donor.blood_group,
                        city: donor.city
                    }
    
                    requests.find(query).toArray(function(err, result) {
                        if (err) res.json({ error: true});
                        res.json({success: true, data: result});
                    });
                }else{
                    res.json({success: false, message:'You can donate plasma only after 14 days of testing negative'});
                }
            }else{
                res.json({error: true, message:'Couldn\'t find mentioned Number'});
            }
        }).catch( err=>{
            res.json({error: true, message:'Couldn\'t find mentioned Number'});
        });
    }catch(err){
        res.json({error: true, message:'Couldn\'t find mentioned Number'});
    } 
});

module.exports = router;