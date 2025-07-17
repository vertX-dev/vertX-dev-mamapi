import { 
    allWeapons, 
    allArmor, 
    meleeWeapons,
    rangedWeapons,
    tools,
    allItems
} from './mainLib.js';

export const passives = {
    FROST_TOUCH_RARE: {
        name: "§1Frost Touch",
        type: meleeWeapons,
        rarity: "Rare",
        min: 1,
        max: 1,
        description: "slow enemy for §x{x} seconds on hit",
        cooldown: 10,
        scoreboard: "frosttouch"
    },
    FROST_TOUCH_EPIC: {
        name: "§5Frost Touch",
        type: meleeWeapons,
        rarity: "Epic",
        min: 2,
        max: 2,
        description: "slow enemy for §x{x} seconds on hit"
    }
};