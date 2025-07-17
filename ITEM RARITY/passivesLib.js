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
        max: 2,
        description: "§7Slow enemy for §x{x} \n§7seconds on hit",
        cooldown: 50,
        scoreboard: "frosttouch"
    },
    FROST_TOUCH_EPIC: {
        name: "§5Frost Touch",
        type: meleeWeapons,
        rarity: "Epic",
        min: 1,
        max: 3,
        description: "§7Slow enemy for §x{x} \n§7seconds on hit",
        cooldown: 30,
        scoreboard: "frosttouch"
    }
};