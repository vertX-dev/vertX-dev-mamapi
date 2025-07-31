import { 
    allWeapons, 
    allArmor, 
    meleeWeapons,
    rangedWeapons,
    tools,
    allItems
} from './mainLib.js';

export const passives = {
    // Existing Frost Touch passives
    FROST_TOUCH_RARE: {
        name: "§9Frost Touch",
        type: meleeWeapons,
        rarity: "Rare",
        min: 1,
        max: 2,
        description: "§7Slow enemy for §x{x} §7seconds on hit. \n§75% chance to set powdered snow below enemy§7.",
        cooldown: 50,
        scoreboard: "frosttouch"
    },
    FROST_TOUCH_EPIC: {
        name: "§5Frost Touch",
        type: meleeWeapons,
        rarity: "Epic",
        min: 1,
        max: 3,
        description: "§7Slow enemy for §x{x} §7seconds on hit. \n§75% chance to set powdered snow below enemy§7.",
        cooldown: 30,
        scoreboard: "frosttouch"
    },
    FROST_TOUCH_LEGENDARY: {
        name: "§6Frost Touch",
        type: meleeWeapons,
        rarity: "Legendary",
        min: 2,
        max: 3,
        description: "§7Slow enemy for §x{x} §7seconds on hit. \n§75% chance to set powdered snow below enemy§7.",
        cooldown: 30,
        scoreboard: "frosttouch"
    },
    FROST_TOUCH_MYTHIC: {
        name: "§cFrost Touch",
        type: meleeWeapons,
        rarity: "Mythic",
        min: 3,
        max: 3,
        description: "§7Slow enemy for §x{x} §7seconds on hit. \n§75% chance to set powder snow below enemy§7.",
        cooldown: 30,
        scoreboard: "frosttouch"
    },

    // Lightning Strike passives
    LIGHTNING_STRIKE_RARE: {
        name: "§9Lightning Strike",
        type: allWeapons,
        rarity: "Rare",
        min: 5,
        max: 7,
        description: "§7§x{x}% §7chance to strike \n§7lightning on enemy hit.",
        cooldown: 20,
        scoreboard: "lightningstrike"
    },
    LIGHTNING_STRIKE_EPIC: {
        name: "§5Lightning Strike",
        type: allWeapons,
        rarity: "Epic",
        min: 7,
        max: 10,
        description: "§7§x{x}% §7chance to strike \n§7lightning on enemy hit.",
        cooldown: 20,
        scoreboard: "lightningstrike"
    },
    LIGHTNING_STRIKE_LEGENDARY: {
        name: "§6Lightning Strike",
        type: allWeapons,
        rarity: "Legendary",
        min: 10,
        max: 15,
        description: "§7§x{x}% §7chance to strike \n§7lightning on enemy hit.",
        cooldown: 20,
        scoreboard: "lightningstrike"
    },
    LIGHTNING_STRIKE_MYTHIC: {
        name: "§cLightning Strike",
        type: allWeapons,
        rarity: "Mythic",
        min: 15,
        max: 25,
        description: "§7§x{x}% §7chance to strike \n§7lightning on enemy hit.",
        cooldown: 20,
        scoreboard: "lightningstrike"
    },

    // Vampiric passives (only during full moon)
    VAMPIRIC_EPIC: {
        name: "§5Vampiric",
        type: meleeWeapons,
        rarity: "Epic",
        min: 13,
        max: 20,
        description: "§7During full moon: \n§7Heal §x{x}% §7of damage dealt.",
        cooldown: 90,
        scoreboard: "vampiric"
    },
    VAMPIRIC_LEGENDARY: {
        name: "§6Vampiric",
        type: meleeWeapons,
        rarity: "Legendary",
        min: 21,
        max: 30,
        description: "§7During full moon: \n§7Heal §x{x}% §7of damage dealt.",
        cooldown: 60,
        scoreboard: "vampiric"
    },
    VAMPIRIC_MYTHIC: {
        name: "§cVampiric",
        type: meleeWeapons,
        rarity: "Mythic",
        min: 30,
        max: 50,
        description: "§7During full moon: \n§7Heal §x{x}% §7of damage dealt.",
        cooldown: 30,
        scoreboard: "vampiric"
    },

//     // Berserker passives
//     BERSERKER_RARE: {
//         name: "§9Berserker",
//         type: meleeWeapons,
//         rarity: "Rare",
//         min: 8,
//         max: 12,
//         description: "§7When below 30% health: Gain Speed I and Strength I for §x{x} §7seconds.",
//         cooldown: 120,
//         scoreboard: "berserker"
//     },
//     BERSERKER_EPIC: {
//         name: "§5Berserker",
//         type: meleeWeapons,
//         rarity: "Epic",
//         min: 10,
//         max: 15,
//         description: "§7When below 35% health: Gain Speed I and Strength I for §x{x} §7seconds.",
//         cooldown: 90,
//         scoreboard: "berserker"
//     },
//     BERSERKER_LEGENDARY: {
//         name: "§6Berserker",
//         type: meleeWeapons,
//         rarity: "Legendary",
//         min: 12,
//         max: 18,
//         description: "§7When below 40% health: Gain Speed II and Strength II for §x{x} §7seconds.",
//         cooldown: 70,
//         scoreboard: "berserker"
//     },
//     BERSERKER_MYTHIC: {
//         name: "§cBerserker",
//         type: meleeWeapons,
//         rarity: "Mythic",
//         min: 15,
//         max: 22,
//         description: "§7When below 45% health: Gain Speed II and Strength II for §x{x} §7seconds.",
//         cooldown: 50,
//         scoreboard: "berserker"
//     },

    // Poison Blade passives
    POISON_BLADE_RARE: {
        name: "§9Poison Blade",
        type: meleeWeapons,
        rarity: "Rare",
        min: 3,
        max: 5,
        description: "§7Apply Poison for §x{x} §7seconds on hit.",
        cooldown: 100,
        scoreboard: "poisonblade"
    },
    POISON_BLADE_EPIC: {
        name: "§5Poison Blade",
        type: meleeWeapons,
        rarity: "Epic",
        min: 4,
        max: 7,
        description: "§7Apply Poison for §x{x} §7seconds on hit.",
        cooldown: 50,
        scoreboard: "poisonblade"
    },
    POISON_BLADE_LEGENDARY: {
        name: "§6Poison Blade",
        type: meleeWeapons,
        rarity: "Legendary",
        min: 5,
        max: 8,
        description: "§7Apply Poison for §x{x} §7seconds on hit.",
        cooldown: 15,
        scoreboard: "poisonblade"
    },
    

    // Explosive Arrows passives
    EXPLOSIVE_ARROWS_RARE: {
        name: "§9Explosive Arrows",
        type: rangedWeapons,
        rarity: "Rare",
        min: 2,
        max: 3,
        description: "§7Arrows explode with power §x{x} §7on impact.",
        cooldown: 1000,
        scoreboard: "explosivearrows"
    },
    EXPLOSIVE_ARROWS_EPIC: {
        name: "§5Explosive Arrows",
        type: rangedWeapons,
        rarity: "Epic",
        min: 4,
        max: 5,
        description: "§7Arrows explode with power §x{x} §7on impact.",
        cooldown: 800,
        scoreboard: "explosivearrows"
    },
    EXPLOSIVE_ARROWS_LEGENDARY: {
        name: "§6Explosive Arrows",
        type: rangedWeapons,
        rarity: "Legendary",
        min: 6,
        max: 7,
        description: "§7Arrows explode with power §x{x} §7on impact.",
        cooldown: 600,
        scoreboard: "explosivearrows"
    },
    EXPLOSIVE_ARROWS_MYTHIC: {
        name: "§cExplosive Arrows",
        type: rangedWeapons,
        rarity: "Mythic",
        min: 8,
        max: 10,
        description: "§7Arrows explode with power §x{x} §7on impact.",
        cooldown: 450,
        scoreboard: "explosivearrows"
    },

    // Ender Arrow passives
    ENDER_ARROW_RARE: {
        name: "§9Ender Arrow",
        type: rangedWeapons,
        rarity: "Rare",
        min: 25,
        max: 35,
        description: "§7Can shoot Endermen. §x{x}% §7increased hit chance against Endermen.",
        cooldown: 150,
        scoreboard: "enderarrow"
    },
    ENDER_ARROW_EPIC: {
        name: "§5Ender Arrow",
        type: rangedWeapons,
        rarity: "Epic",
        min: 35,
        max: 50,
        description: "§7Can shoot Endermen. §x{x}% §7increased hit chance against Endermen.",
        cooldown: 110,
        scoreboard: "enderarrow"
    },
    ENDER_ARROW_LEGENDARY: {
        name: "§6Ender Arrow",
        type: rangedWeapons,
        rarity: "Legendary",
        min: 50,
        max: 70,
        description: "§7Can shoot Endermen. §x{x}% §7increased hit chance against Endermen.",
        cooldown: 70,
        scoreboard: "enderarrow"
    },
    ENDER_ARROW_MYTHIC: {
        name: "§cEnder Arrow",
        type: rangedWeapons,
        rarity: "Mythic",
        min: 90,
        max: 100,
        description: "§7Can shoot Endermen. §x{x}% §7increased hit chance against Endermen.",
        cooldown: 30,
        scoreboard: "enderarrow"
    },
    
    // Dragon Armor passives
    DRAGON_ARMOR_RARE: {
        name: "§9Dragon Armor",
        type: "chestplate",
        rarity: "Rare",
        min: 5,
        max: 10,
        description: "§7When receiving fire damage: Gain Fire Resistance for §x{x} §7seconds.",
        cooldown: 900,
        scoreboard: "dragonarmor"
    },
    DRAGON_ARMOR_EPIC: {
        name: "§5Dragon Armor",
        type: "chestplate",
        rarity: "Epic",
        min: 10,
        max: 20,
        description: "§7When receiving fire damage: Gain Fire Resistance for §x{x} §7seconds.",
        cooldown: 800,
        scoreboard: "dragonarmor"
    },
    DRAGON_ARMOR_LEGENDARY: {
        name: "§6Dragon Armor",
        type: "chestplate",
        rarity: "Legendary",
        min: 20,
        max: 35,
        description: "§7When receiving fire damage: Gain Fire Resistance for §x{x} §7seconds.",
        cooldown: 700,
        scoreboard: "dragonarmor"
    },
    DRAGON_ARMOR_MYTHIC: {
        name: "§cDragon Armor",
        type: "chestplate",
        rarity: "Mythic",
        min: 35,
        max: 60,
        description: "§7When receiving fire damage: Gain Fire Resistance for §x{x} §7seconds.",
        cooldown: 600,
        scoreboard: "dragonarmor"
    }
};