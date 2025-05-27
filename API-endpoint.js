const express = require('express')
const {dbScripts} = require('./dbScripts');
const app = express()
const port = 3000

function setup() {

    app.get('/', (req, res) => {
    dbScripts.load();
    });

    app.listen(port, () => {
    console.log(`Bot api on port ${port}`)
    });

}