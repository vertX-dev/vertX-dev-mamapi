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
        id: 1,
        name: "§bSmash Leap",
        type: "mace",
        min: 7,
        max: 10,
        description: "Smashes the ground and stuns enemies in {value} blocks radius, then leaps 8 blocks if has wind charge",
        cooldown: 120,
        scoreboard: "smashleap"
    },

    // SPIN STRIKE - Sword
    {
        id: 2,
        name: "§bSpin Strike",
        type: "sword",
        min: 20,
        max: 30,
        description: "Performs a 360° spin attack, dealing {value} damage to all enemies within 3 blocks",
        cooldown: 60,
        scoreboard: "spinstrike"
    },

    // EXPLOSIVE MINING - Pickaxe
    {
        id: 3,
        name: "§bExplosive Mining",
        type: "pickaxe",
        min: 10,
        max: 15,
        description: "Creates an explosion with size of {value} to break blocks and damage enemies",
        cooldown: 1000,
        scoreboard: "explosivemining"
    },

    // RAY MINER - Pickaxe
    {
        id: 4,
        name: "§bRay Miner",
        type: "pickaxe",
        min: 25,
        max: 35,
        description: "Breaks {value} blocks in a straight line through solid materials",
        cooldown: 180,
        scoreboard: "rayminer"
    },

    // EXCAVATOR - Shovel
    {
        id: 5,
        name: "§bExcavator",
        type: "shovel",
        min: 12,
        max: 18,
        description: "Breaks sand-type blocks in a 3x3x{value} area, consuming durability",
        cooldown: 70,
        scoreboard: "excavator"
    },

    // FLAME ARC - Sword
    {
        id: 6,
        name: "§bFlame Arc",
        type: "sword",
        min: 50,
        max: 75,
        description: "Unleashes an arc of fire that ignites enemies and blocks, dealing {value} fire damage",
        cooldown: 200,
        scoreboard: "flamearc"
    },

    // SHADOW DASH - Sword
    {
        id: 7,
        name: "§bShadow Dash",
        type: "sword",
        min: 15,
        max: 20,
        description: "Dash forward {value} blocks through enemies, reduced distance when airborne",
        cooldown: 50,
        scoreboard: "shadowdash"
    },

    // VOID PIERCE - Sword
    {
        id: 8,
        name: "§bVoid Pierce",
        type: "sword",
        min: 25,
        max: 40,
        description: "Shoots a void projectile that pierces through enemies, dealing {value} damage",
        cooldown: 80,
        scoreboard: "voidpierce"
    },
];