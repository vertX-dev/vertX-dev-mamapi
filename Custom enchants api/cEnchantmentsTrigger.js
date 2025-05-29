j/*======================
 * Global Imports
 *======================*/
import { world, system, EquipmentSlot, EntityComponentTypes } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { itemTagMapping, structureData } from './cEnchantmentsConfig.js';
import { enchantments } from './cEnchantmentsData.js'



/*======================
  Utility Functions
 ======================*/
function romanToInt(roman) {
    const romanMap = {
        I: 1,
        V: 5,
        X: 10,
        L: 50,
        C: 100,
        D: 500,
        M: 1000
    };

    let num = 0;
    let prevValue = 0;

    // Process the numeral from right to left
    for (let i = roman.length - 1; i >= 0; i--) {
        const currentValue = romanMap[roman[i]];
        if (currentValue === undefined) {
            throw new Error("Invalid Roman numeral character encountered: " + roman[i]);
        }

        if (currentValue < prevValue) {
            num -= currentValue;
        } else {
            num += currentValue;
            prevValue = currentValue;
        }
    }

    return num;
}

function getItemTags(itemId) {
    // Loop through mapping and see if itemId contains one of the keys.
    for (const key in itemTagMapping) {
        if (itemId.includes(key)) {
            // Always include the "all" tag.
            return ["all", ...itemTagMapping[key]];
        }
    }
    player.sendMessage("§c[MINECRAFT] This item is not recognized as a known item.");
    return [];
}

function parseEnchantments(loreArray) {
    let enchants = {};
    let otherLore = [];
    for (let line of loreArray) {
        // Split the line into words; assume the last word is a potential Roman numeral.
        let words = line.trim().split(" ");
        if (words.length >= 2) {
            let possibleRoman = words[words.length - 1];
            let level = romanToInt(possibleRoman);
            // If the numeral converts to a valid level (> 0), treat this line as an enchantment.
            if (level && level > 0) {
                // The enchantment name is the remainder of the line.
                let name = words.slice(0, words.length - 1).join(" ");
                enchants[name] = level;
                continue;
            }
        }
        // If the line does not match the expected pattern, treat it as general lore.
        otherLore.push(line);
    }
    return {
        enchants,
        otherLore
    };
}

function hasLore(stack) { 
    if (!stack) return false; 
    const lore = stack.getLore(); 
    return Array.isArray(lore) && lore.length > 0; 
}

//============TRIGGERS==================================


/** Add custom scripting event to enchant
            case 'customEvent':
                window[data.triggers.function]?.(event, damagingEntity, hitEntity);
                break;
 */

world.afterEvents.entityHitEntity.subscribe((event) => {
    const damagingEntity = event.damagingEntity;
    if (damagingEntity.typeId !== "minecraft:player") return;

    const weaponStack = damagingEntity.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
    if (!hasLore(weaponStack)) return;

    const lore = weaponStack.getLore();
    let { enchants: allEnchantments } = parseEnchantments(lore);

    const weaponTags = getItemTags(weaponStack.typeId);
    if (["armor", "ranged", "book", "elytra"].some(tag => weaponTags.includes(tag))) return;
    if (!weaponTags.includes("weapon")) return;

    const hitEntity = event.hitEntity;
    for (const [enchantName, level] of Object.entries(allEnchantments)) {
        const data = Object.values(enchantments).find(e => e.name === enchantName);
        if (!data?.triggers) continue;
        
        switch (data.triggers.event) {
            case 'customEvent':
                window[data.triggers.function]?.(event, damagingEntity, hitEntity);
                break;
        }
    }
});

world.afterEvents.entityHurt.subscribe((event) => {
    const hurtEntity = event.hurtEntity;
    const equipment = hurtEntity.getComponent("minecraft:equippable");
    if (!equipment) return;

    const armorSlots = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet];
    for (const slot of armorSlots) {
        const armorStack = equipment.getEquipment(slot);
        if (!hasLore(armorStack)) continue;

        const lore = armorStack.getLore();
        let { enchants: armorEnchants } = parseEnchantments(lore);
        const armorTags = getItemTags(armorStack.typeId);
        if (!armorTags.includes("armor")) continue;

        for (const [enchantName, level] of Object.entries(armorEnchants)) {
            const data = Object.values(enchantments).find(e => e.name === enchantName);
            if (!data?.triggers) continue;
            
            switch (data.triggers.event) {
                case 'customArmorEvent':
                    window[data.triggers.function]?.(event, hurtEntity, sourceEntity);
                    break;
            }
        }
    }
});

world.afterEvents.projectileHitEntity.subscribe((event) => {
    const source = event.source;
    if (source.typeId !== "minecraft:player") return;

    const weaponStack = source.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
    if (!hasLore(weaponStack)) return;

    const lore = weaponStack.getLore();
    let { enchants: rangedEnchants } = parseEnchantments(lore);

    const tags = getItemTags(weaponStack.typeId);
    if (!tags.includes("ranged")) return;

    const hitInfo = event.getEntityHit();
    const target = hitInfo.entity;

    for (const [enchantName, level] of Object.entries(rangedEnchants)) {
        const data = Object.values(enchantments).find(e => e.name === enchantName);
        if (!data?.triggers) continue;
        
        switch (data.triggers.event) {
            case 'customRangedEvent':
                window[data.triggers.function]?.(event, source, target);
                break;
        }
    }
});

world.afterEvents.playerBreakBlock.subscribe((event) => {
    const player = event.player;
    if (player.typeId !== "minecraft:player") return;

    const toolStack = event.itemStackBeforeBreak;
    if (!hasLore(toolStack)) return;

    const lore = toolStack.getLore();
    let { enchants: toolEnchants } = parseEnchantments(lore);
    const tags = getItemTags(toolStack.typeId);
    if (!tags.includes("tool")) return;

    for (const [enchantName, level] of Object.entries(toolEnchants)) {
        const data = Object.values(enchantments).find(e => e.name === enchantName);
        if (!data?.triggers) continue;
        
        switch (data.triggers.event) {
            case 'customToolEvent':
                window[data.triggers.function]?.(event, player);
                break;
        }
    }
});

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (player.typeId !== "minecraft:player") continue;
        const equipment = player.getComponent("minecraft:equippable");
        if (!equipment) continue;

        const slots = [
            EquipmentSlot.Mainhand,
            EquipmentSlot.Offhand,
            EquipmentSlot.Head,
            EquipmentSlot.Chest,
            EquipmentSlot.Legs,
            EquipmentSlot.Feet
        ];
        for (const slot of slots) {
            const itemStack = equipment.getEquipment(slot);
            if (!hasLore(itemStack)) continue;

            const lore = itemStack.getLore();
            let { enchants: slotEnchants } = parseEnchantments(lore);
            const tags = getItemTags(itemStack.typeId);
            if (tags.length === 0) continue;

            for (const [enchantName, level] of Object.entries(slotEnchants)) {
                const data = Object.values(enchantments).find(e => e.name === enchantName);
                if (!data?.triggers) continue;
                
                switch (data.triggers.event) {
                    case 'customTickEvent':
                        window[data.triggers.function]?.(player, itemStack, slot);
                        break;
                }
            }
        }
    }
}, 20);

//=================CUSTOM FUNCTIONS===========================










