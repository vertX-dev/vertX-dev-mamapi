// All tags of items
export const itemTagMapping = {
    "sai": ["weapon", "sai", "light", "short"],
    "nunchaku": ["weapon", "nunchaku", "light", "short"],
    "dagger": ["weapon", "dagger", "light", "short"],
    "rapier": ["weapon", "rapier", "light", "long"],
    "kama": ["weapon", "kama", "normal", "short"],
    "katana": ["weapon", "katana", "normal", "long"],
    "gladius": ["weapon", "gladius", "normal", "short"],
    "sword": ["weapon", "sword", "normal", "medium"],
    "cutlass": ["weapon", "cutlass", "normal", "medium"],
    "machete": ["weapon", "machete", "normal", "medium"],
    "scimitar": ["weapon", "scimitar", "light", "short"],
    "broadsword": ["weapon", "broadsword", "heavy", "medium"],
    "longsword": ["weapon", "longsword", "heavy", "long"],
    "staff": ["weapon", "staff", "blunt", "long"],
    "morningstar": ["weapon", "morningstar", "heavy", "medium"],
    "mace": ["weapon", "mace", "blunt"],
    "khopesh": ["weapon", "khopesh", "normal", "short"],
    "cleaver": ["weapon", "cleaver", "normal", "heavy", "short"],
    "lance": ["weapon", "lance", "polearm", "long"],
    "claymore": ["weapon", "claymore", "heavy", "long"],
    "hammer": ["weapon", "hammer", "heavy", "blunt"],
    "battleaxe": ["weapon", "battleaxe", "medium"],
    "greatsword": ["weapon", "greatsword", "heavy", "long"],
    "trident": ["weapon", "trident", "polearm"],
    "bow": ["ranged", "bow"],
    "crossbow": ["ranged", "crossbow"],
    "helmet": ["armor", "helmet"],
    "chestplate": ["armor", "chestplate"],
    "leggings": ["armor", "leggings"],
    "boots": ["armor", "boots"],
    "axe": ["tool", "axe"],
    "pickaxe": ["tool", "pickaxe"],
    "hoe": ["tool", "hoe"],
    "shovel": ["tool", "shovel"],
    "elytra": ["elytra"],
    "gun": ["ranged", "gun"],
    "veapi:book": ["all", "pickaxe", "hoe", "shovel", "armor", "axe", "battleaxe", "gun", "blunt", "book", "boots", "bow", "broadsword", "chestplate", "cleaver", "claymore", "crossbow", "cutlass", "dagger", "elytra", "gladius", "greatsword", "hammer", "heavy", "helmet", "kama", "katana", "khopesh", "leggings", "lance", "light", "longsword", "mace", "machete", "medium", "morningstar", "nunchaku", "normal", "polearm", "rapier", "ranged", "scimitar", "sai", "short", "staff", "sword", "tool", "trident", "weapon"]
}; // you need to add custom book with enabled left hand for book enchantments (using normal book give like 5 isues)


// All tags of structures
export const structureGroups = {
    "village": ["overworld", "villagr"]
};


// All listed enchantments
//1* - function for removing just xp doesn't exist im minecraft, so we need convert xp to lvl and then remove levels. If player has high level it can remove more xp
//2* - for adding items with enchantments to chest in structures you can use https://vertx-dev.github.io/loot-table-generator.html
export const enchantments = {
    exampleEnchant: {
        id: -1, // 1 - 2,147,483,647 
        name: "§7Example enchant", //name of enchantment
        maxLvl: 10, // max level of enchantment, 1 - 3999
        description: "test enchant, +10 damage", // description of enchantment that can be seen in "library"
        xpCost: 150, // cost of enchanting 1 level of enchant, player need to have over 1 level of xp (2*)
        enchantOn: ["weapon"], // list of item tags
        structureGroup: ["overworld"], // list of structure tags where enchantment can spawn (2*)
        spawnChanceChest: 0.3, // 0 - 1 chance of generating this enchantment on item in chest
        enchantmentGroup: ["testGroup"] // enchantments with same group can't be enchanted on same item (e.g. Fire protection, Blast protection, Projectile protection, Protection)
    }
};


