const express = require('express');

// Constants
const PORT = 6000;
const HOST = '0.0.0.0';

// DOS
const DOS = express();
DOS.get('/', (req, res) => {
    res.sendFile('index.html');
});

DOS.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);