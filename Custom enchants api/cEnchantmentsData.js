/**All listed enchantments
1* - function for removing just xp doesn't exist im minecraft, so we need convert xp to lvl and then remove levels. If player has high level it can remove more xp
2* - for adding items with enchantments to chest in structures you can use https://vertx-dev.github.io/loot-table-generator.html
export const enchantments = {
    exampleEnchant: {
        id: 1, // 1 - 2,147,483,647 
        name: "§7Example enchant", //name of enchantment
        maxLvl: 10, // max level of enchantment, 1 - 3999
        description: "test enchant, +10 damage", // description of enchantment that can be seen in "library"
        xpCost: 150, // cost of enchanting 1 level of enchant, player need to have over 1 level of xp (2*)
        enchantOn: ["weapon"], // list of item tags
        structureGroup: ["overworld"], // list of structure tags where enchantment can spawn (2*)
        enchantmentGroup: ["testGroup"] // enchantments with same group can't be enchanted on same item (e.g. Fire protection, Blast protection, Projectile protection, Protection)
        triggers: { //Only for lite version
            event: "entityHitEntity", // event to trigger enchantment effect (projectileHitEntity, entityHurt, playerBreakBlock, entityHitEntity, tick20)
            target: "player", // function will be executed from target (hit, source)
            function: "example" // you need to create functions for all enchantment levels, name it as "example_1, example_2, example_3...", script will automatically assign functions to the appropriate levels 
        }
    }
};*/

export const enchantments = {
    testEnchant: {
        id: 1,
        name: "§7Shiny",
        maxLvl: 5,
        description: "test description",
        xpCost: 100,
        enchantOn: ["weapon"],
        structureGroup: ["overworld"],
        enchantmentGroup: ["combat"],
        triggers: {
            event: "entityHitEntity",
            target: "hit",
            function: "test"
        }
    }
};


