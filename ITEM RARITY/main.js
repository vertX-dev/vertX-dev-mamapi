import { world, system, EquipmentSlot } from "@minecraft/server";

function rarityItemTest(itemStack, player) {
    if (!itemStack) return;

    const lore = itemStack.getLore() ?? [];

    if (lore.length === 0) {
        const Tags = parseTags(itemStack.typeId);

        if (Tags && Tags.rarity) {
            const rarity = randomRarity();
            
            const stats = randomStats(rarity.sid, Tags.data);
            
            
            
            
            
            const newLore = [rarity.dName, ...stats];
          
            let newItem = itemStack.clone();
            newItem.setLore(newLore);
            const equippable = player.getComponent("minecraft:equippable");
            if (equippable) {
                equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
            }
        }
    }
}


function randomStats(rarity, type) {
    // Type filtered
    const availableStats = Object.values(stats).filter(r => r.type.includes(type));
    let srr = Object.values(RARITY).find(r => r.sid === rarity);
    
    let StatsCounter = Math.floor(Math.random() * (srr.maxStats - srr.minStats + 1) + srr.minStats);
    
    let result = [];
    
    if (StatsCounter > 0) {
        result.push("Attributes");
        
        for (let i = 1; i <= StatsCounter; i++) {
            let attempts = 0;
            let foundStat = false;
            
            while (!foundStat && attempts < 10) { // Prevent infinite loops
                let RR = randomRarity(Math.min(6, Math.max(1, (srr.id - Math.floor((Math.random() * 3) - 1)))));
                const RarityStats = availableStats.filter(s => s.rarity === RR);
                
                if (RarityStats.length > 0) {
                    const newStat = RarityStats[Math.floor((Math.random()) * RarityStats.length)];
                    const newStatValue = +(Math.random() * (newStat.max - newStat.min) + newStat.min).toFixed(1);
                    const measure = newStat.measure ?? "";
                    const sign = newStatValue >= 0 ? "+" : "";
                    result.push(`${newStat.name} ${sign}${newStatValue}${measure}`);
                    foundStat = true;
                } else {
                    // If no stats found with current rarity, reduce counter and try again
                    attempts++;
                    if (attempts >= 10) {
                        StatsCounter--; // Reduce counter if we can't find suitable stats
                        break;
                    }
                }
            }
        }
    }
    return result;
}

function randomRarity(SRR = "Common") {
    let rarity = Object.values(RARITY).find(r => r.sid === SRR);
    let currentId = rarity.id;

    while (true) {
        const nextRarity = Object.values(RARITY).find(r => r.id === currentId + 1);
        if (!nextRarity) break; // no higher rarity exists

        if (Math.random() <= nextRarity.chance) {
            rarity = nextRarity;
            currentId++;
        } else {
            break;
        }
    }
    return rarity;
}


//need rework

const stats = {
    // DAMAGE STATS (Offensive)
    DAMAGE_COMMON: {
        name: "Damage",
        type: ["sword", "axe", "bow", "crossbow", "trident"],
        rarity: "Common",
        min: 1,
        max: 3,
    },
    DAMAGE_UNCOMMON: {
        name: "Damage",
        type: ["sword", "axe", "bow", "crossbow", "trident"],
        rarity: "Uncommon",
        min: 2,
        max: 5,
    },
    DAMAGE_RARE: {
        name: "Damage",
        type: ["sword", "axe", "bow", "crossbow", "trident"],
        rarity: "Rare",
        min: 4,
        max: 8,
    },
    DAMAGE_EPIC: {
        name: "Damage",
        type: ["sword", "axe", "bow", "crossbow", "trident"],
        rarity: "Epic",
        min: 7,
        max: 12,
    },
    DAMAGE_LEGENDARY: {
        name: "Damage",
        type: ["sword", "axe", "bow", "crossbow", "trident"],
        rarity: "Legendary",
        min: 10,
        max: 18,
    },
    DAMAGE_MYTHIC: {
        name: "Damage",
        type: ["sword", "axe", "bow", "crossbow", "trident"],
        rarity: "Mythic",
        min: 15,
        max: 25,
    },

    // ARMOR STATS (Defensive)
    ARMOR_COMMON: {
        name: "Armor",
        type: ["helmet", "chestplate", "leggings", "boots", "shield"],
        rarity: "Common",
        min: 1,
        max: 2,
    },
    ARMOR_UNCOMMON: {
        name: "Armor",
        type: ["helmet", "chestplate", "leggings", "boots", "shield"],
        rarity: "Uncommon",
        min: 2,
        max: 4,
    },
    ARMOR_RARE: {
        name: "Armor",
        type: ["helmet", "chestplate", "leggings", "boots", "shield"],
        rarity: "Rare",
        min: 3,
        max: 6,
    },
    ARMOR_EPIC: {
        name: "Armor",
        type: ["helmet", "chestplate", "leggings", "boots", "shield"],
        rarity: "Epic",
        min: 5,
        max: 9,
    },
    ARMOR_LEGENDARY: {
        name: "Armor",
        type: ["helmet", "chestplate", "leggings", "boots", "shield"],
        rarity: "Legendary",
        min: 7,
        max: 12,
    },
    ARMOR_MYTHIC: {
        name: "Armor",
        type: ["helmet", "chestplate", "leggings", "boots", "shield"],
        rarity: "Mythic",
        min: 10,
        max: 18,
    },

    // DURABILITY STATS (Utility)
    DURABILITY_COMMON: {
        name: "Durability",
        type: ["sword", "pickaxe", "axe", "shovel", "hoe", "bow", "crossbow", "trident", "fishing_rod", "shears", "flint_and_steel", "elytra"],
        rarity: "Common",
        min: 50,
        max: 100,
    },
    DURABILITY_UNCOMMON: {
        name: "Durability",
        type: ["sword", "pickaxe", "axe", "shovel", "hoe", "bow", "crossbow", "trident", "fishing_rod", "shears", "flint_and_steel", "elytra"],
        rarity: "Uncommon",
        min: 100,
        max: 200,
    },
    DURABILITY_RARE: {
        name: "Durability",
        type: ["sword", "pickaxe", "axe", "shovel", "hoe", "bow", "crossbow", "trident", "fishing_rod", "shears", "flint_and_steel", "elytra"],
        rarity: "Rare",
        min: 200,
        max: 400,
    },
    DURABILITY_EPIC: {
        name: "Durability",
        type: ["sword", "pickaxe", "axe", "shovel", "hoe", "bow", "crossbow", "trident", "fishing_rod", "shears", "flint_and_steel", "elytra"],
        rarity: "Epic",
        min: 400,
        max: 700,
    },
    DURABILITY_LEGENDARY: {
        name: "Durability",
        type: ["sword", "pickaxe", "axe", "shovel", "hoe", "bow", "crossbow", "trident", "fishing_rod", "shears", "flint_and_steel", "elytra"],
        rarity: "Legendary",
        min: 700,
        max: 1200,
    },
    DURABILITY_MYTHIC: {
        name: "Durability",
        type: ["sword", "pickaxe", "axe", "shovel", "hoe", "bow", "crossbow", "trident", "fishing_rod", "shears", "flint_and_steel", "elytra"],
        rarity: "Mythic",
        min: 1200,
        max: 2000,
    },

    // EFFICIENCY STATS (Utility - for tools)
    EFFICIENCY_COMMON: {
        name: "Efficiency",
        type: ["pickaxe", "axe", "shovel", "hoe", "shears"],
        rarity: "Common",
        min: 5,
        max: 10,
        measure: "%"
    },
    EFFICIENCY_UNCOMMON: {
        name: "Efficiency",
        type: ["pickaxe", "axe", "shovel", "hoe", "shears"],
        rarity: "Uncommon",
        min: 10,
        max: 20,
        measure: "%"
    },
    EFFICIENCY_RARE: {
        name: "Efficiency",
        type: ["pickaxe", "axe", "shovel", "hoe", "shears"],
        rarity: "Rare",
        min: 20,
        max: 35,
        measure: "%"
    },
    EFFICIENCY_EPIC: {
        name: "Efficiency",
        type: ["pickaxe", "axe", "shovel", "hoe", "shears"],
        rarity: "Epic",
        min: 35,
        max: 55,
        measure: "%"
    },
    EFFICIENCY_LEGENDARY: {
        name: "Efficiency",
        type: ["pickaxe", "axe", "shovel", "hoe", "shears"],
        rarity: "Legendary",
        min: 55,
        max: 80,
        measure: "%"
    },
    EFFICIENCY_MYTHIC: {
        name: "Efficiency",
        type: ["pickaxe", "axe", "shovel", "hoe", "shears"],
        rarity: "Mythic",
        min: 80,
        max: 120,
        measure: "%"
    },

    // CRITICAL CHANCE STATS (Offensive)
    CRITICAL_CHANCE_COMMON: {
        name: "Critical Chance",
        type: ["sword", "bow", "crossbow", "trident"],
        rarity: "Common",
        min: 2,
        max: 5,
        measure: "%"
    },
    CRITICAL_CHANCE_UNCOMMON: {
        name: "Critical Chance",
        type: ["sword", "bow", "crossbow", "trident"],
        rarity: "Uncommon",
        min: 5,
        max: 10,
        measure: "%"
    },
    CRITICAL_CHANCE_RARE: {
        name: "Critical Chance",
        type: ["sword", "bow", "crossbow", "trident"],
        rarity: "Rare",
        min: 10,
        max: 18,
        measure: "%"
    },
    CRITICAL_CHANCE_EPIC: {
        name: "Critical Chance",
        type: ["sword", "bow", "crossbow", "trident"],
        rarity: "Epic",
        min: 18,
        max: 28,
        measure: "%"
    },
    CRITICAL_CHANCE_LEGENDARY: {
        name: "Critical Chance",
        type: ["sword", "bow", "crossbow", "trident"],
        rarity: "Legendary",
        min: 28,
        max: 40,
        measure: "%"
    },
    CRITICAL_CHANCE_MYTHIC: {
        name: "Critical Chance",
        type: ["sword", "bow", "crossbow", "trident"],
        rarity: "Mythic",
        min: 40,
        max: 60,
        measure: "%"
    },

    // HEALTH BONUS STATS (Defensive)
    HEALTH_BONUS_COMMON: {
        name: "Health Bonus",
        type: ["helmet", "chestplate", "leggings", "boots", "totem"],
        rarity: "Common",
        min: 5,
        max: 15,
    },
    HEALTH_BONUS_UNCOMMON: {
        name: "Health Bonus",
        type: ["helmet", "chestplate", "leggings", "boots", "totem"],
        rarity: "Uncommon",
        min: 15,
        max: 30,
    },
    HEALTH_BONUS_RARE: {
        name: "Health Bonus",
        type: ["helmet", "chestplate", "leggings", "boots", "totem"],
        rarity: "Rare",
        min: 30,
        max: 50,
    },
    HEALTH_BONUS_EPIC: {
        name: "Health Bonus",
        type: ["helmet", "chestplate", "leggings", "boots", "totem"],
        rarity: "Epic",
        min: 50,
        max: 80,
    },
    HEALTH_BONUS_LEGENDARY: {
        name: "Health Bonus",
        type: ["helmet", "chestplate", "leggings", "boots", "totem"],
        rarity: "Legendary",
        min: 80,
        max: 120,
    },
    HEALTH_BONUS_MYTHIC: {
        name: "Health Bonus",
        type: ["helmet", "chestplate", "leggings", "boots", "totem"],
        rarity: "Mythic",
        min: 120,
        max: 200,
    },

    // LUCK STATS (Utility)
    LUCK_COMMON: {
        name: "Luck",
        type: ["fishing_rod", "pickaxe", "axe", "shovel", "hoe"],
        rarity: "Common",
        min: 1,
        max: 3,
        measure: "%"
    },
    LUCK_UNCOMMON: {
        name: "Luck",
        type: ["fishing_rod", "pickaxe", "axe", "shovel", "hoe"],
        rarity: "Uncommon",
        min: 3,
        max: 7,
        measure: "%"
    },
    LUCK_RARE: {
        name: "Luck",
        type: ["fishing_rod", "pickaxe", "axe", "shovel", "hoe"],
        rarity: "Rare",
        min: 7,
        max: 15,
        measure: "%"
    },
    LUCK_EPIC: {
        name: "Luck",
        type: ["fishing_rod", "pickaxe", "axe", "shovel", "hoe"],
        rarity: "Epic",
        min: 15,
        max: 25,
        measure: "%"
    },
    LUCK_LEGENDARY: {
        name: "Luck",
        type: ["fishing_rod", "pickaxe", "axe", "shovel", "hoe"],
        rarity: "Legendary",
        min: 25,
        max: 40,
        measure: "%"
    },
    LUCK_MYTHIC: {
        name: "Luck",
        type: ["fishing_rod", "pickaxe", "axe", "shovel", "hoe"],
        rarity: "Mythic",
        min: 40,
        max: 65,
        measure: "%"
    },

    // MOVEMENT SPEED STATS (Utility)
    MOVEMENT_SPEED_COMMON: {
        name: "Movement Speed",
        type: ["boots", "elytra"],
        rarity: "Common",
        min: 2,
        max: 5,
        measure: "%"
    },
    MOVEMENT_SPEED_UNCOMMON: {
        name: "Movement Speed",
        type: ["boots", "elytra"],
        rarity: "Uncommon",
        min: 5,
        max: 10,
        measure: "%"
    },
    MOVEMENT_SPEED_RARE: {
        name: "Movement Speed",
        type: ["boots", "elytra"],
        rarity: "Rare",
        min: 10,
        max: 18,
        measure: "%"
    },
    MOVEMENT_SPEED_EPIC: {
        name: "Movement Speed",
        type: ["boots", "elytra"],
        rarity: "Epic",
        min: 18,
        max: 30,
        measure: "%"
    },
    MOVEMENT_SPEED_LEGENDARY: {
        name: "Movement Speed",
        type: ["boots", "elytra"],
        rarity: "Legendary",
        min: 30,
        max: 45,
        measure: "%"
    },
    MOVEMENT_SPEED_MYTHIC: {
        name: "Movement Speed",
        type: ["boots", "elytra"],
        rarity: "Mythic",
        min: 45,
        max: 70,
        measure: "%"
    },

    // FIRE DAMAGE STATS (Offensive - special)
    FIRE_DAMAGE_COMMON: {
        name: "Fire Damage",
        type: ["sword", "bow", "crossbow", "flint_and_steel"],
        rarity: "Common",
        min: 1,
        max: 2,
    },
    FIRE_DAMAGE_UNCOMMON: {
        name: "Fire Damage",
        type: ["sword", "bow", "crossbow", "flint_and_steel"],
        rarity: "Uncommon",
        min: 2,
        max: 4,
    },
    FIRE_DAMAGE_RARE: {
        name: "Fire Damage",
        type: ["sword", "bow", "crossbow", "flint_and_steel"],
        rarity: "Rare",
        min: 4,
        max: 7,
    },
    FIRE_DAMAGE_EPIC: {
        name: "Fire Damage",
        type: ["sword", "bow", "crossbow", "flint_and_steel"],
        rarity: "Epic",
        min: 7,
        max: 12,
    },
    FIRE_DAMAGE_LEGENDARY: {
        name: "Fire Damage",
        type: ["sword", "bow", "crossbow", "flint_and_steel"],
        rarity: "Legendary",
        min: 12,
        max: 20,
    },
    FIRE_DAMAGE_MYTHIC: {
        name: "Fire Damage",
        type: ["sword", "bow", "crossbow", "flint_and_steel"],
        rarity: "Mythic",
        min: 20,
        max: 35,
    },

    // BLOCK CHANCE STATS (Defensive)
    BLOCK_CHANCE_COMMON: {
        name: "Block Chance",
        type: ["shield"],
        rarity: "Common",
        min: 5,
        max: 10,
        measure: "%"
    },
    BLOCK_CHANCE_UNCOMMON: {
        name: "Block Chance",
        type: ["shield"],
        rarity: "Uncommon",
        min: 10,
        max: 18,
        measure: "%"
    },
    BLOCK_CHANCE_RARE: {
        name: "Block Chance",
        type: ["shield"],
        rarity: "Rare",
        min: 18,
        max: 30,
        measure: "%"
    },
    BLOCK_CHANCE_EPIC: {
        name: "Block Chance",
        type: ["shield"],
        rarity: "Epic",
        min: 30,
        max: 45,
        measure: "%"
    },
    BLOCK_CHANCE_LEGENDARY: {
        name: "Block Chance",
        type: ["shield"],
        rarity: "Legendary",
        min: 45,
        max: 65,
        measure: "%"
    },
    BLOCK_CHANCE_MYTHIC: {
        name: "Block Chance",
        type: ["shield"],
        rarity: "Mythic",
        min: 65,
        max: 85,
        measure: "%"
    },

    // MANA REGENERATION STATS (Utility)
    MANA_REGEN_COMMON: {
        name: "Mana Regeneration",
        type: ["helmet", "chestplate", "leggings", "boots", "totem"],
        rarity: "Common",
        min: 1,
        max: 3,
    },
    MANA_REGEN_UNCOMMON: {
        name: "Mana Regeneration",
        type: ["helmet", "chestplate", "leggings", "boots", "totem"],
        rarity: "Uncommon",
        min: 3,
        max: 6,
    },
    MANA_REGEN_RARE: {
        name: "Mana Regeneration",
        type: ["helmet", "chestplate", "leggings", "boots", "totem"],
        rarity: "Rare",
        min: 6,
        max: 12,
    },
    MANA_REGEN_EPIC: {
        name: "Mana Regeneration",
        type: ["helmet", "chestplate", "leggings", "boots", "totem"],
        rarity: "Epic",
        min: 12,
        max: 20,
    },
    MANA_REGEN_LEGENDARY: {
        name: "Mana Regeneration",
        type: ["helmet", "chestplate", "leggings", "boots", "totem"],
        rarity: "Legendary",
        min: 20,
        max: 35,
    },
    MANA_REGEN_MYTHIC: {
        name: "Mana Regeneration",
        type: ["helmet", "chestplate", "leggings", "boots", "totem"],
        rarity: "Mythic",
        min: 35,
        max: 60,
    }
};

/*
const RARITY = {
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

const RARITY = {
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

const TagMapping = [
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

const blackList = [
    "minecraft:apple"
];

const skills = {
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

function parseTags(itemId) {
    for (const blItem of blackList) {
        if (itemId == blItem) {
            return {
                rarity: false
            }
        }
    }
    for (const key of TagMapping) {
        if (itemId.includes(key)) {
            return {
                rarity: true,
                data: key
            };
        }
    }
}

system.runInterval(() => {
    const players = world.getPlayers();
    for (const player of players) {
        rarityItemTest(player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand), player);
    }
}, 20)


//Events





