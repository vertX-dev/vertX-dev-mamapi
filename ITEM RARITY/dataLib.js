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
        chance: 0.7,
        sid: "Uncommon",
        dName: "\n\n",
        minStats: 0,
        maxStats: 2
    },
    RARE: {
        id: 3,
        chance: 0.5,
        sid: "Rare",
        dName: "\n\n",
        minStats: 1,
        maxStats: 2
    },
    EPIC: {
        id: 4,
        chance: 0.4,
        sid: "Epic",
        dName: "\n\n",
        minStats: 1,
        maxStats: 3
    },
    LEGENDARY: {
        id: 5,
        chance: 0.4,
        sid: "Legendary",
        dName: "\n\n",
        minStats: 2,
        maxStats: 3
    },
    MYTHIC: {
        id: 6,
        chance: 0.5,
        sid: "Mythic",
        dName: "\n\n",
        minStats: 3,
        maxStats: 4
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
    // DAMAGE - All items
    DAMAGE_COMMON: { name: "§8Damage", type: TagMapping, rarity: "Common", min: 1, max: 2, scoreboardTracker: "damage" },
    DAMAGE_UNCOMMON: { name: "§aDamage", type: TagMapping, rarity: "Uncommon", min: 1, max: 3, scoreboardTracker: "damage" },
    DAMAGE_RARE: { name: "§1Damage", type: TagMapping, rarity: "Rare", min: 2, max: 4, scoreboardTracker: "damage" },
    DAMAGE_EPIC: { name: "§5Damage", type: TagMapping, rarity: "Epic", min: 3, max: 5, scoreboardTracker: "damage" },
    DAMAGE_LEGENDARY: { name: "§6Damage", type: TagMapping, rarity: "Legendary", min: 4, max: 7, scoreboardTracker: "damage" },
    DAMAGE_MYTHIC: { name: "§cDamage", type: TagMapping, rarity: "Mythic", min: 5, max: 8, scoreboardTracker: "damage" },

    // DEFENSE - All items
    DEFENSE_COMMON: { name: "§8Defense", type: TagMapping, rarity: "Common", min: 1, max: 3, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_UNCOMMON: { name: "§aDefense", type: TagMapping, rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_RARE: { name: "§1Defense", type: TagMapping, rarity: "Rare", min: 3, max: 6, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_EPIC: { name: "§5Defense", type: TagMapping, rarity: "Epic", min: 5, max: 8, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_LEGENDARY: { name: "§6Defense", type: TagMapping, rarity: "Legendary", min: 7, max: 10, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_MYTHIC: { name: "§cDefense", type: TagMapping, rarity: "Mythic", min: 10, max: 15, scoreboardTracker: "defense", measure: "%" },

    // SPEED - All items
    SPEED_COMMON:    { name: "§8Speed",     type: TagMapping, rarity: "Common",    min: 1,  max: 3,  scoreboardTracker: "speed", measure: "%" },
    SPEED_UNCOMMON:  { name: "§aSpeed",     type: TagMapping, rarity: "Uncommon",  min: 2,  max: 5,  scoreboardTracker: "speed", measure: "%" },
    SPEED_RARE:      { name: "§1Speed",     type: TagMapping, rarity: "Rare",      min: 3,  max: 6,  scoreboardTracker: "speed", measure: "%" },
    SPEED_EPIC:      { name: "§5Speed",     type: TagMapping, rarity: "Epic",      min: 5,  max: 8,  scoreboardTracker: "speed", measure: "%" },
    SPEED_LEGENDARY: { name: "§6Speed",     type: TagMapping, rarity: "Legendary", min: 7,  max: 10, scoreboardTracker: "speed", measure: "%" },
    SPEED_MYTHIC:    { name: "§cSpeed",     type: TagMapping, rarity: "Mythic",    min: 10, max: 15, scoreboardTracker: "speed", measure: "%" },
    
    // HEALTH - All items
    HEALTH_COMMON: { name: "§8Health", type: TagMapping, rarity: "Common", min: 1, max: 2, scoreboardTracker: "health" },
    HEALTH_UNCOMMON: { name: "§aHealth", type: TagMapping, rarity: "Uncommon", min: 1, max: 4, scoreboardTracker: "health" },
    HEALTH_RARE: { name: "§1Health", type: TagMapping, rarity: "Rare", min: 2, max: 5, scoreboardTracker: "health" },
    HEALTH_EPIC: { name: "§5Health", type: TagMapping, rarity: "Epic", min: 4, max: 7, scoreboardTracker: "health" },
    HEALTH_LEGENDARY: { name: "§6Health", type: TagMapping, rarity: "Legendary", min: 5, max: 8, scoreboardTracker: "health" },
    HEALTH_MYTHIC: { name: "§cHealth", type: TagMapping, rarity: "Mythic", min: 6, max: 10, scoreboardTracker: "health" },
    
    // CRITICAL CHANCE - All items
    CRIT_CHANCE_COMMON: { name: "§8Crit Chance", type: TagMapping, rarity: "Common", min: 1, max: 3, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_UNCOMMON: { name: "§aCrit Chance", type: TagMapping, rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_RARE: { name: "§1Crit Chance", type: TagMapping, rarity: "Rare", min: 3, max: 7, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_EPIC: { name: "§5Crit Chance", type: TagMapping, rarity: "Epic", min: 5, max: 10, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_LEGENDARY: { name: "§6Crit Chance", type: TagMapping, rarity: "Legendary", min: 8, max: 15, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_MYTHIC: { name: "§cCrit Chance", type: TagMapping, rarity: "Mythic", min: 12, max: 20, scoreboardTracker: "critchance", measure: "%" },

    // CRITICAL DAMAGE - All items
    CRIT_DAMAGE_COMMON: { name: "§8Crit Damage", type: TagMapping, rarity: "Common", min: 1, max: 5, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_UNCOMMON: { name: "§aCrit Damage", type: TagMapping, rarity: "Uncommon", min: 4, max: 10, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_RARE: { name: "§1Crit Damage", type: TagMapping, rarity: "Rare", min: 9, max: 15, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_EPIC: { name: "§5Crit Damage", type: TagMapping, rarity: "Epic", min: 15, max: 22, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_LEGENDARY: { name: "§6Crit Damage", type: TagMapping, rarity: "Legendary", min: 21, max: 33, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_MYTHIC: { name: "§cCrit Damage", type: TagMapping, rarity: "Mythic", min: 33, max: 45, scoreboardTracker: "critdamage", measure: "%" },

    // REGENERATION - All items
    REGENERATION_EPIC: { name: "§5Regeneration", type: TagMapping, rarity: "Epic", min: 1, max: 2, scoreboardTracker: "regeneration", measure: "/10s" },
    REGENERATION_LEGENDARY: { name: "§6Regeneration", type: TagMapping, rarity: "Legendary", min: 1, max: 3, scoreboardTracker: "regeneration", measure: "/10s" },
    REGENERATION_MYTHIC: { name: "§cRegeneration", type: TagMapping, rarity: "Mythic", min: 3, max: 4, scoreboardTracker: "regeneration", measure: "/10s" },

    // DAMAGE PERCENT - All items
    DAMAGE_PERCENT_COMMON: { name: "§8Damage§x", type: TagMapping, rarity: "Common", min: 1, max: 3, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_UNCOMMON: { name: "§aDamage§x", type: TagMapping, rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_RARE: { name: "§1Damage§x", type: TagMapping, rarity: "Rare", min: 3, max: 7, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_EPIC: { name: "§5Damage§x", type: TagMapping, rarity: "Epic", min: 5, max: 10, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_LEGENDARY: { name: "§6Damage§x", type: TagMapping, rarity: "Legendary", min: 8, max: 15, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_MYTHIC: { name: "§cDamage§x", type: TagMapping, rarity: "Mythic", min: 12, max: 20, scoreboardTracker: "damagepercent", measure: "%" },

};














