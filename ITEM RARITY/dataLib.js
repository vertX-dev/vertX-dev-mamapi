/*
export const RARITY = {
    COMMON: {
        id: 1,
        chance: 1,
        sid: "Common",
        dName: "\n\n",
        minStats: 0,
        maxStats: 1
    },
    UNCOMMON: {
        id: 2,
        chance: 0.45,
        sid: "Uncommon",
        dName: "\n\n",
        minStats: 1,
        maxStats: 2
    },
    RARE: {
        id: 3,
        chance: 0.3,
        sid: "Rare",
        dName: "\n\n",
        minStats: 2,
        maxStats: 3
    },
    EPIC: {
        id: 4,
        chance: 0.2,
        sid: "Epic",
        dName: "\n\n",
        minStats: 3,
        maxStats: 4
    },
    LEGENDARY: {
        id: 5,
        chance: 0.15,
        sid: "Legendary",
        dName: "\n\n",
        minStats: 4,
        maxStats: 5
    },
    MYTHIC: {
        id: 6,
        chance: 0.2,
        sid: "Mythic",
        dName: "\n\n",
        minStats: 5,
        maxStats: 6
    }
};
*/

export const RARITY = {
    COMMON: {
        id: 1,
        chance: 1,
        sid: "Common",
        dName: "§7Common",
        minStats: 0,
        maxStats: 1
    },
    UNCOMMON: {
        id: 2,
        chance: 0.7,
        sid: "Uncommon",
        dName: "§aUncommon",
        minStats: 0,
        maxStats: 2
    },
    RARE: {
        id: 3,
        chance: 0.5,
        sid: "Rare",
        dName: "§9Rare",
        minStats: 1,
        maxStats: 2
    },
    EPIC: {
        id: 4,
        chance: 0.4,
        sid: "Epic",
        dName: "§5Epic",
        minStats: 1,
        maxStats: 3
    },
    LEGENDARY: {
        id: 5,
        chance: 0.4,
        sid: "Legendary",
        dName: "§6Legendary",
        minStats: 2,
        maxStats: 3
    },
    MYTHIC: {
        id: 6,
        chance: 0.5,
        sid: "Mythic",
        dName: "§cMythic",
        minStats: 3,
        maxStats: 4
    }
};


export const blackList = [
    "minecraft:apple"
];

export const TagMapping = [
    "sword",
    "pickaxe",
    "axe",
    "shovel",
    "hoe",

    "helmet",
    "chestplate",
    "leggings",
    "boots",

    "bow",
    "crossbow",
    "trident",
    "shield",
    "elytra",
    "totem"
];

export const stats = {
    // DAMAGE - Weapons
    DAMAGE_COMMON: { name: "§8Damage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Common", min: 1, max: 2, scoreboardTracker: "damage" },
    DAMAGE_UNCOMMON: { name: "§aDamage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Uncommon", min: 1, max: 3, scoreboardTracker: "damage" },
    DAMAGE_RARE: { name: "§1Damage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Rare", min: 2, max: 4, scoreboardTracker: "damage" },
    DAMAGE_EPIC: { name: "§5Damage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Epic", min: 3, max: 4, scoreboardTracker: "damage" },
    DAMAGE_LEGENDARY: { name: "§6Damage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Legendary", min: 3, max: 5, scoreboardTracker: "damage" },
    DAMAGE_MYTHIC: { name: "§cDamage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Mythic", min: 4, max: 6, scoreboardTracker: "damage" },

    // DEFENSE - Armor
    DEFENSE_COMMON: { name: "§8Defense", type: ["helmet", "chestplate", "leggings", "boots", "shield"], rarity: "Common", min: 1, max: 3, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_UNCOMMON: { name: "§aDefense", type: ["helmet", "chestplate", "leggings", "boots", "shield"], rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_RARE: { name: "§1Defense", type: ["helmet", "chestplate", "leggings", "boots", "shield"], rarity: "Rare", min: 3, max: 6, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_EPIC: { name: "§5Defense", type: ["helmet", "chestplate", "leggings", "boots", "shield"], rarity: "Epic", min: 5, max: 8, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_LEGENDARY: { name: "§6Defense", type: ["helmet", "chestplate", "leggings", "boots", "shield"], rarity: "Legendary", min: 7, max: 10, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_MYTHIC: { name: "§cDefense", type: ["helmet", "chestplate", "leggings", "boots", "shield"], rarity: "Mythic", min: 10, max: 15, scoreboardTracker: "defense", measure: "%" },

    // HEALTH - All items
    HEALTH_COMMON: { name: "§8Health", type: TagMapping, rarity: "Common", min: 2, max: 5, scoreboardTracker: "health" },
    HEALTH_UNCOMMON: { name: "§aHealth", type: TagMapping, rarity: "Uncommon", min: 3, max: 8, scoreboardTracker: "health" },
    HEALTH_RARE: { name: "§1Health", type: TagMapping, rarity: "Rare", min: 5, max: 12, scoreboardTracker: "health" },
    HEALTH_EPIC: { name: "§5Health", type: TagMapping, rarity: "Epic", min: 8, max: 18, scoreboardTracker: "health" },
    HEALTH_LEGENDARY: { name: "§6Health", type: TagMapping, rarity: "Legendary", min: 12, max: 25, scoreboardTracker: "health" },
    HEALTH_MYTHIC: { name: "§cHealth", type: TagMapping, rarity: "Mythic", min: 20, max: 35, scoreboardTracker: "health" },

    // SPEED - Boots, Elytra, Weapons
    SPEED_COMMON: { name: "§8Speed", type: ["boots", "elytra", "sword", "bow"], rarity: "Common", min: 1, max: 2, scoreboardTracker: "speed" },
    SPEED_UNCOMMON: { name: "§aSpeed", type: ["boots", "elytra", "sword", "bow"], rarity: "Uncommon", min: 1, max: 3, scoreboardTracker: "speed" },
    SPEED_RARE: { name: "§1Speed", type: ["boots", "elytra", "sword", "bow"], rarity: "Rare", min: 2, max: 4, scoreboardTracker: "speed" },
    SPEED_EPIC: { name: "§5Speed", type: ["boots", "elytra", "sword", "bow"], rarity: "Epic", min: 3, max: 6, scoreboardTracker: "speed" },
    SPEED_LEGENDARY: { name: "§6Speed", type: ["boots", "elytra", "sword", "bow"], rarity: "Legendary", min: 4, max: 8, scoreboardTracker: "speed" },
    SPEED_MYTHIC: { name: "§cSpeed", type: ["boots", "elytra", "sword", "bow"], rarity: "Mythic", min: 6, max: 12, scoreboardTracker: "speed" },

    // CRITICAL CHANCE - Weapons
    CRIT_CHANCE_COMMON: { name: "§8Crit Chance", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Common", min: 1, max: 3, scoreboardTracker: "critChance" },
    CRIT_CHANCE_UNCOMMON: { name: "§aCrit Chance", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "critChance" },
    CRIT_CHANCE_RARE: { name: "§1Crit Chance", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Rare", min: 3, max: 7, scoreboardTracker: "critChance" },
    CRIT_CHANCE_EPIC: { name: "§5Crit Chance", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Epic", min: 5, max: 10, scoreboardTracker: "critChance" },
    CRIT_CHANCE_LEGENDARY: { name: "§6Crit Chance", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Legendary", min: 8, max: 15, scoreboardTracker: "critChance" },
    CRIT_CHANCE_MYTHIC: { name: "§cCrit Chance", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Mythic", min: 12, max: 20, scoreboardTracker: "critChance" },

    // CRITICAL DAMAGE - Weapons
    CRIT_DAMAGE_COMMON: { name: "§8Crit Damage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Common", min: 5, max: 10, scoreboardTracker: "critDamage" },
    CRIT_DAMAGE_UNCOMMON: { name: "§aCrit Damage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Uncommon", min: 8, max: 15, scoreboardTracker: "critDamage" },
    CRIT_DAMAGE_RARE: { name: "§1Crit Damage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Rare", min: 12, max: 25, scoreboardTracker: "critDamage" },
    CRIT_DAMAGE_EPIC: { name: "§5Crit Damage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Epic", min: 20, max: 35, scoreboardTracker: "critDamage" },
    CRIT_DAMAGE_LEGENDARY: { name: "§6Crit Damage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Legendary", min: 30, max: 50, scoreboardTracker: "critDamage" },
    CRIT_DAMAGE_MYTHIC: { name: "§cCrit Damage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Mythic", min: 45, max: 75, scoreboardTracker: "critDamage" },

    // ATTACK SPEED - Weapons
    ATTACK_SPEED_COMMON: { name: "§8Attack Speed", type: ["sword", "axe", "bow", "crossbow"], rarity: "Common", min: 1, max: 3, scoreboardTracker: "attackSpeed" },
    ATTACK_SPEED_UNCOMMON: { name: "§aAttack Speed", type: ["sword", "axe", "bow", "crossbow"], rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "attackSpeed" },
    ATTACK_SPEED_RARE: { name: "§1Attack Speed", type: ["sword", "axe", "bow", "crossbow"], rarity: "Rare", min: 3, max: 8, scoreboardTracker: "attackSpeed" },
    ATTACK_SPEED_EPIC: { name: "§5Attack Speed", type: ["sword", "axe", "bow", "crossbow"], rarity: "Epic", min: 5, max: 12, scoreboardTracker: "attackSpeed" },
    ATTACK_SPEED_LEGENDARY: { name: "§6Attack Speed", type: ["sword", "axe", "bow", "crossbow"], rarity: "Legendary", min: 8, max: 18, scoreboardTracker: "attackSpeed" },
    ATTACK_SPEED_MYTHIC: { name: "§cAttack Speed", type: ["sword", "axe", "bow", "crossbow"], rarity: "Mythic", min: 12, max: 25, scoreboardTracker: "attackSpeed" },

    // MINING SPEED - Tools
    MINING_SPEED_COMMON: { name: "§8Mining Speed", type: ["pickaxe", "axe", "shovel", "hoe"], rarity: "Common", min: 1, max: 3, scoreboardTracker: "miningSpeed" },
    MINING_SPEED_UNCOMMON: { name: "§aMining Speed", type: ["pickaxe", "axe", "shovel", "hoe"], rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "miningSpeed" },
    MINING_SPEED_RARE: { name: "§1Mining Speed", type: ["pickaxe", "axe", "shovel", "hoe"], rarity: "Rare", min: 3, max: 8, scoreboardTracker: "miningSpeed" },
    MINING_SPEED_EPIC: { name: "§5Mining Speed", type: ["pickaxe", "axe", "shovel", "hoe"], rarity: "Epic", min: 5, max: 12, scoreboardTracker: "miningSpeed" },
    MINING_SPEED_LEGENDARY: { name: "§6Mining Speed", type: ["pickaxe", "axe", "shovel", "hoe"], rarity: "Legendary", min: 8, max: 18, scoreboardTracker: "miningSpeed" },
    MINING_SPEED_MYTHIC: { name: "§cMining Speed", type: ["pickaxe", "axe", "shovel", "hoe"], rarity: "Mythic", min: 12, max: 25, scoreboardTracker: "miningSpeed" },

    // LUCK - Tools and some accessories
    LUCK_COMMON: { name: "§8Luck", type: ["pickaxe", "axe", "shovel", "hoe", "sword", "totem"], rarity: "Common", min: 1, max: 2, scoreboardTracker: "luck" },
    LUCK_UNCOMMON: { name: "§aLuck", type: ["pickaxe", "axe", "shovel", "hoe", "sword", "totem"], rarity: "Uncommon", min: 1, max: 3, scoreboardTracker: "luck" },
    LUCK_RARE: { name: "§1Luck", type: ["pickaxe", "axe", "shovel", "hoe", "sword", "totem"], rarity: "Rare", min: 2, max: 5, scoreboardTracker: "luck" },
    LUCK_EPIC: { name: "§5Luck", type: ["pickaxe", "axe", "shovel", "hoe", "sword", "totem"], rarity: "Epic", min: 3, max: 8, scoreboardTracker: "luck" },
    LUCK_LEGENDARY: { name: "§6Luck", type: ["pickaxe", "axe", "shovel", "hoe", "sword", "totem"], rarity: "Legendary", min: 5, max: 12, scoreboardTracker: "luck" },
    LUCK_MYTHIC: { name: "§cLuck", type: ["pickaxe", "axe", "shovel", "hoe", "sword", "totem"], rarity: "Mythic", min: 8, max: 18, scoreboardTracker: "luck" },

    // REGENERATION - Armor and Totem
    REGENERATION_COMMON: { name: "§8Regeneration", type: ["helmet", "chestplate", "leggings", "boots", "totem"], rarity: "Common", min: 1, max: 2, scoreboardTracker: "regen" },
    REGENERATION_UNCOMMON: { name: "§aRegeneration", type: ["helmet", "chestplate", "leggings", "boots", "totem"], rarity: "Uncommon", min: 1, max: 3, scoreboardTracker: "regen" },
    REGENERATION_RARE: { name: "§1Regeneration", type: ["helmet", "chestplate", "leggings", "boots", "totem"], rarity: "Rare", min: 2, max: 4, scoreboardTracker: "regen" },
    REGENERATION_EPIC: { name: "§5Regeneration", type: ["helmet", "chestplate", "leggings", "boots", "totem"], rarity: "Epic", min: 3, max: 6, scoreboardTracker: "regen" },
    REGENERATION_LEGENDARY: { name: "§6Regeneration", type: ["helmet", "chestplate", "leggings", "boots", "totem"], rarity: "Legendary", min: 4, max: 8, scoreboardTracker: "regen" },
    REGENERATION_MYTHIC: { name: "§cRegeneration", type: ["helmet", "chestplate", "leggings", "boots", "totem"], rarity: "Mythic", min: 6, max: 12, scoreboardTracker: "regen" },

    // MAGIC FIND - All items
    MAGIC_FIND_COMMON: { name: "§8Magic Find", type: TagMapping, rarity: "Common", min: 1, max: 2, scoreboardTracker: "magicFind" },
    MAGIC_FIND_UNCOMMON: { name: "§aMagic Find", type: TagMapping, rarity: "Uncommon", min: 1, max: 3, scoreboardTracker: "magicFind" },
    MAGIC_FIND_RARE: { name: "§1Magic Find", type: TagMapping, rarity: "Rare", min: 2, max: 4, scoreboardTracker: "magicFind" },
    MAGIC_FIND_EPIC: { name: "§5Magic Find", type: TagMapping, rarity: "Epic", min: 3, max: 6, scoreboardTracker: "magicFind" },
    MAGIC_FIND_LEGENDARY: { name: "§6Magic Find", type: TagMapping, rarity: "Legendary", min: 4, max: 8, scoreboardTracker: "magicFind" },
    MAGIC_FIND_MYTHIC: { name: "§cMagic Find", type: TagMapping, rarity: "Mythic", min: 6, max: 12, scoreboardTracker: "magicFind" },

    // KNOCKBACK RESISTANCE - Armor
    KNOCKBACK_RESISTANCE_COMMON: { name: "§8Knockback Resistance", type: ["helmet", "chestplate", "leggings", "boots"], rarity: "Common", min: 1, max: 3, scoreboardTracker: "knockbackRes" },
    KNOCKBACK_RESISTANCE_UNCOMMON: { name: "§aKnockback Resistance", type: ["helmet", "chestplate", "leggings", "boots"], rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "knockbackRes" },
    KNOCKBACK_RESISTANCE_RARE: { name: "§1Knockback Resistance", type: ["helmet", "chestplate", "leggings", "boots"], rarity: "Rare", min: 3, max: 8, scoreboardTracker: "knockbackRes" },
    KNOCKBACK_RESISTANCE_EPIC: { name: "§5Knockback Resistance", type: ["helmet", "chestplate", "leggings", "boots"], rarity: "Epic", min: 5, max: 12, scoreboardTracker: "knockbackRes" },
    KNOCKBACK_RESISTANCE_LEGENDARY: { name: "§6Knockback Resistance", type: ["helmet", "chestplate", "leggings", "boots"], rarity: "Legendary", min: 8, max: 18, scoreboardTracker: "knockbackRes" },
    KNOCKBACK_RESISTANCE_MYTHIC: { name: "§cKnockback Resistance", type: ["helmet", "chestplate", "leggings", "boots"], rarity: "Mythic", min: 12, max: 25, scoreboardTracker: "knockbackRes" },

    // FIRE RESISTANCE - Armor
    FIRE_RESISTANCE_COMMON: { name: "§8Fire Resistance", type: ["helmet", "chestplate", "leggings", "boots"], rarity: "Common", min: 1, max: 3, scoreboardTracker: "fireRes" },
    FIRE_RESISTANCE_UNCOMMON: { name: "§aFire Resistance", type: ["helmet", "chestplate", "leggings", "boots"], rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "fireRes" },
    FIRE_RESISTANCE_RARE: { name: "§1Fire Resistance", type: ["helmet", "chestplate", "leggings", "boots"], rarity: "Rare", min: 3, max: 8, scoreboardTracker: "fireRes" },
    FIRE_RESISTANCE_EPIC: { name: "§5Fire Resistance", type: ["helmet", "chestplate", "leggings", "boots"], rarity: "Epic", min: 5, max: 12, scoreboardTracker: "fireRes" },
    FIRE_RESISTANCE_LEGENDARY: { name: "§6Fire Resistance", type: ["helmet", "chestplate", "leggings", "boots"], rarity: "Legendary", min: 8, max: 18, scoreboardTracker: "fireRes" },
    FIRE_RESISTANCE_MYTHIC: { name: "§cFire Resistance", type: ["helmet", "chestplate", "leggings", "boots"], rarity: "Mythic", min: 12, max: 25, scoreboardTracker: "fireRes" },

    // FLIGHT SPEED - Elytra
    FLIGHT_SPEED_COMMON: { name: "§8Flight Speed", type: ["elytra"], rarity: "Common", min: 1, max: 3, scoreboardTracker: "flightSpeed" },
    FLIGHT_SPEED_UNCOMMON: { name: "§aFlight Speed", type: ["elytra"], rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "flightSpeed" },
    FLIGHT_SPEED_RARE: { name: "§1Flight Speed", type: ["elytra"], rarity: "Rare", min: 3, max: 8, scoreboardTracker: "flightSpeed" },
    FLIGHT_SPEED_EPIC: { name: "§5Flight Speed", type: ["elytra"], rarity: "Epic", min: 5, max: 12, scoreboardTracker: "flightSpeed" },
    FLIGHT_SPEED_LEGENDARY: { name: "§6Flight Speed", type: ["elytra"], rarity: "Legendary", min: 8, max: 18, scoreboardTracker: "flightSpeed" },
    FLIGHT_SPEED_MYTHIC: { name: "§cFlight Speed", type: ["elytra"], rarity: "Mythic", min: 12, max: 25, scoreboardTracker: "flightSpeed" },

    // LIFESTEAL - Weapons
    LIFESTEAL_COMMON: { name: "§8Lifesteal", type: ["sword", "axe", "trident"], rarity: "Common", min: 1, max: 2, scoreboardTracker: "lifesteal" },
    LIFESTEAL_UNCOMMON: { name: "§aLifesteal", type: ["sword", "axe", "trident"], rarity: "Uncommon", min: 1, max: 3, scoreboardTracker: "lifesteal" },
    LIFESTEAL_RARE: { name: "§1Lifesteal", type: ["sword", "axe", "trident"], rarity: "Rare", min: 2, max: 4, scoreboardTracker: "lifesteal" },
    LIFESTEAL_EPIC: { name: "§5Lifesteal", type: ["sword", "axe", "trident"], rarity: "Epic", min: 3, max: 6, scoreboardTracker: "lifesteal" },
    LIFESTEAL_LEGENDARY: { name: "§6Lifesteal", type: ["sword", "axe", "trident"], rarity: "Legendary", min: 4, max: 8, scoreboardTracker: "lifesteal" },
    LIFESTEAL_MYTHIC: { name: "§cLifesteal", type: ["sword", "axe", "trident"], rarity: "Mythic", min: 6, max: 12, scoreboardTracker: "lifesteal" }
};