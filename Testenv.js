import { world, EquipmentSlot, system, ItemStack } from "@minecraft/setver";

const ITEMS = [
    "minecraft:apple"
];

function getRandomItems() {
    const items = Object.values(ITEMS);
    
    ritems = [];
    
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
    if (fullItems.length > 0) system.runTimeout(() => giveItem(player, fullItems, container), 200);
}

function createItems(itemIds) {
    let items = [];
    
    for (const itemId of itemIds) {
        items.push(new ItemStack(itemId));
    }
    
    return items;
}

world.afterEvents.playerSpawn.subscribe((ev) => {
    if (ev.initialSpawn) {
        giveItems(ev.player, createItems(getRandomItems()));
    }
});