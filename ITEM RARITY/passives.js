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
    passives
} from './passivesLib.js';

// Import required functions from main.js
import { 
    getItemRarity, 
    getUpgradeCounter, 
    calculateCostWithCounter, 
    getUpgradeTemplates, 
    hasRequiredItems, 
    countItemInInventory, 
    removeItemFromInventory, 
    updateUpgradeCounter
} from './main.js';

export function showEnhancedPassiveUpgradeMenu(equipment, player, itemStack) {
    const currentRarity = getItemRarity(itemStack);
    const upgradeCost = UPGRADE_COSTS.PASSIVE_UPGRADE[currentRarity];
    const upgradeCounter = getUpgradeCounter(itemStack, "Passive Upgrade");
    const adjustedCost = upgradeCost ? calculateCostWithCounter(upgradeCost.requiredItems, upgradeCounter) : null;
    
    const form = new ModalFormData();
    form.title("§6Passive Upgrade Menu");
    
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
    
    form.textField("Upgrade Details", "", {
        defaultValue: `§7Current Rarity: §e${currentRarity}\n§7Success Rate: §a${(upgradeCost.successChance * 100).toFixed(1)}%\n§7Upgrade Count: §c${upgradeCounter}\n§7Multiplier: §ax${upgradeCost.upgradeMultiplier}\n§7Your RRS: §a${upgradeTemplates}\n§7Required: §e${requirements}\n§7Can Afford: ${canAfford ? '§aYes' : '§cNo'}`
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
        performBulkPassiveUpgrade(equipment, player, itemStack, adjustedCost, upgradeCost, attempts, upgradeCounter);
    });
}

export function showEnhancedPassiveRerollMenu(equipment, player, itemStack) {
    const currentRarity = getItemRarity(itemStack);
    const rerollCost = UPGRADE_COSTS.PASSIVE_REROLL[currentRarity];
    const rerollCounter = getUpgradeCounter(itemStack, "Passive Reroll");
    const adjustedCost = rerollCost ? calculateCostWithCounter(rerollCost.requiredItems, rerollCounter) : null;
    
    const form = new ModalFormData();
    form.title("§ePassive Reroll Menu");
    
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
    
    form.textField("Reroll Details", "", {
        defaultValue: `§7Current Rarity: §e${currentRarity}\n§7Reroll Count: §c${rerollCounter}\n§7Your RRS: §a${upgradeTemplates}\n§7Required: §e${requirements}\n§7Can Afford: ${canAfford ? '§aYes' : '§cNo'}`
    });
    
    form.slider("§6Bulk Attempts", 1, Math.min(5, canAfford ? Math.floor(adjustedCost.reduce((max, req) => Math.min(max, countItemInInventory(player, req.item) / req.count), Infinity)) : 1), {
        step: 1,
        defaultValue: 1
    });
    form.toggle("§aConfirm Reroll", {
        defaultValue: false
    });
    
    form.show(player).then((response) => {
        if (response.canceled || !response.formValues[2]) {
            player.sendMessage("§7Reroll cancelled.");
            return;
        }
        
        const attempts = response.formValues[1];
        performBulkPassiveReroll(equipment, player, itemStack, adjustedCost, attempts, rerollCounter);
    });
}

export function performBulkPassiveUpgrade(equipment, player, itemStack, adjustedCost, upgradeCost, attempts, startingCounter) {
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
            // Upgrade passives - this would require implementing passive upgrade logic
            upgradeItemPassives(itemStack, upgradeCost.upgradeMultiplier);
            successCount++;
        }
        
        // Update counter
        const newCounter = startingCounter + i + 1;
        updateUpgradeCounter(itemStack, "Passive Upgrade", newCounter);
        
        // Update item in equipment slot
        const container = player.getComponent("equippable");
        container.setEquipment(equipment, itemStack);
    }
    
    const successRate = ((successCount / totalAttempts) * 100).toFixed(1);
    player.sendMessage(`§aPassive upgrade complete!\n§7Attempts: §e${totalAttempts}\n§7Successes: §e${successCount} (${successRate}%)`);
}

export function performBulkPassiveReroll(equipment, player, itemStack, adjustedCost, attempts, startingCounter) {
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
        
        // Reroll passives - this would require implementing passive reroll logic
        const rarity = getItemRarity(itemStack);
        rerollItemPassives(itemStack, rarity);
        successCount++;
        
        // Update counter
        const newCounter = startingCounter + i + 1;
        updateUpgradeCounter(itemStack, "Passive Reroll", newCounter);
        
        // Update item in equipment slot
        const container = player.getComponent("equippable");
        container.setEquipment(equipment, itemStack);
    }
    
    player.sendMessage(`§aPassive reroll complete!\n§7Attempts: §e${totalAttempts}\n§7Passives rerolled: §e${successCount}`);
}

// Helper functions that would need to be implemented
function upgradeItemPassives(itemStack, multiplier) {
    // Implementation would depend on how passives are stored in the item lore
    // This is a placeholder for the actual passive upgrade logic
}

function rerollItemPassives(itemStack, rarity) {
    // Implementation would depend on how passives are stored in the item lore
    // This is a placeholder for the actual passive reroll logic
}