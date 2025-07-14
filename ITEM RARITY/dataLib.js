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

export const TagMapping = [
    "sword",
    "pickaxe",
    "axe",
    "shovel",
    "hoe",
    "mace",

    "helmet",
    "chestplate",
    "leggings",
    "boots",

    "bow",
    "crossbow",
    "trident",
    "shield",
    "elytra",
    "totem"
];

export const stats = {
    // DAMAGE - All items
    DAMAGE_COMMON: {
        name: "§8Damage",
        type: TagMapping,
        rarity: "Common",
        min: 1,
        max: 2,
        scoreboardTracker: "damage"
    },
    DAMAGE_UNCOMMON: {
        name: "§aDamage",
        type: TagMapping,
        rarity: "Uncommon",
        min: 1,
        max: 3,
        scoreboardTracker: "damage"
    },
    DAMAGE_RARE: {
        name: "§1Damage",
        type: TagMapping,
        rarity: "Rare",
        min: 2,
        max: 4,
        scoreboardTracker: "damage"
    },
    DAMAGE_EPIC: {
        name: "§5Damage",
        type: TagMapping,
        rarity: "Epic",
        min: 3,
        max: 5,
        scoreboardTracker: "damage"
    },
    DAMAGE_LEGENDARY: {
        name: "§6Damage",
        type: TagMapping,
        rarity: "Legendary",
        min: 4,
        max: 7,
        scoreboardTracker: "damage"
    },
    DAMAGE_MYTHIC: {
        name: "§cDamage",
        type: TagMapping,
        rarity: "Mythic",
        min: 5,
        max: 8,
        scoreboardTracker: "damage"
    },

    // DEFENSE - All items
    DEFENSE_COMMON: {
        name: "§8Defense",
        type: TagMapping,
        rarity: "Common",
        min: 1,
        max: 3,
        scoreboardTracker: "defense",
        measure: "%"
    },
    DEFENSE_UNCOMMON: {
        name: "§aDefense",
        type: TagMapping,
        rarity: "Uncommon",
        min: 2,
        max: 5,
        scoreboardTracker: "defense",
        measure: "%"
    },
    DEFENSE_RARE: {
        name: "§1Defense",
        type: TagMapping,
        rarity: "Rare",
        min: 3,
        max: 6,
        scoreboardTracker: "defense",
        measure: "%"
    },
    DEFENSE_EPIC: {
        name: "§5Defense",
        type: TagMapping,
        rarity: "Epic",
        min: 5,
        max: 8,
        scoreboardTracker: "defense",
        measure: "%"
    },
    DEFENSE_LEGENDARY: {
        name: "§6Defense",
        type: TagMapping,
        rarity: "Legendary",
        min: 7,
        max: 10,
        scoreboardTracker: "defense",
        measure: "%"
    },
    DEFENSE_MYTHIC: {
        name: "§cDefense",
        type: TagMapping,
        rarity: "Mythic",
        min: 10,
        max: 15,
        scoreboardTracker: "defense",
        measure: "%"
    },

    // SPEED - All items
    SPEED_COMMON: {
        name: "§8Speed",
        type: TagMapping,
        rarity: "Common",
        min: 1,
        max: 3,
        scoreboardTracker: "speed",
        measure: "%"
    },
    SPEED_UNCOMMON: {
        name: "§aSpeed",
        type: TagMapping,
        rarity: "Uncommon",
        min: 2,
        max: 5,
        scoreboardTracker: "speed",
        measure: "%"
    },
    SPEED_RARE: {
        name: "§1Speed",
        type: TagMapping,
        rarity: "Rare",
        min: 3,
        max: 6,
        scoreboardTracker: "speed",
        measure: "%"
    },
    SPEED_EPIC: {
        name: "§5Speed",
        type: TagMapping,
        rarity: "Epic",
        min: 5,
        max: 8,
        scoreboardTracker: "speed",
        measure: "%"
    },
    SPEED_LEGENDARY: {
        name: "§6Speed",
        type: TagMapping,
        rarity: "Legendary",
        min: 7,
        max: 10,
        scoreboardTracker: "speed",
        measure: "%"
    },
    SPEED_MYTHIC: {
        name: "§cSpeed",
        type: TagMapping,
        rarity: "Mythic",
        min: 10,
        max: 15,
        scoreboardTracker: "speed",
        measure: "%"
    },

    // HEALTH - All items
    HEALTH_COMMON: {
        name: "§8Health",
        type: TagMapping,
        rarity: "Common",
        min: 1,
        max: 2,
        scoreboardTracker: "health"
    },
    HEALTH_UNCOMMON: {
        name: "§aHealth",
        type: TagMapping,
        rarity: "Uncommon",
        min: 1,
        max: 4,
        scoreboardTracker: "health"
    },
    HEALTH_RARE: {
        name: "§1Health",
        type: TagMapping,
        rarity: "Rare",
        min: 2,
        max: 5,
        scoreboardTracker: "health"
    },
    HEALTH_EPIC: {
        name: "§5Health",
        type: TagMapping,
        rarity: "Epic",
        min: 4,
        max: 7,
        scoreboardTracker: "health"
    },
    HEALTH_LEGENDARY: {
        name: "§6Health",
        type: TagMapping,
        rarity: "Legendary",
        min: 5,
        max: 8,
        scoreboardTracker: "health"
    },
    HEALTH_MYTHIC: {
        name: "§cHealth",
        type: TagMapping,
        rarity: "Mythic",
        min: 6,
        max: 10,
        scoreboardTracker: "health"
    },

    // CRITICAL CHANCE - All items
    CRIT_CHANCE_COMMON: {
        name: "§8Crit Chance",
        type: TagMapping,
        rarity: "Common",
        min: 1,
        max: 3,
        scoreboardTracker: "critchance",
        measure: "%"
    },
    CRIT_CHANCE_UNCOMMON: {
        name: "§aCrit Chance",
        type: TagMapping,
        rarity: "Uncommon",
        min: 2,
        max: 5,
        scoreboardTracker: "critchance",
        measure: "%"
    },
    CRIT_CHANCE_RARE: {
        name: "§1Crit Chance",
        type: TagMapping,
        rarity: "Rare",
        min: 3,
        max: 7,
        scoreboardTracker: "critchance",
        measure: "%"
    },
    CRIT_CHANCE_EPIC: {
        name: "§5Crit Chance",
        type: TagMapping,
        rarity: "Epic",
        min: 5,
        max: 10,
        scoreboardTracker: "critchance",
        measure: "%"
    },
    CRIT_CHANCE_LEGENDARY: {
        name: "§6Crit Chance",
        type: TagMapping,
        rarity: "Legendary",
        min: 8,
        max: 15,
        scoreboardTracker: "critchance",
        measure: "%"
    },
    CRIT_CHANCE_MYTHIC: {
        name: "§cCrit Chance",
        type: TagMapping,
        rarity: "Mythic",
        min: 12,
        max: 20,
        scoreboardTracker: "critchance",
        measure: "%"
    },

    // CRITICAL DAMAGE - All items
    CRIT_DAMAGE_COMMON: {
        name: "§8Crit Damage",
        type: TagMapping,
        rarity: "Common",
        min: 1,
        max: 5,
        scoreboardTracker: "critdamage",
        measure: "%"
    },
    CRIT_DAMAGE_UNCOMMON: {
        name: "§aCrit Damage",
        type: TagMapping,
        rarity: "Uncommon",
        min: 4,
        max: 10,
        scoreboardTracker: "critdamage",
        measure: "%"
    },
    CRIT_DAMAGE_RARE: {
        name: "§1Crit Damage",
        type: TagMapping,
        rarity: "Rare",
        min: 9,
        max: 15,
        scoreboardTracker: "critdamage",
        measure: "%"
    },
    CRIT_DAMAGE_EPIC: {
        name: "§5Crit Damage",
        type: TagMapping,
        rarity: "Epic",
        min: 15,
        max: 22,
        scoreboardTracker: "critdamage",
        measure: "%"
    },
    CRIT_DAMAGE_LEGENDARY: {
        name: "§6Crit Damage",
        type: TagMapping,
        rarity: "Legendary",
        min: 21,
        max: 33,
        scoreboardTracker: "critdamage",
        measure: "%"
    },
    CRIT_DAMAGE_MYTHIC: {
        name: "§cCrit Damage",
        type: TagMapping,
        rarity: "Mythic",
        min: 33,
        max: 45,
        scoreboardTracker: "critdamage",
        measure: "%"
    },

    // REGENERATION - All items
    REGENERATION_EPIC: {
        name: "§5Regeneration",
        type: TagMapping,
        rarity: "Epic",
        min: 1,
        max: 2,
        scoreboardTracker: "regeneration",
        measure: "/10s"
    },
    REGENERATION_LEGENDARY: {
        name: "§6Regeneration",
        type: TagMapping,
        rarity: "Legendary",
        min: 1,
        max: 3,
        scoreboardTracker: "regeneration",
        measure: "/10s"
    },
    REGENERATION_MYTHIC: {
        name: "§cRegeneration",
        type: TagMapping,
        rarity: "Mythic",
        min: 3,
        max: 4,
        scoreboardTracker: "regeneration",
        measure: "/10s"
    },

    // DAMAGE PERCENT - All items
    DAMAGE_PERCENT_COMMON: {
        name: "§8Damage§x",
        type: TagMapping,
        rarity: "Common",
        min: 1,
        max: 3,
        scoreboardTracker: "damagepercent",
        measure: "%"
    },
    DAMAGE_PERCENT_UNCOMMON: {
        name: "§aDamage§x",
        type: TagMapping,
        rarity: "Uncommon",
        min: 2,
        max: 5,
        scoreboardTracker: "damagepercent",
        measure: "%"
    },
    DAMAGE_PERCENT_RARE: {
        name: "§1Damage§x",
        type: TagMapping,
        rarity: "Rare",
        min: 3,
        max: 7,
        scoreboardTracker: "damagepercent",
        measure: "%"
    },
    DAMAGE_PERCENT_EPIC: {
        name: "§5Damage§x",
        type: TagMapping,
        rarity: "Epic",
        min: 5,
        max: 10,
        scoreboardTracker: "damagepercent",
        measure: "%"
    },
    DAMAGE_PERCENT_LEGENDARY: {
        name: "§6Damage§x",
        type: TagMapping,
        rarity: "Legendary",
        min: 8,
        max: 15,
        scoreboardTracker: "damagepercent",
        measure: "%"
    },
    DAMAGE_PERCENT_MYTHIC: {
        name: "§cDamage§x",
        type: TagMapping,
        rarity: "Mythic",
        min: 12,
        max: 20,
        scoreboardTracker: "damagepercent",
        measure: "%"
    },

    // LIFESTEAL - All items
    LIFESTEAL_COMMON: {
        name: "§8Lifesteal",
        type: TagMapping,
        rarity: "Common",
        min: 1,
        max: 2,
        scoreboardTracker: "lifesteal",
        measure: "%"
    },
    LIFESTEAL_UNCOMMON: {
        name: "§aLifesteal",
        type: TagMapping,
        rarity: "Uncommon",
        min: 2,
        max: 4,
        scoreboardTracker: "lifesteal",
        measure: "%"
    },
    LIFESTEAL_RARE: {
        name: "§1Lifesteal",
        type: TagMapping,
        rarity: "Rare",
        min: 3,
        max: 5,
        scoreboardTracker: "lifesteal",
        measure: "%"
    },
    LIFESTEAL_EPIC: {
        name: "§5Lifesteal",
        type: TagMapping,
        rarity: "Epic",
        min: 4,
        max: 7,
        scoreboardTracker: "lifesteal",
        measure: "%"
    },
    LIFESTEAL_LEGENDARY: {
        name: "§6Lifesteal",
        type: TagMapping,
        rarity: "Legendary",
        min: 6,
        max: 9,
        scoreboardTracker: "lifesteal",
        measure: "%"
    },
    LIFESTEAL_MYTHIC: {
        name: "§cLifesteal",
        type: TagMapping,
        rarity: "Mythic",
        min: 8,
        max: 12,
        scoreboardTracker: "lifesteal",
        measure: "%"
    }

};



export const skills = {
    // Sword Skills
    FLAME_BURST: {
        name: "§cFlame Burst",
        type: "sword",
        rarity: "Epic",
        min: 3,
        max: 5,
        description: "creates a ring of fire around you dealing §x{x} damage",
        cooldown: 150,
        scoreboard: "flameburst"
    },
    LIGHTNING_CALL: {
        name: "§eLightning Call",
        type: "sword",
        rarity: "Legendary",
        min: 4,
        max: 7,
        description: "strikes the ground with chain lightning dealing §x{x} damage",
        cooldown: 200,
        scoreboard: "lightningcall"
    },
    VOID_SLASH: {
        name: "§5Void Slash",
        type: "sword",
        rarity: "Mythic",
        min: 5,
        max: 8,
        description: "launches a piercing projectile dealing §x{x} damage",
        cooldown: 180,
        scoreboard: "voidslash"
    },
    SPIRIT_BLADE: {
        name: "§dSpirit Blade",
        type: "sword",
        rarity: "Epic",
        min: 2,
        max: 4,
        description: "next §x{x} attacks phase through armor",
        cooldown: 160,
        scoreboard: "spiritblade"
    },
    TIME_SLOW: {
        name: "§bTime Slow",
        type: "sword",
        rarity: "Legendary",
        min: 3,
        max: 5,
        description: "slows all enemies for §x{x} seconds",
        cooldown: 220,
        scoreboard: "timeslow"
    },

    // Pickaxe Skills
    EARTHQUAKE: {
        name: "§6Earthquake",
        type: "pickaxe",
        rarity: "Epic",
        min: 4,
        max: 6,
        description: "damages ground enemies dealing §x{x} damage",
        cooldown: 180,
        scoreboard: "earthquake"
    },
    CRYSTAL_SPIKES: {
        name: "§bCrystal Spikes",
        type: "pickaxe",
        rarity: "Rare",
        min: 3,
        max: 5,
        description: "summons spikes in a line dealing §x{x} damage",
        cooldown: 140,
        scoreboard: "crystalspikes"
    },
    MOLTEN_CORE: {
        name: "§cMolten Core",
        type: "pickaxe",
        rarity: "Legendary",
        min: 4,
        max: 6,
        description: "adds fire damage for §x{x} seconds",
        cooldown: 200,
        scoreboard: "moltencore"
    },
    GRAVITY_WELL: {
        name: "§5Gravity Well",
        type: "pickaxe",
        rarity: "Epic",
        min: 3,
        max: 5,
        description: "pulls enemies for §x{x} seconds",
        cooldown: 160,
        scoreboard: "gravitywell"
    },
    MAGMA_ERUPTION: {
        name: "§cMagma Eruption",
        type: "pickaxe",
        rarity: "Mythic",
        min: 5,
        max: 8,
        description: "creates lava geysers dealing §x{x} damage",
        cooldown: 250,
        scoreboard: "magmaeruption"
    },

    // Axe Skills
    WHIRLWIND_THROW: {
        name: "§aWhirlwind Throw",
        type: "axe",
        rarity: "Epic",
        min: 3,
        max: 5,
        description: "throws axe in boomerang pattern dealing §x{x} damage",
        cooldown: 170,
        scoreboard: "whirlwindthrow"
    },
    ROOT_ENTANGLE: {
        name: "§2Root Entangle",
        type: "axe",
        rarity: "Rare",
        min: 2,
        max: 4,
        description: "holds enemies in place for §x{x} seconds",
        cooldown: 150,
        scoreboard: "rootentangle"
    },
    BERSERK_MODE: {
        name: "§4Berserk Mode",
        type: "axe",
        rarity: "Legendary",
        min: 4,
        max: 6,
        description: "increases attack speed for §x{x} seconds",
        cooldown: 200,
        scoreboard: "berserkmode"
    },
    WINDSTORM: {
        name: "§fWindstorm",
        type: "axe",
        rarity: "Epic",
        min: 3,
        max: 5,
        description: "creates tornado dealing §x{x} damage",
        cooldown: 180,
        scoreboard: "windstorm"
    },
    BARK_ARMOR: {
        name: "§2Bark Armor",
        type: "axe",
        rarity: "Rare",
        min: 3,
        max: 5,
        description: "absorbs §x{x} damage for 10 seconds",
        cooldown: 160,
        scoreboard: "barkarmor"
    },

    // Shovel Skills
    DUST_DEVIL: {
        name: "§eDust Devil",
        type: "shovel",
        rarity: "Epic",
        min: 2,
        max: 4,
        description: "creates following tornado dealing §x{x} damage",
        cooldown: 150,
        scoreboard: "dustdevil"
    },
    TREMOR: {
        name: "§6Tremor",
        type: "shovel",
        rarity: "Rare",
        min: 3,
        max: 5,
        description: "sends shockwaves dealing §x{x} damage",
        cooldown: 140,
        scoreboard: "tremor"
    },
    AVALANCHE: {
        name: "§7Avalanche",
        type: "shovel",
        rarity: "Legendary",
        min: 4,
        max: 7,
        description: "drops rocks from above dealing §x{x} damage",
        cooldown: 200,
        scoreboard: "avalanche"
    },
    SAND_MIRAGE: {
        name: "§eSand Mirage",
        type: "shovel",
        rarity: "Epic",
        min: 2,
        max: 3,
        description: "creates §x{x} false duplicates",
        cooldown: 180,
        scoreboard: "sandmirage"
    },
    DUST_STORM: {
        name: "§6Dust Storm",
        type: "shovel",
        rarity: "Rare",
        min: 2,
        max: 4,
        description: "reduces visibility for §x{x} seconds",
        cooldown: 160,
        scoreboard: "duststorm"
    },

    // Hoe Skills
    SEED_BARRAGE: {
        name: "§2Seed Barrage",
        type: "hoe",
        rarity: "Epic",
        min: 3,
        max: 5,
        description: "fires §x{x} explosive seeds",
        cooldown: 140,
        scoreboard: "seedbarrage"
    },
    BLOOM_FIELD: {
        name: "§dBloom Field",
        type: "hoe",
        rarity: "Rare",
        min: 2,
        max: 4,
        description: "creates flowers providing buffs for §x{x} seconds",
        cooldown: 180,
        scoreboard: "bloomfield"
    },
    POISON_SPORES: {
        name: "§aPoison Spores",
        type: "hoe",
        rarity: "Epic",
        min: 3,
        max: 5,
        description: "releases toxic clouds lasting §x{x} seconds",
        cooldown: 160,
        scoreboard: "poisonspores"
    },
    MUSHROOM_CIRCLE: {
        name: "§cMushroom Circle",
        type: "hoe",
        rarity: "Legendary",
        min: 4,
        max: 6,
        description: "summons §x{x} explosive mushrooms",
        cooldown: 200,
        scoreboard: "mushroomcircle"
    },
    FERTILE_GROUND: {
        name: "§2Fertile Ground",
        type: "hoe",
        rarity: "Rare",
        min: 1,
        max: 2,
        description: "creates healing area for §x{x} hearts/second",
        cooldown: 180,
        scoreboard: "fertileground"
    },

    // Helmet Skills
    SONIC_SCREAM: {
        name: "§fSonic Scream",
        type: "helmet",
        rarity: "Epic",
        min: 3,
        max: 5,
        description: "pushes enemies away dealing §x{x} damage",
        cooldown: 160,
        scoreboard: "sonicscream"
    },
    PHANTOM_SIGHT: {
        name: "§5Phantom Sight",
        type: "helmet",
        rarity: "Legendary",
        min: 5,
        max: 8,
        description: "see invisible enemies for §x{x} seconds",
        cooldown: 200,
        scoreboard: "phantomsight"
    },
    PRISM_VISION: {
        name: "§bPrism Vision",
        type: "helmet",
        rarity: "Epic",
        min: 3,
        max: 5,
        description: "see weak points for §x{x} seconds",
        cooldown: 180,
        scoreboard: "prismvision"
    },
    TELEPATHY: {
        name: "§dTelepathy",
        type: "helmet",
        rarity: "Rare",
        min: 2,
        max: 4,
        description: "predict attacks for §x{x} seconds",
        cooldown: 150,
        scoreboard: "telepathy"
    },
    NIGHTMARE: {
        name: "§4Nightmare",
        type: "helmet",
        rarity: "Legendary",
        min: 3,
        max: 5,
        description: "cause fear for §x{x} seconds",
        cooldown: 220,
        scoreboard: "nightmare"
    },

    // Chestplate Skills
    IRON_FORTRESS: {
        name: "§7Iron Fortress",
        type: "chestplate",
        rarity: "Epic",
        min: 3,
        max: 5,
        description: "become immobile but invulnerable for §x{x} seconds",
        cooldown: 250,
        scoreboard: "ironfortress"
    },
    REFLECT_AURA: {
        name: "§eReflect Aura",
        type: "chestplate",
        rarity: "Rare",
        min: 2,
        max: 4,
        description: "reflect §x{x} damage back to attackers",
        cooldown: 180,
        scoreboard: "reflectaura"
    },
    HEALING_BURST: {
        name: "§aHealing Burst",
        type: "chestplate",
        rarity: "Epic",
        min: 3,
        max: 5,
        description: "heal nearby allies for §x{x} hearts",
        cooldown: 200,
        scoreboard: "healingburst"
    },
    MAGNETIC_FIELD: {
        name: "§9Magnetic Field",
        type: "chestplate",
        rarity: "Legendary",
        min: 4,
        max: 6,
        description: "pull items and deflect projectiles for §x{x} seconds",
        cooldown: 180,
        scoreboard: "magneticfield"
    },
    SOUL_SHIELD: {
        name: "§5Soul Shield",
        type: "chestplate",
        rarity: "Mythic",
        min: 3,
        max: 5,
        description: "absorb next §x{x} attacks completely",
        cooldown: 300,
        scoreboard: "soulshield"
    },

    // Leggings Skills
    SPEED_BOOST: {
        name: "§fSpeed Boost",
        type: "leggings",
        rarity: "Rare",
        min: 5,
        max: 8,
        description: "increases movement speed for §x{x} seconds",
        cooldown: 160,
        scoreboard: "speedboost"
    },
    PHASE_WALK: {
        name: "§5Phase Walk",
        type: "leggings",
        rarity: "Epic",
        min: 3,
        max: 5,
        description: "walk through walls for §x{x} seconds",
        cooldown: 200,
        scoreboard: "phasewalk"
    },
    DOUBLE_JUMP: {
        name: "§bDouble Jump",
        type: "leggings",
        rarity: "Rare",
        min: 8,
        max: 12,
        description: "allows double jump for §x{x} seconds",
        cooldown: 150,
        scoreboard: "doublejump"
    },
    WALL_CLIMB: {
        name: "§2Wall Climb",
        type: "leggings",
        rarity: "Epic",
        min: 10,
        max: 15,
        description: "climb any surface for §x{x} seconds",
        cooldown: 180,
        scoreboard: "wallclimb"
    },
    DIMENSION_STEP: {
        name: "§5Dimension Step",
        type: "leggings",
        rarity: "Legendary",
        min: 15,
        max: 25,
        description: "teleport to visible location within §x{x} blocks",
        cooldown: 200,
        scoreboard: "dimensionstep"
    },

    // Boots Skills
    LAVA_WALK: {
        name: "§cLava Walk",
        type: "boots",
        rarity: "Epic",
        min: 8,
        max: 12,
        description: "walk on lava for §x{x} seconds",
        cooldown: 200,
        scoreboard: "lavawalk"
    },
    STEALTH_STEP: {
        name: "§8Stealth Step",
        type: "boots",
        rarity: "Rare",
        min: 5,
        max: 8,
        description: "become invisible for §x{x} seconds",
        cooldown: 180,
        scoreboard: "stealthstep"
    },
    HARVEST_MOON: {
        name: "§eHarvest Moon",
        type: "boots",
        rarity: "Legendary",
        min: 2,
        max: 4,
        description: "heal §x{x} hearts based on nearby vegetation",
        cooldown: 160,
        scoreboard: "harvestmoon"
    },
    SKY_STEP: {
        name: "§bSky Step",
        type: "boots",
        rarity: "Epic",
        min: 5,
        max: 8,
        description: "create air platforms for §x{x} seconds",
        cooldown: 180,
        scoreboard: "skystep"
    },
    FEATHER_FALL: {
        name: "§fFeather Fall",
        type: "boots",
        rarity: "Rare",
        min: 10,
        max: 15,
        description: "no fall damage for §x{x} seconds",
        cooldown: 140,
        scoreboard: "featherfall"
    }
};

export const passives = {
    // Sword Passives
    FROST_STRIKE: {
        name: "§bFrost Strike",
        type: "sword",
        rarity: "Rare",
        min: 1,
        max: 3,
        description: "slow enemy for §x{x} seconds on hit",
        cooldown: 30,
        scoreboard: "froststrike"
    },
    EMBER_SLASH: {
        name: "§6Ember Slash",
        type: "sword",
        rarity: "Common",
        min: 1,
        max: 2,
        description: "ignite enemies for §x{x} seconds",
        cooldown: 20,
        scoreboard: "emberslash"
    },
    LIGHTNING_EDGE: {
        name: "§eLightning Edge",
        type: "sword",
        rarity: "Epic",
        min: 2,
        max: 4,
        description: "summon lightning dealing §x{x} damage",
        cooldown: 50,
        scoreboard: "lightningedge"
    },
    WINDCUTTER: {
        name: "§fWindcutter",
        type: "sword",
        rarity: "Rare",
        min: 1,
        max: 2,
        description: "push enemies back §x{x} blocks",
        cooldown: 25,
        scoreboard: "windcutter"
    },
    POISON_BLADE: {
        name: "§aPoison Blade",
        type: "sword",
        rarity: "Rare",
        min: 3,
        max: 5,
        description: "apply poison for §x{x} seconds",
        cooldown: 40,
        scoreboard: "poisonblade"
    },
    WEAKNESS_WAVE: {
        name: "§8Weakness Wave",
        type: "sword",
        rarity: "Common",
        min: 2,
        max: 4,
        description: "reduce enemy damage for §x{x} seconds",
        cooldown: 35,
        scoreboard: "weaknesswave"
    },
    BLINDNESS_STRIKE: {
        name: "§0Blindness Strike",
        type: "sword",
        rarity: "Epic",
        min: 2,
        max: 4,
        description: "blind players for §x{x} seconds",
        cooldown: 60,
        scoreboard: "blindnessstrike"
    },
    SLOWNESS_SWEEP: {
        name: "§7Slowness Sweep",
        type: "sword",
        rarity: "Rare",
        min: 2,
        max: 4,
        description: "slow nearby enemies for §x{x} seconds",
        cooldown: 45,
        scoreboard: "slownesssweep"
    },
    LIFESTEAL: {
        name: "§cLifesteal",
        type: "sword",
        rarity: "Epic",
        min: 1,
        max: 2,
        description: "heal §x{x} hearts on damage",
        cooldown: 30,
        scoreboard: "lifesteal"
    },
    DASH_STRIKE: {
        name: "§bDash Strike",
        type: "sword",
        rarity: "Rare",
        min: 2,
        max: 4,
        description: "teleport forward §x{x} blocks while attacking",
        cooldown: 40,
        scoreboard: "dashstrike"
    },
    LEAP_ATTACK: {
        name: "§aLeap Attack",
        type: "sword",
        rarity: "Common",
        min: 1,
        max: 2,
        description: "jump higher and deal §x{x} extra damage",
        cooldown: 25,
        scoreboard: "leapattack"
    },
    PHANTOM_STEP: {
        name: "§5Phantom Step",
        type: "sword",
        rarity: "Epic",
        min: 1,
        max: 2,
        description: "become translucent for §x{x} seconds",
        cooldown: 50,
        scoreboard: "phantomstep"
    },
    PIERCING_THRUST: {
        name: "§ePiercing Thrust",
        type: "sword",
        rarity: "Rare",
        min: 2,
        max: 3,
        description: "attack pierces through §x{x} enemies",
        cooldown: 35,
        scoreboard: "piercingthrust"
    },
    HEX_BLADE: {
        name: "§5Hex Blade",
        type: "sword",
        rarity: "Epic",
        min: 20,
        max: 40,
        description: "mark enemies for §x{x}% extra damage",
        cooldown: 40,
        scoreboard: "hexblade"
    },
    SOUL_BURN: {
        name: "§4Soul Burn",
        type: "sword",
        rarity: "Legendary",
        min: 1,
        max: 2,
        description: "deal §x{x} armor-piercing damage over time",
        cooldown: 50,
        scoreboard: "soulburn"
    },
    CHAOS_BLADE: {
        name: "§cChaos Blade",
        type: "sword",
        rarity: "Mythic",
        min: 1,
        max: 3,
        description: "random effect with §x{x} intensity",
        cooldown: 30,
        scoreboard: "chaosblade"
    },
    THORNWHIP: {
        name: "§2Thornwhip",
        type: "sword",
        rarity: "Rare",
        min: 2,
        max: 4,
        description: "summon thorns slowing enemies for §x{x} seconds",
        cooldown: 45,
        scoreboard: "thornwhip"
    },
    SANDSTORM: {
        name: "§eSandstorm",
        type: "sword",
        rarity: "Epic",
        min: 3,
        max: 5,
        description: "create dust cloud for §x{x} seconds",
        cooldown: 60,
        scoreboard: "sandstorm"
    },
    STARFALL: {
        name: "§fStarfall",
        type: "sword",
        rarity: "Legendary",
        min: 2,
        max: 4,
        description: "call down §x{x} star projectiles",
        cooldown: 70,
        scoreboard: "starfall"
    },
    ECHO_STRIKE: {
        name: "§9Echo Strike",
        type: "sword",
        rarity: "Epic",
        min: 1,
        max: 2,
        description: "delayed attack after §x{x} seconds",
        cooldown: 40,
        scoreboard: "echostrike"
    },

    // Tool Passives
    MOLTEN_TOUCH: {
        name: "§cMolten Touch",
        type: "pickaxe",
        rarity: "Rare",
        min: 1,
        max: 2,
        description: "smelts mined blocks §x{x}% of the time",
        cooldown: 0,
        scoreboard: "moltentouch"
    },
    FORTUNE_SURGE: {
        name: "§6Fortune Surge",
        type: "pickaxe",
        rarity: "Epic",
        min: 10,
        max: 25,
        description: "§x{x}% chance for double drops",
        cooldown: 0,
        scoreboard: "fortunesurge"
    },
    TIMBER_RAGE: {
        name: "§2Timber Rage",
        type: "axe",
        rarity: "Rare",
        min: 15,
        max: 30,
        description: "§x{x}% chance to cut entire tree",
        cooldown: 0,
        scoreboard: "timberrage"
    },
    HARVEST_BLESSING: {
        name: "§aHarvest Blessing",
        type: "hoe",
        rarity: "Common",
        min: 10,
        max: 20,
        description: "§x{x}% chance for bonus crops",
        cooldown: 0,
        scoreboard: "harvestblessing"
    },
    SPEED_DIGGER: {
        name: "§eSpeedy Digger",
        type: "shovel",
        rarity: "Rare",
        min: 15,
        max: 25,
        description: "§x{x}% faster digging speed",
        cooldown: 0,
        scoreboard: "speeddigger"
    },

    // Armor Passives
    FIRE_RESISTANCE: {
        name: "§cFire Resistance",
        type: ["helmet", "chestplate", "leggings", "boots"],
        rarity: "Rare",
        min: 10,
        max: 25,
        description: "§x{x}% fire damage reduction",
        cooldown: 0,
        scoreboard: "fireresistance"
    },
    WATER_BREATHING: {
        name: "§9Water Breathing",
        type: "helmet",
        rarity: "Epic",
        min: 5,
        max: 10,
        description: "breathe underwater for §x{x} extra seconds",
        cooldown: 0,
        scoreboard: "waterbreathing"
    },
    NIGHT_VISION: {
        name: "§eNight Vision",
        type: "helmet",
        rarity: "Rare",
        min: 1,
        max: 1,
        description: "see clearly in darkness",
        cooldown: 0,
        scoreboard: "nightvision"
    },
    THORNS_AURA: {
        name: "§2Thorns Aura",
        type: "chestplate",
        rarity: "Epic",
        min: 1,
        max: 3,
        description: "reflect §x{x} damage to attackers",
        cooldown: 0,
        scoreboard: "thornsaura"
    },
    SWIFT_FEET: {
        name: "§fSwift Feet",
        type: "boots",
        rarity: "Common",
        min: 10,
        max: 20,
        description: "§x{x}% movement speed increase",
        cooldown: 0,
        scoreboard: "swiftfeet"
    },
    FEATHER_WEIGHT: {
        name: "§fFeather Weight",
        type: "boots",
        rarity: "Rare",
        min: 25,
        max: 50,
        description: "§x{x}% fall damage reduction",
        cooldown: 0,
        scoreboard: "featherweight"
    },
    MANA_SHIELD: {
        name: "§5Mana Shield",
        type: "chestplate",
        rarity: "Legendary",
        min: 10,
        max: 20,
        description: "§x{x}% damage absorbed by mana",
        cooldown: 0,
        scoreboard: "manashield"
    },
    HEALTH_BOOST: {
        name: "§cHealth Boost",
        type: ["helmet", "chestplate", "leggings", "boots"],
        rarity: "Epic",
        min: 1,
        max: 3,
        description: "§x{x} extra max hearts",
        cooldown: 0,
        scoreboard: "healthboost"
    },
    DODGE_CHANCE: {
        name: "§bDodge Chance",
        type: "leggings",
        rarity: "Epic",
        min: 5,
        max: 15,
        description: "§x{x}% chance to avoid damage",
        cooldown: 0,
        scoreboard: "dodgechance"
    },
    ARMOR_PIERCE: {
        name: "§7Armor Pierce",
        type: "sword",
        rarity: "Rare",
        min: 10,
        max: 25,
        description: "ignore §x{x}% of enemy armor",
        cooldown: 0,
        scoreboard: "armorpierce"
    }
};