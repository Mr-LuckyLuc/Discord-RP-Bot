const { dbScripts } = require("./dbScripts.js");

async function getLocation() {
    const id = await dbScripts.getLocation("jabollah");
    console.log(id)
}

getLocation();


// const mysql = require('mysql2');

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "castleRP"
// });

// db.connect(function(err) {
//     if (err) throw err;
//     console.log("looking for location!");
//     db.query(`select * from location;`, function (err, result) {
//       if (err) throw err;
//       console.log(result);
//       return result;
//     });
// });

// process.exit();