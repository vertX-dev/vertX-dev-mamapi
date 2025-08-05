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
        player.runCommand("tell @s clear inventory to get " + item.nameTag);
        system.runTimeout(() => giveItem(player, item, container), 160);
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