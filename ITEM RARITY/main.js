import { world, system, EquipmentSlot } from "@minecraft/server";

function rarityItemTest(itemStack, player) {
    if (!itemStack) return;

    const lore = itemStack.getLore() ?? [];

    if (lore.length === 0) {
        const Tags = parseTags(itemStack.typeId);

        if (Tags && Tags.rarity) {
            const rarity = randomRarity();
            const stats = randomStats(rarity.sid);
            const newLore = [rarity.dName];

          
          
          
            let newItem = itemStack.clone();
            newItem.setLore(newLore);
            const equippable = player.getComponent("minecraft:equippable");
            if (equippable) {
                equippable.setEquipment("mainhand", newItem);
            }
        }
    }
}


function randomStats(id) {
    
}

function randomRarity() {
    let rarity = RARITY.COMMON;
    let currentId = rarity.id;

    while (true) {
        const nextRarity = Object.values(RARITY).find(r => r.id === currentId + 1);
        if (!nextRarity) break; // no higher rarity exists

        if (Math.random() >= nextRarity.chance) {
            rarity = nextRarity;
            currentId++;
        } else {
            break;
        }
    }
    return rarity;
}

const stats = {
    DAMAGE: {
        Name: "Damage",
        type: ["weapon", "tool"],
        Common:    { MIN: 3,  MAX: 5,  chance: 0.9 },
        Uncommon:  { MIN: 5,  MAX: 7,  chance: 0.8 },
        Rare:      { MIN: 7,  MAX: 10, chance: 0.75 },
        Epic:      { MIN: 10, MAX: 14, chance: 0.6 },
        Legendary: { MIN: 14, MAX: 18, chance: 0.5 },
        Mythic:    { MIN: 18, MAX: 22, chance: 0.4 }
    },
    ATTACK_SPEED: {
        Name: "Attack Speed",
        type: ["weapon", "tool"],
        Common:    { MIN: -0.2, MAX: 0,   chance: 0.6 },
        Uncommon:  { MIN: 0,    MAX: 0.2, chance: 0.6 },
        Rare:      { MIN: 0.1,  MAX: 0.3, chance: 0.5 },
        Epic:      { MIN: 0.2,  MAX: 0.4, chance: 0.4 },
        Legendary: { MIN: 0.3,  MAX: 0.5, chance: 0.3 },
        Mythic:    { MIN: 0.4,  MAX: 0.6, chance: 0.2 }
    },
    ARMOR: {
        Name: "Armor",
        type: ["armor"],
        Common:    { MIN: 1, MAX: 2, chance: 0.8 },
        Uncommon:  { MIN: 2, MAX: 3, chance: 0.8 },
        Rare:      { MIN: 3, MAX: 4, chance: 0.7 },
        Epic:      { MIN: 4, MAX: 5, chance: 0.6 },
        Legendary: { MIN: 5, MAX: 6, chance: 0.5 },
        Mythic:    { MIN: 6, MAX: 8, chance: 0.4 }
    },
    KNOCKBACK_RESISTANCE: {
        Name: "Knockback Resistance",
        type: ["armor"],
        Common:    { MIN: -0.1, MAX: 0,   chance: 0.5 },
        Uncommon:  { MIN: 0,    MAX: 0.1, chance: 0.5 },
        Rare:      { MIN: 0.1,  MAX: 0.2, chance: 0.4 },
        Epic:      { MIN: 0.2,  MAX: 0.3, chance: 0.3 },
        Legendary: { MIN: 0.3,  MAX: 0.4, chance: 0.2 },
        Mythic:    { MIN: 0.4,  MAX: 0.5, chance: 0.2 }
    },
    HEALTH_REGEN: {
        Name: "Health Regen",
        type: ["armor", "accessory"],
        Common:    { MIN: -0.5, MAX: 0,   chance: 0.4 },
        Uncommon:  { MIN: 0,    MAX: 0.5, chance: 0.4 },
        Rare:      { MIN: 0.3,  MAX: 0.7, chance: 0.35 },
        Epic:      { MIN: 0.6,  MAX: 1.0, chance: 0.25 },
        Legendary: { MIN: 0.9,  MAX: 1.4, chance: 0.2 },
        Mythic:    { MIN: 1.2,  MAX: 1.8, chance: 0.15 }
    },
    MOVEMENT_SPEED: {
        Name: "Movement Speed",
        type: ["armor", "boots", "accessory"],
        Common:    { MIN: -0.05, MAX: 0,    chance: 0.5 },
        Uncommon:  { MIN: 0,     MAX: 0.05, chance: 0.5 },
        Rare:      { MIN: 0.05,  MAX: 0.1,  chance: 0.4 },
        Epic:      { MIN: 0.1,   MAX: 0.15, chance: 0.3 },
        Legendary: { MIN: 0.15,  MAX: 0.2,  chance: 0.2 },
        Mythic:    { MIN: 0.2,   MAX: 0.3,  chance: 0.1 }
    },
    JUMP_HEIGHT: {
        Name: "Jump Height",
        type: ["boots", "armor"],
        Common:    { MIN: 0,    MAX: 0.1, chance: 0.3 },
        Uncommon:  { MIN: 0.1,  MAX: 0.2, chance: 0.3 },
        Rare:      { MIN: 0.2,  MAX: 0.3, chance: 0.3 },
        Epic:      { MIN: 0.3,  MAX: 0.4, chance: 0.2 },
        Legendary: { MIN: 0.4,  MAX: 0.5, chance: 0.15 },
        Mythic:    { MIN: 0.5,  MAX: 0.6, chance: 0.1 }
    },
    BLOCK_CHANCE: {
        Name: "Block Chance",
        type: ["shield", "armor"],
        Common:    { MIN: 0,  MAX: 0.05, chance: 0.2 },
        Uncommon:  { MIN: 0.05, MAX: 0.1, chance: 0.25 },
        Rare:      { MIN: 0.1,  MAX: 0.15, chance: 0.3 },
        Epic:      { MIN: 0.15, MAX: 0.2, chance: 0.25 },
        Legendary: { MIN: 0.2,  MAX: 0.25, chance: 0.2 },
        Mythic:    { MIN: 0.25, MAX: 0.3, chance: 0.15 }
    },
    CRIT_CHANCE: {
        Name: "Crit Chance",
        type: ["weapon"],
        Common:    { MIN: -0.05, MAX: 0,    chance: 0.4 },
        Uncommon:  { MIN: 0,     MAX: 0.05, chance: 0.4 },
        Rare:      { MIN: 0.05,  MAX: 0.1,  chance: 0.3 },
        Epic:      { MIN: 0.1,   MAX: 0.15, chance: 0.2 },
        Legendary: { MIN: 0.15,  MAX: 0.2,  chance: 0.15 },
        Mythic:    { MIN: 0.2,   MAX: 0.3,  chance: 0.1 }
    },
    DURABILITY: {
        Name: "Durability",
        type: ["weapon", "tool", "armor"],
        Common:    { MIN: -20, MAX: 0,   chance: 0.6 },
        Uncommon:  { MIN: 0,   MAX: 20,  chance: 0.6 },
        Rare:      { MIN: 10,  MAX: 30,  chance: 0.5 },
        Epic:      { MIN: 20,  MAX: 40,  chance: 0.4 },
        Legendary: { MIN: 30,  MAX: 50,  chance: 0.3 },
        Mythic:    { MIN: 40,  MAX: 60,  chance: 0.2 }
    }
};

const RARITY = {
    COMMON: {
        id: 1,
        chance: 1,
        sid: "Common",
        dName: "§7Common"
    },
    UNCOMMON: {
        id: 2,
        chance: 0.4,
        sid: "Uncommon",
        dName: "§aUncommon"
    },
    RARE: {
        id: 3,
        chance: 0.3,
        sid: "Rare",
        dName: "§9Rare"
    },
    EPIC: {
        id: 4,
        chance: 0.2,
        sid: "Epic",
        dName: "§5Epic"
    },
    LEGENDARY: {
        id: 5,
        chance: 0.15,
        sid: "Legendary",
        dName: "§6Legendary"
    },
    MYTHIC: {
        id: 6,
        chance: 0.2,
        sid: "Mythic",
        dName: "§dMythic"
    }
};

/*New
 const RARITY = {
    COMMON: {
        id: 1,
        chance: 1,
        sid: "Common",
        dName: ""
    },
    UNCOMMON: {
        id: 2,
        chance: 0.4,
        sid: "Uncommon",
        dName: ""
    },
    RARE: {
        id: 3,
        chance: 0.3,
        sid: "Rare",
        dName: ""
    },
    EPIC: {
        id: 4,
        chance: 0.2,
        sid: "Epic",
        dName: ""
    },
    LEGENDARY: {
        id: 5,
        chance: 0.15,
        sid: "Legendary",
        dName: ""
    },
    MYTHIC: {
        id: 6,
        chance: 0.2,
        sid: "Mythic",
        dName: ""
    }
};*/

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