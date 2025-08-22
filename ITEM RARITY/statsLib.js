import {
    allWeapons,
    allArmor,
    meleeWeapons,
    rangedWeapons,
    tools,
    allItems
} from './mainLib.js';

export const stats = [
    // DAMAGE - Weapons only
    {
        name: "§7Damage",
        type: allItems,
        rarity: "Common",
        min: 1,
        max: 2,
        scoreboardTracker: "rrsdamage"
    },
    {
        name: "§aDamage",
        type: allItems,
        rarity: "Uncommon",
        min: 1,
        max: 3,
        scoreboardTracker: "rrsdamage"
    },
    {
        name: "§9Damage",
        type: allItems,
        rarity: "Rare",
        min: 2,
        max: 4,
        scoreboardTracker: "rrsdamage"
    },
    {
        name: "§5Damage",
        type: allItems,
        rarity: "Epic",
        min: 3,
        max: 5,
        scoreboardTracker: "rrsdamage"
    },
    {
        name: "§6Damage",
        type: allItems,
        rarity: "Legendary",
        min: 4,
        max: 7,
        scoreboardTracker: "rrsdamage"
    },
    {
        name: "§cDamage",
        type: allItems,
        rarity: "Mythic",
        min: 5,
        max: 8,
        scoreboardTracker: "rrsdamage"
    },

    // DEFENSE - Armor items
    {
        name: "§7Defense",
        type: allItems,
        rarity: "Common",
        min: 1,
        max: 3,
        scoreboardTracker: "rrsdefense",
        measure: "%"
    },
    {
        name: "§aDefense",
        type: allItems,
        rarity: "Uncommon",
        min: 2,
        max: 5,
        scoreboardTracker: "rrsdefense",
        measure: "%"
    },
    {
        name: "§9Defense",
        type: allItems,
        rarity: "Rare",
        min: 3,
        max: 6,
        scoreboardTracker: "rrsdefense",
        measure: "%"
    },
    {
        name: "§5Defense",
        type: allItems,
        rarity: "Epic",
        min: 5,
        max: 8,
        scoreboardTracker: "rrsdefense",
        measure: "%"
    },
    {
        name: "§6Defense",
        type: allItems,
        rarity: "Legendary",
        min: 7,
        max: 10,
        scoreboardTracker: "rrsdefense",
        measure: "%"
    },
    {
        name: "§cDefense",
        type: allItems,
        rarity: "Mythic",
        min: 10,
        max: 15,
        scoreboardTracker: "rrsdefense",
        measure: "%"
    },

    // SPEED - Boots, legs, accessories
    {
        name: "§7Speed",
        type: allItems,
        rarity: "Common",
        min: 1,
        max: 3,
        scoreboardTracker: "rrsspeed",
        measure: "%"
    },
    {
        name: "§aSpeed",
        type: allItems,
        rarity: "Uncommon",
        min: 2,
        max: 5,
        scoreboardTracker: "rrsspeed",
        measure: "%"
    },
    {
        name: "§9Speed",
        type: allItems,
        rarity: "Rare",
        min: 3,
        max: 6,
        scoreboardTracker: "rrsspeed",
        measure: "%"
    },
    {
        name: "§5Speed",
        type: allItems,
        rarity: "Epic",
        min: 5,
        max: 8,
        scoreboardTracker: "rrsspeed",
        measure: "%"
    },
    {
        name: "§6Speed",
        type: allItems,
        rarity: "Legendary",
        min: 7,
        max: 10,
        scoreboardTracker: "rrsspeed",
        measure: "%"
    },
    {
        name: "§cSpeed",
        type: allItems,
        rarity: "Mythic",
        min: 10,
        max: 15,
        scoreboardTracker: "rrsspeed",
        measure: "%"
    },

    // HEALTH - Armor and accessories
    {
        name: "§7Health",
        type: allItems,
        rarity: "Common",
        min: 1,
        max: 2,
        scoreboardTracker: "rrshealth"
    },
    {
        name: "§aHealth",
        type: allItems,
        rarity: "Uncommon",
        min: 1,
        max: 4,
        scoreboardTracker: "rrshealth"
    },
    {
        name: "§9Health",
        type: allItems,
        rarity: "Rare",
        min: 2,
        max: 5,
        scoreboardTracker: "rrshealth"
    },
    {
        name: "§5Health",
        type: allItems,
        rarity: "Epic",
        min: 4,
        max: 7,
        scoreboardTracker: "rrshealth"
    },
    {
        name: "§6Health",
        type: allItems,
        rarity: "Legendary",
        min: 5,
        max: 8,
        scoreboardTracker: "rrshealth"
    },
    {
        name: "§cHealth",
        type: allItems,
        rarity: "Mythic",
        min: 6,
        max: 10,
        scoreboardTracker: "rrshealth"
    },

    // CRITICAL CHANCE - Weapons and some accessories
    {
        name: "§7Crit Chance",
        type: allItems,
        rarity: "Common",
        min: 1,
        max: 3,
        scoreboardTracker: "rrscritchance",
        measure: "%"
    },
    {
        name: "§aCrit Chance",
        type: allItems,
        rarity: "Uncommon",
        min: 2,
        max: 5,
        scoreboardTracker: "rrscritchance",
        measure: "%"
    },
    {
        name: "§9Crit Chance",
        type: allItems,
        rarity: "Rare",
        min: 3,
        max: 7,
        scoreboardTracker: "rrscritchance",
        measure: "%"
    },
    {
        name: "§5Crit Chance",
        type: allItems,
        rarity: "Epic",
        min: 5,
        max: 10,
        scoreboardTracker: "rrscritchance",
        measure: "%"
    },
    {
        name: "§6Crit Chance",
        type: allItems,
        rarity: "Legendary",
        min: 8,
        max: 15,
        scoreboardTracker: "rrscritchance",
        measure: "%"
    },
    {
        name: "§cCrit Chance",
        type: allItems,
        rarity: "Mythic",
        min: 12,
        max: 20,
        scoreboardTracker: "rrscritchance",
        measure: "%"
    },

    // CRITICAL DAMAGE - Weapons and some accessories
    {
        name: "§7Crit Damage",
        type: allItems,
        rarity: "Common",
        min: 1,
        max: 5,
        scoreboardTracker: "rrscritdamage",
        measure: "%"
    },
    {
        name: "§aCrit Damage",
        type: allItems,
        rarity: "Uncommon",
        min: 4,
        max: 10,
        scoreboardTracker: "rrscritdamage",
        measure: "%"
    },
    {
        name: "§9Crit Damage",
        type: allItems,
        rarity: "Rare",
        min: 9,
        max: 15,
        scoreboardTracker: "rrscritdamage",
        measure: "%"
    },
    {
        name: "§5Crit Damage",
        type: allItems,
        rarity: "Epic",
        min: 15,
        max: 22,
        scoreboardTracker: "rrscritdamage",
        measure: "%"
    },
    {
        name: "§6Crit Damage",
        type: allItems,
        rarity: "Legendary",
        min: 21,
        max: 33,
        scoreboardTracker: "rrscritdamage",
        measure: "%"
    },
    {
        name: "§cCrit Damage",
        type: allItems,
        rarity: "Mythic",
        min: 33,
        max: 45,
        scoreboardTracker: "rrscritdamage",
        measure: "%"
    },

    // REGENERATION - Armor and accessories  
    {
        name: "§5Regeneration",
        type: allItems,
        rarity: "Epic",
        min: 1,
        max: 2,
        scoreboardTracker: "rrsregeneration",
        measure: "/10s"
    },
    {
        name: "§6Regeneration",
        type: allItems,
        rarity: "Legendary",
        min: 1,
        max: 3,
        scoreboardTracker: "rrsregeneration",
        measure: "/10s"
    },
    {
        name: "§cRegeneration",
        type: allItems,
        rarity: "Mythic",
        min: 3,
        max: 4,
        scoreboardTracker: "rrsregeneration",
        measure: "/10s"
    },

    // DAMAGE PERCENT - Weapons and some accessories
    {
        name: "§7Damage§x",
        type: allItems,
        rarity: "Common",
        min: 1,
        max: 3,
        scoreboardTracker: "rrsdamagepercent",
        measure: "%"
    },
    {
        name: "§aDamage§x",
        type: allItems,
        rarity: "Uncommon",
        min: 2,
        max: 5,
        scoreboardTracker: "rrsdamagepercent",
        measure: "%"
    },
    {
        name: "§9Damage§x",
        type: allItems,
        rarity: "Rare",
        min: 3,
        max: 7,
        scoreboardTracker: "rrsdamagepercent",
        measure: "%"
    },
    {
        name: "§5Damage§x",
        type: allItems,
        rarity: "Epic",
        min: 5,
        max: 10,
        scoreboardTracker: "rrsdamagepercent",
        measure: "%"
    },
    {
        name: "§6Damage§x",
        type: allItems,
        rarity: "Legendary",
        min: 8,
        max: 15,
        scoreboardTracker: "rrsdamagepercent",
        measure: "%"
    },
    {
        name: "§cDamage§x",
        type: allItems,
        rarity: "Mythic",
        min: 12,
        max: 20,
        scoreboardTracker: "rrsdamagepercent",
        measure: "%"
    },

    // LIFESTEAL - Weapons only
    {
        name: "§9Lifesteal",
        type: allItems,
        rarity: "Rare",
        min: 1,
        max: 3,
        scoreboardTracker: "rrslifesteal",
        measure: "%"
    },
    {
        name: "§5Lifesteal",
        type: allItems,
        rarity: "Epic",
        min: 3,
        max: 5,
        scoreboardTracker: "rrslifesteal",
        measure: "%"
    },
    {
        name: "§6Lifesteal",
        type: allItems,
        rarity: "Legendary",
        min: 5,
        max: 7,
        scoreboardTracker: "rrslifesteal",
        measure: "%"
    },
    {
        name: "§cLifesteal",
        type: allItems,
        rarity: "Mythic",
        min: 8,
        max: 10,
        scoreboardTracker: "rrslifesteal",
        measure: "%"
    },

    // HEALTH PERCENT - Armor and accessories
    {
        name: "§7Health§x",
        type: allItems,
        rarity: "Common",
        min: 1,
        max: 3,
        scoreboardTracker: "rrshealthpercent",
        measure: "%"
    },
    {
        name: "§aHealth§x",
        type: allItems,
        rarity: "Uncommon",
        min: 2,
        max: 5,
        scoreboardTracker: "rrshealthpercent",
        measure: "%"
    },
    {
        name: "§9Health§x",
        type: allItems,
        rarity: "Rare",
        min: 3,
        max: 7,
        scoreboardTracker: "rrshealthpercent",
        measure: "%"
    },
    {
        name: "§5Health§x",
        type: allItems,
        rarity: "Epic",
        min: 5,
        max: 10,
        scoreboardTracker: "rrshealthpercent",
        measure: "%"
    },
    {
        name: "§6Health§x",
        type: allItems,
        rarity: "Legendary",
        min: 8,
        max: 15,
        scoreboardTracker: "rrshealthpercent",
        measure: "%"
    },
    {
        name: "§cHealth§x",
        type: allItems,
        rarity: "Mythic",
        min: 12,
        max: 20,
        scoreboardTracker: "rrshealthpercent",
        measure: "%"
    }
];