import {
    allWeapons,
    allArmor,
    meleeWeapons,
    rangedWeapons,
    tools,
    allItems
} from './mainLib.js';

export const DIVINE_SKILLS = [
    // SMASH LEAP - Mace
    {
        name: "§bSmash Leap",
        type: "mace",
        rarity: "Divine",
        min: 7,
        max: 10,
        description: "Smashes the ground and stuns enemies in §x{x}§7 blocks radius, then leaps 8 blocks if has wind charge",
        cooldown: 120,
        scoreboard: "smashleap"
    },

    // SPIN STRIKE - Sword
    {
        name: "§bSpin Strike",
        type: "sword",
        rarity: "Divine",
        min: 20,
        max: 30,
        description: "Performs a 360° spin attack, dealing §x{x}§7 damage to all enemies within 3 blocks",
        cooldown: 60,
        scoreboard: "spinstrike"
    },

    // EXPLOSIVE MINING - Pickaxe
    {
        name: "§bExplosive Mining",
        type: "pickaxe",
        rarity: "Divine",
        min: 10,
        max: 15,
        description: "Creates an explosion with size of §x{x}§7 to break blocks and damage enemies",
        cooldown: 1000,
        scoreboard: "explosivemining"
    },

    // RAY MINER - Pickaxe
    {
        name: "§bRay Miner",
        type: "pickaxe",
        rarity: "Divine",
        min: 25,
        max: 35,
        description: "Breaks §x{x}§7 blocks in a straight line through solid materials",
        cooldown: 180,
        scoreboard: "rayminer"
    },

    // EXCAVATOR - Shovel
    {
        name: "§bExcavator",
        type: "shovel",
        rarity: "Divine",
        min: 12,
        max: 18,
        description: "Breaks sand-type blocks in a 3x3x§x{x}§7 area, consuming durability",
        cooldown: 70,
        scoreboard: "excavator"
    },

    // FLAME ARC - Sword
    {
        name: "§bFlame Arc",
        type: "sword",
        rarity: "Divine",
        min: 50,
        max: 75,
        description: "Unleashes an arc of fire that ignites enemies and blocks, dealing §x{x}§7 fire damage",
        cooldown: 200,
        scoreboard: "flamearc"
    },

    // SHADOW DASH - Sword
    {
        name: "§bShadow Dash",
        type: "sword",
        rarity: "Divine",
        min: 15,
        max: 20,
        description: "Dash forward §x{x}§7 blocks through enemies, reduced distance when airborne",
        cooldown: 50,
        scoreboard: "shadowdash"
    },

    // VOID PIERCE - Sword
    {
        name: "§bVoid Pierce",
        type: "sword",
        rarity: "Divine",
        min: 25,
        max: 40,
        description: "Shoots a void projectile that pierces through enemies, dealing §x{x}§7 damage",
        cooldown: 80,
        scoreboard: "voidpierce"
    },
];