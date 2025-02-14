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

  static async query(queryString) {
    console.log('querying special query');
    const [result] = await this.pool.execute(queryString);
    console.info("Query Result:", result);
    return result;
  }

  static players = [];
  static locations = [];
  static shopLocations = [];
  static items = [];
  static resources = [];
  static tools = [];

  static async addPlayer(player) {
    console.log("adding player!");
    await this.pool.execute(`insert into player (id, money) values (${player.id}, ${player.money});`);
    return { id : player.id, money : player.money, items : [], tools : [] };
  }

  static async addLocation(location) {
    console.log("adding location!");
    await this.pool.execute(`insert into location (id, name, isShop) values (${location.name}, '${location.name}', ${location.isShop});`);
    const [result] = await this.pool.execute(`select LAST_INSERT_ID();`);
    console.info("Query Result:", result);
    return result;
  }

  static async addItem(item) {
    console.log("adding item!");
    await this.pool.execute(`insert into item (name, value) values ('${item.name}', ${item.value});`);
    const [result] = await this.pool.execute(`select LAST_INSERT_ID();`);
    console.info("Query Result:", result);
    return result;
  }

  static async addResource(resource) {
    console.log("adding resource!");
    await this.pool.execute(`insert into resource (name, itemId, lootInterval) values ('${resource.name}', ${resource.item.itemId}, ${resource.lootInterval});`);
    const [result] = await this.pool.execute(`select LAST_INSERT_ID();`);
    console.info("Query Result:", result);
    return result;
  }

  static async addTool(tool) {
    console.log("adding tool!");
    await this.pool.execute(`insert into tool (name, durability, damage, speed, resourceId, valuePD) values ('${tool.name}', ${tool.durability}, ${tool.damage}, ${tool.speed}, ${tool.resource.resourceId}, ${tool.valuePD});`);
    const [result] = await this.pool.execute(`select LAST_INSERT_ID();`);
    console.info("Query Result:", result);
    return result;
  }

  static async addPlayer2Tool(playerId, toolId, toolDurability) {
    console.log("adding tool to inventory!");
    const [result] = await this.pool.execute(
      `insert into player2tools (playerId, toolId, toolDurability) values ('${playerId}', ${toolId}, ${toolDurability});`);
    console.info("Query Result:", result);
    return result;
  }

  static async addPlayer2Item(playerId, itemId) {
    console.log("adding item to inventory!");
    const [result] = await this.pool.execute(
      `insert into player2items (playerId, itemId) values ('${playerId}', ${itemId});`);
    console.info("Query Result:", result);
    return result;
  }

  static async changeToolDurability(playerId, toolId, oldDurability, newDurability) {
    console.log("Changing tool durability!");
    const [result] = await this.pool.execute(
      `update player2tools set toolDurability = ${newDurability} where playerId = ${playerId} and toolId = ${toolId} and toolDurability = ${oldDurability} limit 1;`);
    console.info("Query Result:", result);
    return result;
  }

  static async changePlayerMoney(id, money) {
    console.log("Changing tool durability!");
    const [result] = await this.pool.execute(
      `update player set money = ${money} where id = ${id};`);
    console.info("Query Result:", result);
    return result;
  }

  static async deleteLocation(id) {
    console.log("deleting location!");
    const [result] = await this.pool.execute(`delete from location where id = ${id};`);
    console.info("Query Result:", result);
    return result;
  }

  static async deleteItem(id) {
    console.log("deleting item!");
    const [result] = await this.pool.execute(`delete from item where id = ${id});`);
    console.info("Query Result:", result);
    return result;
  }

  static async deleteResource(id) {
    console.log("deleting resource!");
    const [result] = await this.pool.execute(`delete from resource where id = ${id});`);
    console.info("Query Result:", result);
    return result;
  }

  static async deleteTool(id) {
    console.log("deleting tool!");
    const [result] = await this.pool.execute(`delete from tool where id = ${id});`);
    console.info("Query Result:", result);
    return result;
  }

  static async deletePlayer2Tool(playerId, toolId, toolDurability) {
    console.log("deleting tool from inventory!");
    const [result] = await this.pool.execute(
      `delete from player2tools where playerId = ${playerId} and toolId = ${toolId} and toolDurability = ${toolDurability} limit 1;`);
    console.info("Query Result:", result);
    return result;
  }

  static async deletePlayer2Item(playerId, itemId) {
    console.log("deleting item from inventory!");
    const [result] = await this.pool.execute(
      `delete from player2items where playerId = ${playerId} and itemId = ${itemId} limit 1;`);
    console.info("Query Result:", result);
    return result;
  }

  static async loadPlayer(playerId) {
    console.log("Loading a player!");
    const [[result]] = await this.pool.execute(
      `SELECT * FROM player WHERE id = ${playerId};`);
    console.info("Query Result:", result);
    const [items] = await this.pool.execute(
      `SELECT * FROM player2items WHERE playerId = ${playerId};`);
    console.info("Query Result:", items);
    const [tools] = await this.pool.execute(
      `SELECT * FROM player2tools WHERE playerId = ${playerId};`);
    console.info("Query Result:", tools);
    const player = {id: result.id, money: result.money, items: items, tools: items};
    this.players.push(player);
    return player;
  }

  static async loadLocations() {
    console.log("Gathering locations!");
    const [result] = await this.pool.execute(
      `SELECT * FROM location`);
    console.info("Query Result:", result);
    return result;
  }

  static async loadItems() {
    console.log("Gathering items!");
    const [result] = await this.pool.execute(
      `SELECT * FROM item`);
    console.info("Query Result:", result);
    return result;
  }

  static async loadResources() {
    console.log("Gathering resources!");
    const [result] = await this.pool.execute(
      `SELECT * FROM resource`);
    console.info("Query Result:", result);
    return result;
  }

  static async loadTools() {
    console.log("Gathering tools!");
    const [result] = await this.pool.execute(
      `SELECT * FROM tool`);
    console.info("Query Result:", result);
    return result;
  }

  static async getPlayerId(id) {
    console.log("Getting a player!");
    let result = this.players.find(player => player.id == id);
    if (result) return result;
    result = await this.loadPlayer(id);
    if (result.id == undefined) result = undefined;
    return result;
  }

  static getLocations() {
    return this.locations;
  }

  static getLocationName(name) {
    return this.locations.find(location => location.locationName == name);
  }
  
  static getLocationId(id) {
    return this.locations.find(location => location.id == id);
  }

  static getItems() {
    return this.items
  }
  
  static getItemName(name) {
    return this.items.find(item => item.name == name);
  }
  
  static getItemId(id) {
    return this.items.find(item => item.id == id);
  }

  static getResources() {
    return this.resources;
  }

  static getResourceName(name) {
    return this.resources.find(resource => resource.name == name);
  }

  static getResourceId(id) {
    return this.resources.find(resource => resource.id == id);
  }

  static getTools() {
    return this.tools;
  }

  static getToolName(name) {
    return this.tools.find(tool => tool.name == name);
  }

  static getToolId(id) {
    return this.tools.find(tool => tool.id == id);
  }

  // which getters do i need more 

  //might want to delete this if i want to enable this bot on multiple servers :/
  //for now this is only for one server, will have to change a lot of db stuff for the multiple server functionality
  static async startUp() {
    this.locations = await this.loadLocations();
    this.items = await this.loadItems();
    this.resources = await this.loadResources();
    this.tools = await this.loadTools();
    this.shopLocations = this.locations.filter(location => location.isShop);
    // will load player when player does something to possibly save memory
    this.resources.forEach(resource => {
      const item = this.getItemId(resource.item);
      resource.item = item;
    });
    this.tools.forEach(tool => {
      const resource = this.getResourceId(tool.resource);
      tool.resource = resource;
    });
  }
}

//TODO: save all player progression
//TODO: remove all useless results, their logging and returning

module.exports = {
  dbScripts
}