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
        chance: 0.45,
        sid: "Uncommon",
        dName: "\n\n",
        minStats: 1,
        maxStats: 2
    },
    RARE: {
        id: 3,
        chance: 0.3,
        sid: "Rare",
        dName: "\n\n",
        minStats: 2,
        maxStats: 3
    },
    EPIC: {
        id: 4,
        chance: 0.2,
        sid: "Epic",
        dName: "\n\n",
        minStats: 3,
        maxStats: 4
    },
    LEGENDARY: {
        id: 5,
        chance: 0.15,
        sid: "Legendary",
        dName: "\n\n",
        minStats: 4,
        maxStats: 5
    },
    MYTHIC: {
        id: 6,
        chance: 0.2,
        sid: "Mythic",
        dName: "\n\n",
        minStats: 5,
        maxStats: 6
    }
};
*/

export const RARITY = {
    COMMON: {
        id: 1,
        chance: 1,
        sid: "Common",
        dName: "§7Common",
        minStats: 0,
        maxStats: 1
    },
    UNCOMMON: {
        id: 2,
        chance: 0.4,
        sid: "Uncommon",
        dName: "§aUncommon",
        minStats: 1,
        maxStats: 2
    },
    RARE: {
        id: 3,
        chance: 0.3,
        sid: "Rare",
        dName: "§9Rare",
        minStats: 2,
        maxStats: 3
    },
    EPIC: {
        id: 4,
        chance: 0.2,
        sid: "Epic",
        dName: "§5Epic",
        minStats: 3,
        maxStats: 4
    },
    LEGENDARY: {
        id: 5,
        chance: 0.15,
        sid: "Legendary",
        dName: "§6Legendary",
        minStats: 4,
        maxStats: 5
    },
    MYTHIC: {
        id: 6,
        chance: 0.2,
        sid: "Mythic",
        dName: "§dMythic",
        minStats: 5,
        maxStats: 6
    }
};

export const TagMapping = [
    "sword",
    "pickaxe",
    "axe",
    "shovel",
    "hoe",

    "helmet",
    "chestplate",
    "leggings",
    "boots",

    "bow",
    "crossbow",
    "trident",
    "shield",

    "fishing_rod",
    "shears",
    "flint_and_steel",
    "elytra",
    "totem"
];

export const blackList = [
    "minecraft:apple"
];


export const skills = {
  spin_attack: {
    rarity: "Rare",
    description: "Damage enemies in {x} block radius for 10 damage",
    displayName: "Damage Spin",
    effect: {
      "Common": { MIN: 1, MAX: 2 },
      "Uncommon": { MIN: 2, MAX: 3 },
      "Rare": { MIN: 3, MAX: 4 },
      "Epic": { MIN: 4, MAX: 5 },
      "Legendary": { MIN: 5, MAX: 6 },
      "Mythic": { MIN: 6, MAX: 7 }
    },
    type: ["melee", "weapon"]
  },

  sprint_speed: {
    rarity: "Uncommon",
    description: "Increases movement speed while sprinting by {x}%",
    displayName: "Sprinter's Boost",
    effect: {
      "Common": { MIN: 5, MAX: 7 },
      "Uncommon": { MIN: 7, MAX: 10 },
      "Rare": { MIN: 10, MAX: 15 },
      "Epic": { MIN: 15, MAX: 20 },
      "Legendary": { MIN: 20, MAX: 25 },
      "Mythic": { MIN: 25, MAX: 30 }
    },
    type: ["boots", "armor", "passive"]
  },

  health_regen: {
    rarity: "Rare",
    description: "Regenerate {x} HP every 5 seconds when not in combat",
    displayName: "Regenerative Aura",
    effect: {
      "Common": { MIN: 1, MAX: 1 },
      "Uncommon": { MIN: 1, MAX: 2 },
      "Rare": { MIN: 2, MAX: 3 },
      "Epic": { MIN: 3, MAX: 4 },
      "Legendary": { MIN: 4, MAX: 5 },
      "Mythic": { MIN: 5, MAX: 6 }
    },
    type: ["armor", "passive"]
  },

  critical_chance: {
    rarity: "Epic",
    description: "Grants {x}% chance to deal double damage on hit",
    displayName: "Critical Strike",
    effect: {
      "Common": { MIN: 2, MAX: 4 },
      "Uncommon": { MIN: 4, MAX: 6 },
      "Rare": { MIN: 6, MAX: 8 },
      "Epic": { MIN: 8, MAX: 10 },
      "Legendary": { MIN: 10, MAX: 12 },
      "Mythic": { MIN: 12, MAX: 15 }
    },
    type: ["weapon", "passive"]
  },

  shield_bash: {
    rarity: "Uncommon",
    description: "Bash enemies in front of you for {x} damage when sneaking with shield",
    displayName: "Shield Bash",
    effect: {
      "Common": { MIN: 2, MAX: 3 },
      "Uncommon": { MIN: 3, MAX: 4 },
      "Rare": { MIN: 4, MAX: 5 },
      "Epic": { MIN: 5, MAX: 6 },
      "Legendary": { MIN: 6, MAX: 8 },
      "Mythic": { MIN: 8, MAX: 10 }
    },
    type: ["shield", "active"]
  },

  charge_dash: {
    rarity: "Legendary",
    description: "Dash forward {x} blocks and knock back enemies",
    displayName: "Charge Dash",
    effect: {
      "Common": { MIN: 2, MAX: 3 },
      "Uncommon": { MIN: 3, MAX: 4 },
      "Rare": { MIN: 4, MAX: 5 },
      "Epic": { MIN: 5, MAX: 6 },
      "Legendary": { MIN: 6, MAX: 7 },
      "Mythic": { MIN: 7, MAX: 8 }
    },
    type: ["boots", "active"]
  },

  jump_boost: {
    rarity: "Uncommon",
    description: "Increases jump height by {x} blocks",
    displayName: "Leap Legs",
    effect: {
      "Common": { MIN: 0.5, MAX: 1 },
      "Uncommon": { MIN: 1, MAX: 1.5 },
      "Rare": { MIN: 1.5, MAX: 2 },
      "Epic": { MIN: 2, MAX: 2.5 },
      "Legendary": { MIN: 2.5, MAX: 3 },
      "Mythic": { MIN: 3, MAX: 3.5 }
    },
    type: ["boots", "passive"]
  },

  ranged_power: {
    rarity: "Rare",
    description: "Increases ranged damage by {x}%",
    displayName: "Sharpshooter",
    effect: {
      "Common": { MIN: 5, MAX: 7 },
      "Uncommon": { MIN: 7, MAX: 10 },
      "Rare": { MIN: 10, MAX: 13 },
      "Epic": { MIN: 13, MAX: 16 },
      "Legendary": { MIN: 16, MAX: 20 },
      "Mythic": { MIN: 20, MAX: 25 }
    },
    type: ["bow", "crossbow", "passive"]
  }
};

//need rework

export const stats = {
    DAMAGE: {
        name: "§8Damage",
        type: ["sword", "axe", "bow", "crossbow", "trident"],
        rarity: ["Common", "Uncommon", "Rare", "Epic"],
        values: {
            "Common": {min: 0, max: 2},
            "Uncommon": {min: 1, max: 4},
            "Rare": {min: 3, max: 6},
            "Epic": {min: 5, max: 10}
        }
    },
    ATTACK_SPEED: {
        name: "§9Attack Speed",
        type: ["sword", "axe"],
        rarity: ["Common", "Uncommon", "Rare"],
        values: {
            "Common": {min: 0.1, max: 0.3},
            "Uncommon": {min: 0.2, max: 0.5},
            "Rare": {min: 0.4, max: 0.8}
        }
    },
    CRITICAL_CHANCE: {
        name: "§eCritical Chance",
        type: ["sword", "axe", "bow", "crossbow"],
        rarity: ["Uncommon", "Rare", "Epic", "Legendary"],
        values: {
            "Uncommon": {min: 1, max: 3},
            "Rare": {min: 2, max: 5},
            "Epic": {min: 4, max: 8},
            "Legendary": {min: 6, max: 12}
        },
        measure: "%"
    },
    CRITICAL_DAMAGE: {
        name: "§6Critical Damage",
        type: ["sword", "axe", "bow", "crossbow"],
        rarity: ["Rare", "Epic", "Legendary", "Mythic"],
        values: {
            "Rare": {min: 5, max: 15},
            "Epic": {min: 10, max: 25},
            "Legendary": {min: 20, max: 40},
            "Mythic": {min: 35, max: 60}
        },
        measure: "%"
    },
    HEALTH: {
        name: "§cHealth",
        type: ["helmet", "chestplate", "leggings", "boots", "sword", "axe"],
        rarity: ["Common", "Uncommon", "Rare", "Epic"],
        values: {
            "Common": {min: 1, max: 5},
            "Uncommon": {min: 3, max: 10},
            "Rare": {min: 8, max: 20},
            "Epic": {min: 15, max: 35}
        }
    },
    DEFENSE: {
        name: "§aDefense",
        type: ["helmet", "chestplate", "leggings", "boots", "shield"],
        rarity: ["Common", "Uncommon", "Rare", "Epic", "Legendary"],
        values: {
            "Common": {min: 1, max: 3},
            "Uncommon": {min: 2, max: 6},
            "Rare": {min: 4, max: 10},
            "Epic": {min: 8, max: 18},
            "Legendary": {min: 15, max: 30}
        }
    },
    SPEED: {
        name: "§fSpeed",
        type: ["boots", "leggings"],
        rarity: ["Uncommon", "Rare", "Epic", "Legendary"],
        values: {
            "Uncommon": {min: 1, max: 3},
            "Rare": {min: 2, max: 5},
            "Epic": {min: 4, max: 8},
            "Legendary": {min: 6, max: 12}
        },
        measure: "%"
    },
    MANA: {
        name: "§bMana",
        type: ["helmet", "chestplate", "leggings", "boots", "wand", "staff"],
        rarity: ["Common", "Uncommon", "Rare", "Epic", "Legendary"],
        values: {
            "Common": {min: 2, max: 8},
            "Uncommon": {min: 5, max: 15},
            "Rare": {min: 10, max: 25},
            "Epic": {min: 20, max: 45},
            "Legendary": {min: 35, max: 70}
        }
    },
    MAGIC_DAMAGE: {
        name: "§dMagic Damage",
        type: ["wand", "staff", "helmet", "chestplate"],
        rarity: ["Uncommon", "Rare", "Epic", "Legendary", "Mythic"],
        values: {
            "Uncommon": {min: 1, max: 4},
            "Rare": {min: 3, max: 8},
            "Epic": {min: 6, max: 15},
            "Legendary": {min: 12, max: 25},
            "Mythic": {min: 20, max: 40}
        }
    },
    LUCK: {
        name: "§2Luck",
        type: ["helmet", "chestplate", "leggings", "boots", "sword", "axe", "pickaxe"],
        rarity: ["Rare", "Epic", "Legendary", "Mythic"],
        values: {
            "Rare": {min: 1, max: 3},
            "Epic": {min: 2, max: 6},
            "Legendary": {min: 4, max: 10},
            "Mythic": {min: 8, max: 18}
        }
    },
    FIRE_RESISTANCE: {
        name: "§4Fire Resistance",
        type: ["helmet", "chestplate", "leggings", "boots"],
        rarity: ["Uncommon", "Rare", "Epic"],
        values: {
            "Uncommon": {min: 5, max: 15},
            "Rare": {min: 10, max: 25},
            "Epic": {min: 20, max: 40}
        },
        measure: "%"
    },
    KNOCKBACK_RESISTANCE: {
        name: "§7Knockback Resistance",
        type: ["helmet", "chestplate", "leggings", "boots"],
        rarity: ["Rare", "Epic", "Legendary"],
        values: {
            "Rare": {min: 10, max: 25},
            "Epic": {min: 20, max: 45},
            "Legendary": {min: 35, max: 65}
        },
        measure: "%"
    },
    MINING_SPEED: {
        name: "§eMining Speed",
        type: ["pickaxe", "shovel", "axe"],
        rarity: ["Common", "Uncommon", "Rare", "Epic"],
        values: {
            "Common": {min: 5, max: 15},
            "Uncommon": {min: 10, max: 25},
            "Rare": {min: 20, max: 40},
            "Epic": {min: 30, max: 60}
        },
        measure: "%"
    },
    VAMPIRISM: {
        name: "§5Vampirism",
        type: ["sword", "axe"],
        rarity: ["Epic", "Legendary", "Mythic"],
        values: {
            "Epic": {min: 1, max: 3},
            "Legendary": {min: 2, max: 5},
            "Mythic": {min: 4, max: 8}
        },
        measure: "%"
    },
    THORNS: {
        name: "§cThorns",
        type: ["helmet", "chestplate", "leggings", "boots"],
        rarity: ["Rare", "Epic", "Legendary"],
        values: {
            "Rare": {min: 5, max: 15},
            "Epic": {min: 10, max: 25},
            "Legendary": {min: 20, max: 40}
        },
        measure: "%"
    }
};