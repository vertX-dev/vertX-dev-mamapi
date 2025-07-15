import { 
    allWeapons, 
    allArmor, 
    footArmor, 
    legArmor, 
    accessories 
} from './mainLib.js';

export const stats = {
    // DAMAGE - Weapons only
    DAMAGE_COMMON: { name: "§8Damage", type: allWeapons, rarity: "Common", min: 1, max: 2, scoreboardTracker: "damage" },
    DAMAGE_UNCOMMON: { name: "§aDamage", type: allWeapons, rarity: "Uncommon", min: 1, max: 3, scoreboardTracker: "damage" },
    DAMAGE_RARE: { name: "§1Damage", type: allWeapons, rarity: "Rare", min: 2, max: 4, scoreboardTracker: "damage" },
    DAMAGE_EPIC: { name: "§5Damage", type: allWeapons, rarity: "Epic", min: 3, max: 5, scoreboardTracker: "damage" },
    DAMAGE_LEGENDARY: { name: "§6Damage", type: allWeapons, rarity: "Legendary", min: 4, max: 7, scoreboardTracker: "damage" },
    DAMAGE_MYTHIC: { name: "§cDamage", type: allWeapons, rarity: "Mythic", min: 5, max: 8, scoreboardTracker: "damage" },

    // DEFENSE - Armor items
    DEFENSE_COMMON: { name: "§8Defense", type: allArmor, rarity: "Common", min: 1, max: 3, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_UNCOMMON: { name: "§aDefense", type: allArmor, rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_RARE: { name: "§1Defense", type: allArmor, rarity: "Rare", min: 3, max: 6, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_EPIC: { name: "§5Defense", type: allArmor, rarity: "Epic", min: 5, max: 8, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_LEGENDARY: { name: "§6Defense", type: allArmor, rarity: "Legendary", min: 7, max: 10, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_MYTHIC: { name: "§cDefense", type: allArmor, rarity: "Mythic", min: 10, max: 15, scoreboardTracker: "defense", measure: "%" },

    // SPEED - Boots, legs, accessories
    SPEED_COMMON:    { name: "§8Speed",     type: [...footArmor, ...legArmor, "elytra", "jetpack"], rarity: "Common",    min: 1,  max: 3,  scoreboardTracker: "speed", measure: "%" },
    SPEED_UNCOMMON:  { name: "§aSpeed",     type: [...footArmor, ...legArmor, "elytra", "jetpack"], rarity: "Uncommon",  min: 2,  max: 5,  scoreboardTracker: "speed", measure: "%" },
    SPEED_RARE:      { name: "§1Speed",     type: [...footArmor, ...legArmor, "elytra", "jetpack"], rarity: "Rare",      min: 3,  max: 6,  scoreboardTracker: "speed", measure: "%" },
    SPEED_EPIC:      { name: "§5Speed",     type: [...footArmor, ...legArmor, "elytra", "jetpack"], rarity: "Epic",      min: 5,  max: 8,  scoreboardTracker: "speed", measure: "%" },
    SPEED_LEGENDARY: { name: "§6Speed",     type: [...footArmor, ...legArmor, "elytra", "jetpack"], rarity: "Legendary", min: 7,  max: 10, scoreboardTracker: "speed", measure: "%" },
    SPEED_MYTHIC:    { name: "§cSpeed",     type: [...footArmor, ...legArmor, "elytra", "jetpack"], rarity: "Mythic",    min: 10, max: 15, scoreboardTracker: "speed", measure: "%" },
    
    // HEALTH - Armor and accessories
    HEALTH_COMMON: { name: "§8Health", type: [...allArmor, ...accessories, "totem"], rarity: "Common", min: 1, max: 2, scoreboardTracker: "health" },
    HEALTH_UNCOMMON: { name: "§aHealth", type: [...allArmor, ...accessories, "totem"], rarity: "Uncommon", min: 1, max: 4, scoreboardTracker: "health" },
    HEALTH_RARE: { name: "§1Health", type: [...allArmor, ...accessories, "totem"], rarity: "Rare", min: 2, max: 5, scoreboardTracker: "health" },
    HEALTH_EPIC: { name: "§5Health", type: [...allArmor, ...accessories, "totem"], rarity: "Epic", min: 4, max: 7, scoreboardTracker: "health" },
    HEALTH_LEGENDARY: { name: "§6Health", type: [...allArmor, ...accessories, "totem"], rarity: "Legendary", min: 5, max: 8, scoreboardTracker: "health" },
    HEALTH_MYTHIC: { name: "§cHealth", type: [...allArmor, ...accessories, "totem"], rarity: "Mythic", min: 6, max: 10, scoreboardTracker: "health" },
    
    // CRITICAL CHANCE - Weapons and some accessories
    CRIT_CHANCE_COMMON: { name: "§8Crit Chance", type: [...allWeapons, "ring", "amulet"], rarity: "Common", min: 1, max: 3, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_UNCOMMON: { name: "§aCrit Chance", type: [...allWeapons, "ring", "amulet"], rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_RARE: { name: "§1Crit Chance", type: [...allWeapons, "ring", "amulet"], rarity: "Rare", min: 3, max: 7, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_EPIC: { name: "§5Crit Chance", type: [...allWeapons, "ring", "amulet"], rarity: "Epic", min: 5, max: 10, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_LEGENDARY: { name: "§6Crit Chance", type: [...allWeapons, "ring", "amulet"], rarity: "Legendary", min: 8, max: 15, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_MYTHIC: { name: "§cCrit Chance", type: [...allWeapons, "ring", "amulet"], rarity: "Mythic", min: 12, max: 20, scoreboardTracker: "critchance", measure: "%" },

    // CRITICAL DAMAGE - Weapons and some accessories
    CRIT_DAMAGE_COMMON: { name: "§8Crit Damage", type: [...allWeapons, "ring", "amulet"], rarity: "Common", min: 1, max: 5, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_UNCOMMON: { name: "§aCrit Damage", type: [...allWeapons, "ring", "amulet"], rarity: "Uncommon", min: 4, max: 10, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_RARE: { name: "§1Crit Damage", type: [...allWeapons, "ring", "amulet"], rarity: "Rare", min: 9, max: 15, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_EPIC: { name: "§5Crit Damage", type: [...allWeapons, "ring", "amulet"], rarity: "Epic", min: 15, max: 22, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_LEGENDARY: { name: "§6Crit Damage", type: [...allWeapons, "ring", "amulet"], rarity: "Legendary", min: 21, max: 33, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_MYTHIC: { name: "§cCrit Damage", type: [...allWeapons, "ring", "amulet"], rarity: "Mythic", min: 33, max: 45, scoreboardTracker: "critdamage", measure: "%" },

    // REGENERATION - Armor and accessories  
    REGENERATION_EPIC: { name: "§5Regeneration", type: [...allArmor, ...accessories, "totem"], rarity: "Epic", min: 1, max: 2, scoreboardTracker: "regeneration", measure: "/10s" },
    REGENERATION_LEGENDARY: { name: "§6Regeneration", type: [...allArmor, ...accessories, "totem"], rarity: "Legendary", min: 1, max: 3, scoreboardTracker: "regeneration", measure: "/10s" },
    REGENERATION_MYTHIC: { name: "§cRegeneration", type: [...allArmor, ...accessories, "totem"], rarity: "Mythic", min: 3, max: 4, scoreboardTracker: "regeneration", measure: "/10s" },

    // DAMAGE PERCENT - Weapons and some accessories
    DAMAGE_PERCENT_COMMON: { name: "§8Damage§x", type: [...allWeapons, "ring", "amulet"], rarity: "Common", min: 1, max: 3, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_UNCOMMON: { name: "§aDamage§x", type: [...allWeapons, "ring", "amulet"], rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_RARE: { name: "§1Damage§x", type: [...allWeapons, "ring", "amulet"], rarity: "Rare", min: 3, max: 7, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_EPIC: { name: "§5Damage§x", type: [...allWeapons, "ring", "amulet"], rarity: "Epic", min: 5, max: 10, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_LEGENDARY: { name: "§6Damage§x", type: [...allWeapons, "ring", "amulet"], rarity: "Legendary", min: 8, max: 15, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_MYTHIC: { name: "§cDamage§x", type: [...allWeapons, "ring", "amulet"], rarity: "Mythic", min: 12, max: 20, scoreboardTracker: "damagepercent", measure: "%" },
    
    // LIFESTEAL - Weapons only
    LIFESTEAL_RARE:      { name: "§1Lifesteal",     type: allWeapons, rarity: "Rare",      min: 3,  max: 5,  scoreboardTracker: "lifesteal", measure: "%" },
    LIFESTEAL_EPIC:      { name: "§5Lifesteal",     type: allWeapons, rarity: "Epic",      min: 4,  max: 7,  scoreboardTracker: "lifesteal", measure: "%" },
    LIFESTEAL_LEGENDARY: { name: "§6Lifesteal",     type: allWeapons, rarity: "Legendary", min: 6,  max: 9,  scoreboardTracker: "lifesteal", measure: "%" },
    LIFESTEAL_MYTHIC:    { name: "§cLifesteal",     type: allWeapons, rarity: "Mythic",    min: 8,  max: 12, scoreboardTracker: "lifesteal", measure: "%" }
};