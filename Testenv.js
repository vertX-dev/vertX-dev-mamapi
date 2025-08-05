import { world, EquipmentSlot, system } from "@minecraft/setver";

const ITEMS = [
    "minecraft:apple"
];

function getRandomItem() {
    return ITEMS[Math.floor(Math.random() * ITEMS.length)];
}

world.afterEvents.playerSpawn.subscribe((ev) => {
    
});