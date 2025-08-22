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
        name: "§7Damage",
        type: allItems,
        min: 1,
        max: 2,
        maxPossibleValue: 50,
        scoreboardTracker: "rrsdamage"
    },
    {
        id: 2,
        name: "§7Defense",
        type: allItems,
        min: 1,
        max: 3,
        maxPossibleValue: 75,
        scoreboardTracker: "rrsdefense",
        measure: "%"
    },
    {
        id: 3,
        name: "§7Speed",
        type: allItems,
        min: 1,
        max: 3,
        maxPossibleValue: 75,
        scoreboardTracker: "rrsspeed",
        measure: "%"
    },
    {
        id: 4,
        name: "§7Health",
        type: allItems,
        min: 1,
        max: 2,
        maxPossibleValue: 50,
        scoreboardTracker: "rrshealth"
    },
    {
        id: 5,
        name: "§7Crit Chance",
        type: allItems,
        min: 1,
        max: 3,
        maxPossibleValue: 75,
        scoreboardTracker: "rrscritchance",
        measure: "%"
    },
    {
        id: 6,
        name: "§7Crit Damage",
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
        name: "§7Damage§x",
        type: allItems,
        min: 1,
        max: 3,
        maxPossibleValue: 75,
        scoreboardTracker: "rrsdamagepercent",
        measure: "%"
    },
    {
        id: 9,
        name: "§9Lifesteal",
        type: allItems,
        min: 1,
        max: 3,
        maxPossibleValue: 75,
        scoreboardTracker: "rrslifesteal",
        measure: "%"
    },
    {
        id: 10,
        name: "§7Health§x",
        type: allItems,
        min: 1,
        max: 3,
        maxPossibleValue: 75,
        scoreboardTracker: "rrshealthpercent",
        measure: "%"
    }
];

