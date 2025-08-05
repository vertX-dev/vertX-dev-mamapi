import { world, EquipmentSlot, system, ItemStack } from "@minecraft/setver";

const ITEMS = [
    "minecraft:apple"
];

function getRandomItem() {
    return ITEMS[Math.floor(Math.random() * ITEMS.length)];
}

function giveItem(player, item, container = player.getComponent("minecraft:inventory").container) {
    if (container.emptySlotsCount > 0) {
        container.addItem(item);
    } else {
        system.runTimeout(() => giveItem(player, item, container), 100);
    }
}

world.afterEvents.playerSpawn.subscribe((ev) => {
    
});