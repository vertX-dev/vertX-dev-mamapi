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
            skill: 0.01,
            passive: 0.05
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
            skill: 0.06,
            passive: 0.1
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
            skill: 0.15,
            passive: 0.2
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
            skill: 0.3,
            passive: 0.4
        }
    }
};

export const blackList = [
    "minecraft:apple"
];

//16 -> 495
export const TagMapping = {
    // Melee Weapons
    "sword": ["sword", "katana", "claymore", "rapier", "shortsword", "longsword", "greatsword", "broadsword", "cutlass", "sabre", "scimitar", "falchion", "blade", "saber"],
    "axe": ["axe", "battleaxe", "handaxe", "tomahawk", "great_axe", "lumber_axe", "hatchet", "cleaver"],
    "pickaxe": ["pickaxe", "pick", "mattock", "paxel"],
    "mace": ["mace", "club", "cudgel", "baton"],
    "hammer": ["hammer", "warhammer", "maul", "sledgehammer", "jackhammer"],
    "dagger": ["dagger", "knife", "blade", "stiletto", "dirk", "shiv"],
    "spear": ["spear", "lance", "javelin", "pike", "halberd", "glaive", "polearm"],
    "trident": ["trident", "fork", "pitchfork"],
    "scythe": ["scythe", "sickle", "reaper"],
    "staff": ["staff", "rod", "wand", "cane", "pole"],
    "flail": ["flail", "morningstar", "chain"],
    "whip": ["whip", "lash", "cord"],
    "multitool": ["multitool", "omnitool", "swiss", "utility"],

    // Tools
    "shovel": ["shovel", "spade", "excavator"],
    "hoe": ["hoe", "tiller", "cultivator"],
    "drill": ["drill", "auger", "borer"],
    "saw": ["saw", "chainsaw", "hacksaw", "bandsaw"],
    "wrench": ["wrench", "spanner", "key"],
    "chisel": ["chisel", "gouge", "carver"],
    "file": ["file", "rasp", "grater"],
    "crowbar": ["crowbar", "pry", "lever"],
    "screwdriver": ["screwdriver", "driver", "turner"],
    "pliers": ["pliers", "tongs", "pincers", "tweezers"],
    "shears": ["shears", "scissors", "snips", "cutters"],
    "fishing_rod": ["fishing", "rod", "pole", "line"],
    "net": ["net", "mesh", "web", "snare"],
    "bucket": ["bucket", "pail", "container"],
    "flask": ["flask", "bottle", "vial", "phial"],
    "torch": ["torch", "lantern", "lamp", "light"],
    "compass": ["compass", "navigator", "direction"],
    "rope": ["rope", "cord", "string", "twine"],
    "hook": ["hook", "grappling", "anchor"],
    "lockpick": ["lockpick", "pick", "jimmy"],
    "key": ["key", "opener", "unlocker"],
    "magnifying_glass": ["magnifying", "lens", "glass"],
    "telescope": ["telescope", "scope", "viewer"],
    "binoculars": ["binoculars", "field", "glasses"],

    // Ranged Weapons
    "bow": ["bow", "longbow", "shortbow", "composite", "recurve", "hunting"],
    "crossbow": ["crossbow", "arbalest", "ballista"],
    "sling": ["sling", "slingshot", "catapult"],
    "blowgun": ["blowgun", "blowpipe", "dart"],
    "throwing_knife": ["throwing", "kunai", "shuriken", "star"],
    "boomerang": ["boomerang", "chakram", "disc"],
    "gun": ["gun", "firearm", "weapon"],
    "pistol": ["pistol", "handgun", "revolver", "sidearm"],
    "rifle": ["rifle", "musket", "carbine", "firearm"],
    "shotgun": ["shotgun", "scattergun", "blunderbuss"],
    "sniper_rifle": ["sniper", "precision", "marksman"],
    "assault_rifle": ["assault", "automatic", "machine"],
    "launcher": ["launcher", "rocket", "grenade", "bazooka"],
    "cannon": ["cannon", "artillery", "mortar"],

    // Armor - Head
    "helmet": ["helmet", "helm", "cap", "hat", "headgear", "casque", "bascinet", "sallet", "barbute", "armet"],
    "crown": ["crown", "circlet", "tiara", "diadem", "coronet"],
    "mask": ["mask", "visor", "face", "guard"],
    "goggles": ["goggles", "glasses", "spectacles", "eyewear"],
    "hood": ["hood", "cowl", "coif", "caul"],

    // Armor - Chest
    "chestplate": ["chestplate", "cuirass", "breastplate", "chest", "torso", "body"],
    "vest": ["vest", "jacket", "coat", "tunic"],
    "robe": ["robe", "gown", "dress", "garment"],
    "chainmail": ["chainmail", "chain", "mail", "hauberk"],
    "scale_mail": ["scale", "scaled", "lamellar"],
    "plate_mail": ["plate", "plated", "full"],
    "leather_armor": ["leather", "hide", "skin"],
    "cloak": ["cloak", "cape", "mantle", "shroud"],

    // Armor - Legs
    "leggings": ["leggings", "pants", "trousers", "leg", "lower"],
    "greaves": ["greaves", "shin", "leg", "guard"],
    "tassets": ["tassets", "thigh", "upper"],

    // Armor - Feet
    "boots": ["boots", "shoes", "footwear", "foot", "sabatons"],
    "sandals": ["sandals", "slippers", "footwear"],

    // Armor - Hands/Arms
    "gloves": ["gloves", "gauntlets", "mittens", "hand", "finger"],
    "bracers": ["bracers", "vambraces", "arm", "forearm", "wrist"],

    // Armor - Accessories
    "shield": ["shield", "buckler", "targe", "aegis", "defender"],
    "belt": ["belt", "girdle", "sash", "waist"],
    "backpack": ["backpack", "pack", "bag", "satchel", "knapsack"],
    "quiver": ["quiver", "arrow", "bolt", "case"],
    "scabbard": ["scabbard", "sheath", "holster", "holder"],
    "pouch": ["pouch", "purse", "wallet", "pocket"],

    // Special/Utility Items
    "elytra": ["elytra", "wings", "wing", "flight"],
    "jetpack": ["jetpack", "thruster", "propulsion"],
    "parachute": ["parachute", "chute", "glider"],
    "totem": ["totem", "idol", "fetish", "charm"],
    "amulet": ["amulet", "talisman", "pendant", "necklace"],
    "ring": ["ring", "band", "circle"],
    "bracelet": ["bracelet", "bangle", "armband"],
    "earring": ["earring", "ear", "stud"],
    "brooch": ["brooch", "pin", "badge", "insignia"],

    // Magic Items
    "wand": ["wand", "rod", "staff", "scepter", "baton"],
    "orb": ["orb", "sphere", "crystal", "ball"],
    "gem": ["gem", "jewel", "stone", "crystal"],
    "focus": ["focus", "catalyst", "conduit", "channeler"],
    "tome": ["tome", "book", "grimoire", "manual"],
    "scroll": ["scroll", "parchment", "paper", "document"],
    "rune": ["rune", "glyph", "symbol", "sigil"],
    "artifact": ["artifact", "relic", "treasure", "ancient"],
    "legendary": ["legendary", "epic", "rare", "unique", "mythic", "divine"]
};

// Item type arrays for stats
export const meleeWeapons = ["sword", "axe", "mace", "hammer", "dagger", "spear", "trident", "scythe", "staff", "flail", "whip"];
export const tools = ["pickaxe", "shovel", "hoe", "drill", "saw", "wrench", "chisel", "file", "crowbar", "screwdriver", "pliers", "shears", "fishing_rod", "net", "bucket", "flask", "torch", "compass", "rope", "hook", "lockpick", "key", "magnifying_glass", "telescope", "binoculars", "multitool"];
export const rangedWeapons = ["bow", "crossbow", "sling", "blowgun", "throwing_knife", "boomerang", "gun", "pistol", "rifle", "shotgun", "sniper_rifle", "assault_rifle", "launcher", "cannon"];
export const allWeapons = [...meleeWeapons, ...rangedWeapons];
export const headArmor = ["helmet", "crown", "mask", "goggles", "hood"];
export const chestArmor = ["chestplate", "vest", "robe", "chainmail", "scale_mail", "plate_mail", "leather_armor", "cloak"];
export const legArmor = ["leggings", "greaves", "tassets"];
export const footArmor = ["boots", "sandals"];
export const handArmor = ["gloves", "bracers"];
export const allArmor = [...headArmor, ...chestArmor, ...legArmor, ...footArmor, ...handArmor, "shield"];
export const accessories = ["belt", "backpack", "quiver", "scabbard", "pouch", "amulet", "ring", "bracelet", "earring", "brooch"];
export const magicItems = ["wand", "orb", "gem", "focus", "tome", "scroll", "rune", "artifact", "legendary"];
export const specialItems = ["elytra", "jetpack", "parachute", "totem"];
export const allItems = [...allWeapons, ...tools, ...allArmor, ...accessories, ...magicItems, ...specialItems];