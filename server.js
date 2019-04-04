const express = require('express');
var path = require('path');

// Constants
const PORT = 48000;
const HOST = '0.0.0.0';

// DOS
const DOS = express();
DOS.use('/os', express.static(path.join(__dirname, 'public')));

DOS.all('*', function(req, res) {
    res.sendFile('index.html');
});

DOS.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);