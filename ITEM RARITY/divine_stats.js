import {
    allWeapons,
    allArmor,
    meleeWeapons,
    rangedWeapons,
    tools,
    allItems
} from './mainLib.js';

export const DIVINE_STATS = [
    {
        id: 1,
        name: "§bDamage",
        type: allItems,
        min: 1,
        max: 2,
        maxPossibleValue: 50,
        scoreboardTracker: "rrsdamage"
    },
    {
        id: 2,
        name: "§bDefense",
        type: allItems,
        min: 1,
        max: 3,
        maxPossibleValue: 75,
        scoreboardTracker: "rrsdefense",
        measure: "%"
    },
    {
        id: 3,
        name: "§bSpeed",
        type: allItems,
        min: 1,
        max: 3,
        maxPossibleValue: 75,
        scoreboardTracker: "rrsspeed",
        measure: "%"
    },
    {
        id: 4,
        name: "§bHealth",
        type: allItems,
        min: 1,
        max: 2,
        maxPossibleValue: 50,
        scoreboardTracker: "rrshealth"
    },
    {
        id: 5,
        name: "§bCrit Chance",
        type: allItems,
        min: 1,
        max: 3,
        maxPossibleValue: 75,
        scoreboardTracker: "rrscritchance",
        measure: "%"
    },
    {
        id: 6,
        name: "§bCrit Damage",
        type: allItems,
        min: 1,
        max: 5,
        maxPossibleValue: 125,
        scoreboardTracker: "rrscritdamage",
        measure: "%"
    },
    {
        id: 7,
        name: "§5Regeneration",
        type: allItems,
        min: 1,
        max: 2,
        maxPossibleValue: 50,
        scoreboardTracker: "rrsregeneration",
        measure: "/10s"
    },
    {
        id: 8,
        name: "§bDamage§x",
        type: allItems,
        min: 1,
        max: 3,
        maxPossibleValue: 75,
        scoreboardTracker: "rrsdamagepercent",
        measure: "%"
    },
    {
        id: 9,
        name: "§bLifesteal",
        type: allItems,
        min: 1,
        max: 3,
        maxPossibleValue: 75,
        scoreboardTracker: "rrslifesteal",
        measure: "%"
    },
    {
        id: 10,
        name: "§bHealth§x",
        type: allItems,
        min: 1,
        max: 3,
        maxPossibleValue: 75,
        scoreboardTracker: "rrshealthpercent",
        measure: "%"
    }
];

