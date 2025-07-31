import { 
    allWeapons, 
    allArmor, 
    meleeWeapons,
    rangedWeapons,
    tools,
    allItems
} from './mainLib.js';

export const stats = {
    // DAMAGE - Weapons only
    DAMAGE_COMMON: { name: "§7Damage", type: allItems, rarity: "Common", min: 1, max: 2, scoreboardTracker: "damage" },
    DAMAGE_UNCOMMON: { name: "§aDamage", type: allItems, rarity: "Uncommon", min: 1, max: 3, scoreboardTracker: "damage" },
    DAMAGE_RARE: { name: "§9Damage", type: allItems, rarity: "Rare", min: 2, max: 4, scoreboardTracker: "damage" },
    DAMAGE_EPIC: { name: "§5Damage", type: allItems, rarity: "Epic", min: 3, max: 5, scoreboardTracker: "damage" },
    DAMAGE_LEGENDARY: { name: "§6Damage", type: allItems, rarity: "Legendary", min: 4, max: 7, scoreboardTracker: "damage" },
    DAMAGE_MYTHIC: { name: "§cDamage", type: allItems, rarity: "Mythic", min: 5, max: 8, scoreboardTracker: "damage" },

    // DEFENSE - Armor items
    DEFENSE_COMMON: { name: "§7Defense", type: allItems, rarity: "Common", min: 1, max: 3, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_UNCOMMON: { name: "§aDefense", type: allItems, rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_RARE: { name: "§9Defense", type: allItems, rarity: "Rare", min: 3, max: 6, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_EPIC: { name: "§5Defense", type: allItems, rarity: "Epic", min: 5, max: 8, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_LEGENDARY: { name: "§6Defense", type: allItems, rarity: "Legendary", min: 7, max: 10, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_MYTHIC: { name: "§cDefense", type: allItems, rarity: "Mythic", min: 10, max: 15, scoreboardTracker: "defense", measure: "%" },

    // SPEED - Boots, legs, accessories
    SPEED_COMMON: { name: "§7Speed", type: allItems, rarity: "Common", min: 1, max: 3, scoreboardTracker: "speed", measure: "%" },
    SPEED_UNCOMMON: { name: "§aSpeed", type: allItems, rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "speed", measure: "%" },
    SPEED_RARE: { name: "§9Speed", type: allItems, rarity: "Rare", min: 3, max: 6, scoreboardTracker: "speed", measure: "%" },
    SPEED_EPIC: { name: "§5Speed", type: allItems, rarity: "Epic", min: 5, max: 8, scoreboardTracker: "speed", measure: "%" },
    SPEED_LEGENDARY: { name: "§6Speed", type: allItems, rarity: "Legendary", min: 7, max: 10, scoreboardTracker: "speed", measure: "%" },
    SPEED_MYTHIC: { name: "§cSpeed", type: allItems, rarity: "Mythic", min: 10, max: 15, scoreboardTracker: "speed", measure: "%" },
    
    // HEALTH - Armor and accessories
    HEALTH_COMMON: { name: "§7Health", type: allItems, rarity: "Common", min: 1, max: 2, scoreboardTracker: "health" },
    HEALTH_UNCOMMON: { name: "§aHealth", type: allItems, rarity: "Uncommon", min: 1, max: 4, scoreboardTracker: "health" },
    HEALTH_RARE: { name: "§9Health", type: allItems, rarity: "Rare", min: 2, max: 5, scoreboardTracker: "health" },
    HEALTH_EPIC: { name: "§5Health", type: allItems, rarity: "Epic", min: 4, max: 7, scoreboardTracker: "health" },
    HEALTH_LEGENDARY: { name: "§6Health", type: allItems, rarity: "Legendary", min: 5, max: 8, scoreboardTracker: "health" },
    HEALTH_MYTHIC: { name: "§cHealth", type: allItems, rarity: "Mythic", min: 6, max: 10, scoreboardTracker: "health" },
    
    // CRITICAL CHANCE - Weapons and some accessories
    CRIT_CHANCE_COMMON: { name: "§7Crit Chance", type: allItems, rarity: "Common", min: 1, max: 3, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_UNCOMMON: { name: "§aCrit Chance", type: allItems, rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_RARE: { name: "§9Crit Chance", type: allItems, rarity: "Rare", min: 3, max: 7, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_EPIC: { name: "§5Crit Chance", type: allItems, rarity: "Epic", min: 5, max: 10, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_LEGENDARY: { name: "§6Crit Chance", type: allItems, rarity: "Legendary", min: 8, max: 15, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_MYTHIC: { name: "§cCrit Chance", type: allItems, rarity: "Mythic", min: 12, max: 20, scoreboardTracker: "critchance", measure: "%" },

    // CRITICAL DAMAGE - Weapons and some accessories
    CRIT_DAMAGE_COMMON: { name: "§7Crit Damage", type: allItems, rarity: "Common", min: 1, max: 5, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_UNCOMMON: { name: "§aCrit Damage", type: allItems, rarity: "Uncommon", min: 4, max: 10, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_RARE: { name: "§9Crit Damage", type: allItems, rarity: "Rare", min: 9, max: 15, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_EPIC: { name: "§5Crit Damage", type: allItems, rarity: "Epic", min: 15, max: 22, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_LEGENDARY: { name: "§6Crit Damage", type: allItems, rarity: "Legendary", min: 21, max: 33, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_MYTHIC: { name: "§cCrit Damage", type: allItems, rarity: "Mythic", min: 33, max: 45, scoreboardTracker: "critdamage", measure: "%" },

    // REGENERATION - Armor and accessories  
    REGENERATION_EPIC: { name: "§5Regeneration", type: allItems, rarity: "Epic", min: 1, max: 2, scoreboardTracker: "regeneration", measure: "/10s" },
    REGENERATION_LEGENDARY: { name: "§6Regeneration", type: allItems, rarity: "Legendary", min: 1, max: 3, scoreboardTracker: "regeneration", measure: "/10s" },
    REGENERATION_MYTHIC: { name: "§cRegeneration", type: allItems, rarity: "Mythic", min: 3, max: 4, scoreboardTracker: "regeneration", measure: "/10s" },

    // DAMAGE PERCENT - Weapons and some accessories
    DAMAGE_PERCENT_COMMON: { name: "§7Damage§x", type: allItems, rarity: "Common", min: 1, max: 3, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_UNCOMMON: { name: "§aDamage§x", type: allItems, rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_RARE: { name: "§9Damage§x", type: allItems, rarity: "Rare", min: 3, max: 7, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_EPIC: { name: "§5Damage§x", type: allItems, rarity: "Epic", min: 5, max: 10, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_LEGENDARY: { name: "§6Damage§x", type: allItems, rarity: "Legendary", min: 8, max: 15, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_MYTHIC: { name: "§cDamage§x", type: allItems, rarity: "Mythic", min: 12, max: 20, scoreboardTracker: "damagepercent", measure: "%" },
    
    // LIFESTEAL - Weapons only
    LIFESTEAL_RARE: { name: "§9Lifesteal", type: allItems, rarity: "Rare", min: 3, max: 5, scoreboardTracker: "lifesteal", measure: "%" },
    LIFESTEAL_EPIC: { name: "§5Lifesteal", type: allItems, rarity: "Epic", min: 4, max: 7, scoreboardTracker: "lifesteal", measure: "%" },
    LIFESTEAL_LEGENDARY: { name: "§6Lifesteal", type: allItems, rarity: "Legendary", min: 6, max: 9, scoreboardTracker: "lifesteal", measure: "%" },
    LIFESTEAL_MYTHIC: { name: "§cLifesteal", type: allItems, rarity: "Mythic", min: 8, max: 12, scoreboardTracker: "lifesteal", measure: "%" },

    // HEALTH PERCENT - Armor and accessories
    HEALTH_PERCENT_COMMON: { name: "§7Health§x", type: allItems, rarity: "Common", min: 1, max: 3, scoreboardTracker: "healthpercent", measure: "%" },
    HEALTH_PERCENT_UNCOMMON: { name: "§aHealth§x", type: allItems, rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "healthpercent", measure: "%" },
    HEALTH_PERCENT_RARE: { name: "§9Health§x", type: allItems, rarity: "Rare", min: 3, max: 7, scoreboardTracker: "healthpercent", measure: "%" },
    HEALTH_PERCENT_EPIC: { name: "§5Health§x", type: allItems, rarity: "Epic", min: 5, max: 10, scoreboardTracker: "healthpercent", measure: "%" },
    HEALTH_PERCENT_LEGENDARY: { name: "§6Health§x", type: allItems, rarity: "Legendary", min: 8, max: 15, scoreboardTracker: "healthpercent", measure: "%" },
    HEALTH_PERCENT_MYTHIC: { name: "§cHealth§x", type: allItems, rarity: "Mythic", min: 12, max: 20, scoreboardTracker: "healthpercent", measure: "%" }
};