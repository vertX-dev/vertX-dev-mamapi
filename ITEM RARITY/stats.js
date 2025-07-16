import {
    world,
    system,
    EquipmentSlot,
    GameMode,
    ItemStack
} from "@minecraft/server";
import {
    ActionFormData,
    ModalFormData,
    FormCancelationReason,
    uiManager
} from "@minecraft/server-ui";
import {
    RARITY,
    blackList,
    TagMapping,
    UPGRADE_COSTS
} from './mainLib.js';
import {
    stats
} from './statsLib.js';

// Import required functions from main.js
import { 
    getItemRarity, 
    getUpgradeCounter, 
    calculateCostWithCounter, 
    getUpgradeTemplates, 
    hasRequiredItems, 
    countItemInInventory, 
    removeItemFromInventory, 
    updateUpgradeCounter,
    showStatsForm,
    showEnhancedSettingsForm,
    msifMenu,
    upgradeMenu
} from './main.js';

export function getStatsFromLore(itemStack) {
    const lore = itemStack.getLore() ?? [];
    const stats = [];
    let inStatsSection = false;
    
    for (const line of lore) {
        if (line === "§8Attributes") {
            inStatsSection = true;
            continue;
        }
        if (line === "§a§t§b§e§n§d§r") {
            break;
        }
        if (inStatsSection && line.includes("§w")) {
            stats.push(line);
        }
    }
    return stats;
}

export function statsMainMenu(player) {
    const menu = new ActionFormData()
        .title('SELECT OPTION')
        .button('STATS', 'textures/ui/gamerpic')
        .button('SETTINGS', 'textures/ui/automation_glyph_color')
        .button('PC MODE', 'textures/ui/addServer')
        .button('FORGE', 'textures/ui/smithing_icon');

    menu.show(player).then((r) => {
        if (!r.canceled) {
            switch (r.selection) {
                case 0:
                    showStatsForm(player, true);
                    break;
                case 1:
                    showEnhancedSettingsForm(player);
                    break;
                case 2:
                    uiManager.closeAllForms(player);
                    player.addTag("pc_mode");
                    player.sendMessage("PC MODE ENABLED\nUse .help for additional info\nYou need to enable beta API");
                    break;
                case 3:
                    upgradeMenu(player);
                    break;
            }
        } else {
            uiManager.closeAllForms(player);
            if (!player.hasTag("pc_mode")) {
                msifMenu(player);
            }
        }
    });
}

export function showEnhancedStatsRerollMenu(equipment, player, itemStack) {
    const currentRarity = getItemRarity(itemStack);
    const rerollCost = UPGRADE_COSTS.STATS_REROLL[currentRarity];
    const rerollCounter = getUpgradeCounter(itemStack, "Stats Reroll");
    const adjustedCost = rerollCost ? calculateCostWithCounter(rerollCost.requiredItems, rerollCounter) : null;
    
    const form = new ModalFormData();
    form.title("§aStats Reroll Menu");
    
    if (!rerollCost) {
        form.textField("OK", "", {
            defaultValue: "§cThis item cannot be rerolled!"
        });
        form.show(player);
        return;
    }
    
    const upgradeTemplates = getUpgradeTemplates(player);
    const requirements = adjustedCost.map(req => `${req.count}x ${req.item.replace("minecraft:", "").replace("rrs:", "")}`).join(", ");
    const canAfford = hasRequiredItems(player, adjustedCost);
    const currentStats = getStatsFromLore(itemStack);
    
    let formText = `§7Current Rarity: §e${currentRarity}\n§7Reroll Count: §c${rerollCounter}\n§7Your RRS: §a${upgradeTemplates}\n§7Base Cost: §e${requirements}\n§7Can Afford: ${canAfford ? '§aYes' : '§cNo'}\n\n§7Current Stats:`;
    currentStats.forEach((stat, index) => {
        formText += `\n§7${index + 1}. ${stat}`;
    });
    
    form.textField("Reroll Details", "", {
        defaultValue: formText
    });
    
    // Add checkboxes for locking stats
    currentStats.forEach((stat, index) => {
        form.toggle(`§eLock Stat ${index + 1}: ${stat.replace(/§./g, '')}`, {
            defaultValue: false
        });
    });
    
    form.slider("§6Bulk Attempts", 1, Math.min(5, canAfford ? Math.floor(adjustedCost.reduce((max, req) => Math.min(max, countItemInInventory(player, req.item) / req.count), Infinity)) : 1), {
        step: 1,
        defaultValue: 1
    });
    form.toggle("§aConfirm Reroll", {
        defaultValue: false
    });
    
    form.show(player).then((response) => {
        if (response.canceled || !response.formValues[response.formValues.length - 1]) {
            player.sendMessage("§7Reroll cancelled.");
            return;
        }
        
        const lockedStats = [];
        for (let i = 1; i <= currentStats.length; i++) {
            if (response.formValues[i]) {
                lockedStats.push(i - 1);
            }
        }
        
        const attempts = response.formValues[response.formValues.length - 2];
        performBulkStatsReroll(equipment, player, itemStack, adjustedCost, attempts, rerollCounter, lockedStats);
    });
}

export function showEnhancedStatsUpgradeMenu(equipment, player, itemStack) {
    const currentRarity = getItemRarity(itemStack);
    const upgradeCost = UPGRADE_COSTS.STATS_UPGRADE[currentRarity];
    const upgradeCounter = getUpgradeCounter(itemStack, "Stats Upgrade");
    const adjustedCost = upgradeCost ? calculateCostWithCounter(upgradeCost.requiredItems, upgradeCounter) : null;
    
    const form = new ModalFormData();
    form.title("§2Stats Upgrade Menu");
    
    if (!upgradeCost) {
        form.textField("OK", "", {
            defaultValue: "§cThis item cannot be upgraded!"
        });
        form.show(player);
        return;
    }
    
    const upgradeTemplates = getUpgradeTemplates(player);
    const requirements = adjustedCost.map(req => `${req.count}x ${req.item.replace("minecraft:", "").replace("rrs:", "")}`).join(", ");
    const canAfford = hasRequiredItems(player, adjustedCost);
    const currentStats = getStatsFromLore(itemStack);
    
    let formText = `§7Current Rarity: §e${currentRarity}\n§7Success Rate: §a${(upgradeCost.successChance * 100).toFixed(1)}%\n§7Upgrade Count: §c${upgradeCounter}\n§7Multiplier: §ax${upgradeCost.upgradeMultiplier}\n§7Your RRS: §a${upgradeTemplates}\n§7Required: §e${requirements}\n§7Can Afford: ${canAfford ? '§aYes' : '§cNo'}\n\n§7Current Stats:`;
    currentStats.forEach((stat, index) => {
        formText += `\n§7${index + 1}. ${stat}`;
    });
    
    form.textField("Upgrade Details", "", {
        defaultValue: formText
    });
    form.slider("§6Bulk Attempts", 1, Math.min(5, canAfford ? Math.floor(adjustedCost.reduce((max, req) => Math.min(max, countItemInInventory(player, req.item) / req.count), Infinity)) : 1), {
        step: 1,
        defaultValue: 1
    });
    form.toggle("§aConfirm Upgrade", {
        defaultValue: false
    });
    
    form.show(player).then((response) => {
        if (response.canceled || !response.formValues[2]) {
            player.sendMessage("§7Upgrade cancelled.");
            return;
        }
        
        const attempts = response.formValues[1];
        performBulkStatsUpgrade(equipment, player, itemStack, adjustedCost, upgradeCost, attempts, upgradeCounter);
    });
}

export function performBulkStatsReroll(equipment, player, itemStack, adjustedCost, attempts, startingCounter, lockedStats = []) {
    if (!hasRequiredItems(player, adjustedCost, attempts)) {
        player.sendMessage("§cYou don't have enough items for this many attempts!");
        return;
    }

    let successCount = 0;
    let totalAttempts = 0;
    
    for (let i = 0; i < attempts; i++) {
        if (!hasRequiredItems(player, adjustedCost)) {
            player.sendMessage(`§eRan out of resources after ${i} attempts.`);
            break;
        }
        
        // Consume items for this attempt
        adjustedCost.forEach(cost => {
            const item = cost.item;
            const count = cost.count;
            removeItemFromInventory(player, item, count);
        });
        
        totalAttempts++;
        
        // Get current stats for rerolling (excluding locked ones)
        const currentStats = getStatsFromLore(itemStack);
        const newStats = [];
        
        currentStats.forEach((stat, index) => {
            if (lockedStats.includes(index)) {
                // Keep the locked stat as is
                newStats.push(stat);
            } else {
                // Reroll this stat
                const rarity = getItemRarity(itemStack);
                const newStat = generateRandomStat(rarity);
                newStats.push(newStat);
                successCount++;
            }
        });
        
        // Update lore with new stats
        updateItemStatsInLore(itemStack, newStats);
        
        // Update counter
        const newCounter = startingCounter + i + 1;
        updateUpgradeCounter(itemStack, "Stats Reroll", newCounter);
        
        // Update item in equipment slot
        const container = player.getComponent("equippable");
        container.setEquipment(equipment, itemStack);
    }
    
    player.sendMessage(`§aStats reroll complete!\n§7Attempts: §e${totalAttempts}\n§7Stats rerolled: §e${successCount}`);
}

export function performBulkStatsUpgrade(equipment, player, itemStack, adjustedCost, upgradeCost, attempts, startingCounter) {
    if (!hasRequiredItems(player, adjustedCost, attempts)) {
        player.sendMessage("§cYou don't have enough items for this many attempts!");
        return;
    }

    let successCount = 0;
    let totalAttempts = 0;
    
    for (let i = 0; i < attempts; i++) {
        if (!hasRequiredItems(player, adjustedCost)) {
            player.sendMessage(`§eRan out of resources after ${i} attempts.`);
            break;
        }
        
        // Consume items for this attempt
        adjustedCost.forEach(cost => {
            const item = cost.item;
            const count = cost.count;
            removeItemFromInventory(player, item, count);
        });
        
        totalAttempts++;
        
        // Determine if this attempt succeeds
        const success = Math.random() < upgradeCost.successChance;
        
        if (success) {
            // Get current stats and upgrade them
            const currentStats = getStatsFromLore(itemStack);
            const upgradedStats = currentStats.map(stat => {
                return upgradeStatValue(stat, upgradeCost.upgradeMultiplier);
            });
            
            // Update lore with upgraded stats
            updateItemStatsInLore(itemStack, upgradedStats);
            successCount++;
        }
        
        // Update counter
        const newCounter = startingCounter + i + 1;
        updateUpgradeCounter(itemStack, "Stats Upgrade", newCounter);
        
        // Update item in equipment slot
        const container = player.getComponent("equippable");
        container.setEquipment(equipment, itemStack);
    }
    
    const successRate = ((successCount / totalAttempts) * 100).toFixed(1);
    player.sendMessage(`§aStats upgrade complete!\n§7Attempts: §e${totalAttempts}\n§7Successes: §e${successCount} (${successRate}%)`);
}