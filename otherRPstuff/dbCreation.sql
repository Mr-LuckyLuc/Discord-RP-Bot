drop table if exists castleRP.player2tools;
drop table if exists castleRP.player2items;
drop table if exists castleRP.tool;
drop table if exists castleRP.resource;
drop table if exists castleRP.item;
drop table if exists castleRP.location;
drop table if exists castleRP.player;
drop database if exists castleRP;

create database castleRP;

create table castleRP.player (
	playerId bigint unsigned not null,
    playerName varchar(20) not null,
    health int not null,
    money int not null,
    primary key (playerId)
);

create table castleRP.location (
	locationId int not null auto_increment,
    locationName varchar(20) not null,
    isShop bool default false,
    primary key (locationId)
);

create table castleRP.item (
	itemId int not null auto_increment,
    itemName varchar(20),
    itemValue int not null,
    primary key (itemId)
);

create table castleRP.resource (
	resourceId int not null auto_increment,
    resourceName varchar(20) not null,
    itemId int not null,
    lootInterval int not null,
    primary key (resourceId),
    foreign key (itemId) references item(ItemId)
);

create table castleRP.tool (
	toolId int not null auto_increment,
	toolName varchar(20),
    toolDurability int default 100,
    damage int not null,
    speed int not null,
    resourceId int not null,
    valuePD double not null,
    primary key (toolId),
    foreign key (resourceId) references resource(resourceId)
);

create table castleRP.player2tools (
	playerId bigint unsigned not null,
    toolId int not null,
    toolDurability int not null,
    foreign key (playerId) references player(playerId),
    foreign key (toolId) references tool(toolId)
);

create table castleRP.player2items (
	playerId bigint unsigned not null,
    itemId int not null,
    foreign key (playerId) references player(playerId),
    foreign key (itemId) references item(itemId)
);
	