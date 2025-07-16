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
    skills
} from './skillsLib.js';

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

export function showEnhancedSkillUpgradeMenu(equipment, player, itemStack) {
    const currentRarity = getItemRarity(itemStack);
    const upgradeCost = UPGRADE_COSTS.SKILL_UPGRADE[currentRarity];
    const upgradeCounter = getUpgradeCounter(itemStack, "Skill Upgrade");
    const adjustedCost = upgradeCost ? calculateCostWithCounter(upgradeCost.requiredItems, upgradeCounter) : null;
    
    const form = new ModalFormData();
    form.title("§9Skill Upgrade Menu");
    
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
        performBulkSkillUpgrade(equipment, player, itemStack, adjustedCost, upgradeCost, attempts, upgradeCounter);
    });
}

export function showEnhancedSkillRerollMenu(equipment, player, itemStack) {
    const currentRarity = getItemRarity(itemStack);
    const rerollCost = UPGRADE_COSTS.SKILL_REROLL[currentRarity];
    const rerollCounter = getUpgradeCounter(itemStack, "Skill Reroll");
    const adjustedCost = rerollCost ? calculateCostWithCounter(rerollCost.requiredItems, rerollCounter) : null;
    
    const form = new ModalFormData();
    form.title("§bSkill Reroll Menu");
    
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
        performBulkSkillReroll(equipment, player, itemStack, adjustedCost, attempts, rerollCounter);
    });
}

export function performBulkSkillUpgrade(equipment, player, itemStack, adjustedCost, upgradeCost, attempts, startingCounter) {
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
            // Upgrade skills - this would require implementing skill upgrade logic
            upgradeItemSkills(itemStack, upgradeCost.upgradeMultiplier);
            successCount++;
        }
        
        // Update counter
        const newCounter = startingCounter + i + 1;
        updateUpgradeCounter(itemStack, "Skill Upgrade", newCounter);
        
        // Update item in equipment slot
        const container = player.getComponent("equippable");
        container.setEquipment(equipment, itemStack);
    }
    
    const successRate = ((successCount / totalAttempts) * 100).toFixed(1);
    player.sendMessage(`§aSkill upgrade complete!\n§7Attempts: §e${totalAttempts}\n§7Successes: §e${successCount} (${successRate}%)`);
}

export function performBulkSkillReroll(equipment, player, itemStack, adjustedCost, attempts, startingCounter) {
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
        
        // Reroll skills - this would require implementing skill reroll logic
        const rarity = getItemRarity(itemStack);
        rerollItemSkills(itemStack, rarity);
        successCount++;
        
        // Update counter
        const newCounter = startingCounter + i + 1;
        updateUpgradeCounter(itemStack, "Skill Reroll", newCounter);
        
        // Update item in equipment slot
        const container = player.getComponent("equippable");
        container.setEquipment(equipment, itemStack);
    }
    
    player.sendMessage(`§aSkill reroll complete!\n§7Attempts: §e${totalAttempts}\n§7Skills rerolled: §e${successCount}`);
}

// Helper functions that would need to be implemented
function upgradeItemSkills(itemStack, multiplier) {
    // Implementation would depend on how skills are stored in the item lore
    // This is a placeholder for the actual skill upgrade logic
}

function rerollItemSkills(itemStack, rarity) {
    // Implementation would depend on how skills are stored in the item lore
    // This is a placeholder for the actual skill reroll logic
}