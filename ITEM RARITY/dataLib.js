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
    CRIT_CHANCE_COMMON: { name: "§8Crit Chance", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Common", min: 1, max: 3, scoreboardTracker: "critchance" },
    CRIT_CHANCE_UNCOMMON: { name: "§aCrit Chance", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "critchance" },
    CRIT_CHANCE_RARE: { name: "§1Crit Chance", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Rare", min: 3, max: 7, scoreboardTracker: "critchance" },
    CRIT_CHANCE_EPIC: { name: "§5Crit Chance", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Epic", min: 5, max: 10, scoreboardTracker: "critchance" },
    CRIT_CHANCE_LEGENDARY: { name: "§6Crit Chance", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Legendary", min: 8, max: 15, scoreboardTracker: "critchance" },
    CRIT_CHANCE_MYTHIC: { name: "§cCrit Chance", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Mythic", min: 12, max: 20, scoreboardTracker: "critchance" },

    // CRITICAL DAMAGE - Weapons
    CRIT_DAMAGE_COMMON: { name: "§8Crit Damage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Common", min: 5, max: 10, scoreboardTracker: "critdamage" },
    CRIT_DAMAGE_UNCOMMON: { name: "§aCrit Damage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Uncommon", min: 8, max: 15, scoreboardTracker: "critdamage" },
    CRIT_DAMAGE_RARE: { name: "§1Crit Damage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Rare", min: 12, max: 25, scoreboardTracker: "critdamage" },
    CRIT_DAMAGE_EPIC: { name: "§5Crit Damage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Epic", min: 20, max: 35, scoreboardTracker: "critdamage" },
    CRIT_DAMAGE_LEGENDARY: { name: "§6Crit Damage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Legendary", min: 30, max: 50, scoreboardTracker: "critdamage" },
    CRIT_DAMAGE_MYTHIC: { name: "§cCrit Damage", type: ["sword", "axe", "bow", "crossbow", "trident"], rarity: "Mythic", min: 45, max: 75, scoreboardTracker: "critdamage" },

};