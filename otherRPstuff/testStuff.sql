delete from castleRP.player where playerId = 1;

insert into castleRP.player (playerId, playerName, health, money) values (1, 'dude', 100, 100);

insert into castleRP.item (itemName, itemValue) values ("wood", 5);

insert into castleRP.resource (resourceName, itemId, lootInterval) values ("tree", 1, 5);

insert into castleRP.tool (toolName, toolDurability, damage, speed, resourceId, valuePD) values ("axe", 100, 5, 10, 1, 0.5);

select * from castleRP.player;

insert into castleRP.player2tools (playerId, toolId, toolDurability) values (1, 1, 100);
insert into castleRP.player2tools (playerId, toolId, toolDurability) values (1, 1, 100);

update castleRP.player2tools set toolDurability = 70 where playerId = 1 and toolId = 1 and toolDurability = 90 limit 1;

select * from castleRP.player2tools;

insert into castleRP.location (locationName) values ("jabollah");

select * from castleRP.location;