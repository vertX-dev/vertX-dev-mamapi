import { world, EquipmentSlot, system, ItemStack } from "@minecraft/setver";

const ITEMS = [
    "minecraft:apple"
];

function getRandomItem() {
    const items = Object.values(ITEMS);
    
    ritems = [];
    
    return ritems;
}

function giveItem(player, items, container = player.getComponent("minecraft:inventory").container) {
    for (const item of items) {
        if (container.emptySlotsCount > 0) {
            container.addItem(item);
        } else {
            player.runCommand("tell @s clear inventory to get " + item.nameTag);
            system.runTimeout(() => giveItem(player, item, container), 200);
        }
    }
}

function createItem(itemId) {
    return new ItemStack(itemId);
}

world.afterEvents.playerSpawn.subscribe((ev) => {
    if (ev.initialSpawn) {
        giveItem(ev.player, createItem(getRandomItem()));
    }
});