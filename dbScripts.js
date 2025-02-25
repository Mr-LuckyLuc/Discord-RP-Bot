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
    console.log('Querying special query');
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
    console.log("Adding player!");
    player = { id : player.id, money : player.money, items : [], tools : [] };
    await this.pool.execute(`insert into player (id, money) values (${player.id}, ${player.money});`);
    this.players.push(player);
    return player;
  }

  static async addLocation(location) {
    console.log("Adding location!");
    await this.pool.execute(`insert into location (id, name, isShop) values (${location.id}, '${location.name}', ${location.isShop});`);
    this.locations.push(location);
    return result;
  }

  static async addItem(item) {
    console.log("Adding item!");
    await this.pool.execute(`insert into item (name, value) values ('${item.name}', ${item.value});`);
    const [result] = await this.pool.execute(`select LAST_INSERT_ID();`);
    console.info("Query Result:", result);
    item = { id : result, name : item.name, value : item.value};
    this.items.push(item);
    return item;
  }

  static async addResource(resource) {
    console.log("Adding resource!");
    await this.pool.execute(`insert into resource (name, itemId, lootInterval) values ('${resource.name}', ${resource.item.itemId}, ${resource.lootInterval});`);
    const [result] = await this.pool.execute(`select LAST_INSERT_ID();`);
    console.info("Query Result:", result);
    resource = { id : result, name : resource.name, item : resource.item, lootInterval : resource.lootInterval};
    this.resources.push(resource);
    return resource;
  }

  static async addTool(tool) {
    console.log("Adding tool!");
    await this.pool.execute(`insert into tool (name, durability, damage, resourceId, valuePD) values ('${tool.name}', ${tool.durability}, ${tool.damage}, ${tool.resource.resourceId}, ${tool.valuePD});`);
    const [result] = await this.pool.execute(`select LAST_INSERT_ID();`);
    console.info("Query Result:", result);
    tool = { id : result, name : tool.name, durability : tool.durability, damage : tool.damage, resource: tool.resource, valuePD : tool.valuePD};
    this.tools.push(tool);
    return tool;
  }

  static async addPlayer2Tool(playerId, toolId, toolDurability) {
    console.log("Adding tool to inventory!");
    const [result] = await this.pool.execute(
      `insert into player2tools (playerId, toolId, toolDurability) values (${playerId}, ${toolId}, ${toolDurability});`);
    // console.info("Query Result:", result);
    return result;
  }

  static async addPlayer2Item(playerId, itemId) {
    console.log("Adding item to inventory!");
    const [result] = await this.pool.execute(
      `insert into player2items (playerId, itemId) values (${playerId}, ${itemId});`);
    // console.info("Query Result:", result);
    return result;
  }

  static async changeToolDurability(playerId, toolId, oldDurability, newDurability) {
    console.log("Changing tool durability custom!");
    this.pool.execute(`update player2tools set toolDurability = ${newDurability} where playerId = ${playerId} and toolId = ${toolId} and toolDurability = ${oldDurability} limit 1;`);
  }

  static async changeToolDurability(playerId, toolId) {
    console.log("Changing tool durability by 1!");
    const result = await this.pool.execute(`update player2tools set toolDurability = toolDurability-1 where playerId = ${playerId} and toolId = ${toolId} order by toolDurability asc limit 1;`);
    console.debug(result);
  }

  static async changePlayerMoney(id, money) {
    console.log("Changing player money!");
    this.pool.execute(`update player set money = ${money} where id = ${id};`);
  }

  static async deleteLocation(id) {
    console.log("Deleting location!");
    this.pool.execute(`delete from location where id = ${id};`);
  }

  static async deleteItem(id) {
    console.log("Deleting item!");
    this.pool.execute(`delete from item where id = ${id});`);
  }

  static async deleteResource(id) {
    console.log("Deleting resource!");
    this.pool.execute(`delete from resource where id = ${id});`);
  }

  static async deleteTool(id) {
    console.log("Deleting tool!");
    this.pool.execute(`delete from tool where id = ${id});`);
  }

  static async deletePlayer2Tool(playerId, toolId, toolDurability) {
    console.log("Deleting tool from inventory!");
    this.pool.execute(`delete from player2tools where playerId = ${playerId} and toolId = ${toolId} and toolDurability = ${toolDurability} limit 1;`);
  }

  static async deletePlayer2Item(playerId, itemId) {
    console.log("Deleting item from inventory!");
    this.pool.execute(`delete from player2items where playerId = ${playerId} and itemId = ${itemId} limit 1;`);
  }

  static async loadPlayer(playerId) {
    console.log("Loading a player!");
    const [[result]] = await this.pool.execute(
      `SELECT * FROM player WHERE id = ${playerId};`);
    console.info("Query Result:", result);
    if (result === undefined) return undefined;
    const [itemData] = await this.pool.execute(
      `SELECT itemId FROM player2items WHERE playerId = ${playerId};`);
    console.info("Query Result:", itemData);
    const items = [];
    itemData.forEach(data => {
      items.push(this.getItemId(data.itemId));
    });
    const [toolData] = await this.pool.execute(
      `SELECT toolId, toolDurability FROM player2tools WHERE playerId = ${playerId};`);
    console.info("Query Result:", toolData);
    const tools = [];
    toolData.forEach(data => {
      const tool = this.getToolId(data.toolId);
      tool.durability = data.toolDurability;
      tools.push(tool);
    });
    const player = {id: result.id, money: result.money, items: items, tools: tools, interaction : null};
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
      `SELECT id, name, lootInterval, itemId AS item FROM resource`);
    console.info("Query Result:", result);
    return result;
  }

  static async loadTools() {
    console.log("Gathering tools!");
    const [result] = await this.pool.execute(
      `SELECT id, name, durability, damage, valuePD, resourceId AS resource FROM tool;`);
    console.info("Query Result:", result);
    return result;
  }

  static async getPlayerId(id) {
    console.log("Getting a player!");
    let result = this.players.find(player => player.id == id);
    if (result) return result;
    result = await this.loadPlayer(id);
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
    console.debug(this.tools);
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

//TODO: remove all useless results, their logging and returning

module.exports = {
  dbScripts
}