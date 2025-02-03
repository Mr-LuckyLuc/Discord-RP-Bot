const mysql = require('mysql2/promise');



class dbScripts {

  static pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "castleRP",
    waitForConnections: true,
    connectionLimit: 4,
    queueLimit: 0
  });

  static players = [];
  static locations = [];
  static shopLocations = [];
  static items = [];
  static resources = [];
  static tools = [];

  static async addPlayer(player) {
    console.log("adding player!");
    await this.pool.execute(`insert into player (playerId, playerName, health, money) values (${player.id}, '${player.name}', ${player.health}, ${player.money});`);
    const [result] = await this.pool.execute(`select LAST_INSERT_ID();`);
    console.log("Query Result:", result);
    return result;
  }

  static async addLocation(location) {
    console.log("adding location!");
    await this.pool.execute(`insert into location (locationName, isShop) values ('${location.name}', ${location.isShop});`);
    const [result] = await this.pool.execute(`select LAST_INSERT_ID();`);
    console.log("Query Result:", result);
    return result;
  }

  static async addItem(item) {
    console.log("adding item!");
    await this.pool.execute(`insert into item (itemName, itemValue) values ('${item.name}', ${item.value});`);
    const [result] = await this.pool.execute(`select LAST_INSERT_ID();`);
    console.log("Query Result:", result);
    return result;
  }

  static async addResource(resource) {
    console.log("adding resource!");
    await this.pool.execute(`insert into resource (resourceName, itemId, lootInterval) values ('${resource.name}', ${resource.item.itemId}, ${resource.lootInterval});`);
    const [result] = await this.pool.execute(`select LAST_INSERT_ID();`);
    console.log("Query Result:", result);
    return result;
  }

  static async addTool(tool) {
    console.log("adding tool!");
    await this.pool.execute(`insert into tool (toolName, toolDurability, damage, speed, resourceId, valuePD) values ('${tool.name}', ${tool.durability}, ${tool.damage}, ${tool.speed}, ${tool.resource.resourceId}, ${tool.valuePD});`);
    const [result] = await this.pool.execute(`select LAST_INSERT_ID();`);
    console.log("Query Result:", result);
    return result;
  }

  static async addTool2Inventory(playerId, toolId, toolDurability) {
    console.log("adding tool to inventory!");
    const [result] = await this.pool.execute(
      `insert into player2tools (playerId, toolId, toolDurability) values ('${playerId}', ${toolId}, ${toolDurability});`);
    console.log("Query Result:", result);
    return result;
  }

  static async addItem2Inventory(playerId, itemId) {
    console.log("adding item to inventory!");
    const [result] = await this.pool.execute(
      `insert into player2items (playerId, itemId) values ('${playerId}', ${itemId});`);
    console.log("Query Result:", result);
    return result;
  }

  static async changeToolDurability(playerId, toolId, oldDurability, newDurability) {
    console.log("Changing tool durability!");
    const [result] = await this.pool.execute(
      `update player2tools set toolDurability = ${newDurability} where playerId = ${playerId} and toolId = ${toolId} and toolDurability = ${oldDurability} limit 1;`);
    console.log("Query Result:", result);
    return result;
  }

  static async getLocationDB(name) {
    console.log("Looking for location...");
    const [result] = await this.pool.execute(
      `SELECT * FROM location WHERE locationName = ${name}`);
    console.log("Query Result:", result);
    return result;
  }

  static async getLocations() {
    console.log("Gathering locations!");
    const [result] = await this.pool.execute(
      `SELECT * FROM location`);
    console.log("Query Result:", result);
    return result;
  }

  static async getItems() {
    console.log("Gathering items!");
    const [result] = await this.pool.execute(
      `SELECT * FROM item`);
    console.log("Query Result:", result);
    return result;
  }

  static async getResources() {
    console.log("Gathering resources!");
    const [result] = await this.pool.execute(
      `SELECT * FROM resource`);
    console.log("Query Result:", result);
    return result;
  }

  static async getTools() {
    console.log("Gathering tools!");
    const [result] = await this.pool.execute(
      `SELECT * FROM tools`);
    console.log("Query Result:", result);
    return result;
  }
  
  static async loadPlayer(playerId) {
    console.log("Gathering locations!");
    const [result] = await this.pool.execute(
      `SELECT * FROM player WHERE playerId = ${playerId};`);
    console.log("Query Result:", result);
    this.players[this.players.length] = result;
  }

  static startUp() {
    this.locations = this.getLocations();
    this.shopLocations = this.locations.filter(function(location) {return location.isShop});
    this.items = this.getItems();
    this.resources = this.getResources();
    this.tools = this.getTools;
    // will load player when player does something to possibly save memory
  }
}

//TODO: add the linking to eachother

module.exports = {
  dbScripts
}