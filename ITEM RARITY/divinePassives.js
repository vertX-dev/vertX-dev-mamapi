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
        name: "§bFrost Touch",
        type: meleeWeapons,
        rarity: "Divine",
        min: 3,
        max: 5,
        description: "Slow enemy for §x{x}§7 seconds on hit. 5% chance to set powdered snow below the enemy.",
        cooldown: 20,
        scoreboard: "frosttouch"
    },

    // LIGHTNING STRIKE — all weapons
    {
        name: "§bLightning Strike",
        type: allWeapons,
        rarity: "Divine",
        min: 25,
        max: 40,
        description: "§x{x}§7% chance to strike lightning on enemy hit.",
        cooldown: 20,
        scoreboard: "lightningstrike"
    },

    // VAMPIRIC — melee weapons (full moon)
    {
        name: "§bVampiric",
        type: meleeWeapons,
        rarity: "Divine",
        min: 50,
        max: 75,
        description: "During full moon: Heal §x{x}§7% of damage dealt.",
        cooldown: 20,
        scoreboard: "vampiric"
    },

    // POISON BLADE — melee weapons
    {
        name: "§bPoison Blade",
        type: meleeWeapons,
        rarity: "Divine",
        min: 8,
        max: 12,
        description: "Apply Poison for §x{x}§7 seconds on hit.",
        cooldown: 10,
        scoreboard: "poisonblade"
    },

    // EXPLOSIVE ARROWS — ranged weapons
    {
        name: "§bExplosive Arrows",
        type: rangedWeapons,
        rarity: "Divine",
        min: 10,
        max: 15,
        description: "Arrows explode with power §x{x}§7 on impact.",
        cooldown: 300,
        scoreboard: "explosivearrows"
    },

    // ENDER ARROW — ranged weapons
    {
        name: "§bEnder Arrow",
        type: rangedWeapons,
        rarity: "Divine",
        min: 100,
        max: 100,
        description: "Can shoot Endermen. §x{x}§7% increased hit chance against Endermen.",
        cooldown: 20,
        scoreboard: "enderarrow"
    },

    // DRAGON ARMOR — chestplate
    {
        name: "§bDragon Armor",
        type: "chestplate",
        rarity: "Divine",
        min: 60,
        max: 90,
        description: "When receiving fire damage: Gain Fire Resistance for §x{x}§7 seconds.",
        cooldown: 500,
        scoreboard: "dragonarmor"
    },

    // AEGIS — helmet
    {
        name: "§bAegis",
        type: "helmet",
        rarity: "Divine",
        min: 2,
        max: 3,
        description: "Block §x{x}§7 negative effects.",
        cooldown: 50,
        scoreboard: "aegis"
    }
];