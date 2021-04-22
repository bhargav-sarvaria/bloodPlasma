//Install express server
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config')
const api = require('./server/api');

const app = express();

app.use(express.static('./dist/bloodPlasma'));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', api);

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/bloodPlasma/'}),
);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080, (req, res) => {
    console.log('Running')
});