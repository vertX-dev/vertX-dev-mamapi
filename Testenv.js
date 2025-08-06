import { world, EquipmentSlot, system, ItemStack } from "@minecraft/setver";

const ITEMS = [
    {id: "pa:justice", chance: 0.55}
];

function getRandomItems() {
    ritems = [];
    for (const item of ITEMS) {
        if (Math.random() <= item.chance) ritems.push(item.id);
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
    if (fullItems.length > 0) system.runTimeout(() => giveItem(player, fullItems, container), 200);
}

function createItems(itemIds) {
    let items = [];
    
    for (const itemId of itemIds) {
        items.push(new ItemStack(itemId));
    }
    
    return items;
}

world.afterEvents.itemUse.subscribe((ev) => {
    if (!ev.source.hasTag("getpasoul") && ev.ItemStack.typeId == "pa:soul") {
        giveItems(ev.source, createItems(getRandomItems()));
        ev.source.addTag("getpasoul");
    }
});