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
        description: "§7Slow enemy for §x{x} §7seconds on hit. \n§75% chance to set powdered snow below enemy§7.",
        cooldown: 30,
        scoreboard: "frosttouch"
    }
};