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
    DAMAGE_COMMON: { name: "§7Damage", type: allItems, rarity: "Common", min: 1, max: 2, scoreboardTracker: "rrsdamage" },
    DAMAGE_UNCOMMON: { name: "§aDamage", type: allItems, rarity: "Uncommon", min: 1, max: 3, scoreboardTracker: "rrsdamage" },
    DAMAGE_RARE: { name: "§9Damage", type: allItems, rarity: "Rare", min: 2, max: 4, scoreboardTracker: "rrsdamage" },
    DAMAGE_EPIC: { name: "§5Damage", type: allItems, rarity: "Epic", min: 3, max: 5, scoreboardTracker: "rrsdamage" },
    DAMAGE_LEGENDARY: { name: "§6Damage", type: allItems, rarity: "Legendary", min: 4, max: 7, scoreboardTracker: "rrsdamage" },
    DAMAGE_MYTHIC: { name: "§cDamage", type: allItems, rarity: "Mythic", min: 5, max: 8, scoreboardTracker: "rrsdamage" },

    // DEFENSE - Armor items
    DEFENSE_COMMON: { name: "§7Defense", type: allItems, rarity: "Common", min: 1, max: 3, scoreboardTracker: "rrsdefense", measure: "%" },
    DEFENSE_UNCOMMON: { name: "§aDefense", type: allItems, rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "rrsdefense", measure: "%" },
    DEFENSE_RARE: { name: "§9Defense", type: allItems, rarity: "Rare", min: 3, max: 6, scoreboardTracker: "rrsdefense", measure: "%" },
    DEFENSE_EPIC: { name: "§5Defense", type: allItems, rarity: "Epic", min: 5, max: 8, scoreboardTracker: "rrsdefense", measure: "%" },
    DEFENSE_LEGENDARY: { name: "§6Defense", type: allItems, rarity: "Legendary", min: 7, max: 10, scoreboardTracker: "rrsdefense", measure: "%" },
    DEFENSE_MYTHIC: { name: "§cDefense", type: allItems, rarity: "Mythic", min: 10, max: 15, scoreboardTracker: "rrsdefense", measure: "%" },

    // SPEED - Boots, legs, accessories
    SPEED_COMMON: { name: "§7Speed", type: allItems, rarity: "Common", min: 1, max: 3, scoreboardTracker: "rrsspeed", measure: "%" },
    SPEED_UNCOMMON: { name: "§aSpeed", type: allItems, rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "rrsspeed", measure: "%" },
    SPEED_RARE: { name: "§9Speed", type: allItems, rarity: "Rare", min: 3, max: 6, scoreboardTracker: "rrsspeed", measure: "%" },
    SPEED_EPIC: { name: "§5Speed", type: allItems, rarity: "Epic", min: 5, max: 8, scoreboardTracker: "rrsspeed", measure: "%" },
    SPEED_LEGENDARY: { name: "§6Speed", type: allItems, rarity: "Legendary", min: 7, max: 10, scoreboardTracker: "rrsspeed", measure: "%" },
    SPEED_MYTHIC: { name: "§cSpeed", type: allItems, rarity: "Mythic", min: 10, max: 15, scoreboardTracker: "rrsspeed", measure: "%" },
    
    // HEALTH - Armor and accessories
    HEALTH_COMMON: { name: "§7Health", type: allItems, rarity: "Common", min: 1, max: 2, scoreboardTracker: "rrshealth" },
    HEALTH_UNCOMMON: { name: "§aHealth", type: allItems, rarity: "Uncommon", min: 1, max: 4, scoreboardTracker: "rrshealth" },
    HEALTH_RARE: { name: "§9Health", type: allItems, rarity: "Rare", min: 2, max: 5, scoreboardTracker: "rrshealth" },
    HEALTH_EPIC: { name: "§5Health", type: allItems, rarity: "Epic", min: 4, max: 7, scoreboardTracker: "rrshealth" },
    HEALTH_LEGENDARY: { name: "§6Health", type: allItems, rarity: "Legendary", min: 5, max: 8, scoreboardTracker: "rrshealth" },
    HEALTH_MYTHIC: { name: "§cHealth", type: allItems, rarity: "Mythic", min: 6, max: 10, scoreboardTracker: "rrshealth" },
    
    // CRITICAL CHANCE - Weapons and some accessories
    CRIT_CHANCE_COMMON: { name: "§7Crit Chance", type: allItems, rarity: "Common", min: 1, max: 3, scoreboardTracker: "rrscritchance", measure: "%" },
    CRIT_CHANCE_UNCOMMON: { name: "§aCrit Chance", type: allItems, rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "rrscritchance", measure: "%" },
    CRIT_CHANCE_RARE: { name: "§9Crit Chance", type: allItems, rarity: "Rare", min: 3, max: 7, scoreboardTracker: "rrscritchance", measure: "%" },
    CRIT_CHANCE_EPIC: { name: "§5Crit Chance", type: allItems, rarity: "Epic", min: 5, max: 10, scoreboardTracker: "rrscritchance", measure: "%" },
    CRIT_CHANCE_LEGENDARY: { name: "§6Crit Chance", type: allItems, rarity: "Legendary", min: 8, max: 15, scoreboardTracker: "rrscritchance", measure: "%" },
    CRIT_CHANCE_MYTHIC: { name: "§cCrit Chance", type: allItems, rarity: "Mythic", min: 12, max: 20, scoreboardTracker: "rrscritchance", measure: "%" },

    // CRITICAL DAMAGE - Weapons and some accessories
    CRIT_DAMAGE_COMMON: { name: "§7Crit Damage", type: allItems, rarity: "Common", min: 1, max: 5, scoreboardTracker: "rrscritdamage", measure: "%" },
    CRIT_DAMAGE_UNCOMMON: { name: "§aCrit Damage", type: allItems, rarity: "Uncommon", min: 4, max: 10, scoreboardTracker: "rrscritdamage", measure: "%" },
    CRIT_DAMAGE_RARE: { name: "§9Crit Damage", type: allItems, rarity: "Rare", min: 9, max: 15, scoreboardTracker: "rrscritdamage", measure: "%" },
    CRIT_DAMAGE_EPIC: { name: "§5Crit Damage", type: allItems, rarity: "Epic", min: 15, max: 22, scoreboardTracker: "rrscritdamage", measure: "%" },
    CRIT_DAMAGE_LEGENDARY: { name: "§6Crit Damage", type: allItems, rarity: "Legendary", min: 21, max: 33, scoreboardTracker: "rrscritdamage", measure: "%" },
    CRIT_DAMAGE_MYTHIC: { name: "§cCrit Damage", type: allItems, rarity: "Mythic", min: 33, max: 45, scoreboardTracker: "rrscritdamage", measure: "%" },

    // REGENERATION - Armor and accessories  
    REGENERATION_EPIC: { name: "§5Regeneration", type: allItems, rarity: "Epic", min: 1, max: 2, scoreboardTracker: "rrsregeneration", measure: "/10s" },
    REGENERATION_LEGENDARY: { name: "§6Regeneration", type: allItems, rarity: "Legendary", min: 1, max: 3, scoreboardTracker: "rrsregeneration", measure: "/10s" },
    REGENERATION_MYTHIC: { name: "§cRegeneration", type: allItems, rarity: "Mythic", min: 3, max: 4, scoreboardTracker: "rrsregeneration", measure: "/10s" },

    // DAMAGE PERCENT - Weapons and some accessories
    DAMAGE_PERCENT_COMMON: { name: "§7Damage§x", type: allItems, rarity: "Common", min: 1, max: 3, scoreboardTracker: "rrsdamagepercent", measure: "%" },
    DAMAGE_PERCENT_UNCOMMON: { name: "§aDamage§x", type: allItems, rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "rrsdamagepercent", measure: "%" },
    DAMAGE_PERCENT_RARE: { name: "§9Damage§x", type: allItems, rarity: "Rare", min: 3, max: 7, scoreboardTracker: "rrsdamagepercent", measure: "%" },
    DAMAGE_PERCENT_EPIC: { name: "§5Damage§x", type: allItems, rarity: "Epic", min: 5, max: 10, scoreboardTracker: "rrsdamagepercent", measure: "%" },
    DAMAGE_PERCENT_LEGENDARY: { name: "§6Damage§x", type: allItems, rarity: "Legendary", min: 8, max: 15, scoreboardTracker: "rrsdamagepercent", measure: "%" },
    DAMAGE_PERCENT_MYTHIC: { name: "§cDamage§x", type: allItems, rarity: "Mythic", min: 12, max: 20, scoreboardTracker: "rrsdamagepercent", measure: "%" },
    
    // LIFESTEAL - Weapons only
    LIFESTEAL_RARE: { name: "§9Lifesteal", type: allItems, rarity: "Rare", min: 3, max: 5, scoreboardTracker: "rrslifesteal", measure: "%" },
    LIFESTEAL_EPIC: { name: "§5Lifesteal", type: allItems, rarity: "Epic", min: 4, max: 7, scoreboardTracker: "rrslifesteal", measure: "%" },
    LIFESTEAL_LEGENDARY: { name: "§6Lifesteal", type: allItems, rarity: "Legendary", min: 6, max: 9, scoreboardTracker: "rrslifesteal", measure: "%" },
    LIFESTEAL_MYTHIC: { name: "§cLifesteal", type: allItems, rarity: "Mythic", min: 8, max: 12, scoreboardTracker: "rrslifesteal", measure: "%" },

    // HEALTH PERCENT - Armor and accessories
    HEALTH_PERCENT_COMMON: { name: "§7Health§x", type: allItems, rarity: "Common", min: 1, max: 3, scoreboardTracker: "rrshealthpercent", measure: "%" },
    HEALTH_PERCENT_UNCOMMON: { name: "§aHealth§x", type: allItems, rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "rrshealthpercent", measure: "%" },
    HEALTH_PERCENT_RARE: { name: "§9Health§x", type: allItems, rarity: "Rare", min: 3, max: 7, scoreboardTracker: "rrshealthpercent", measure: "%" },
    HEALTH_PERCENT_EPIC: { name: "§5Health§x", type: allItems, rarity: "Epic", min: 5, max: 10, scoreboardTracker: "rrshealthpercent", measure: "%" },
    HEALTH_PERCENT_LEGENDARY: { name: "§6Health§x", type: allItems, rarity: "Legendary", min: 8, max: 15, scoreboardTracker: "rrshealthpercent", measure: "%" },
    HEALTH_PERCENT_MYTHIC: { name: "§cHealth§x", type: allItems, rarity: "Mythic", min: 12, max: 20, scoreboardTracker: "rrshealthpercent", measure: "%" }
};