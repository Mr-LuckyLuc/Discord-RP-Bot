const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "castleRP"
});

class dbScripts {

  // players = [];
  // locations = [];
  // shopLocations = [];
  // items = [];
  // resources = [];
  // tools = [];

  static addPlayer(player) {
    db.connect(function(err) {
      if (err) throw err;
      console.log("adding player!");
      db.query(`insert into player (playerId, playerName, health, money) values (${player.id}, '${player.name}', ${player.health}, ${player.money});`, function (err, result) {
        if (err) throw err;
        console.log(result);
      });
    });
  }

  static addLocation(location) {
    db.connect(function(err) {
      if (err) throw err;
      console.log("adding location!");
      db.query(`insert into location (locationName, isShop) values ('${location.name}', ${location.isShop});`, function (err, result) {
        if (err) throw err;
        console.log(result);
      });
      db.query(`select LAST_INSERT_ID();`, function (err, result) {
        if (err) throw err;
        console.log(result);
        return result;
      });
    });
  }

  static addItem(item) {
    db.connect(function(err) {
      if (err) throw err;
      console.log("adding item!");
      db.query(`insert into item (itemName, itemValue) values ('${item.name}', ${item.value});`, function (err, result) {
        if (err) throw err;
        console.log(result);
      });
      db.query(`select LAST_INSERT_ID();`, function (err, result) {
        if (err) throw err;
        console.log(result);
        return result;
      });
    });
  }

  static addResource(resource) {
    db.connect(function(err) {
      if (err) throw err;
      console.log("adding resource!");
      db.query(`insert into resource (resourceName, itemId, lootInterval) values ('${resource.name}', ${resource.item.itemId}, ${resource.lootInterval});`, function (err, result) {
        if (err) throw err;
        console.log(result);
      });
      db.query(`select LAST_INSERT_ID();`, function (err, result) {
        if (err) throw err;
        console.log(result);
        return result;
      });
    });
  }

  static addTool(tool) {
    db.connect(function(err) {
      if (err) throw err;
      console.log("adding tool!");
      db.query(`insert into tool (toolName, toolDurability, damage, speed, resourceId, valuePD) values ('${tool.name}', ${tool.durability}, ${tool.damage}, ${tool.speed}, ${tool.resource.resourceId}, ${tool.valuePD});`, function (err, result) {
        if (err) throw err;
        console.log(result);
      });
      db.query(`select LAST_INSERT_ID();`, function (err, result) {
        if (err) throw err;
        console.log(result);
        return result;
      });
    });
  }

  static addTool2Inventory(playerId, toolId, toolDurability) {
    db.connect(function(err) {
      if (err) throw err;
      console.log("adding tool to inventory!");
      db.query(`insert into player2tools (playerId, toolId, toolDurability) values ('${playerId}', ${toolId}, ${toolDurability});`, function (err, result) {
        if (err) throw err;
        console.log(result);
      });
    });
  }

  static addItem2Inventory(playerId, itemId) {
    db.connect(function(err) {
      if (err) throw err;
      console.log("adding item to inventory!");
      db.query(`insert into player2items (playerId, itemId) values ('${playerId}', ${itemId});`, function (err, result) {
        if (err) throw err;
        console.log(result);
      });
    });
  }

  static changeToolDurability(playerId, toolId, oldDurability, newDurability) {
    db.connect(function(err) {
      if (err) throw err;
      console.log("Changing tool durability!");
      db.query(`update player2tools set toolDurability = ${newDurability} where playerId = ${playerId} and toolId = ${toolId} and toolDurability = ${oldDurability} limit 1;`, function (err, result) {
        if (err) throw err;
        console.log(result);
      });
    });
  }

  static getLocation(name) {
    db.connect(function(err) {
      if (err) throw err;
      console.log("looking for location!");
      db.query(`select locationId from location where locationName = '${name}';`, function (err, result) {
        if (err) throw err;
        console.log(result);
        return result;
      });
    });
  }

  //might do this later, dont know
  static loadPlayer(playerId) {

  }

  //might do this later, dont know
  static startUp() {
    //load locations
    //load items
    //load resources
    //load tools
    // will load player when player does something to possibly save memory
  }
}

module.exports = {
  dbScripts
}