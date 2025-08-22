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
    },
    DIVINE: {
        id: 7,
        chance: 0.1,
        sid: "Divine",
        dName: "§bDivine",
        color: "§b",
        minStats: 0,
        maxStats: 0,
        skillChances: {
            skill: 0,
            passive: 0
        }
    }
};

export const blackList = [
    "minecraft:apple"
];

export const TagMapping = {
    "sword": ["sword", "katana", "claymore", "rapier", "shortsword", "longsword", "greatsword", "broadsword", "cutlass", "scimitar", "falchion", "blade", "saber", "estoc", "gladius", "bastard", "flamberge", "zweihander", "wakizashi", "tanto", "ninjato", "dao", "jian", "shamshir", "tulwar", "khopesh", "xiphos", "kopis", "epee", "foil", "dagger", "dirk", "stiletto", "poniard", "misericorde", "rondel", "bodkin", "kris", "athame", "sgian", "kukri", "bowie", "seax", "firesword", "icesword", "darksword", "lightsaber", "soulblade", "venomsword", "dragontooth", "voidblade", "lifesword", "knife"],
    "pickaxe": ["pickaxe", "pick", "mattock", "digger", "icepick", "warpick", "paxel", "firepick", "icepick", "netherpick", "soulpick", "obsidianpick", "powerpick"],
    "axe": ["axe", "battleaxe", "handaxe", "tomahawk", "hatchet", "cleaver", "francisca", "poleaxe", "labrys", "daneaxe", "stormaxe", "dreadaxe", "demonaxe", "skullcleaver", "wildaxe", "ironcleaver", "flameaxe", "leafcutter"],
    "shovel": ["shovel", "spade", "scoop", "trenching", "entrenching"],
    "hoe": ["hoe", "tiller", "cultivator"],
    "mace": ["mace", "club", "warhammer", "flail", "cudgel", "bludgeon", "morningstar", "sledgehammer", "mjolnir", "hammer", "halberd", "boneclub", "dreadhammer", "spikeclub", "thundermace", "skullhammer", "flamemace", "earthhammer"],
    "helmet": ["helmet", "hat", "cap", "crown", "circlet", "headpiece", "headgear", "coif", "casque", "bascinet", "sallet", "barbute", "armet", "helm", "spangenhelm", "burgonet", "morion", "kabuto", "ironhelm", "netherhelm", "bonecap", "flamehelm", "skullhelm", "dreadhelm", "leafhat"],
    "chestplate": ["chestplate", "tunic", "vest", "breastplate", "jerkin", "cuirass", "chainmail", "hauberk", "byrnie", "haubergeon", "lamellar", "brigandine", "gambeson", "aketon", "pourpoint", "surcoat", "tabard", "ironvest", "boneplate", "nethercuirass", "flamechest", "leafshirt", "dreadmail", "spiritplate"],
    "leggings": ["leggings", "pants", "trousers"],
    "boots": ["boots", "shoes", "sandals", "footwear", "sabatons", "slippers", "sollerets", "poulaines", "moccasins", "speedboots", "jumpboots", "fireboots", "frostboots", "stealthboots", "wingboots"],
    "bow": ["bow", "longbow", "shortbow", "crossbow", "recurve", "flatbow", "ballista", "arbalet", "longbow", "icebow", "netherbow", "soulbow", "windbow", "thunderbow", "spiritbow"],
    "trident": ["trident", "fork", "spear", "lance", "pitchfork", "pike", "polearm", "ranseur", "spetum", "corsesca", "pilum", "assegai", "naginata", "yari", "qiang", "dory", "sarissa", "spontoon", "icefork", "stormfork", "firelance", "soultrident", "dreadspike", "seaspear"],
    "shield": ["shield", "buckler", "targe", "defender", "scutum", "hoplon", "aspis", "pavise", "rotella", "adarga"],
    "elytra": ["elytra", "wings", "glider", "wing"],
    "totem": ["totem", "charm", "talisman", "amulet", "relic", "artifact", "idol", "firecharm", "shadowrelic", "iceamulet", "soulidol", "stormtotem", "blesscharm"]
};

// Item type arrays for stats
export const meleeWeapons = ["sword", "axe", "mace", "trident"];
export const tools = ["pickaxe", "shovel", "hoe", "axe"];
export const rangedWeapons = ["bow"];
export const allWeapons = [...meleeWeapons, ...rangedWeapons];
export const allArmor = ["helmet", "chestplate", "leggings", "boots", "shield", "elytra"];
export const allItems = [...allWeapons, ...tools, ...allArmor, "totem"];