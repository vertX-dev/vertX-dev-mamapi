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
        maxStats: 2
    },
    UNCOMMON: {
        id: 2,
        chance: 0.7,
        sid: "Uncommon",
        dName: "§aUncommon",
        minStats: 2,
        maxStats: 4
    },
    RARE: {
        id: 3,
        chance: 0.5,
        sid: "Rare",
        dName: "§9Rare",
        minStats: 3,
        maxStats: 4
    },
    EPIC: {
        id: 4,
        chance: 0.4,
        sid: "Epic",
        dName: "§5Epic",
        minStats: 3,
        maxStats: 5
    },
    LEGENDARY: {
        id: 5,
        chance: 0.4,
        sid: "Legendary",
        dName: "§6Legendary",
        minStats: 4,
        maxStats: 6
    },
    MYTHIC: {
        id: 6,
        chance: 0.5,
        sid: "Mythic",
        dName: "§dMythic",
        minStats: 5,
        maxStats: 7
    }
};

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

    "fishing_rod",
    "shears",
    "flint_and_steel",
    "elytra",
    "totem"
];

export const blackList = [
    "minecraft:apple"
];


export const stats = {
    DAMAGE: {
        name: "§8Damage",
        type: ["sword", "axe", "bow", "crossbow", "trident"],
        rarity: "Uncommon",
        min: 2,
        max: 4
        //measure: "%" can be used if it need specification, e.g., if damage boost in percents
    },
    
    STRENGTH: {
        name: "§cStrength",
        type: ["sword", "axe", "bow", "crossbow", "trident", "gauntlets"],
        rarity: "Common",
        min: 1,
        max: 3
    },
    
    CRITICAL_CHANCE: {
        name: "§6Critical Chance",
        type: ["sword", "axe", "bow", "crossbow"],
        rarity: "Rare",
        min: 5,
        max: 15,
        measure: "%"
    },
    
    CRITICAL_DAMAGE: {
        name: "§6Critical Damage",
        type: ["sword", "axe", "bow", "crossbow"],
        rarity: "Rare",
        min: 10,
        max: 25,
        measure: "%"
    },
    
    ATTACK_SPEED: {
        name: "§eAttack Speed",
        type: ["sword", "axe", "dagger"],
        rarity: "Uncommon",
        min: 3,
        max: 8,
        measure: "%"
    },
    
    DEFENSE: {
        name: "§aDefense",
        type: ["helmet", "chestplate", "leggings", "boots", "shield"],
        rarity: "Common",
        min: 2,
        max: 6
    },
    
    HEALTH: {
        name: "§4Health",
        type: ["helmet", "chestplate", "leggings", "boots", "ring", "amulet"],
        rarity: "Common",
        min: 5,
        max: 15
    },
    
    SPEED: {
        name: "§bSpeed",
        type: ["boots", "leggings", "ring"],
        rarity: "Uncommon",
        min: 2,
        max: 5,
        measure: "%"
    },
    
    MAGIC_DAMAGE: {
        name: "§5Magic Damage",
        type: ["wand", "staff", "orb", "amulet"],
        rarity: "Rare",
        min: 3,
        max: 7
    },
    
    MANA: {
        name: "§9Mana",
        type: ["helmet", "chestplate", "wand", "staff", "orb", "ring"],
        rarity: "Common",
        min: 10,
        max: 30
    },
    
    MANA_REGENERATION: {
        name: "§9Mana Regeneration",
        type: ["helmet", "chestplate", "ring", "amulet"],
        rarity: "Uncommon",
        min: 1,
        max: 3
    },
    
    LUCK: {
        name: "§dLuck",
        type: ["ring", "amulet", "charm"],
        rarity: "Epic",
        min: 1,
        max: 2
    },
    
    FIRE_RESISTANCE: {
        name: "§cFire Resistance",
        type: ["helmet", "chestplate", "leggings", "boots", "amulet"],
        rarity: "Rare",
        min: 5,
        max: 20,
        measure: "%"
    },
    
    WATER_RESISTANCE: {
        name: "§bWater Resistance",
        type: ["helmet", "chestplate", "leggings", "boots", "amulet"],
        rarity: "Rare",
        min: 5,
        max: 20,
        measure: "%"
    },
    
    POISON_RESISTANCE: {
        name: "§2Poison Resistance",
        type: ["helmet", "chestplate", "amulet"],
        rarity: "Rare",
        min: 10,
        max: 30,
        measure: "%"
    },
    
    THORNS: {
        name: "§7Thorns",
        type: ["helmet", "chestplate", "leggings", "boots"],
        rarity: "Rare",
        min: 2,
        max: 5,
        measure: "%"
    },
    
    LIFE_STEAL: {
        name: "§4Life Steal",
        type: ["sword", "axe", "dagger"],
        rarity: "Epic",
        min: 1,
        max: 3,
        measure: "%"
    },
    
    KNOCKBACK: {
        name: "§7Knockback",
        type: ["sword", "axe", "bow", "crossbow"],
        rarity: "Uncommon",
        min: 1,
        max: 2
    },
    
    PIERCING: {
        name: "§fPiercing",
        type: ["bow", "crossbow", "trident"],
        rarity: "Rare",
        min: 1,
        max: 3
    },
    
    DURABILITY: {
        name: "§6Durability",
        type: ["sword", "axe", "bow", "crossbow", "helmet", "chestplate", "leggings", "boots", "shield"],
        rarity: "Common",
        min: 50,
        max: 200
    },
    
    EXPERIENCE_BOOST: {
        name: "§bExperience Boost",
        type: ["helmet", "ring", "amulet"],
        rarity: "Epic",
        min: 5,
        max: 15,
        measure: "%"
    },
    
    MINING_SPEED: {
        name: "§emining Speed",
        type: ["pickaxe", "shovel", "axe", "hoe"],
        rarity: "Uncommon",
        min: 10,
        max: 25,
        measure: "%"
    },
    
    FORTUNE: {
        name: "§aFortune",
        type: ["pickaxe", "shovel", "axe", "hoe"],
        rarity: "Rare",
        min: 1,
        max: 3
    },
    
    SILK_TOUCH: {
        name: "§fSilk Touch",
        type: ["pickaxe", "shovel", "axe", "hoe"],
        rarity: "Epic",
        min: 1,
        max: 1
    },
    
    NIGHT_VISION: {
        name: "§eNight Vision",
        type: ["helmet", "amulet"],
        rarity: "Rare",
        min: 1,
        max: 1
    },
    
    WATER_BREATHING: {
        name: "§bWater Breathing",
        type: ["helmet", "amulet"],
        rarity: "Rare",
        min: 1,
        max: 1
    },
    
    FEATHER_FALLING: {
        name: "§fFeather Falling",
        type: ["boots"],
        rarity: "Uncommon",
        min: 1,
        max: 4
    },
    
    FROST_WALKER: {
        name: "§bFrost Walker",
        type: ["boots"],
        rarity: "Epic",
        min: 1,
        max: 2
    },
    
    SOUL_SPEED: {
        name: "§8Soul Speed",
        type: ["boots"],
        rarity: "Rare",
        min: 1,
        max: 3
    }
};