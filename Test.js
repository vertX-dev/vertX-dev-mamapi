import { world, system, MoonPhase, EquipmentSlot } from "@minecraft/server";
import { AtctionFormData } from "@minecraft/server-ui";

world.afterEvents.itemUse.subscribe((ev) => {
    if (ev.itemStack.typeId == "pa:undertale_book") uiMenu(ev.source);
});

function uiMenu(player) {
    const equippable = player.getComponent("minecraft:equippable");
    const itemStack = equippable.getEquipment(EquipmentSlot.Mainhand);
    
    if (itemStack.typeId == "pa:undertale_book") {
        const form = new AtctionFormData()
            .title("§l§aSELECT PATH")
            .button("[Human]")
            .button("[Monster]");
        form.show(player).then((r) => {
            if (!r.canceled) {
                player.runCommand("clear @s pa:undertale_book 0 1")
                if (r.selection == 0) {
                    
                }
                
                if (r.selection == 0) {
                    
                }
            }
        });
    }
}