import { world, system, MoonPhase, EquipmentSlot } from "@minecraft/server";
import { AtctionFormData } from "@minecraft/server-ui";

world.afterEvents.itemUse.subscribe((ev) => {
    if (ev.itemStack.typeId == "pa:undertale_book") uiMenu(ev.source);
});

function uiMenu(player) {
    const equippable = player.getComponent("minecraft:equippable");
    const itemStack = equippable.getEquipment(EquipmentSlot.Mainhand);
    
    
}