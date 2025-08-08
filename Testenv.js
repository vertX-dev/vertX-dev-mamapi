import { world, EquipmentSlot, system, ItemStack } from "@minecraft/setver";

const ITEMS = [
    {id: "pa:soul", chance: 0.95},
    {id: "pa:integrity", chance: 0.55},
    {id: "pa:perseverance", chance: 0.50},
    {id: "pa:kindness", chance: 0.45},
    {id: "pa:patience", chance: 0.40},
    {id: "pa:bravery", chance: 0.35},
    {id: "pa:justice", chance: 0.20},
    {id: "pa:fear", chance: 0.5},
    {id: "pa:hate", chance: 0.4},
    {id: "pa:determination", chance: 0.3},
    {id: "pa:true_determination", chance: 0.1}
];

function getRandomItems() {
    let ritems = [];
    for (const item of ITEMS) {
        if (Math.random() <= item.chance) ritems.push(item.id);
        if (ritems.length >= 1) break;
    }
    
    return ritems;
}

function giveItems(player, items, container = player.getComponent("minecraft:inventory").container) {
    let fullItems = [];
    for (const item of items) {
        if (container.emptySlotsCount > 0) {
            container.addItem(item);
        } else {
            player.runCommand("tell @s clear inventory to get " + item.nameTag);
            fullItems.push(item);
        }
    }
    if (fullItems.length > 0) system.runTimeout(() => giveItems(player, fullItems, container), 200);
}

function createItems(itemIds) {
    let items = [];
    
    for (const itemId of itemIds) {
        items.push(new ItemStack(itemId));
    }
    
    return items;
}

world.afterEvents.itemUse.subscribe((ev) => {
    if (!ev.source.hasTag("getpasoul") && ev.itemStack.typeId == "pa:soul") {
        ev.source.runCommand("clear @s pa:soul 0 1");
        giveItems(ev.source, createItems(getRandomItems()));
        ev.source.addTag("getpasoul");
    }
});