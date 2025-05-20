const mysql = require('mysql2/promise');

const {
    MYSQL_HOST: HOST,
    MYSQL_USER: USER,
    MYSQL_PASSWORD: PASSWORD,
    MYSQL_DB: DB
} = process.env;

class dbScripts {

  static pool = null;

  static async getPool() {
    if (!this.pool) {
      let connected = false;
      let attempts = 0;
      while (!connected && attempts < 10) {
        try {
          this.pool = mysql.createPool({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DB,
            waitForConnections: true,
            connectionLimit: 4,
            queueLimit: 0,
          });
          await this.pool.query("SELECT 1");
          connected = true;
          console.log("✅ DB connection pool created");
        } catch (err) {
          console.warn(`⏳ DB not ready yet (attempt ${attempts + 1}), retrying in 3s...`);
          attempts++;
          await new Promise(res => setTimeout(res, 3000));
        }
      }
      if (!connected) {
        console.error("❌ Could not connect to DB after multiple attempts. Exiting.");
        process.exit(1);
      }
    }
    return this.pool;
  }

  static async query(queryString, values = []) {
    const pool = await this.getPool();
    const [result] = await pool.execute(queryString, values);
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
    await this.query(`insert into player (id, money) values (?, ?)`, [player.id, player.money]);
    this.players.push(player);
    return player;
  }

  static async addLocation(location) {
    console.log("Adding location!");
    await this.query(`insert into location (id, name, isShop) values (?, ?, ?)`, [location.id, location.name, location.isShop]);
    this.locations.push(location);
    return location;
  }

  static async addItem(item) {
    console.log("Adding item!");
    await this.query(`insert into item (name, value) values (?, ?)`, [item.name, item.value]);
    const [result] = await this.query(`select LAST_INSERT_ID();`);
    item = { id : result["LAST_INSERT_ID()"], name : item.name, value : item.value };
    this.items.push(item);
    return item;
  }

  static async addResource(resource) {
    console.log("Adding resource!");
    await this.query(`insert into resource (name, itemId, lootInterval) values (?, ?, ?)`, [resource.name, resource.item.itemId, resource.lootInterval]);
    const [result] = await this.query(`select LAST_INSERT_ID();`);
    resource = { id : result["LAST_INSERT_ID()"], name : resource.name, item : resource.item, lootInterval : resource.lootInterval };
    this.resources.push(resource);
    return resource;
  }

  static async addTool(tool) {
    console.log("Adding tool!");
    await this.query(`insert into tool (name, durability, damage, resourceId, valuePD) values (?, ?, ?, ?, ?)`, [tool.name, tool.durability, tool.damage, tool.resource.resourceId, tool.valuePD]);
    const [result] = await this.query(`select LAST_INSERT_ID();`);
    tool = { id : result["LAST_INSERT_ID()"], name : tool.name, durability : tool.durability, damage : tool.damage, resource: tool.resource, valuePD : tool.valuePD };
    this.tools.push(tool);
    return tool;
  }

  static async addPlayer2Tool(playerId, toolId, toolDurability) {
    console.log("Adding tool to inventory!");
    return this.query(`insert into player2tools (playerId, toolId, toolDurability) values (?, ?, ?)`, [playerId, toolId, toolDurability]);
  }

  static async addPlayer2Item(playerId, itemId) {
    console.log("Adding item to inventory!");
    return this.query(`insert into player2items (playerId, itemId) values (?, ?)`, [playerId, itemId]);
  }

  static async changeToolDurability(playerId, toolId, oldDurability, newDurability) {
    console.log("Changing tool durability custom!");
    return this.query(`update player2tools set toolDurability = ? where playerId = ? and toolId = ? and toolDurability = ? limit 1`, [newDurability, playerId, toolId, oldDurability]);
  }

  static async changeToolDurabilityByOne(playerId, toolId) {
    console.log("Changing tool durability by 1!");
    return this.query(`update player2tools set toolDurability = toolDurability-1 where playerId = ? and toolId = ? order by toolDurability asc limit 1`, [playerId, toolId]);
  }

  static async changePlayerMoney(id, money) {
    console.log("Changing player money!");
    return this.query(`update player set money = ? where id = ?`, [money, id]);
  }

  static async deleteLocation(id) {
    console.log("Deleting location!");
    return this.query(`delete from location where id = ?`, [id]);
  }

  static async deleteItem(id) {
    console.log("Deleting item!");
    return this.query(`delete from item where id = ?`, [id]);
  }

  static async deleteResource(id) {
    console.log("Deleting resource!");
    return this.query(`delete from resource where id = ?`, [id]);
  }

  static async deleteTool(id) {
    console.log("Deleting tool!");
    return this.query(`delete from tool where id = ?`, [id]);
  }

  static async deletePlayer2Tool(playerId, toolId, toolDurability) {
    console.log("Deleting tool from inventory!");
    return this.query(`delete from player2tools where playerId = ? and toolId = ? and toolDurability = ? limit 1`, [playerId, toolId, toolDurability]);
  }

  static async deletePlayer2Item(playerId, itemId) {
    console.log("Deleting item from inventory!");
    return this.query(`delete from player2items where playerId = ? and itemId = ? limit 1`, [playerId, itemId]);
  }

  static async loadPlayer(playerId) {
    console.log("Loading a player!");
    const fullResult = await this.query(`SELECT * FROM player WHERE id = ?`, [playerId]);
    console.log(fullResult);
    const [[result]] = fullResult;
    if (result === undefined) return undefined;
    const itemData = await this.query(`SELECT itemId FROM player2items WHERE playerId = ?`, [playerId]);
    const items = itemData.map(data => this.getItemId(data.itemId));
    const toolData = await this.query(`SELECT toolId, toolDurability FROM player2tools WHERE playerId = ?`, [playerId]);
    const tools = toolData.map(data => {
      const tool = this.getToolId(data.toolId);
      tool.durability = data.toolDurability;
      return tool;
    });
    const player = { id: result.id, money: result.money, items, tools, interaction: null };
    this.players.push(player);
    return player;
  }

  static async loadLocations() {
    console.log("Gathering locations!");
    return this.query(`SELECT * FROM location`);
  }

  static async loadItems() {
    console.log("Gathering items!");
    return this.query(`SELECT * FROM item`);
  }

  static async loadResources() {
    console.log("Gathering resources!");
    return this.query(`SELECT id, name, lootInterval, itemId AS item FROM resource`);
  }

  static async loadTools() {
    console.log("Gathering tools!");
    return this.query(`SELECT id, name, durability, damage, valuePD, resourceId AS resource FROM tool`);
  }

  static async getPlayerId(id) {
    let result = this.players.find(player => player.id == id);
    if (result) return result;
    return await this.loadPlayer(id);
  }

  static getLocations() { return this.locations; }
  static getLocationName(name) { return this.locations.find(location => location.locationName == name); }
  static getLocationId(id) { return this.locations.find(location => location.id == id); }
  static getItems() { return this.items; }
  static getItemName(name) { return this.items.find(item => item.name == name); }
  static getItemId(id) { return this.items.find(item => item.id == id); }
  static getResources() { return this.resources; }
  static getResourceName(name) { return this.resources.find(resource => resource.name == name); }
  static getResourceId(id) { return this.resources.find(resource => resource.id == id); }
  static getTools() { return this.tools; }
  static getToolName(name) { return this.tools.find(tool => tool.name == name); }
  static getToolId(id) { return this.tools.find(tool => tool.id == id); }

  static async startUp() {
    this.locations = await this.loadLocations();
    this.items = await this.loadItems();
    this.resources = await this.loadResources();
    this.tools = await this.loadTools();
    this.shopLocations = this.locations.filter(location => location.isShop);
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

module.exports = {
  dbScripts
} 
