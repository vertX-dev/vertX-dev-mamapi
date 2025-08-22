import {
    allWeapons,
    allArmor,
    meleeWeapons,
    rangedWeapons,
    tools,
    allItems
} from './mainLib.js';

export const passives = [
    // FROST TOUCH — melee weapons
    {
        name: "§9Frost Touch",
        type: meleeWeapons,
        rarity: "Rare",
        min: 1,
        max: 2,
        description: "Slow enemy for §x{x}§7 seconds on hit. 5% chance to set powdered snow below the enemy.",
        cooldown: 50,
        scoreboard: "frosttouch"
    },
    {
        name: "§5Frost Touch",
        type: meleeWeapons,
        rarity: "Epic",
        min: 1,
        max: 3,
        description: "Slow enemy for §x{x}§7 seconds on hit. 5% chance to set powdered snow below the enemy.",
        cooldown: 30,
        scoreboard: "frosttouch"
    },
    {
        name: "§6Frost Touch",
        type: meleeWeapons,
        rarity: "Legendary",
        min: 2,
        max: 3,
        description: "Slow enemy for §x{x}§7 seconds on hit. 5% chance to set powdered snow below the enemy.",
        cooldown: 30,
        scoreboard: "frosttouch"
    },
    {
        name: "§cFrost Touch",
        type: meleeWeapons,
        rarity: "Mythic",
        min: 3,
        max: 3,
        description: "Slow enemy for §x{x}§7 seconds on hit. 5% chance to set powdered snow below the enemy.",
        cooldown: 30,
        scoreboard: "frosttouch"
    },

    // LIGHTNING STRIKE — all weapons
    {
        name: "§9Lightning Strike",
        type: allWeapons,
        rarity: "Rare",
        min: 5,
        max: 7,
        description: "§x{x}§7% chance to strike lightning on enemy hit.",
        cooldown: 20,
        scoreboard: "lightningstrike"
    },
    {
        name: "§5Lightning Strike",
        type: allWeapons,
        rarity: "Epic",
        min: 7,
        max: 10,
        description: "§x{x}§7% chance to strike lightning on enemy hit.",
        cooldown: 20,
        scoreboard: "lightningstrike"
    },
    {
        name: "§6Lightning Strike",
        type: allWeapons,
        rarity: "Legendary",
        min: 10,
        max: 15,
        description: "§x{x}§7% chance to strike lightning on enemy hit.",
        cooldown: 20,
        scoreboard: "lightningstrike"
    },
    {
        name: "§cLightning Strike",
        type: allWeapons,
        rarity: "Mythic",
        min: 15,
        max: 25,
        description: "§x{x}§7% chance to strike lightning on enemy hit.",
        cooldown: 20,
        scoreboard: "lightningstrike"
    },

    // VAMPIRIC — melee weapons (full moon)
    {
        name: "§5Vampiric",
        type: meleeWeapons,
        rarity: "Epic",
        min: 13,
        max: 20,
        description: "During full moon: Heal §x{x}§7% of damage dealt.",
        cooldown: 90,
        scoreboard: "vampiric"
    },
    {
        name: "§6Vampiric",
        type: meleeWeapons,
        rarity: "Legendary",
        min: 21,
        max: 30,
        description: "During full moon: Heal §x{x}§7% of damage dealt.",
        cooldown: 60,
        scoreboard: "vampiric"
    },
    {
        name: "§cVampiric",
        type: meleeWeapons,
        rarity: "Mythic",
        min: 30,
        max: 50,
        description: "During full moon: Heal §x{x}§7% of damage dealt.",
        cooldown: 30,
        scoreboard: "vampiric"
    },

    // POISON BLADE — melee weapons
    {
        name: "§9Poison Blade",
        type: meleeWeapons,
        rarity: "Rare",
        min: 3,
        max: 5,
        description: "Apply Poison for §x{x}§7 seconds on hit.",
        cooldown: 100,
        scoreboard: "poisonblade"
    },
    {
        name: "§5Poison Blade",
        type: meleeWeapons,
        rarity: "Epic",
        min: 4,
        max: 7,
        description: "Apply Poison for §x{x}§7 seconds on hit.",
        cooldown: 50,
        scoreboard: "poisonblade"
    },
    {
        name: "§6Poison Blade",
        type: meleeWeapons,
        rarity: "Legendary",
        min: 5,
        max: 8,
        description: "Apply Poison for §x{x}§7 seconds on hit.",
        cooldown: 15,
        scoreboard: "poisonblade"
    },

    // EXPLOSIVE ARROWS — ranged weapons
    {
        name: "§9Explosive Arrows",
        type: rangedWeapons,
        rarity: "Rare",
        min: 2,
        max: 3,
        description: "Arrows explode with power §x{x}§7 on impact.",
        cooldown: 1000,
        scoreboard: "explosivearrows"
    },
    {
        name: "§5Explosive Arrows",
        type: rangedWeapons,
        rarity: "Epic",
        min: 4,
        max: 5,
        description: "Arrows explode with power §x{x}§7 on impact.",
        cooldown: 800,
        scoreboard: "explosivearrows"
    },
    {
        name: "§6Explosive Arrows",
        type: rangedWeapons,
        rarity: "Legendary",
        min: 6,
        max: 7,
        description: "Arrows explode with power §x{x}§7 on impact.",
        cooldown: 600,
        scoreboard: "explosivearrows"
    },
    {
        name: "§cExplosive Arrows",
        type: rangedWeapons,
        rarity: "Mythic",
        min: 8,
        max: 10,
        description: "Arrows explode with power §x{x}§7 on impact.",
        cooldown: 450,
        scoreboard: "explosivearrows"
    },

    // ENDER ARROW — ranged weapons
    {
        name: "§9Ender Arrow",
        type: rangedWeapons,
        rarity: "Rare",
        min: 25,
        max: 35,
        description: "Can shoot Endermen. §x{x}§7% increased hit chance against Endermen.",
        cooldown: 150,
        scoreboard: "enderarrow"
    },
    {
        name: "§5Ender Arrow",
        type: rangedWeapons,
        rarity: "Epic",
        min: 35,
        max: 50,
        description: "Can shoot Endermen. §x{x}§7% increased hit chance against Endermen.",
        cooldown: 110,
        scoreboard: "enderarrow"
    },
    {
        name: "§6Ender Arrow",
        type: rangedWeapons,
        rarity: "Legendary",
        min: 50,
        max: 70,
        description: "Can shoot Endermen. §x{x}§7% increased hit chance against Endermen.",
        cooldown: 70,
        scoreboard: "enderarrow"
    },
    {
        name: "§cEnder Arrow",
        type: rangedWeapons,
        rarity: "Mythic",
        min: 90,
        max: 100,
        description: "Can shoot Endermen. §x{x}§7% increased hit chance against Endermen.",
        cooldown: 30,
        scoreboard: "enderarrow"
    },

    // DRAGON ARMOR — chestplate
    {
        name: "§9Dragon Armor",
        type: "chestplate",
        rarity: "Rare",
        min: 5,
        max: 10,
        description: "When receiving fire damage: Gain Fire Resistance for §x{x}§7 seconds.",
        cooldown: 900,
        scoreboard: "dragonarmor"
    },
    {
        name: "§5Dragon Armor",
        type: "chestplate",
        rarity: "Epic",
        min: 10,
        max: 20,
        description: "When receiving fire damage: Gain Fire Resistance for §x{x}§7 seconds.",
        cooldown: 800,
        scoreboard: "dragonarmor"
    },
    {
        name: "§6Dragon Armor",
        type: "chestplate",
        rarity: "Legendary",
        min: 20,
        max: 35,
        description: "When receiving fire damage: Gain Fire Resistance for §x{x}§7 seconds.",
        cooldown: 700,
        scoreboard: "dragonarmor"
    },
    {
        name: "§cDragon Armor",
        type: "chestplate",
        rarity: "Mythic",
        min: 35,
        max: 60,
        description: "When receiving fire damage: Gain Fire Resistance for §x{x}§7 seconds.",
        cooldown: 600,
        scoreboard: "dragonarmor"
    },

    // AEGIS — helmet
    {
        name: "§9Aegis",
        type: "helmet",
        rarity: "Rare",
        min: 1,
        max: 1,
        description: "Block §x{x}§7 negative effects.",
        cooldown: 300,
        scoreboard: "aegis"
    },
    {
        name: "§5Aegis",
        type: "helmet",
        rarity: "Epic",
        min: 1,
        max: 1,
        description: "Block §x{x}§7 negative effects.",
        cooldown: 200,
        scoreboard: "aegis"
    },
    {
        name: "§6Aegis",
        type: "helmet",
        rarity: "Legendary",
        min: 1,
        max: 2,
        description: "Block §x{x}§7 negative effects.",
        cooldown: 120,
        scoreboard: "aegis"
    },
    {
        name: "§cAegis",
        type: "helmet",
        rarity: "Mythic",
        min: 2,
        max: 2,
        description: "Block §x{x}§7 negative effects.",
        cooldown: 80,
        scoreboard: "aegis"
    }
];