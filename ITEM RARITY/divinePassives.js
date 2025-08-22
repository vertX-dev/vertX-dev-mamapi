import {
    allWeapons,
    allArmor,
    meleeWeapons,
    rangedWeapons,
    tools,
    allItems
} from './mainLib.js';

export const DIVINE_PASSIVES = [
    // FROST TOUCH — melee weapons
    {
        id: 1,
        name: "§bFrost Touch",
        type: meleeWeapons,
        min: 3,
        max: 5,
        description: "Slow enemy for {value} seconds on hit. 5% chance to set powdered snow below the enemy.",
        cooldown: 20,
        scoreboard: "frosttouch"
    },

    // LIGHTNING STRIKE — all weapons
    {
        id: 2,
        name: "§bLightning Strike",
        type: allWeapons,
        min: 25,
        max: 40,
        description: "{value}% chance to strike lightning on enemy hit.",
        cooldown: 20,
        scoreboard: "lightningstrike"
    },

    // VAMPIRIC — melee weapons (full moon)
    {
        id: 3,
        name: "§bVampiric",
        type: meleeWeapons,
        min: 50,
        max: 75,
        description: "During full moon: Heal {value}% of damage dealt.",
        cooldown: 20,
        scoreboard: "vampiric"
    },

    // POISON BLADE — melee weapons
    {
        id: 4,
        name: "§bPoison Blade",
        type: meleeWeapons,
        min: 8,
        max: 12,
        description: "Apply Poison for {value} seconds on hit.",
        cooldown: 10,
        scoreboard: "poisonblade"
    },

    // EXPLOSIVE ARROWS — ranged weapons
    {
        id: 5,
        name: "§bExplosive Arrows",
        type: rangedWeapons,
        min: 10,
        max: 15,
        description: "Arrows explode with power {value} on impact.",
        cooldown: 300,
        scoreboard: "explosivearrows"
    },

    // ENDER ARROW — ranged weapons
    {
        id: 6,
        name: "§bEnder Arrow",
        type: rangedWeapons,
        min: 100,
        max: 100,
        description: "Can shoot Endermen. {value}% increased hit chance against Endermen.",
        cooldown: 20,
        scoreboard: "enderarrow"
    },

    // DRAGON ARMOR — chestplate
    {
        id: 7,
        name: "§bDragon Armor",
        type: "chestplate",
        min: 60,
        max: 90,
        description: "When receiving fire damage: Gain Fire Resistance for {value} seconds.",
        cooldown: 500,
        scoreboard: "dragonarmor"
    },

    // AEGIS — helmet
    {
        id: 8,
        name: "§bAegis",
        type: "helmet",
        min: 2,
        max: 3,
        description: "Block {value} negative effects.",
        cooldown: 50,
        scoreboard: "aegis"
    }
];