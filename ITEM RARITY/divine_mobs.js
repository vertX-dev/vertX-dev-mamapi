export const DIVINE_TIER_DROPS = [{
        id: 1,
        min: 1,
        max: 1,
        chance: 10,
        xpMin: 1,
        xpMax: 3
    },
    {
        id: 2,
        min: 1,
        max: 2,
        chance: 10,
        xpMin: 2,
        xpMax: 4
    },
    {
        id: 3,
        min: 1,
        max: 2,
        chance: 10,
        xpMin: 3,
        xpMax: 6
    },
    {
        id: 4,
        min: 1,
        max: 2,
        chance: 10,
        xpMin: 4,
        xpMax: 7
    },
    {
        id: 5,
        min: 1,
        max: 3,
        chance: 10,
        xpMin: 5,
        xpMax: 8
    },
    {
        id: 6,
        min: 1,
        max: 3,
        chance: 10,
        xpMin: 6,
        xpMax: 10
    },
    {
        id: 7,
        min: 2,
        max: 3,
        chance: 10,
        xpMin: 7,
        xpMax: 11
    },
    {
        id: 8,
        min: 2,
        max: 4,
        chance: 10,
        xpMin: 8,
        xpMax: 12
    },
    {
        id: 9,
        min: 2,
        max: 4,
        chance: 10,
        xpMin: 9,
        xpMax: 14
    },
    {
        id: 10,
        min: 3,
        max: 5,
        chance: 10,
        xpMin: 10,
        xpMax: 15
    },

    {
        id: 11,
        min: 3,
        max: 5,
        chance: 10,
        xpMin: 12,
        xpMax: 17
    },
    {
        id: 12,
        min: 3,
        max: 6,
        chance: 10,
        xpMin: 13,
        xpMax: 18
    },
    {
        id: 13,
        min: 4,
        max: 6,
        chance: 10,
        xpMin: 14,
        xpMax: 20
    },
    {
        id: 14,
        min: 4,
        max: 6,
        chance: 10,
        xpMin: 15,
        xpMax: 21
    },
    {
        id: 15,
        min: 4,
        max: 7,
        chance: 10,
        xpMin: 16,
        xpMax: 23
    },
    {
        id: 16,
        min: 5,
        max: 7,
        chance: 10,
        xpMin: 17,
        xpMax: 24
    },
    {
        id: 17,
        min: 5,
        max: 8,
        chance: 10,
        xpMin: 18,
        xpMax: 26
    },
    {
        id: 18,
        min: 5,
        max: 8,
        chance: 10,
        xpMin: 19,
        xpMax: 27
    },
    {
        id: 19,
        min: 6,
        max: 9,
        chance: 10,
        xpMin: 20,
        xpMax: 29
    },
    {
        id: 20,
        min: 6,
        max: 9,
        chance: 10,
        xpMin: 21,
        xpMax: 30
    },

    {
        id: 21,
        min: 6,
        max: 10,
        chance: 10,
        xpMin: 22,
        xpMax: 32
    },
    {
        id: 22,
        min: 7,
        max: 10,
        chance: 10,
        xpMin: 23,
        xpMax: 33
    },
    {
        id: 23,
        min: 7,
        max: 11,
        chance: 10,
        xpMin: 24,
        xpMax: 35
    },
    {
        id: 24,
        min: 8,
        max: 11,
        chance: 10,
        xpMin: 25,
        xpMax: 36
    },
    {
        id: 25,
        min: 8,
        max: 12,
        chance: 10,
        xpMin: 26,
        xpMax: 38
    }
];

export const EQUIPMENT_POWER = {
    "leather_helmet": 2,
    "leather_chestplate": 3,
    "leather_leggings": 2,
    "leather_boots": 1,
    "copper_helmet": 4,
    "copper_chestplate": 6,
    "copper_leggings": 5,
    "copper_boots": 3,
    "golden_helmet": 5,
    "golden_chestplate": 7,
    "golden_leggings": 6,
    "golden_boots": 4,
    "iron_helmet": 6,
    "iron_chestplate": 10,
    "iron_leggings": 8,
    "iron_boots": 5,
    "diamond_helmet": 7,
    "diamond_chestplate": 12,
    "diamond_leggings": 9,
    "diamond_boots": 6,
    "netherite_helmet": 9,
    "netherite_chestplate": 15,
    "netherite_leggings": 12,
    "netherite_boots": 7,
    "wooden_sword": 4,
    "stone_sword": 6,
    "copper_sword": 7,
    "golden_sword": 8,
    "iron_sword": 10,
    "diamond_sword": 12,
    "netherite_sword": 15,
    "wooden_axe": 5,
    "stone_axe": 7,
    "copper_axe": 8,
    "golden_axe": 9,
    "iron_axe": 12,
    "diamond_axe": 14,
    "netherite_axe": 18,
    "bow": 11,
    "crossbow": 12
};

export const EFFECTS = {
    "speed": {
        "powerPerLevel": 10,
        "maxLevel": 2
    },
    "strength": {
        "powerPerLevel": 10,
        "maxLevel": 7
    },
    "resistance": {
        "powerPerLevel": 75,
        "maxLevel": 4
    },
    "fire_resistance": {
        "powerPerLevel": 20,
        "maxLevel": 1
    },
    "health_boost": {
        "powerPerLevel": 3,
        "maxLevel": 120
    }
};

export const MOB_LEVELS = [{
    "level": 1,
    "head": ["leather_helmet", "copper_helmet", "iron_helmet"],
    "chest": ["leather_chestplate", "copper_chestplate", "iron_chestplate"],
    "legs": ["leather_leggings", "copper_leggings", "iron_leggings"],
    "feet": ["leather_boots", "copper_boots", "iron_boots"],
    "mainhand": ["wooden_sword", "stone_sword", "copper_sword", "golden_sword", "iron_sword", "bow"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 15,
    "maxPowerLevel": 20
}, {
    "level": 2,
    "head": ["leather_helmet", "copper_helmet", "iron_helmet"],
    "chest": ["leather_chestplate", "copper_chestplate", "iron_chestplate"],
    "legs": ["leather_leggings", "copper_leggings", "iron_leggings"],
    "feet": ["leather_boots", "copper_boots", "iron_boots"],
    "mainhand": ["wooden_sword", "stone_sword", "copper_sword", "golden_sword", "iron_sword", "bow"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 30,
    "maxPowerLevel": 40
}, {
    "level": 3,
    "head": ["leather_helmet", "copper_helmet", "iron_helmet"],
    "chest": ["leather_chestplate", "copper_chestplate", "iron_chestplate"],
    "legs": ["leather_leggings", "copper_leggings", "iron_leggings"],
    "feet": ["leather_boots", "copper_boots", "iron_boots"],
    "mainhand": ["wooden_sword", "stone_sword", "copper_sword", "golden_sword", "iron_sword", "bow"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 45,
    "maxPowerLevel": 60
}, {
    "level": 4,
    "head": ["leather_helmet", "copper_helmet", "iron_helmet"],
    "chest": ["leather_chestplate", "copper_chestplate", "iron_chestplate"],
    "legs": ["leather_leggings", "copper_leggings", "iron_leggings"],
    "feet": ["leather_boots", "copper_boots", "iron_boots"],
    "mainhand": ["wooden_sword", "stone_sword", "copper_sword", "golden_sword", "iron_sword", "bow"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 60,
    "maxPowerLevel": 80
}, {
    "level": 5,
    "head": ["leather_helmet", "copper_helmet", "iron_helmet"],
    "chest": ["leather_chestplate", "copper_chestplate", "iron_chestplate"],
    "legs": ["leather_leggings", "copper_leggings", "iron_leggings"],
    "feet": ["leather_boots", "copper_boots", "iron_boots"],
    "mainhand": ["wooden_sword", "stone_sword", "copper_sword", "golden_sword", "iron_sword", "bow"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 75,
    "maxPowerLevel": 100
}, {
    "level": 6,
    "head": ["leather_helmet", "copper_helmet", "iron_helmet"],
    "chest": ["leather_chestplate", "copper_chestplate", "iron_chestplate"],
    "legs": ["leather_leggings", "copper_leggings", "iron_leggings"],
    "feet": ["leather_boots", "copper_boots", "iron_boots"],
    "mainhand": ["wooden_sword", "stone_sword", "copper_sword", "golden_sword", "iron_sword", "bow"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 90,
    "maxPowerLevel": 120
}, {
    "level": 7,
    "head": ["leather_helmet", "copper_helmet", "iron_helmet"],
    "chest": ["leather_chestplate", "copper_chestplate", "iron_chestplate"],
    "legs": ["leather_leggings", "copper_leggings", "iron_leggings"],
    "feet": ["leather_boots", "copper_boots", "iron_boots"],
    "mainhand": ["wooden_sword", "stone_sword", "copper_sword", "golden_sword", "iron_sword", "bow"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 105,
    "maxPowerLevel": 140
}, {
    "level": 8,
    "head": ["leather_helmet", "copper_helmet", "iron_helmet"],
    "chest": ["leather_chestplate", "copper_chestplate", "iron_chestplate"],
    "legs": ["leather_leggings", "copper_leggings", "iron_leggings"],
    "feet": ["leather_boots", "copper_boots", "iron_boots"],
    "mainhand": ["wooden_sword", "stone_sword", "copper_sword", "golden_sword", "iron_sword", "bow"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 120,
    "maxPowerLevel": 160
}, {
    "level": 9,
    "head": ["leather_helmet", "copper_helmet", "iron_helmet"],
    "chest": ["leather_chestplate", "copper_chestplate", "iron_chestplate"],
    "legs": ["leather_leggings", "copper_leggings", "iron_leggings"],
    "feet": ["leather_boots", "copper_boots", "iron_boots"],
    "mainhand": ["wooden_sword", "stone_sword", "copper_sword", "golden_sword", "iron_sword", "bow"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 135,
    "maxPowerLevel": 180
}, {
    "level": 10,
    "head": ["iron_helmet", "diamond_helmet", "netherite_helmet"],
    "chest": ["iron_chestplate", "diamond_chestplate", "netherite_chestplate"],
    "legs": ["iron_leggings", "diamond_leggings", "netherite_leggings"],
    "feet": ["iron_boots", "diamond_boots", "netherite_boots"],
    "mainhand": ["wooden_sword", "stone_sword", "copper_sword", "golden_sword", "iron_sword", "bow"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 150,
    "maxPowerLevel": 200
}, {
    "level": 11,
    "head": ["iron_helmet", "diamond_helmet", "netherite_helmet"],
    "chest": ["iron_chestplate", "diamond_chestplate", "netherite_chestplate"],
    "legs": ["iron_leggings", "diamond_leggings", "netherite_leggings"],
    "feet": ["iron_boots", "diamond_boots", "netherite_boots"],
    "mainhand": ["wooden_sword", "stone_sword", "copper_sword", "golden_sword", "iron_sword", "bow"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 165,
    "maxPowerLevel": 220
}, {
    "level": 12,
    "head": ["iron_helmet", "diamond_helmet", "netherite_helmet"],
    "chest": ["iron_chestplate", "diamond_chestplate", "netherite_chestplate"],
    "legs": ["iron_leggings", "diamond_leggings", "netherite_leggings"],
    "feet": ["iron_boots", "diamond_boots", "netherite_boots"],
    "mainhand": ["wooden_sword", "stone_sword", "copper_sword", "golden_sword", "iron_sword", "bow"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 180,
    "maxPowerLevel": 240
}, {
    "level": 13,
    "head": ["iron_helmet", "diamond_helmet", "netherite_helmet"],
    "chest": ["iron_chestplate", "diamond_chestplate", "netherite_chestplate"],
    "legs": ["iron_leggings", "diamond_leggings", "netherite_leggings"],
    "feet": ["iron_boots", "diamond_boots", "netherite_boots"],
    "mainhand": ["wooden_sword", "stone_sword", "copper_sword", "golden_sword", "iron_sword", "bow"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 195,
    "maxPowerLevel": 260
}, {
    "level": 14,
    "head": ["iron_helmet", "diamond_helmet", "netherite_helmet"],
    "chest": ["iron_chestplate", "diamond_chestplate", "netherite_chestplate"],
    "legs": ["iron_leggings", "diamond_leggings", "netherite_leggings"],
    "feet": ["iron_boots", "diamond_boots", "netherite_boots"],
    "mainhand": ["wooden_sword", "stone_sword", "copper_sword", "golden_sword", "iron_sword", "bow"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 210,
    "maxPowerLevel": 280
}, {
    "level": 15,
    "head": ["iron_helmet", "diamond_helmet", "netherite_helmet"],
    "chest": ["iron_chestplate", "diamond_chestplate", "netherite_chestplate"],
    "legs": ["iron_leggings", "diamond_leggings", "netherite_leggings"],
    "feet": ["iron_boots", "diamond_boots", "netherite_boots"],
    "mainhand": ["iron_sword", "bow", "diamond_sword", "crossbow", "netherite_sword"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 225,
    "maxPowerLevel": 300
}, {
    "level": 16,
    "head": ["iron_helmet", "diamond_helmet", "netherite_helmet"],
    "chest": ["iron_chestplate", "diamond_chestplate", "netherite_chestplate"],
    "legs": ["iron_leggings", "diamond_leggings", "netherite_leggings"],
    "feet": ["iron_boots", "diamond_boots", "netherite_boots"],
    "mainhand": ["iron_sword", "bow", "diamond_sword", "crossbow", "netherite_sword"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 240,
    "maxPowerLevel": 320
}, {
    "level": 17,
    "head": ["iron_helmet", "diamond_helmet", "netherite_helmet"],
    "chest": ["iron_chestplate", "diamond_chestplate", "netherite_chestplate"],
    "legs": ["iron_leggings", "diamond_leggings", "netherite_leggings"],
    "feet": ["iron_boots", "diamond_boots", "netherite_boots"],
    "mainhand": ["iron_sword", "bow", "diamond_sword", "crossbow", "netherite_sword"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 255,
    "maxPowerLevel": 340
}, {
    "level": 18,
    "head": ["iron_helmet", "diamond_helmet", "netherite_helmet"],
    "chest": ["iron_chestplate", "diamond_chestplate", "netherite_chestplate"],
    "legs": ["iron_leggings", "diamond_leggings", "netherite_leggings"],
    "feet": ["iron_boots", "diamond_boots", "netherite_boots"],
    "mainhand": ["iron_sword", "bow", "diamond_sword", "crossbow", "netherite_sword"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 270,
    "maxPowerLevel": 360
}, {
    "level": 19,
    "head": ["iron_helmet", "diamond_helmet", "netherite_helmet"],
    "chest": ["iron_chestplate", "diamond_chestplate", "netherite_chestplate"],
    "legs": ["iron_leggings", "diamond_leggings", "netherite_leggings"],
    "feet": ["iron_boots", "diamond_boots", "netherite_boots"],
    "mainhand": ["iron_sword", "bow", "diamond_sword", "crossbow", "netherite_sword"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 285,
    "maxPowerLevel": 380
}, {
    "level": 20,
    "head": ["iron_helmet", "diamond_helmet", "netherite_helmet"],
    "chest": ["iron_chestplate", "diamond_chestplate", "netherite_chestplate"],
    "legs": ["iron_leggings", "diamond_leggings", "netherite_leggings"],
    "feet": ["iron_boots", "diamond_boots", "netherite_boots"],
    "mainhand": ["iron_sword", "bow", "diamond_sword", "crossbow", "netherite_sword"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 300,
    "maxPowerLevel": 400
}, {
    "level": 21,
    "head": ["iron_helmet", "diamond_helmet", "netherite_helmet"],
    "chest": ["iron_chestplate", "diamond_chestplate", "netherite_chestplate"],
    "legs": ["iron_leggings", "diamond_leggings", "netherite_leggings"],
    "feet": ["iron_boots", "diamond_boots", "netherite_boots"],
    "mainhand": ["iron_sword", "bow", "diamond_sword", "crossbow", "netherite_sword"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 315,
    "maxPowerLevel": 420
}, {
    "level": 22,
    "head": ["iron_helmet", "diamond_helmet", "netherite_helmet"],
    "chest": ["iron_chestplate", "diamond_chestplate", "netherite_chestplate"],
    "legs": ["iron_leggings", "diamond_leggings", "netherite_leggings"],
    "feet": ["iron_boots", "diamond_boots", "netherite_boots"],
    "mainhand": ["iron_sword", "bow", "diamond_sword", "crossbow", "netherite_sword"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 330,
    "maxPowerLevel": 440
}, {
    "level": 23,
    "head": ["iron_helmet", "diamond_helmet", "netherite_helmet"],
    "chest": ["iron_chestplate", "diamond_chestplate", "netherite_chestplate"],
    "legs": ["iron_leggings", "diamond_leggings", "netherite_leggings"],
    "feet": ["iron_boots", "diamond_boots", "netherite_boots"],
    "mainhand": ["iron_sword", "bow", "diamond_sword", "crossbow", "netherite_sword"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 345,
    "maxPowerLevel": 460
}, {
    "level": 24,
    "head": ["iron_helmet", "diamond_helmet", "netherite_helmet"],
    "chest": ["iron_chestplate", "diamond_chestplate", "netherite_chestplate"],
    "legs": ["iron_leggings", "diamond_leggings", "netherite_leggings"],
    "feet": ["iron_boots", "diamond_boots", "netherite_boots"],
    "mainhand": ["iron_sword", "bow", "diamond_sword", "crossbow", "netherite_sword"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 360,
    "maxPowerLevel": 480
}, {
    "level": 25,
    "head": ["iron_helmet", "diamond_helmet", "netherite_helmet"],
    "chest": ["iron_chestplate", "diamond_chestplate", "netherite_chestplate"],
    "legs": ["iron_leggings", "diamond_leggings", "netherite_leggings"],
    "feet": ["iron_boots", "diamond_boots", "netherite_boots"],
    "mainhand": ["iron_sword", "bow", "diamond_sword", "crossbow", "netherite_sword"],
    "offhand": [],
    "effects": ["speed", "strength", "resistance", "health_boost"],
    "minPowerLevel": 375,
    "maxPowerLevel": 500
}];