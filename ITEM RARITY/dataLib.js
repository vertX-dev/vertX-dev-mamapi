/*
export const RARITY = {
    COMMON: {
        id: 1,
        chance: 1,
        sid: "Common",
        dName: "\n\n",
        minStats: 0,
        maxStats: 1
    },
    UNCOMMON: {
        id: 2,
        chance: 0.7,
        sid: "Uncommon",
        dName: "\n\n",
        minStats: 0,
        maxStats: 2
    },
    RARE: {
        id: 3,
        chance: 0.5,
        sid: "Rare",
        dName: "\n\n",
        minStats: 1,
        maxStats: 2
    },
    EPIC: {
        id: 4,
        chance: 0.4,
        sid: "Epic",
        dName: "\n\n",
        minStats: 1,
        maxStats: 3
    },
    LEGENDARY: {
        id: 5,
        chance: 0.4,
        sid: "Legendary",
        dName: "\n\n",
        minStats: 2,
        maxStats: 3
    },
    MYTHIC: {
        id: 6,
        chance: 0.5,
        sid: "Mythic",
        dName: "\n\n",
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
            skill: 0.16,
            passive: 0.20
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
            skill: 0.35,
            passive: 0.55
        }
    },
    LEGENDARY: {
        id: 5,
        chance: 0.35,
        sid: "Legendary",
        dName: "§6Legendary",
        color: "§6",
        minStats: 2,
        maxStats: 3,
        skillChances: {
            skill: 0.85,
            passive: 0.60
        }
    },
    MYTHIC: {
        id: 6,
        chance: 0.3,
        sid: "Mythic",
        dName: "§cMythic",
        color: "§c",
        minStats: 3,
        maxStats: 4,
        skillChances: {
            skill: 0.95,
            passive: 0.95
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

export const stats = {
    // DAMAGE - Weapons only
    DAMAGE_COMMON: { name: "§8Damage", type: ["sword", "axe", "mace", "hammer", "dagger", "spear", "trident", "scythe", "staff", "flail", "whip", "pickaxe", "bow", "crossbow", "sling", "blowgun", "throwing_knife", "boomerang", "gun", "pistol", "rifle", "shotgun", "sniper_rifle", "assault_rifle", "launcher", "cannon"], rarity: "Common", min: 1, max: 2, scoreboardTracker: "damage" },
    DAMAGE_UNCOMMON: { name: "§aDamage", type: ["sword", "axe", "mace", "hammer", "dagger", "spear", "trident", "scythe", "staff", "flail", "whip", "pickaxe", "bow", "crossbow", "sling", "blowgun", "throwing_knife", "boomerang", "gun", "pistol", "rifle", "shotgun", "sniper_rifle", "assault_rifle", "launcher", "cannon"], rarity: "Uncommon", min: 1, max: 3, scoreboardTracker: "damage" },
    DAMAGE_RARE: { name: "§1Damage", type: ["sword", "axe", "mace", "hammer", "dagger", "spear", "trident", "scythe", "staff", "flail", "whip", "pickaxe", "bow", "crossbow", "sling", "blowgun", "throwing_knife", "boomerang", "gun", "pistol", "rifle", "shotgun", "sniper_rifle", "assault_rifle", "launcher", "cannon"], rarity: "Rare", min: 2, max: 4, scoreboardTracker: "damage" },
    DAMAGE_EPIC: { name: "§5Damage", type: ["sword", "axe", "mace", "hammer", "dagger", "spear", "trident", "scythe", "staff", "flail", "whip", "pickaxe", "bow", "crossbow", "sling", "blowgun", "throwing_knife", "boomerang", "gun", "pistol", "rifle", "shotgun", "sniper_rifle", "assault_rifle", "launcher", "cannon"], rarity: "Epic", min: 3, max: 5, scoreboardTracker: "damage" },
    DAMAGE_LEGENDARY: { name: "§6Damage", type: ["sword", "axe", "mace", "hammer", "dagger", "spear", "trident", "scythe", "staff", "flail", "whip", "pickaxe", "bow", "crossbow", "sling", "blowgun", "throwing_knife", "boomerang", "gun", "pistol", "rifle", "shotgun", "sniper_rifle", "assault_rifle", "launcher", "cannon"], rarity: "Legendary", min: 4, max: 7, scoreboardTracker: "damage" },
    DAMAGE_MYTHIC: { name: "§cDamage", type: ["sword", "axe", "mace", "hammer", "dagger", "spear", "trident", "scythe", "staff", "flail", "whip", "pickaxe", "bow", "crossbow", "sling", "blowgun", "throwing_knife", "boomerang", "gun", "pistol", "rifle", "shotgun", "sniper_rifle", "assault_rifle", "launcher", "cannon"], rarity: "Mythic", min: 5, max: 8, scoreboardTracker: "damage" },

    // DEFENSE - Armor items
    DEFENSE_COMMON: { name: "§8Defense", type: ["helmet", "crown", "mask", "goggles", "hood", "chestplate", "vest", "robe", "chainmail", "scale_mail", "plate_mail", "leather_armor", "cloak", "leggings", "greaves", "tassets", "boots", "sandals", "gloves", "bracers", "shield"], rarity: "Common", min: 1, max: 3, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_UNCOMMON: { name: "§aDefense", type: ["helmet", "crown", "mask", "goggles", "hood", "chestplate", "vest", "robe", "chainmail", "scale_mail", "plate_mail", "leather_armor", "cloak", "leggings", "greaves", "tassets", "boots", "sandals", "gloves", "bracers", "shield"], rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_RARE: { name: "§1Defense", type: ["helmet", "crown", "mask", "goggles", "hood", "chestplate", "vest", "robe", "chainmail", "scale_mail", "plate_mail", "leather_armor", "cloak", "leggings", "greaves", "tassets", "boots", "sandals", "gloves", "bracers", "shield"], rarity: "Rare", min: 3, max: 6, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_EPIC: { name: "§5Defense", type: ["helmet", "crown", "mask", "goggles", "hood", "chestplate", "vest", "robe", "chainmail", "scale_mail", "plate_mail", "leather_armor", "cloak", "leggings", "greaves", "tassets", "boots", "sandals", "gloves", "bracers", "shield"], rarity: "Epic", min: 5, max: 8, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_LEGENDARY: { name: "§6Defense", type: ["helmet", "crown", "mask", "goggles", "hood", "chestplate", "vest", "robe", "chainmail", "scale_mail", "plate_mail", "leather_armor", "cloak", "leggings", "greaves", "tassets", "boots", "sandals", "gloves", "bracers", "shield"], rarity: "Legendary", min: 7, max: 10, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_MYTHIC: { name: "§cDefense", type: ["helmet", "crown", "mask", "goggles", "hood", "chestplate", "vest", "robe", "chainmail", "scale_mail", "plate_mail", "leather_armor", "cloak", "leggings", "greaves", "tassets", "boots", "sandals", "gloves", "bracers", "shield"], rarity: "Mythic", min: 10, max: 15, scoreboardTracker: "defense", measure: "%" },

    // SPEED - Boots, legs, accessories
    SPEED_COMMON:    { name: "§8Speed",     type: ["boots", "sandals", "leggings", "greaves", "tassets", "elytra", "jetpack"], rarity: "Common",    min: 1,  max: 3,  scoreboardTracker: "speed", measure: "%" },
    SPEED_UNCOMMON:  { name: "§aSpeed",     type: ["boots", "sandals", "leggings", "greaves", "tassets", "elytra", "jetpack"], rarity: "Uncommon",  min: 2,  max: 5,  scoreboardTracker: "speed", measure: "%" },
    SPEED_RARE:      { name: "§1Speed",     type: ["boots", "sandals", "leggings", "greaves", "tassets", "elytra", "jetpack"], rarity: "Rare",      min: 3,  max: 6,  scoreboardTracker: "speed", measure: "%" },
    SPEED_EPIC:      { name: "§5Speed",     type: ["boots", "sandals", "leggings", "greaves", "tassets", "elytra", "jetpack"], rarity: "Epic",      min: 5,  max: 8,  scoreboardTracker: "speed", measure: "%" },
    SPEED_LEGENDARY: { name: "§6Speed",     type: ["boots", "sandals", "leggings", "greaves", "tassets", "elytra", "jetpack"], rarity: "Legendary", min: 7,  max: 10, scoreboardTracker: "speed", measure: "%" },
    SPEED_MYTHIC:    { name: "§cSpeed",     type: ["boots", "sandals", "leggings", "greaves", "tassets", "elytra", "jetpack"], rarity: "Mythic",    min: 10, max: 15, scoreboardTracker: "speed", measure: "%" },
    
    // HEALTH - Armor and accessories
    HEALTH_COMMON: { name: "§8Health", type: ["helmet", "crown", "chestplate", "vest", "robe", "chainmail", "scale_mail", "plate_mail", "leather_armor", "amulet", "ring", "totem"], rarity: "Common", min: 1, max: 2, scoreboardTracker: "health" },
    HEALTH_UNCOMMON: { name: "§aHealth", type: ["helmet", "crown", "chestplate", "vest", "robe", "chainmail", "scale_mail", "plate_mail", "leather_armor", "amulet", "ring", "totem"], rarity: "Uncommon", min: 1, max: 4, scoreboardTracker: "health" },
    HEALTH_RARE: { name: "§1Health", type: ["helmet", "crown", "chestplate", "vest", "robe", "chainmail", "scale_mail", "plate_mail", "leather_armor", "amulet", "ring", "totem"], rarity: "Rare", min: 2, max: 5, scoreboardTracker: "health" },
    HEALTH_EPIC: { name: "§5Health", type: ["helmet", "crown", "chestplate", "vest", "robe", "chainmail", "scale_mail", "plate_mail", "leather_armor", "amulet", "ring", "totem"], rarity: "Epic", min: 4, max: 7, scoreboardTracker: "health" },
    HEALTH_LEGENDARY: { name: "§6Health", type: ["helmet", "crown", "chestplate", "vest", "robe", "chainmail", "scale_mail", "plate_mail", "leather_armor", "amulet", "ring", "totem"], rarity: "Legendary", min: 5, max: 8, scoreboardTracker: "health" },
    HEALTH_MYTHIC: { name: "§cHealth", type: ["helmet", "crown", "chestplate", "vest", "robe", "chainmail", "scale_mail", "plate_mail", "leather_armor", "amulet", "ring", "totem"], rarity: "Mythic", min: 6, max: 10, scoreboardTracker: "health" },
    
    // CRITICAL CHANCE - All items
    CRIT_CHANCE_COMMON: { name: "§8Crit Chance", type: TagMapping, rarity: "Common", min: 1, max: 3, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_UNCOMMON: { name: "§aCrit Chance", type: TagMapping, rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_RARE: { name: "§1Crit Chance", type: TagMapping, rarity: "Rare", min: 3, max: 7, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_EPIC: { name: "§5Crit Chance", type: TagMapping, rarity: "Epic", min: 5, max: 10, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_LEGENDARY: { name: "§6Crit Chance", type: TagMapping, rarity: "Legendary", min: 8, max: 15, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_MYTHIC: { name: "§cCrit Chance", type: TagMapping, rarity: "Mythic", min: 12, max: 20, scoreboardTracker: "critchance", measure: "%" },

    // CRITICAL DAMAGE - All items
    CRIT_DAMAGE_COMMON: { name: "§8Crit Damage", type: TagMapping, rarity: "Common", min: 1, max: 5, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_UNCOMMON: { name: "§aCrit Damage", type: TagMapping, rarity: "Uncommon", min: 4, max: 10, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_RARE: { name: "§1Crit Damage", type: TagMapping, rarity: "Rare", min: 9, max: 15, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_EPIC: { name: "§5Crit Damage", type: TagMapping, rarity: "Epic", min: 15, max: 22, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_LEGENDARY: { name: "§6Crit Damage", type: TagMapping, rarity: "Legendary", min: 21, max: 33, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_MYTHIC: { name: "§cCrit Damage", type: TagMapping, rarity: "Mythic", min: 33, max: 45, scoreboardTracker: "critdamage", measure: "%" },

    // REGENERATION - All items
    REGENERATION_EPIC: { name: "§5Regeneration", type: TagMapping, rarity: "Epic", min: 1, max: 2, scoreboardTracker: "regeneration", measure: "/10s" },
    REGENERATION_LEGENDARY: { name: "§6Regeneration", type: TagMapping, rarity: "Legendary", min: 1, max: 3, scoreboardTracker: "regeneration", measure: "/10s" },
    REGENERATION_MYTHIC: { name: "§cRegeneration", type: TagMapping, rarity: "Mythic", min: 3, max: 4, scoreboardTracker: "regeneration", measure: "/10s" },

    // DAMAGE PERCENT - All items
    DAMAGE_PERCENT_COMMON: { name: "§8Damage§x", type: TagMapping, rarity: "Common", min: 1, max: 3, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_UNCOMMON: { name: "§aDamage§x", type: TagMapping, rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_RARE: { name: "§1Damage§x", type: TagMapping, rarity: "Rare", min: 3, max: 7, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_EPIC: { name: "§5Damage§x", type: TagMapping, rarity: "Epic", min: 5, max: 10, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_LEGENDARY: { name: "§6Damage§x", type: TagMapping, rarity: "Legendary", min: 8, max: 15, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_MYTHIC: { name: "§cDamage§x", type: TagMapping, rarity: "Mythic", min: 12, max: 20, scoreboardTracker: "damagepercent", measure: "%" },
    
    // LIFESTEAL - All items
    LIFESTEAL_RARE:      { name: "§1Lifesteal",     type: TagMapping, rarity: "Rare",      min: 3,  max: 5,  scoreboardTracker: "lifesteal", measure: "%" },
    LIFESTEAL_EPIC:      { name: "§5Lifesteal",     type: TagMapping, rarity: "Epic",      min: 4,  max: 7,  scoreboardTracker: "lifesteal", measure: "%" },
    LIFESTEAL_LEGENDARY: { name: "§6Lifesteal",     type: TagMapping, rarity: "Legendary", min: 6,  max: 9,  scoreboardTracker: "lifesteal", measure: "%" },
    LIFESTEAL_MYTHIC:    { name: "§cLifesteal",     type: TagMapping, rarity: "Mythic",    min: 8,  max: 12, scoreboardTracker: "lifesteal", measure: "%" }
    
};


export const skills = {
    // SMASH LEAP - Mace
    SMASH_LEAP_RARE: { name: "§9Smash Leap", type: "mace", rarity: "Rare", min: 2, max: 2, description: "§7Smashes the ground and stuns \n§7enemies in §x{x} §7blocks radius, \n§7then leaps 8 blocks if has wind charge", cooldown: 120, scoreboard: "smashleap" },
    SMASH_LEAP_EPIC: { name: "§5Smash Leap", type: "mace", rarity: "Epic", min: 2, max: 3, description: "§7Smashes the ground and stuns \n§7enemies in §x{x} §7blocks radius, \n§7then leaps 8 blocks if has wind charge", cooldown: 120, scoreboard: "smashleap" },
    SMASH_LEAP_LEGENDARY: { name: "§6Smash Leap", type: "mace", rarity: "Legendary", min: 3, max: 5, description: "§7Smashes the ground and stuns \n§7enemies in §x{x} §7blocks radius, \n§7then leaps 8 blocks if has wind charge", cooldown: 120, scoreboard: "smashleap" },
    SMASH_LEAP_MYTHIC: { name: "§cSmash Leap", type: "mace", rarity: "Mythic", min: 5, max: 7, description: "§7Smashes the ground and stuns \n§7enemies in §x{x} §7blocks radius, \n§7then leaps 8 blocks if has wind charge", cooldown: 120, scoreboard: "smashleap" },

    // SPIN STRIKE - Sword
    SPIN_STRIKE_RARE: { name: "§9Spin Strike", type: "sword", rarity: "Rare", min: 5, max: 6, description: "§7Performs a 360° spin attack, \n§7dealing §x{x} §7damage to all \n§7enemies within 3 blocks", cooldown: 60, scoreboard: "spinstrike" },
    SPIN_STRIKE_EPIC: { name: "§5Spin Strike", type: "sword", rarity: "Epic", min: 7, max: 9, description: "§7Performs a 360° spin attack, \n§7dealing §x{x} §7damage to all \n§7enemies within 3 blocks", cooldown: 60, scoreboard: "spinstrike" },
    SPIN_STRIKE_LEGENDARY: { name: "§6Spin Strike", type: "sword", rarity: "Legendary", min: 10, max: 15, description: "§7Performs a 360° spin attack, \n§7dealing §x{x} §7damage to all \n§7enemies within 3 blocks", cooldown: 60, scoreboard: "spinstrike" },
    SPIN_STRIKE_MYTHIC: { name: "§cSpin Strike", type: "sword", rarity: "Mythic", min: 15, max: 20, description: "§7Performs a 360° spin attack, \n§7dealing §x{x} §7damage to all \n§7enemies within 3 blocks", cooldown: 60, scoreboard: "spinstrike" },

    // EXPLOSIVE MINING - Pickaxe
    EXPLOSIVE_MINING_RARE: { name: "§9Explosive Mining", type: "pickaxe", rarity: "Rare", min: 2, max: 3, description: "§7Creates an explosion with \n§7size of §x{x} §7to break \n§7blocks and damage enemies", cooldown: 1000, scoreboard: "explosivemining" },
    EXPLOSIVE_MINING_EPIC: { name: "§5Explosive Mining", type: "pickaxe", rarity: "Epic", min: 4, max: 5, description: "§7Creates an explosion with \n§7size of §x{x} §7to break \n§7blocks and damage enemies", cooldown: 1000, scoreboard: "explosivemining" },
    EXPLOSIVE_MINING_LEGENDARY: { name: "§6Explosive Mining", type: "pickaxe", rarity: "Legendary", min: 6, max: 7, description: "§7Creates an explosion with \n§7size of §x{x} §7to break \n§7blocks and damage enemies", cooldown: 1000, scoreboard: "explosivemining" },
    EXPLOSIVE_MINING_MYTHIC: { name: "§cExplosive Mining", type: "pickaxe", rarity: "Mythic", min: 8, max: 10, description: "§7Creates an explosion with \n§7size of §x{x} §7to break \n§7blocks and damage enemies", cooldown: 1000, scoreboard: "explosivemining" },

    // RAY MINER - Pickaxe
    RAY_MINER_RARE: { name: "§9Ray Miner", type: "pickaxe", rarity: "Rare", min: 8, max: 12, description: "§7Breaks §x{x} §7blocks in a \n§7straight line through solid \n§7materials", cooldown: 180, scoreboard: "rayminer" },
    RAY_MINER_EPIC: { name: "§5Ray Miner", type: "pickaxe", rarity: "Epic", min: 12, max: 16, description: "§7Breaks §x{x} §7blocks in a \n§7straight line through solid \n§7materials", cooldown: 180, scoreboard: "rayminer" },
    RAY_MINER_LEGENDARY: { name: "§6Ray Miner", type: "pickaxe", rarity: "Legendary", min: 16, max: 20, description: "§7Breaks §x{x} §7blocks in a \n§7straight line through solid \n§7materials", cooldown: 180, scoreboard: "rayminer" },
    RAY_MINER_MYTHIC: { name: "§cRay Miner", type: "pickaxe", rarity: "Mythic", min: 20, max: 25, description: "§7Breaks §x{x} §7blocks in a \n§7straight line through solid \n§7materials", cooldown: 180, scoreboard: "rayminer" },

    // EXCAVATOR - Shovel
    EXCAVATOR_RARE: { name: "§9Excavator", type: "shovel", rarity: "Rare", min: 2, max: 4, description: "§7Breaks sand-type blocks in a \n§73x3x§x{x} §7area, consuming \n§7durability", cooldown: 70, scoreboard: "excavator" },
    EXCAVATOR_EPIC: { name: "§5Excavator", type: "shovel", rarity: "Epic", min: 4, max: 6, description: "§7Breaks sand-type blocks in a \n§73x3x§x{x} §7area, consuming \n§7durability", cooldown: 70, scoreboard: "excavator" },
    EXCAVATOR_LEGENDARY: { name: "§6Excavator", type: "shovel", rarity: "Legendary", min: 6, max: 8, description: "§7Breaks sand-type blocks in a \n§73x3x§x{x} §7area, consuming \n§7durability", cooldown: 70, scoreboard: "excavator" },
    EXCAVATOR_MYTHIC: { name: "§cExcavator", type: "shovel", rarity: "Mythic", min: 7, max: 12, description: "§7Breaks sand-type blocks in a \n§73x3x§x{x} §7area, consuming \n§7durability", cooldown: 70, scoreboard: "excavator" },

    // FLAME ARC - Sword
    FLAME_ARC_RARE: { name: "§9Flame Arc", type: "sword", rarity: "Rare", min: 15, max: 20, description: "§7Unleashes an arc of fire that \n§7ignites enemies and blocks, \n§7dealing §x{x} §7fire damage", cooldown: 400, scoreboard: "flamearc" },
    FLAME_ARC_EPIC: { name: "§5Flame Arc", type: "sword", rarity: "Epic", min: 20, max: 28, description: "§7Unleashes an arc of fire that \n§7ignites enemies and blocks, \n§7dealing §x{x} §7fire damage", cooldown: 400, scoreboard: "flamearc" },
    FLAME_ARC_LEGENDARY: { name: "§6Flame Arc", type: "sword", rarity: "Legendary", min: 28, max: 38, description: "§7Unleashes an arc of fire that \n§7ignites enemies and blocks, \n§7dealing §x{x} §7fire damage", cooldown: 400, scoreboard: "flamearc" },
    FLAME_ARC_MYTHIC: { name: "§cFlame Arc", type: "sword", rarity: "Mythic", min: 38, max: 50, description: "§7Unleashes an arc of fire that \n§7ignites enemies and blocks, \n§7dealing §x{x} §7fire damage", cooldown: 400, scoreboard: "flamearc" },

    // SHADOW DASH - Sword
    SHADOW_DASH_RARE: { name: "§9Shadow Dash", type: "sword", rarity: "Rare", min: 3, max: 5, description: "§7Dash forward §x{x} §7blocks \n§7through enemies, reduced \n§7distance when airborne", cooldown: 50, scoreboard: "shadowdash" },
    SHADOW_DASH_EPIC: { name: "§5Shadow Dash", type: "sword", rarity: "Epic", min: 6, max: 8, description: "§7Dash forward §x{x} §7blocks \n§7through enemies, reduced \n§7distance when airborne", cooldown: 50, scoreboard: "shadowdash" },
    SHADOW_DASH_LEGENDARY: { name: "§6Shadow Dash", type: "sword", rarity: "Legendary", min: 9, max: 12, description: "§7Dash forward §x{x} §7blocks \n§7through enemies, reduced \n§7distance when airborne", cooldown: 50, scoreboard: "shadowdash" },
    SHADOW_DASH_MYTHIC: { name: "§cShadow Dash", type: "sword", rarity: "Mythic", min: 13, max: 15, description: "§7Dash forward §x{x} §7blocks \n§7through enemies, reduced \n§7distance when airborne", cooldown: 50, scoreboard: "shadowdash" },

    // VOID PIERCE - Sword
    VOID_PIERCE_RARE: { name: "§9Void Pierce", type: "sword", rarity: "Rare", min: 3, max: 5, description: "§7Shoots a void projectile that \n§7pierces through enemies, \n§7dealing §x{x} §7damage", cooldown: 80, scoreboard: "voidpierce" },
    VOID_PIERCE_EPIC: { name: "§5Void Pierce", type: "sword", rarity: "Epic", min: 6, max: 8, description: "§7Shoots a void projectile that \n§7pierces through enemies, \n§7dealing §x{x} §7damage", cooldown: 80, scoreboard: "voidpierce" },
    VOID_PIERCE_LEGENDARY: { name: "§6Void Pierce", type: "sword", rarity: "Legendary", min: 9, max: 14, description: "§7Shoots a void projectile that \n§7pierces through enemies, \n§7dealing §x{x} §7damage", cooldown: 80, scoreboard: "voidpierce" },
    VOID_PIERCE_MYTHIC: { name: "§cVoid Pierce", type: "sword", rarity: "Mythic", min: 15, max: 25, description: "§7Shoots a void projectile that \n§7pierces through enemies, \n§7dealing §x{x} §7damage", cooldown: 80, scoreboard: "voidpierce" }
};

export const passives = {
    FROST_TOUCH: {
        name: "§bFrost Touch",
        type: "sword",
        rarity: "Rare",
        min: 1,
        max: 2,
        description: "slow enemy for §x{x} seconds on hit",
        cooldown: 10,
        scoreboard: "frosttouch"
    }
};