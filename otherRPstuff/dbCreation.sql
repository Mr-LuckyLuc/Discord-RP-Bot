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
	id varchar(18) not null,
    money int not null,
    primary key (id)
);

create table castleRP.location (
	id varchar(18) not null,
    name varchar(20) not null,
    isShop bool default false,
    primary key (id)
);

create table castleRP.item (
	id int not null auto_increment,
    name varchar(20),
    value int not null,
    primary key (id)
);

create table castleRP.resource (
	id int not null auto_increment,
    name varchar(20) not null,
    itemId int not null,
    lootInterval int not null,
    primary key (id),
    foreign key (itemId) references item(id)
);

create table castleRP.tool (
	id int not null auto_increment,
	name varchar(20),
    durability int default 100,
    damage int not null,
    resourceId int not null,
    valuePD double not null,
    primary key (id),
    foreign key (resourceId) references resource(id)
);

create table castleRP.player2tools (
	playerId varchar(18) not null,
    toolId int not null,
    toolDurability int not null,
    foreign key (playerId) references player(id),
    foreign key (toolId) references tool(id)
);

create table castleRP.player2items (
	playerId varchar(18) not null,
    itemId int not null,
    foreign key (playerId) references player(id),
    foreign key (itemId) references item(id)
);
	