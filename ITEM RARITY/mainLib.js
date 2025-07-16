/*
export const RARITY = {
    COMMON: {
        id: 1,
        chance: 1,
        sid: "Common",
        dName: "\n\n",
        minStats: 0,
        maxStats: 1
    },
    UNCOMMON: {
        id: 2,
        chance: 0.7,
        sid: "Uncommon",
        dName: "\n\n",
        minStats: 0,
        maxStats: 2
    },
    RARE: {
        id: 3,
        chance: 0.5,
        sid: "Rare",
        dName: "\n\n",
        minStats: 1,
        maxStats: 2
    },
    EPIC: {
        id: 4,
        chance: 0.4,
        sid: "Epic",
        dName: "\n\n",
        minStats: 1,
        maxStats: 3
    },
    LEGENDARY: {
        id: 5,
        chance: 0.4,
        sid: "Legendary",
        dName: "\n\n",
        minStats: 2,
        maxStats: 3
    },
    MYTHIC: {
        id: 6,
        chance: 0.5,
        sid: "Mythic",
        dName: "\n\n",
        minStats: 3,
        maxStats: 4
    }
};
*/

export const RARITY = {
    COMMON: {
        id: 1,
        chance: 1,
        sid: "Common",
        dName: "§7Common",
        color: "§7",
        minStats: 0,
        maxStats: 1,
        skillChances: {
            skill: 0,
            passive: 0
        }
    },
    UNCOMMON: {
        id: 2,
        chance: 0.7,
        sid: "Uncommon",
        dName: "§aUncommon",
        color: "§a",
        minStats: 0,
        maxStats: 2,
        skillChances: {
            skill: 0,
            passive: 0
        }
    },
    RARE: {
        id: 3,
        chance: 0.5,
        sid: "Rare",
        dName: "§9Rare",
        color: "§9",
        minStats: 1,
        maxStats: 2,
        skillChances: {
            skill: 0.1,
            passive: 0.1
        }
    },
    EPIC: {
        id: 4,
        chance: 0.4,
        sid: "Epic",
        dName: "§5Epic",
        color: "§5",
        minStats: 1,
        maxStats: 3,
        skillChances: {
            skill: 0.25,
            passive: 0.25
        }
    },
    LEGENDARY: {
        id: 5,
        chance: 0.4,
        sid: "Legendary",
        dName: "§6Legendary",
        color: "§6",
        minStats: 2,
        maxStats: 3,
        skillChances: {
            skill: 0.90,
            passive: 0.75
        }
    },
    MYTHIC: {
        id: 6,
        chance: 0.5,
        sid: "Mythic",
        dName: "§cMythic",
        color: "§c",
        minStats: 3,
        maxStats: 4,
        skillChances: {
            skill: 0.95,
            passive: 0.70
        }
    }
};

export const blackList = [
    "minecraft:apple"
];

export const TagMapping = {
    "sword": ["sword", "katana", "claymore", "rapier", "shortsword", "longsword", "greatsword", "broadsword", "cutlass", "sabre", "scimitar", "falchion", "blade", "saber"],
    "pickaxe": ["pickaxe", "pick", "mattock", "mining_pick", "digger"],
    "axe": ["axe", "battleaxe", "handaxe", "tomahawk", "great_axe", "lumber_axe", "hatchet", "cleaver"],
    "shovel": ["shovel", "spade", "digger", "scoop"],
    "hoe": ["hoe", "tiller", "cultivator", "farming_hoe"],
    "mace": ["mace", "club", "hammer", "warhammer", "maul", "flail", "cudgel", "bludgeon"],
    "helmet": ["helmet", "hat", "cap", "crown", "circlet", "headpiece", "headgear", "coif", "casque"],
    "chestplate": ["chestplate", "armor", "tunic", "vest", "breastplate", "jerkin", "cuirass", "mail", "chainmail"],
    "leggings": ["leggings", "pants", "trousers", "greaves", "breeches", "chaps"],
    "boots": ["boots", "shoes", "sandals", "footwear", "sabatons", "slippers"],
    "bow": ["bow", "longbow", "shortbow", "crossbow", "recurve", "composite_bow"],
    "trident": ["trident", "fork", "spear", "lance", "javelin", "harpoon", "pitchfork"],
    "shield": ["shield", "buckler", "targe", "defender", "barrier", "guard"],
    "elytra": ["elytra", "wings", "glider", "wing", "flight"],
    "totem": ["totem", "charm", "talisman", "amulet", "relic", "artifact", "idol"]
};

// Item type arrays for stats
export const meleeWeapons = ["sword", "axe", "mace", "trident"];
export const tools = ["pickaxe", "shovel", "hoe", "axe"];
export const rangedWeapons = ["bow"];
export const allWeapons = [...meleeWeapons, ...rangedWeapons];
export const allArmor = ["helmet", "chestplate", "leggings", "boots", "shield", "elytra"];
export const allItems = [...allWeapons, ...tools, ...allArmor, "totem"];

// Upgrade Cost Definitions
export const UPGRADE_COSTS = {
    // Rarity upgrade costs - items needed to upgrade to next rarity level
    RARITY_UPGRADE: {
        COMMON: {
            targetRarity: "UNCOMMON",
            requiredItems: [
                { item: "rrs:common_upgrade", count: 2 }
            ],
            successChance: 0.8
        },
        UNCOMMON: {
            targetRarity: "RARE", 
            requiredItems: [
                { item: "rrs:uncommon_upgrade", count: 2 },
                { item: "rrs:common_upgrade", count: 1 }
            ],
            successChance: 0.7
        },
        RARE: {
            targetRarity: "EPIC",
            requiredItems: [
                { item: "rrs:rare_upgrade", count: 2 },
                { item: "rrs:uncommon_upgrade", count: 1 }
            ],
            successChance: 0.6
        },
        EPIC: {
            targetRarity: "LEGENDARY",
            requiredItems: [
                { item: "rrs:epic_upgrade", count: 2 },
                { item: "rrs:rare_upgrade", count: 1 }
            ],
            successChance: 0.5
        },
        LEGENDARY: {
            targetRarity: "MYTHIC",
            requiredItems: [
                { item: "rrs:legendary_upgrade", count: 3 },
                { item: "rrs:epic_upgrade", count: 1 }
            ],
            successChance: 0.4
        },
        MYTHIC: {
            targetRarity: null, // Max rarity
            requiredItems: [],
            successChance: 0
        }
    },

    // Stats upgrade costs - improve existing stats
    STATS_UPGRADE: {
        COMMON: {
            requiredItems: [
                { item: "minecraft:experience_bottle", count: 5 },
                { item: "rrs:common_upgrade", count: 1 }
            ],
            successChance: 0.9,
            upgradeMultiplier: 1.2
        },
        UNCOMMON: {
            requiredItems: [
                { item: "minecraft:experience_bottle", count: 8 },
                { item: "rrs:uncommon_upgrade", count: 1 }
            ],
            successChance: 0.8,
            upgradeMultiplier: 1.3
        },
        RARE: {
            requiredItems: [
                { item: "minecraft:experience_bottle", count: 12 },
                { item: "rrs:rare_upgrade", count: 1 }
            ],
            successChance: 0.7,
            upgradeMultiplier: 1.4
        },
        EPIC: {
            requiredItems: [
                { item: "minecraft:experience_bottle", count: 16 },
                { item: "rrs:epic_upgrade", count: 1 }
            ],
            successChance: 0.6,
            upgradeMultiplier: 1.5
        },
        LEGENDARY: {
            requiredItems: [
                { item: "minecraft:experience_bottle", count: 24 },
                { item: "rrs:legendary_upgrade", count: 1 }
            ],
            successChance: 0.5,
            upgradeMultiplier: 1.6
        },
        MYTHIC: {
            requiredItems: [
                { item: "minecraft:experience_bottle", count: 32 },
                { item: "rrs:mythic_upgrade", count: 1 }
            ],
            successChance: 0.4,
            upgradeMultiplier: 1.8
        }
    },

    // Stats reroll costs - reroll stats completely
    STATS_REROLL: {
        COMMON: {
            requiredItems: [
                { item: "minecraft:enchanted_book", count: 1 }
            ],
            successChance: 1.0
        },
        UNCOMMON: {
            requiredItems: [
                { item: "minecraft:enchanted_book", count: 2 }
            ],
            successChance: 1.0
        },
        RARE: {
            requiredItems: [
                { item: "minecraft:enchanted_book", count: 3 }
            ],
            successChance: 1.0
        },
        EPIC: {
            requiredItems: [
                { item: "minecraft:enchanted_book", count: 4 }
            ],
            successChance: 1.0
        },
        LEGENDARY: {
            requiredItems: [
                { item: "minecraft:enchanted_book", count: 6 }
            ],
            successChance: 1.0
        },
        MYTHIC: {
            requiredItems: [
                { item: "minecraft:enchanted_book", count: 8 }
            ],
            successChance: 1.0
        }
    },

    // Skill upgrade costs
    SKILL_UPGRADE: {
        COMMON: {
            requiredItems: [
                { item: "minecraft:nether_star", count: 1 },
                { item: "rrs:common_upgrade", count: 2 }
            ],
            successChance: 0.8,
            upgradeMultiplier: 1.3
        },
        UNCOMMON: {
            requiredItems: [
                { item: "minecraft:nether_star", count: 1 },
                { item: "rrs:uncommon_upgrade", count: 2 }
            ],
            successChance: 0.7,
            upgradeMultiplier: 1.4
        },
        RARE: {
            requiredItems: [
                { item: "minecraft:nether_star", count: 2 },
                { item: "rrs:rare_upgrade", count: 1 }
            ],
            successChance: 0.6,
            upgradeMultiplier: 1.5
        },
        EPIC: {
            requiredItems: [
                { item: "minecraft:nether_star", count: 2 },
                { item: "rrs:epic_upgrade", count: 1 }
            ],
            successChance: 0.5,
            upgradeMultiplier: 1.6
        },
        LEGENDARY: {
            requiredItems: [
                { item: "minecraft:nether_star", count: 3 },
                { item: "rrs:legendary_upgrade", count: 1 }
            ],
            successChance: 0.4,
            upgradeMultiplier: 1.7
        },
        MYTHIC: {
            requiredItems: [
                { item: "minecraft:nether_star", count: 4 },
                { item: "rrs:mythic_upgrade", count: 1 }
            ],
            successChance: 0.3,
            upgradeMultiplier: 1.8
        }
    },

    // Skill reroll costs
    SKILL_REROLL: {
        COMMON: {
            requiredItems: [
                { item: "minecraft:book", count: 2 }
            ],
            successChance: 1.0
        },
        UNCOMMON: {
            requiredItems: [
                { item: "minecraft:book", count: 3 }
            ],
            successChance: 1.0
        },
        RARE: {
            requiredItems: [
                { item: "minecraft:book", count: 4 }
            ],
            successChance: 1.0
        },
        EPIC: {
            requiredItems: [
                { item: "minecraft:book", count: 6 }
            ],
            successChance: 1.0
        },
        LEGENDARY: {
            requiredItems: [
                { item: "minecraft:book", count: 8 }
            ],
            successChance: 1.0
        },
        MYTHIC: {
            requiredItems: [
                { item: "minecraft:book", count: 12 }
            ],
            successChance: 1.0
        }
    },

    // Passive upgrade costs
    PASSIVE_UPGRADE: {
        COMMON: {
            requiredItems: [
                { item: "minecraft:totem_of_undying", count: 1 },
                { item: "rrs:common_upgrade", count: 2 }
            ],
            successChance: 0.8,
            upgradeMultiplier: 1.3
        },
        UNCOMMON: {
            requiredItems: [
                { item: "minecraft:totem_of_undying", count: 1 },
                { item: "rrs:uncommon_upgrade", count: 2 }
            ],
            successChance: 0.7,
            upgradeMultiplier: 1.4
        },
        RARE: {
            requiredItems: [
                { item: "minecraft:totem_of_undying", count: 1 },
                { item: "rrs:rare_upgrade", count: 2 }
            ],
            successChance: 0.6,
            upgradeMultiplier: 1.5
        },
        EPIC: {
            requiredItems: [
                { item: "minecraft:totem_of_undying", count: 1 },
                { item: "rrs:epic_upgrade", count: 2 }
            ],
            successChance: 0.5,
            upgradeMultiplier: 1.6
        },
        LEGENDARY: {
            requiredItems: [
                { item: "minecraft:totem_of_undying", count: 2 },
                { item: "rrs:legendary_upgrade", count: 1 }
            ],
            successChance: 0.4,
            upgradeMultiplier: 1.7
        },
        MYTHIC: {
            requiredItems: [
                { item: "minecraft:totem_of_undying", count: 2 },
                { item: "rrs:mythic_upgrade", count: 1 }
            ],
            successChance: 0.3,
            upgradeMultiplier: 1.8
        }
    },

    // Passive reroll costs
    PASSIVE_REROLL: {
        COMMON: {
            requiredItems: [
                { item: "minecraft:blaze_powder", count: 4 }
            ],
            successChance: 1.0
        },
        UNCOMMON: {
            requiredItems: [
                { item: "minecraft:blaze_powder", count: 6 }
            ],
            successChance: 1.0
        },
        RARE: {
            requiredItems: [
                { item: "minecraft:blaze_powder", count: 8 }
            ],
            successChance: 1.0
        },
        EPIC: {
            requiredItems: [
                { item: "minecraft:blaze_powder", count: 12 }
            ],
            successChance: 1.0
        },
        LEGENDARY: {
            requiredItems: [
                { item: "minecraft:blaze_powder", count: 16 }
            ],
            successChance: 1.0
        },
        MYTHIC: {
            requiredItems: [
                { item: "minecraft:blaze_powder", count: 24 }
            ],
            successChance: 1.0
        }
    }
};