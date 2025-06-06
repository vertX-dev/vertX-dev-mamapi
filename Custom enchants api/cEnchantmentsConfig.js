// All tags of items
export const itemTagMapping = {
    "sai": ["weapon", "sai", "light", "short"],
    "nunchaku": ["weapon", "nunchaku", "light", "short"],
    "dagger": ["weapon", "dagger", "light", "short"],
    "rapier": ["weapon", "rapier", "light", "long"],
    "kama": ["weapon", "kama", "normal", "short"],
    "katana": ["weapon", "katana", "normal", "long"],
    "gladius": ["weapon", "gladius", "normal", "short"],
    "sword": ["weapon", "sword", "normal", "medium"],
    "cutlass": ["weapon", "cutlass", "normal", "medium"],
    "machete": ["weapon", "machete", "normal", "medium"],
    "scimitar": ["weapon", "scimitar", "light", "short"],
    "broadsword": ["weapon", "broadsword", "heavy", "medium"],
    "longsword": ["weapon", "longsword", "heavy", "long"],
    "staff": ["weapon", "staff", "blunt", "long"],
    "morningstar": ["weapon", "morningstar", "heavy", "medium"],
    "mace": ["weapon", "mace", "blunt"],
    "khopesh": ["weapon", "khopesh", "normal", "short"],
    "cleaver": ["weapon", "cleaver", "normal", "heavy", "short"],
    "lance": ["weapon", "lance", "polearm", "long"],
    "claymore": ["weapon", "claymore", "heavy", "long"],
    "hammer": ["weapon", "hammer", "heavy", "blunt"],
    "battleaxe": ["weapon", "battleaxe", "medium"],
    "greatsword": ["weapon", "greatsword", "heavy", "long"],
    "trident": ["weapon", "trident", "polearm"],
    "bow": ["ranged", "bow"],
    "crossbow": ["ranged", "crossbow"],
    "helmet": ["armor", "helmet"],
    "chestplate": ["armor", "chestplate"],
    "leggings": ["armor", "leggings"],
    "boots": ["armor", "boots"],
    "axe": ["tool", "axe"],
    "pickaxe": ["tool", "pickaxe"],
    "hoe": ["tool", "hoe"],
    "shovel": ["tool", "shovel"],
    "elytra": ["elytra"],
    "gun": ["ranged", "gun"],
    "veapi:book": ["all", "pickaxe", "hoe", "shovel", "armor", "axe", "battleaxe", "gun", "blunt", "book", "boots", "bow", "broadsword", "chestplate", "cleaver", "claymore", "crossbow", "cutlass", "dagger", "elytra", "gladius", "greatsword", "hammer", "heavy", "helmet", "kama", "katana", "khopesh", "leggings", "lance", "light", "longsword", "mace", "machete", "medium", "morningstar", "nunchaku", "normal", "polearm", "rapier", "ranged", "scimitar", "sai", "short", "staff", "sword", "tool", "trident", "weapon"]
}; // you need to add custom book with enabled left hand for book enchantments (using normal book give like 5 isues)


// All tags of structures
export const structureData = {
    // ── Village ──
    "village_blacksmith": {
        tags: ["overworld", "village"],
        maxEnchantmentLvl: 2,
        maxEnchantments: 2,
        chanceToRoll: 0.1
    },
    "village_two_room_house": {
        tags: ["overworld", "village"],
        maxEnchantmentLvl: 2,
        maxEnchantments: 2,
        chanceToRoll: 0.1
    },
    "spawn_bonus_chest": {
        tags: ["overworld", "village"],
        maxEnchantmentLvl: 2,
        maxEnchantments: 2,
        chanceToRoll: 0.1
    },

    // ── Stronghold ──
    "stronghold_library": {
        tags: ["overworld", "underground", "stronghold"],
        maxEnchantmentLvl: 3,
        maxEnchantments: 3,
        chanceToRoll: 0.9
    },
    "stronghold_corridor": {
        tags: ["overworld", "underground", "stronghold"],
        maxEnchantmentLvl: 3,
        maxEnchantments: 3,
        chanceToRoll: 0.9
    },
    "stronghold_crossing": {
        tags: ["overworld", "underground", "stronghold"],
        maxEnchantmentLvl: 3,
        maxEnchantments: 3,
        chanceToRoll: 0.9
    },
    "monster_room": {
        tags: ["overworld", "underground", "stronghold"],
        maxEnchantmentLvl: 3,
        maxEnchantments: 3,
        chanceToRoll: 0.9
    },

    // ── Mineshaft ──
    "abandoned_mineshaft": {
        tags: ["overworld", "underground", "mineshaft"],
        maxEnchantmentLvl: 2,
        maxEnchantments: 3,
        chanceToRoll: 0.7
    },
    "dispenser_trap": {
        tags: ["overworld", "underground", "mineshaft"],
        maxEnchantmentLvl: 2,
        maxEnchantments: 3,
        chanceToRoll: 0.7
    },

    // ── Desert Pyramid ──
    "desert_pyramid": {
        tags: ["overworld", "desert", "pyramid"],
        maxEnchantmentLvl: 2,
        maxEnchantments: 2,
        chanceToRoll: 0.8
    },

    // ── Jungle Pyramid ──
    "jungle_temple": {
        tags: ["overworld", "jungle", "pyramid"],
        maxEnchantmentLvl: 2,
        maxEnchantments: 2,
        chanceToRoll: 0.8
    },

    // ── Igloo ──
    "igloo_chest": {
        tags: ["overworld", "snow", "igloo"],
        maxEnchantmentLvl: 1,
        maxEnchantments: 1,
        chanceToRoll: 0.05
    },

    // ── Swamp Hut ──
    "swamp_hut": {
        tags: ["overworld", "swamp", "hut"],
        maxEnchantmentLvl: 1,
        maxEnchantments: 1,
        chanceToRoll: 0.9
    },

    // ── Woodland Mansion ──
    "woodland_mansion": {
        tags: ["overworld", "forest", "mansion"],
        maxEnchantmentLvl: 4,
        maxEnchantments: 4,
        chanceToRoll: 0.8
    },

    // ── Ocean Ruins ──
    "underwater_ruin_small": {
        tags: ["overworld", "ocean", "ruin"],
        maxEnchantmentLvl: 2,
        maxEnchantments: 2,
        chanceToRoll: 0.9
    },
    "underwater_ruin_big": {
        tags: ["overworld", "ocean", "ruin"],
        maxEnchantmentLvl: 2,
        maxEnchantments: 2,
        chanceToRoll: 0.9
    },

    // ── Shipwrecks ──
    "shipwreck": {
        tags: ["overworld", "ocean", "shipwreck"],
        maxEnchantmentLvl: 2,
        maxEnchantments: 2,
        chanceToRoll: 0.9
    },
    "shipwrecksupply": {
        tags: ["overworld", "ocean", "shipwreck"],
        maxEnchantmentLvl: 2,
        maxEnchantments: 2,
        chanceToRoll: 0.9
    },
    "shipwrecktreasure": {
        tags: ["overworld", "ocean", "shipwreck"],
        maxEnchantmentLvl: 2,
        maxEnchantments: 2,
        chanceToRoll: 0.9
    },

    // ── Buried Treasure ──
    "buriedtreasure": {
        tags: ["overworld", "beach", "treasure"],
        maxEnchantmentLvl: 3,
        maxEnchantments: 3,
        chanceToRoll: 0.9
    },

    // ── Ruined Portal ──
    "ruined_portal": {
        tags: ["overworld", "end", "nether", "portal"],
        maxEnchantmentLvl: 3,
        maxEnchantments: 3,
        chanceToRoll: 0.3
    },

    // ── Pillager Outpost ──
    "pillager_outpost": {
        tags: ["overworld", "plains", "outpost"],
        maxEnchantmentLvl: 1,
        maxEnchantments: 2,
        chanceToRoll: 0.1
    },

    // ── Nether Fortress ──
    "nether_bridge": {
        tags: ["nether", "fortress"],
        maxEnchantmentLvl: 3,
        maxEnchantments: 4,
        chanceToRoll: 0.6
    },

    // ── Bastion Remnant ──
    "bastion_treasure": {
        tags: ["nether", "bastion"],
        maxEnchantmentLvl: 4,
        maxEnchantments: 4,
        chanceToRoll: 0.7
    },
    "bastion_bridge": {
        tags: ["nether", "bastion"],
        maxEnchantmentLvl: 4,
        maxEnchantments: 4,
        chanceToRoll: 0.7
    },
    "bastion_hoglin_stable": {
        tags: ["nether", "bastion"],
        maxEnchantmentLvl: 4,
        maxEnchantments: 4,
        chanceToRoll: 0.7
    },
    "bastion_other": {
        tags: ["nether", "bastion"],
        maxEnchantmentLvl: 4,
        maxEnchantments: 4,
        chanceToRoll: 0.7
    },

    // ── End City ──
    "end_city_treasure": {
        tags: ["end", "city"],
        maxEnchantmentLvl: 4,
        maxEnchantments: 4,
        chanceToRoll: 0.9
    },

    // ── Ancient City ──
    "ancient_city": {
        tags: ["overworld", "underground", "deep_dark", "ancient"],
        maxEnchantmentLvl: 4,
        maxEnchantments: 4,
        chanceToRoll: 0.7
    },

    // ── Simple Dungeon ──
    "simple_dungeon": {
        tags: ["overworld", "underground", "dungeon"],
        maxEnchantmentLvl: 2,
        maxEnchantments: 2,
        chanceToRoll: 0.5
    }
};
