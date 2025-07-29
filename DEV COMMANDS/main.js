import {
    system,
    world,
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    EquipmentSlot
} from "@minecraft/server";

import {
    uiManager,
    ActionFormData,
    ModalFormData
} from "@minecraft/server-ui";


function hideString(str) {
  const marker = '§c§b§i§n§d§t';
  let encoded = '';
  for (const char of str) {
    encoded += `§${char}`;
  }
  encoded += '§r'; // Reset at the end
  return marker + encoded;
}

function revealString(hidden) {
  const marker = '§c§b§i§n§d§t';
  if (!hidden.startsWith(marker)) return null; // Not a hidden string

  // Remove marker and trailing reset
  let data = hidden.slice(marker.length).replace(/§r$/, '');

  // Extract each char after §
  const chars = [...data.matchAll(/§(.)/g)].map(match => match[1]);
  return chars.join('');
}

system.beforeEvents.startup.subscribe((init) => {
    const addLoreCommand = {
        name: "vertx:addlore",
        description: "add lore to item (saves existing lore).",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: "Lore string"}
        ],
        optionalParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "Targets"},
            { type: CustomCommandParamType.Boolean, name: "Add lore to bottom (default true)"}
        ]
    };
    
    const setLoreCommand = {
        name: "vertx:setlore",
        description: "set lore to item (replace existing lore).",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: "Lore string"}
        ],
        optionalParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "Targets"}
        ]
    };
    
    const bindCommandCommand = {
        name: "vertx:bindcommand",
        description: "Bind command to item",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: "Command"}
        ],
        optionalParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "Targets"}
        ]
    };
    
    
    
    init.customCommandRegistry.registerCommand(addLoreCommand, addLoreFunction);
    init.customCommandRegistry.registerCommand(setLoreCommand, setLoreFunction);
    init.customCommandRegistry.registerCommand(bindCommandCommand, bindCommandFunction);
    
});


function addLoreFunction(origin, lore, entities = [origin.sourceEntity], bottom = true) {
    system.run(() => {
        for (const entity of entities) {
            try {
                const equippable = entity.getComponent("minecraft:equippable");
                const item = equippable.getEquipment(EquipmentSlot.Mainhand);
                if (!item) continue;
                
                const oldLore = item.getLore();
                
                const newItem = item.clone();
                
                if (bottom) {
                    const newLore = [...oldLore, lore];
                    newItem.setLore(newLore);
                    equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
                } else {
                    const newLore = [lore, ...oldLore];
                    newItem.setLore(newLore);
                    equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
                }
                
            } catch (e) {
                console.log("failed to add lore for " + entity.typeId);
            }
        }
    });
    
    return {
        status: CustomCommandStatus.Success,
    };
}

function setLoreFunction(origin, lore, entities = [origin.sourceEntity]) {
    system.run(() => {
        for (const entity of entities) {
            try {
                const equippable = entity.getComponent("minecraft:equippable");
                const item = equippable.getEquipment(EquipmentSlot.Mainhand);
                if (!item) continue;
                
                const newItem = item.clone();
                
                const newLore = [lore];
                
                newItem.setLore(newLore);
                
                equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
            } catch (e) {
                console.log("failed to add lore for " + entity.typeId);
            }
        }
    });
    
    return {
        status: CustomCommandStatus.Success,
    };
}

function bindCommandFunction(origin, lore, entities = [origin.sourceEntity]) {
    system.run(() => {
        for (const entity of entities) {
            try {
                const equippable = entity.getComponent("minecraft:equippable");
                const item = equippable.getEquipment(EquipmentSlot.Mainhand);
                if (!item) continue;
                
                const newItem = item.clone();
                
                const oldLore = item.getLore();
                
                const newLore = [...oldLore, hideString(lore)];
                
                newItem.setLore(newLore);
                
                equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
            } catch (e) {
                console.log("failed to bind command for " + entity.typeId);
            }
        }
    });
    
    return {
        status: CustomCommandStatus.Success,
    };
}


world.afterEvents.itemUse.subscribe((ev) => {
    if (ev.source.typeId != "minecraft:player" && ev.itemStack) return;
    const player = ev.source;
    const itemStack = ev.itemStack;
    const loreArray = itemStack.getLore();
    if (!loreArray || loreArray.length === 0) return [];

    let commands = [];
    let ix = 0;

    while (ix < loreArray.length) {
        if (loreArray[ix].startsWith("§c§b§i§n§d§t")) {
            commands.push(revealString(loreArray[ix]));
        }
        ix++;
    }
    for (const command of commands) {
        try {
            player.runCommand(command);
            
        } catch (e) {
            console.log("command error: " + e);
            console.log(command + " §c[FAILED]");
        }
    }
});