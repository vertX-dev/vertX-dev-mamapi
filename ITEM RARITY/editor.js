import { world, system, EquipmentSlot, ItemStack } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

//=====================================DATA DEFINITIONS===========================================

// Rarity definitions
const RARITY = {
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
            skill: 0.33,
            passive: 0.40
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
            skill: 0.5,
            passive: 0.66
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
            skill: 1,
            passive: 1
        }
    }
};

// Stats definitions
const stats = {
    // DAMAGE - All items
    DAMAGE_COMMON: { name: "§8Damage", rarity: "Common", min: 1, max: 2, scoreboardTracker: "damage" },
    DAMAGE_UNCOMMON: { name: "§aDamage", rarity: "Uncommon", min: 1, max: 3, scoreboardTracker: "damage" },
    DAMAGE_RARE: { name: "§1Damage", rarity: "Rare", min: 2, max: 4, scoreboardTracker: "damage" },
    DAMAGE_EPIC: { name: "§5Damage", rarity: "Epic", min: 3, max: 5, scoreboardTracker: "damage" },
    DAMAGE_LEGENDARY: { name: "§6Damage", rarity: "Legendary", min: 4, max: 7, scoreboardTracker: "damage" },
    DAMAGE_MYTHIC: { name: "§cDamage", rarity: "Mythic", min: 5, max: 8, scoreboardTracker: "damage" },

    // DEFENSE - All items
    DEFENSE_COMMON: { name: "§8Defense", rarity: "Common", min: 1, max: 3, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_UNCOMMON: { name: "§aDefense", rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_RARE: { name: "§1Defense", rarity: "Rare", min: 3, max: 6, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_EPIC: { name: "§5Defense", rarity: "Epic", min: 5, max: 8, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_LEGENDARY: { name: "§6Defense", rarity: "Legendary", min: 7, max: 10, scoreboardTracker: "defense", measure: "%" },
    DEFENSE_MYTHIC: { name: "§cDefense", rarity: "Mythic", min: 10, max: 15, scoreboardTracker: "defense", measure: "%" },

    // SPEED - All items
    SPEED_COMMON: { name: "§8Speed", rarity: "Common", min: 1, max: 3, scoreboardTracker: "speed", measure: "%" },
    SPEED_UNCOMMON: { name: "§aSpeed", rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "speed", measure: "%" },
    SPEED_RARE: { name: "§1Speed", rarity: "Rare", min: 3, max: 6, scoreboardTracker: "speed", measure: "%" },
    SPEED_EPIC: { name: "§5Speed", rarity: "Epic", min: 5, max: 8, scoreboardTracker: "speed", measure: "%" },
    SPEED_LEGENDARY: { name: "§6Speed", rarity: "Legendary", min: 7, max: 10, scoreboardTracker: "speed", measure: "%" },
    SPEED_MYTHIC: { name: "§cSpeed", rarity: "Mythic", min: 10, max: 15, scoreboardTracker: "speed", measure: "%" },
    
    // HEALTH - All items
    HEALTH_COMMON: { name: "§8Health", rarity: "Common", min: 1, max: 2, scoreboardTracker: "health" },
    HEALTH_UNCOMMON: { name: "§aHealth", rarity: "Uncommon", min: 1, max: 4, scoreboardTracker: "health" },
    HEALTH_RARE: { name: "§1Health", rarity: "Rare", min: 2, max: 5, scoreboardTracker: "health" },
    HEALTH_EPIC: { name: "§5Health", rarity: "Epic", min: 4, max: 7, scoreboardTracker: "health" },
    HEALTH_LEGENDARY: { name: "§6Health", rarity: "Legendary", min: 5, max: 8, scoreboardTracker: "health" },
    HEALTH_MYTHIC: { name: "§cHealth", rarity: "Mythic", min: 6, max: 10, scoreboardTracker: "health" },
    
    // CRITICAL CHANCE - All items
    CRIT_CHANCE_COMMON: { name: "§8Crit Chance", rarity: "Common", min: 1, max: 3, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_UNCOMMON: { name: "§aCrit Chance", rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_RARE: { name: "§1Crit Chance", rarity: "Rare", min: 3, max: 7, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_EPIC: { name: "§5Crit Chance", rarity: "Epic", min: 5, max: 10, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_LEGENDARY: { name: "§6Crit Chance", rarity: "Legendary", min: 8, max: 15, scoreboardTracker: "critchance", measure: "%" },
    CRIT_CHANCE_MYTHIC: { name: "§cCrit Chance", rarity: "Mythic", min: 12, max: 20, scoreboardTracker: "critchance", measure: "%" },

    // CRITICAL DAMAGE - All items
    CRIT_DAMAGE_COMMON: { name: "§8Crit Damage", rarity: "Common", min: 1, max: 5, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_UNCOMMON: { name: "§aCrit Damage", rarity: "Uncommon", min: 4, max: 10, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_RARE: { name: "§1Crit Damage", rarity: "Rare", min: 9, max: 15, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_EPIC: { name: "§5Crit Damage", rarity: "Epic", min: 15, max: 22, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_LEGENDARY: { name: "§6Crit Damage", rarity: "Legendary", min: 21, max: 33, scoreboardTracker: "critdamage", measure: "%" },
    CRIT_DAMAGE_MYTHIC: { name: "§cCrit Damage", rarity: "Mythic", min: 33, max: 45, scoreboardTracker: "critdamage", measure: "%" },

    // REGENERATION - Epic+ items
    REGENERATION_EPIC: { name: "§5Regeneration", rarity: "Epic", min: 1, max: 2, scoreboardTracker: "regeneration", measure: "/10s" },
    REGENERATION_LEGENDARY: { name: "§6Regeneration", rarity: "Legendary", min: 1, max: 3, scoreboardTracker: "regeneration", measure: "/10s" },
    REGENERATION_MYTHIC: { name: "§cRegeneration", rarity: "Mythic", min: 3, max: 4, scoreboardTracker: "regeneration", measure: "/10s" },

    // DAMAGE PERCENT - All items
    DAMAGE_PERCENT_COMMON: { name: "§8Damage%", rarity: "Common", min: 1, max: 3, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_UNCOMMON: { name: "§aDamage%", rarity: "Uncommon", min: 2, max: 5, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_RARE: { name: "§1Damage%", rarity: "Rare", min: 3, max: 7, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_EPIC: { name: "§5Damage%", rarity: "Epic", min: 5, max: 10, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_LEGENDARY: { name: "§6Damage%", rarity: "Legendary", min: 8, max: 15, scoreboardTracker: "damagepercent", measure: "%" },
    DAMAGE_PERCENT_MYTHIC: { name: "§cDamage%", rarity: "Mythic", min: 12, max: 20, scoreboardTracker: "damagepercent", measure: "%" },

    // LIFE STEAL - Rare+ items
    LIFESTEAL_RARE: { name: "§1Life Steal", rarity: "Rare", min: 1, max: 2, scoreboardTracker: "lifesteal", measure: "%" },
    LIFESTEAL_EPIC: { name: "§5Life Steal", rarity: "Epic", min: 2, max: 4, scoreboardTracker: "lifesteal", measure: "%" },
    LIFESTEAL_LEGENDARY: { name: "§6Life Steal", rarity: "Legendary", min: 3, max: 6, scoreboardTracker: "lifesteal", measure: "%" },
    LIFESTEAL_MYTHIC: { name: "§cLife Steal", rarity: "Mythic", min: 5, max: 8, scoreboardTracker: "lifesteal", measure: "%" }
};

// Skills definitions
const skills = {
    SMASH_LEAP: { name: "Smash Leap", description: "Leap forward and deal AoE damage", cooldown: 10 },
    SPIN_STRIKE: { name: "Spin Strike", description: "Spin attack damaging nearby enemies", cooldown: 8 },
    EXPLOSIVE_MINING: { name: "Explosive Mining", description: "Mine in a 3x3 area", cooldown: 15 },
    RAY_MINER: { name: "Ray Miner", description: "Mine in a straight line", cooldown: 12 },
    EXCAVATOR: { name: "Excavator", description: "Mine a large area", cooldown: 20 },
    FLAME_ARC: { name: "Flame Arc", description: "Fire projectile that burns enemies", cooldown: 6 },
    SHADOW_DASH: { name: "Shadow Dash", description: "Teleport through enemies dealing damage", cooldown: 14 },
    VOID_PIERCE: { name: "Void Pierce", description: "Piercing attack that ignores armor", cooldown: 18 }
};

// Passives definitions
const passives = {
    THORNS: { name: "Thorns", description: "Reflect damage back to attackers" },
    FIRE_AURA: { name: "Fire Aura", description: "Burn nearby enemies" },
    ICE_SHIELD: { name: "Ice Shield", description: "Chance to freeze attackers" },
    LIGHTNING_STRIKE: { name: "Lightning Strike", description: "Chance to strike with lightning" },
    VAMPIRE: { name: "Vampire", description: "Heal when dealing damage" },
    BERSERKER: { name: "Berserker", description: "Damage increases when health is low" },
    GUARDIAN: { name: "Guardian", description: "Reduce damage when health is high" },
    SWIFT: { name: "Swift", description: "Increased movement speed in combat" }
};

//=====================================ITEM EDITOR CONFIGURATION===========================================

// Get available stats for a specific rarity
function getStatsForRarity(rarityName) {
    const availableStats = [];
    for (const [key, stat] of Object.entries(stats)) {
        if (stat.rarity === rarityName) {
            availableStats.push({ key, ...stat });
        }
    }
    return availableStats;
}

// Get all available skills
function getAvailableSkills() {
    const availableSkills = [];
    for (const [key, skill] of Object.entries(skills)) {
        availableSkills.push({ key, ...skill });
    }
    return availableSkills;
}

// Get all available passives
function getAvailablePassives() {
    const availablePassives = [];
    for (const [key, passive] of Object.entries(passives)) {
        availablePassives.push({ key, ...passive });
    }
    return availablePassives;
}

// Generate random value within min-max range
function generateRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create item lore based on rarity and stats
function createItemLore(itemName, rarity, selectedStats, selectedSkill, selectedPassive) {
    const lore = [];
    
    // Add rarity line
    lore.push(`${rarity.dName}`);
    lore.push("");
    
    // Add stats
    for (const statEntry of selectedStats) {
        const value = generateRandomValue(statEntry.min, statEntry.max);
        const measure = statEntry.measure || "";
        lore.push(`${statEntry.name}: +${value}${measure}`);
    }
    
    if (selectedStats.length > 0) {
        lore.push("");
    }
    
    // Add skill if selected
    if (selectedSkill) {
        lore.push(`§b⚡ ${selectedSkill.name}`);
        lore.push(`§7${selectedSkill.description || "Active skill"}`);
        lore.push("");
    }
    
    // Add passive if selected
    if (selectedPassive) {
        lore.push(`§d◉ ${selectedPassive.name}`);
        lore.push(`§7${selectedPassive.description || "Passive ability"}`);
        lore.push("");
    }
    
    // Add footer
    lore.push("§8Custom Item");
    
    return lore;
}

// Create item tags based on selections
function createItemTags(rarity, selectedStats, selectedSkill, selectedPassive) {
    const tags = [];
    
    // Add rarity tag
    tags.push(`rarity_${rarity.sid.toLowerCase()}`);
    
    // Add stat tags
    for (const statEntry of selectedStats) {
        const value = generateRandomValue(statEntry.min, statEntry.max);
        tags.push(`${statEntry.scoreboardTracker}_${value}`);
    }
    
    // Add skill tag if selected
    if (selectedSkill) {
        tags.push(`skill_${selectedSkill.key.toLowerCase()}`);
    }
    
    // Add passive tag if selected
    if (selectedPassive) {
        tags.push(`passive_${selectedPassive.key.toLowerCase()}`);
    }
    
    return tags;
}

// Main editor form
function showItemEditor(player) {
    const form = new ModalFormData()
        .title("§6Item Rarity Editor §r- Create Custom Items");
    
    // Base item ID input
    form.textField("Base Item ID", "Enter item ID (e.g. minecraft:diamond_sword)", "minecraft:diamond_sword");
    
    // Custom item name
    form.textField("Custom Item Name", "Enter custom name", "Epic Sword");
    
    // Rarity selection
    const rarityOptions = Object.values(RARITY).map(rarity => rarity.dName);
    form.dropdown("Item Rarity", rarityOptions, 2); // Default to Rare
    
    // Number of stats to add
    form.slider("Number of Stats", 0, 6, 1, 2);
    
    // Include skill toggle
    form.toggle("Include Active Skill", false);
    
    // Include passive toggle
    form.toggle("Include Passive Ability", false);
    
    form.submitButton("§aCreate Item");
    
    form.show(player).then((response) => {
        if (response.canceled) return;
        
        const baseItemId = response.formValues[0] || "minecraft:diamond_sword";
        const customName = response.formValues[1] || "Custom Item";
        const rarityIndex = response.formValues[2];
        const numStats = response.formValues[3];
        const includeSkill = response.formValues[4];
        const includePassive = response.formValues[5];
        
        // Validate item ID format
        if (!baseItemId.includes(":")) {
            player.sendMessage("§cInvalid item ID format! Use namespace:item format (e.g. minecraft:diamond_sword)");
            return;
        }
        
        const selectedRarity = Object.values(RARITY)[rarityIndex];
        
        // Show second form for detailed configuration
        showDetailedEditor(player, baseItemId, customName, selectedRarity, numStats, includeSkill, includePassive);
    });
}

// Detailed configuration form
function showDetailedEditor(player, baseItemId, customName, rarity, numStats, includeSkill, includePassive) {
    const form = new ModalFormData()
        .title(`§6Configuring: ${rarity.dName} ${customName}`)
        .textField("Item ID Preview", "Base item", baseItemId);
    
    // Get available stats for this rarity
    const availableStats = getStatsForRarity(rarity.sid);
    
    // Add stat selection dropdowns
    for (let i = 0; i < numStats; i++) {
        if (availableStats.length > 0) {
            const statOptions = availableStats.map(stat => 
                stat.name.replace(/§[0-9a-fk-or]/, "") + ` (${stat.min}-${stat.max}${stat.measure || ""})`
            );
            form.dropdown(`Stat ${i + 1}`, statOptions, i % availableStats.length);
        }
    }
    
    // Skill selection if enabled
    if (includeSkill) {
        const availableSkills = getAvailableSkills();
        if (availableSkills.length > 0) {
            const skillOptions = availableSkills.map(skill => skill.name);
            form.dropdown("Active Skill", skillOptions, 0);
        }
    }
    
    // Passive selection if enabled
    if (includePassive) {
        const availablePassives = getAvailablePassives();
        if (availablePassives.length > 0) {
            const passiveOptions = availablePassives.map(passive => passive.name);
            form.dropdown("Passive Ability", passiveOptions, 0);
        }
    }
    
    form.submitButton("§aGenerate Item");
    
    form.show(player).then((response) => {
        if (response.canceled) return;
        
        let responseIndex = 1; // Skip the item ID preview field
        
        // Get selected stats
        const selectedStats = [];
        const availableStats = getStatsForRarity(rarity.sid);
        for (let i = 0; i < numStats && availableStats.length > 0; i++) {
            const statIndex = response.formValues[responseIndex++];
            selectedStats.push(availableStats[statIndex]);
        }
        
        // Get selected skill
        let selectedSkill = null;
        if (includeSkill) {
            const availableSkills = getAvailableSkills();
            if (availableSkills.length > 0) {
                const skillIndex = response.formValues[responseIndex++];
                selectedSkill = availableSkills[skillIndex];
            }
        }
        
        // Get selected passive
        let selectedPassive = null;
        if (includePassive) {
            const availablePassives = getAvailablePassives();
            if (availablePassives.length > 0) {
                const passiveIndex = response.formValues[responseIndex++];
                selectedPassive = availablePassives[passiveIndex];
            }
        }
        
        // Create the custom item
        createCustomItem(player, baseItemId, customName, rarity, selectedStats, selectedSkill, selectedPassive);
    });
}

// Create and give the custom item to the player
function createCustomItem(player, baseItem, customName, rarity, selectedStats, selectedSkill, selectedPassive) {
    try {
        // Create the item
        const itemStack = new ItemStack(baseItem.id, 1);
        
        // Set custom name with rarity color
        const coloredName = `${rarity.color}${customName}`;
        itemStack.nameTag = coloredName;
        
        // Create lore
        const lore = createItemLore(customName, rarity, selectedStats, selectedSkill, selectedPassive);
        itemStack.setLore(lore);
        
        // Create tags
        const tags = createItemTags(rarity, selectedStats, selectedSkill, selectedPassive);
        
        // Add tags to item
        for (const tag of tags) {
            itemStack.addTag(tag);
        }
        
        // Give item to player
        const inventory = player.getComponent("minecraft:inventory");
        if (inventory) {
            // Try to add to inventory, if full, drop at player location
            const remainingItems = inventory.container.addItem(itemStack);
            if (remainingItems) {
                player.dimension.spawnItem(remainingItems, player.location);
            }
            
            player.sendMessage(`§a✓ Created custom item: ${coloredName}`);
            player.sendMessage(`§7Stats: ${selectedStats.length} | Skill: ${selectedSkill ? '✓' : '✗'} | Passive: ${selectedPassive ? '✓' : '✗'}`);
        }
        
    } catch (error) {
        player.sendMessage(`§cError creating item: ${error.message}`);
        console.error("Item creation error:", error);
    }
}

//=====================================EVENT HANDLERS===========================================

// Listen for rssp:editor item usage
world.afterEvents.itemUse.subscribe((event) => {
    const player = event.source;
    const item = event.itemStack;
    
    // Check if the used item is the editor
    if (item && item.typeId === "rssp:editor") {
        // Prevent the default item use
        system.run(() => {
            showItemEditor(player);
        });
    }
});

// Alternative: Listen for item usage with specific tag
world.afterEvents.itemUse.subscribe((event) => {
    const player = event.source;
    const item = event.itemStack;
    
    // Check if the item has the editor tag
    if (item && item.hasTag && item.hasTag("item_editor")) {
        system.run(() => {
            showItemEditor(player);
        });
    }
});

//=====================================UTILITY COMMANDS===========================================

// Debug command to give editor item (if needed)
world.afterEvents.chatSend.subscribe((event) => {
    const player = event.sender;
    const message = event.message;
    
    if (message === "!give-editor" && player.hasTag("admin")) {
        try {
            const editorItem = new ItemStack("minecraft:nether_star", 1);
            editorItem.nameTag = "§6Item Rarity Editor";
            editorItem.setLore([
                "§7Use this item to create custom",
                "§7items with rarities and stats",
                "",
                "§eRight-click to open editor"
            ]);
            editorItem.addTag("item_editor");
            
            const inventory = player.getComponent("minecraft:inventory");
            inventory.container.addItem(editorItem);
            player.sendMessage("§aEditor item given!");
        } catch (error) {
            player.sendMessage(`§cError: ${error.message}`);
        }
    }
});

export { showItemEditor, createCustomItem };