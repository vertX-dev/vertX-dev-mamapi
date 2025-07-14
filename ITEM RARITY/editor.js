import { world, system, EquipmentSlot, ItemStack } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { RARITY, stats, skills, passives } from './dataLib.js';

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