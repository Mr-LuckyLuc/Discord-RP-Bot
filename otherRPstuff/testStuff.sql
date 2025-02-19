insert into castleRP.item (name, value) values ("wood", 5);

insert into castleRP.resource (name, itemId, lootInterval) values ("tree", 1, 5);

insert into castleRP.tool (name, durability, damage, resourceId, valuePD) values ("axe", 100, 5, 1, 0.5);

select * from castleRP.player;

-- delete from castleRP.player where playerId = '1';

-- insert into castleRP.player (id, money) values ('1', 100);

-- insert into castleRP.player2tools (playerId, toolId, toolDurability) values ('1', 1, 100);
-- insert into castleRP.player2tools (playerId, toolId, toolDurability) values ('1', 1, 100);

-- update castleRP.player2tools set toolDurability = 70 where playerId = '1' and toolId = 1 and toolDurability = 90 limit 1;

-- select * from castleRP.player2tools;

-- insert into castleRP.location (name) values ("jabollah");

-- select * from castleRP.location;