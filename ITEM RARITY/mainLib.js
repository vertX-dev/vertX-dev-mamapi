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