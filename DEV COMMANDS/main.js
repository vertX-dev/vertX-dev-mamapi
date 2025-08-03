import {
    system,
    world,
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    EquipmentSlot,
    BlockPermutation,
    ItemStack
} from "@minecraft/server";

import {
    uiManager,
    ActionFormData,
    ModalFormData
} from "@minecraft/server-ui";

// Constants for hidden string markers
const COMMAND_MARKER = '§c§b§i§n§d§t';
const FUNCTION_MARKER = '§a§b§i§n§d§f';

function hideString(str, marker = COMMAND_MARKER) {
    let encoded = '';
    for (const char of str) {
        encoded += `§${char}`;
    }
    encoded += '§r';
    return marker + encoded;
}

function revealString(hidden, marker = COMMAND_MARKER) {
    if (!hidden.startsWith(marker)) return null;
    let data = hidden.slice(marker.length).replace(/§r$/, '');
    const chars = [...data.matchAll(/§(.)/g)].map(match => match[1]);
    return chars.join('');
}

system.beforeEvents.startup.subscribe((init) => {
    // Original commands
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
    
    const addBlockCommand = {
        name: "vertx:addblock",
        description: "Add block to multiblock",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.BlockType, name: "Block"}
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
    // New commands
    const bindFunctionCommand = {
        name: "vertx:bindfunction",
        description: "Bind function to item",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: "Function name"}
        ],
        optionalParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "Targets"}
        ]
    };

    const explosionCommand = {
        name: "vertx:explosion",
        description: "Create explosion",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.Integer, name: "Size"}
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Location, name: "Location"},
            { type: CustomCommandParamType.Boolean, name: "Break blocks (default true)"},
            { type: CustomCommandParamType.Boolean, name: "Cause fire (default false)"}
        ]
    };
    
    const cloneItemCommand = {
        name: "vertx:cloneitem",
        description: "Clone item from one entity's slot to another entity's slot",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "From Entity" },
            { type: CustomCommandParamType.Integer, name: "From Slot" },
            { type: CustomCommandParamType.EntitySelector, name: "To Entity" },
            { type: CustomCommandParamType.Integer, name: "To Slot" }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Integer, name: "Amount (default 1)" }
        ]
    };

    const setItemNameCommand = {
        name: "vertx:setitemname",
        description: "Set custom name for held item",
        permissionLevel: CommandPermissionLevel.Any,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: "Item Name (e.g. '§6Epic Sword')" }
        ]
    };
    
    const clearLoreCommand = {
        name: "vertx:clearlore",
        description: "Clear lore from item",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { type: CustomCommandParamType.Integer, name: "lines of lore"}
        ]
    };

    const createMultiBlockCommand = {
        name: "vertx:createmultiblock",
        description: "Create multi-block item with GUI",
        permissionLevel: CommandPermissionLevel.GameDirectors
    };

    const multiBlockFillCommand = {
        name: "vertx:multiblockfill",
        description: "Fill area with multi-block from mainhand (~18000 blocks/s)",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.Location, name: "From location"},
            { type: CustomCommandParamType.Location, name: "To location"}
        ]
    };
    
    const nightVisionCommand = {
        name: "vertx:nv",
        description: "Give night vision",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "Target"},
            { type: CustomCommandParamType.Integer, name: "Time in ticks"}
        ]
    };

    const healCommand = {
        name: "vertx:heal",
        description: "Heal player to full health/hunger",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "Target"},
            { type: CustomCommandParamType.String, name: "Heal type (health/hunger/both, default both)"}
        ]
    };
    
    const setDayCommand = {
        name: "vertx:setday",
        description: "Set specific day number",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.Integer, name: "Day number"}
        ]
    };
    
    const spawnEntityCommand = {
        name: "vertx:spawnentity",
        description: "Spawn entities with optional equipment and effects",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: "Entity type"},
            { type: CustomCommandParamType.Integer, name: "Amount"}
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Location, name: "Location"},
            { type: CustomCommandParamType.EntitySelector, name: "Copy equipment from entity"}
        ]
    };
    
    const godCommand = {
        name: "vertx:god",
        description: "Toggle god mode (resistance 5)",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "Target"},
            { type: CustomCommandParamType.Integer, name: "Duration in ticks (default 10 minutes)"}
        ]
    };
    
    const burnEntityCommand = {
        name: "vertx:burnentity",
        description: "Set entity on fire",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "Target"},
            { type: CustomCommandParamType.Integer, name: "Duration in seconds"}
        ]
    };
    
    const knockbackCommand = {
        name: "vertx:knockback",
        description: "Apply knockback force to entities",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "Target"},
            { type: CustomCommandParamType.Float, name: "Strength"}
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Float, name: "Horizontal direction (degrees, default player facing)"},
            { type: CustomCommandParamType.Float, name: "Vertical strength (default 0.5)"}
        ]
    };
    
    const durabilityCommand = {
        name: "vertx:durability",
        description: "Set item durability percentage",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.Integer, name: "Durability percentage (0-100)"}
        ],
        optionalParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "Target"}
        ]
    };
    
    const clearAreaCommand = {
        name: "vertx:cleararea",
        description: "Clear all entities/items in area",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.Integer, name: "Radius"}
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Location, name: "Center location"},
            { type: CustomCommandParamType.String, name: "Entity types to clear (comma separated, default: all)"}
        ]
    };    
        
    const createPathCommand = {
        name: "vertx:createpath", 
        description: "Create path between waypoints with specified radius",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.Float, name: "Radius" },
            { type: CustomCommandParamType.Location, name: "Start location" },
            { type: CustomCommandParamType.Location, name: "End location" }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Location, name: "Waypoint 1 (optional)" },
            { type: CustomCommandParamType.Location, name: "Waypoint 2 (optional)" },
            { type: CustomCommandParamType.Location, name: "Waypoint 3 (optional)" },
            { type: CustomCommandParamType.String, name: "Replace blocks ('ALL' or comma separated list)" },
            { type: CustomCommandParamType.String, name: "Path block (or 'MAINHAND' or 'MULTIBLOCK')" }
        ]
    };    
    
    const getSlotItemCommand = {
        name: "vertx:getslotitem",
        description: "Get information about item in specific slot",
        permissionLevel: CommandPermissionLevel.Any,
        mandatoryParameters: [
            { type: CustomCommandParamType.Integer, name: "Slot number (0-35)" }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "Target player" }
        ]
    };
    
    const findSlotCommand = {
        name: "vertx:findslot",
        description: "Find item locations in inventory",
        permissionLevel: CommandPermissionLevel.Any,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: "Item ID or partial name" }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.String, name: "Mode ('first' or 'all', default: first)" },
            { type: CustomCommandParamType.EntitySelector, name: "Target player" }
        ]
    };
    
    const getPathToolCommand = {
        name: "vertx:getpathtool",
        description: "Get path creation tool (shovel)",
        permissionLevel: CommandPermissionLevel.GameDirectors
    };

    const buildPathCommand = {
        name: "vertx:buildpath",
        description: "Build path using path tool data (opens GUI)",
        permissionLevel: CommandPermissionLevel.GameDirectors
    };    
    
    const configFillCommand = {
        name: "vertx:configfill",
        description: "Configure block filling performance settings",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { type: CustomCommandParamType.Integer, name: "Blocks per tick (default 100)" },
            { type: CustomCommandParamType.Integer, name: "Tick delay (default 1)" },
            { type: CustomCommandParamType.Integer, name: "Max operations (default 50000)" }
        ]
    };    
    
    // Register all commands
    init.customCommandRegistry.registerCommand(addLoreCommand, addLoreFunction);
    init.customCommandRegistry.registerCommand(addBlockCommand, addBlockFunction);
    init.customCommandRegistry.registerCommand(setLoreCommand, setLoreFunction);
    init.customCommandRegistry.registerCommand(bindCommandCommand, bindCommandFunction);
    init.customCommandRegistry.registerCommand(bindFunctionCommand, bindFunctionFunction);
    init.customCommandRegistry.registerCommand(explosionCommand, explosionFunction);
    init.customCommandRegistry.registerCommand(clearLoreCommand, clearLoreFunction);
    init.customCommandRegistry.registerCommand(createMultiBlockCommand, createMultiBlockGUIFunction);
    init.customCommandRegistry.registerCommand(multiBlockFillCommand, multiBlockFillFunction);
    init.customCommandRegistry.registerCommand(nightVisionCommand, nightVisionFunction);
    init.customCommandRegistry.registerCommand(setItemNameCommand, setItemNameFunction);
    init.customCommandRegistry.registerCommand(cloneItemCommand, cloneItemFunction);
    init.customCommandRegistry.registerCommand(healCommand, healFunction);
    init.customCommandRegistry.registerCommand(setDayCommand, setDayFunction);
    init.customCommandRegistry.registerCommand(spawnEntityCommand, spawnEntityFunction);
    init.customCommandRegistry.registerCommand(godCommand, godFunction);
    init.customCommandRegistry.registerCommand(burnEntityCommand, burnEntityFunction);
    init.customCommandRegistry.registerCommand(knockbackCommand, knockbackFunction);
    init.customCommandRegistry.registerCommand(createPathCommand, createPathFunction);
    init.customCommandRegistry.registerCommand(durabilityCommand, durabilityFunction);
    init.customCommandRegistry.registerCommand(clearAreaCommand, clearAreaFunction);
    init.customCommandRegistry.registerCommand(getSlotItemCommand, getSlotItemFunction);
    init.customCommandRegistry.registerCommand(findSlotCommand, findSlotFunction);
    init.customCommandRegistry.registerCommand(getPathToolCommand, getPathToolFunction);
    init.customCommandRegistry.registerCommand(buildPathCommand, buildPathFunction);
    init.customCommandRegistry.registerCommand(configFillCommand, configFillFunction);
    
});

// Original functions
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
                } else {
                    const newLore = [lore, ...oldLore];
                    newItem.setLore(newLore);
                }
                
                equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
            } catch (e) {
                console.log("failed to add lore for " + entity.typeId);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function addBlockFunction(origin, lore, entities = [origin.sourceEntity], bottom = true) {
    system.run(() => {
        for (const entity of entities) {
            try {
                const equippable = entity.getComponent("minecraft:equippable");
                const item = equippable.getEquipment(EquipmentSlot.Mainhand);
                if (!item) continue;
                
                const oldLore = item.getLore();
                const newItem = item.clone();
                const addLore = `§8- ${lore.id}`;
                
                if (bottom) {
                    const newLore = [...oldLore, addLore];
                    newItem.setLore(newLore);
                } else {
                    const newLore = [addLore, ...oldLore];
                    newItem.setLore(newLore);
                }
                
                equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
            } catch (e) {
                console.log("failed to add lore for " + entity.typeId);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function setLoreFunction(origin, lore, entities = [origin.sourceEntity]) {
    system.run(() => {
        for (const entity of entities) {
            try {
                const equippable = entity.getComponent("minecraft:equippable");
                const item = equippable.getEquipment(EquipmentSlot.Mainhand);
                if (!item) continue;
                
                const newItem = item.clone();
                newItem.setLore([lore]);
                equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
            } catch (e) {
                console.log("failed to set lore for " + entity.typeId);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function clearLoreFunction(origin, lines = 100) {
    system.run(() => {
        const player = origin.sourceEntity;
        const equippable = player.getComponent("minecraft:equippable");
        const item = equippable.getEquipment(EquipmentSlot.Mainhand);
        if (!item) return;
        
        const newItem = item.clone();
        const oldLore = item.getLore();
        const newLore = [];
        const size = oldLore.length - lines;
        let ix = 0;
        
        while (ix < size) {
            newLore.push(oldLore[ix]);
            ix++;
        }
        
        newItem.setLore(newLore);
        equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
    });
    
    return { status: CustomCommandStatus.Success};
}

function bindCommandFunction(origin, command, entities = [origin.sourceEntity]) {
    system.run(() => {
        for (const entity of entities) {
            try {
                const equippable = entity.getComponent("minecraft:equippable");
                const item = equippable.getEquipment(EquipmentSlot.Mainhand);
                if (!item) continue;
                
                const newItem = item.clone();
                const oldLore = item.getLore();
                const newLore = [...oldLore, hideString(command, COMMAND_MARKER)];
                newItem.setLore(newLore);
                equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
            } catch (e) {
                console.log("failed to bind command for " + entity.typeId);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// New command functions
function bindFunctionFunction(origin, functionName, entities = [origin.sourceEntity]) {
    system.run(() => {
        for (const entity of entities) {
            try {
                const equippable = entity.getComponent("minecraft:equippable");
                const item = equippable.getEquipment(EquipmentSlot.Mainhand);
                if (!item) continue;
                
                const newItem = item.clone();
                const oldLore = item.getLore();
                const newLore = [...oldLore, hideString(functionName, FUNCTION_MARKER)];
                newItem.setLore(newLore);
                equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
            } catch (e) {
                console.log("failed to bind function for " + entity.typeId);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function explosionFunction(origin, size, location = origin.sourceEntity?.location, breakBlocks = true, causeFire = false) {
    system.run(() => {
        try {
            const dimension = origin.sourceEntity?.dimension || world.getDimension("overworld");
            const explosionOptions = {
                breaksBlocks: breakBlocks,
                causesFire: causeFire
            };
            
            dimension.createExplosion(location, size, explosionOptions);
        } catch (e) {
            console.log("failed to create explosion: " + e);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// FIXED: createMultiBlockFunction - Creates an item with visible block list in lore
// function createMultiBlockFunction(origin, blockId, name, blockList, entities = [origin.sourceEntity]) {
//     system.run(() => {
//         for (const entity of entities) {
//             try {
//                 const equippable = entity.getComponent("minecraft:equippable");
//                 
//                 // Create new item of the specified block type
//                 const newItem = new ItemStack(blockId, 1);
//                 newItem.nameTag = name;
//                 
//                 // Add visible lore showing the block list
//                 const blocks = blockList.split(',').map(block => block.trim());
//                 const loreLines = [
//                     "§6Multi-Block Item",
//                     "§7Blocks:",
//                     ...blocks.map(block => `§8- ${block}`)
//                 ];
//                 newItem.setLore(loreLines);
//                 
//                 equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
//                 entity.sendMessage(`§aCreated multi-block item: ${name}`);
//             } catch (e) {
//                 console.log("failed to create multi-block for " + entity.typeId + ": " + e);
//             }
//         }
//     });
//     
//     return { status: CustomCommandStatus.Success };
// }

// FIXED: createMultiBlockGUIFunction - Shows GUI to create multi-block item
function createMultiBlockGUIFunction(origin) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            showCreateMultiBlockGUI(player);
        } catch (e) {
            console.log("failed to show create multi-block GUI: " + e);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function nightVisionFunction(origin, targets = [origin.sourceEntity], time = 10 * 60 * 20) {
    system.run(() => {
        for (const entity of targets) {
            entity.addEffect("night_vision", time, { amplifier: 1, showParticles: false});
        }
    });
    
    return { status: CustomCommandStatus.Success};
}

function setItemNameFunction(origin, name) {
    system.run(() => {
        const entity = origin.sourceEntity;
        const equippable = entity.getComponent("minecraft:equippable");
        const item = equippable.getEquipment(EquipmentSlot.Mainhand);
        if (!item) return;
        
        const newItem = item.clone();
        newItem.nameTag = name;
        equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
    });
    
    return { status: CustomCommandStatus.Success};
}

function cloneItemFunction(origin, fromEntity, fromSlot, toEntity, toSlot, amount = 1) {
    system.run(() => {
        try {
            const fromInventory = fromEntity.getComponent("minecraft:inventory")?.container;
            const toInventory = toEntity.getComponent("minecraft:inventory")?.container;
    
            if (!fromInventory || !toInventory) {
                fromEntity.sendMessage("§cError: One or both entities have no inventory.");
                return;
            }
    
            const sourceItem = fromInventory.getItem(fromSlot);
            if (!sourceItem) {
                fromEntity.sendMessage("§cError: No item in source slot.");
                return;
            }
            // Clone the item
            const clonedItem = sourceItem.clone();
            // Place into target slot
            toInventory.setItem(toSlot, clonedItem);
    
            fromEntity.sendMessage(`§aCloned item '${sourceItem.typeId}' x${amount} to ${toEntity.name}'s slot ${toSlot}.`);
    
        } catch (e) {
            world.sendMessage(`§cCloneItemFunction Error: ${e}`);
        }
    });
    
    return { status: CustomCommandStatus.Success};
}

// FIXED: showCreateMultiBlockGUI - Fixed ItemStack constructor and proper lore system
function showCreateMultiBlockGUI(player) {
    const form = new ModalFormData()
        .title("§aCreate Multi-Block")
        .textField("Block ID (e.g., minecraft:stone):", "minecraft:stone")
        .textField("Item Name:", "Multi-Block")
        .textField("Block List (comma separated):", "minecraft:stone,minecraft:cobblestone,minecraft:granite");
    
    form.show(player).then((response) => {
        if (response.canceled) return;
        
        const [blockId, name, blockList] = response.formValues;
        
        if (!blockId || !name || !blockList) {
            player.sendMessage("§cAll fields are required!");
            return;
        }
        
        try {
            const equippable = player.getComponent("minecraft:equippable");
            
            // Create new item with proper constructor
            const newItem = new ItemStack(blockId, 1);
            newItem.nameTag = name;
            
            // Create visible lore with block list
            const blocks = blockList.split(',').map(block => block.trim());
            const loreLines = [
                "§6Multi-Block Item",
                "§7Blocks:",
                ...blocks.map(block => `§8- ${block}`)
            ];
            newItem.setLore(loreLines);
            
            equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
            player.sendMessage("§aMulti-block item created!");
            
        } catch (e) {
            player.sendMessage("§cFailed to create multi-block: " + e);
        }
    });
}

// Event Handlers
world.afterEvents.itemUse.subscribe((ev) => {
    if (ev.source.typeId !== "minecraft:player" || !ev.itemStack) return;
    
    const player = ev.source;
    const itemStack = ev.itemStack;
    const loreArray = itemStack.getLore();
    
    if (!loreArray || loreArray.length === 0) return;

    // Handle commands
    let commands = [];
    let functions = [];
    
    for (const lore of loreArray) {
        const command = revealString(lore, COMMAND_MARKER);
        if (command) {
            commands.push(command);
        }
        
        const functionName = revealString(lore, FUNCTION_MARKER);
        if (functionName) {
            functions.push(functionName);
        }
    }
    
    // Execute commands
    for (const command of commands) {
        try {
            player.runCommand(command);
        } catch (e) {
            console.log("command error: " + e);
            console.log(command + " §c[FAILED]");
        }
    }
    
    // Execute functions
    for (const functionName of functions) {
        try {
            player.runCommand("function " + functionName);
        } catch (e) {
            console.log("function error: " + e);
            console.log("function " + functionName + " §c[FAILED]");
        }
    }
});

// FIXED: world.afterEvents.blockPlace.subscribe - Complete implementation for multi-block placement
world.afterEvents.playerPlaceBlock.subscribe((ev) => {
    if (ev.player.typeId !== "minecraft:player") return;
    
    const player = ev.player;
    const equippable = player.getComponent("minecraft:equippable");
    const item = equippable.getEquipment(EquipmentSlot.Mainhand);
    
    if (!item) return;
    
    const loreArray = item.getLore();
    if (!loreArray || loreArray.length === 0) return;
    
    // Check if this is a multi-block item
    let isMultiBlock = false;
    const blockList = [];
    let foundBlocksSection = false;
    
    for (const lore of loreArray) {
        if (lore === "§6Multi-Block Item") {
            isMultiBlock = true;
        }
        if (lore === "§7Blocks:") {
            foundBlocksSection = true;
            continue;
        }
        if (foundBlocksSection && lore.startsWith("§8- ")) {
            const blockId = lore.replace("§8- ", "");
            blockList.push(blockId);
        }
    }
    
    if (isMultiBlock && blockList.length > 0) {
        // Replace the placed block with a random block from the list
        const randomBlock = blockList[Math.floor(Math.random() * blockList.length)];
        try {
            const blockPermutation = BlockPermutation.resolve(randomBlock);
            ev.dimension.setBlockPermutation(ev.block.location, blockPermutation);
        } catch (e) {
            console.log(`Failed to place random block ${randomBlock}: ${e}`);
        }
    }
});

function healFunction(origin, targets = [origin.sourceEntity], healType = "both") {
    system.run(() => {
        for (const entity of targets) {
            try {
                const health = entity.getComponent("minecraft:health");
                const food = entity.getComponent("minecraft:food");
                
                if (healType === "health" || healType === "both") {
                    if (health) {
                        health.setCurrentValue(health.effectiveMax);
                    }
                }
                
                if (healType === "hunger" || healType === "both") {
                    if (food) {
                        food.value = 20;
                    }
                }
                
                entity.sendMessage("§aYou have been healed!");
            } catch (e) {
                console.log("failed to heal " + entity.typeId + ": " + e);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function setDayFunction(origin, dayNumber) {
    system.run(() => {
        try {
            const dimension = origin.sourceEntity?.dimension || world.getDimension("overworld");
            const targetTime = (dayNumber - 1) * 24000 + 1000; // Day starts at 1000 ticks
            dimension.runCommand(`time set ${targetTime}`);
            
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§aSet to day ${dayNumber}`);
            }
        } catch (e) {
            console.log("failed to set day: " + e);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function spawnEntityFunction(origin, entityType, amount, location = origin.sourceEntity?.location, copyFrom = null) {
    system.run(() => {
        try {
            const dimension = origin.sourceEntity?.dimension || world.getDimension("overworld");
            const spawnedEntities = [];
            
            // Spawn entities
            for (let i = 0; i < amount; i++) {
                const entity = dimension.spawnEntity(entityType, location);
                spawnedEntities.push(entity);
            }
            
            // Copy equipment if specified
            if (copyFrom && copyFrom.length > 0) {
                const sourceEntity = copyFrom[0];
                
                // Check if source entity exists and is valid
                if (!sourceEntity || !sourceEntity.isValid) {
                    if (origin.sourceEntity) {
                        origin.sourceEntity.sendMessage("§cSource entity is invalid or doesn't exist!");
                    }
                    console.log("Copy equipment failed: source entity invalid");
                } else {
                    // Try both equippable and inventory components from source
                    const sourceEquippable = sourceEntity.getComponent("minecraft:equippable");
                    const sourceInventory = sourceEntity.getComponent("minecraft:inventory");
                    
                    if (!sourceEquippable && !sourceInventory) {
                        if (origin.sourceEntity) {
                            origin.sourceEntity.sendMessage(`§eSource entity (${sourceEntity.typeId}) has no equipment or inventory to copy.`);
                        }
                        console.log(`Copy equipment skipped: ${sourceEntity.typeId} has no equippable or inventory component`);
                    } else {
                        let totalSuccessfulCopies = 0;
                        let entitiesProcessed = 0;
                        
                        for (const entity of spawnedEntities) {
                            if (!entity || !entity.isValid) {
                                console.log("Skipping invalid spawned entity");
                                continue;
                            }
                            
                            entitiesProcessed++;
                            let entityCopies = 0;
                            
                            // Try to copy equipment first (for equipped items)
                            const targetEquippable = entity.getComponent("minecraft:equippable");
                            if (sourceEquippable && targetEquippable) {
                                for (const slot of Object.values(EquipmentSlot)) {
                                    try {
                                        const item = sourceEquippable.getEquipment(slot);
                                        if (item) {
                                            targetEquippable.setEquipment(slot, item.clone());
                                            entityCopies++;
                                        }
                                    } catch (e) {
                                        console.log(`Failed to copy equipment slot ${slot}: ${e}`);
                                    }
                                }
                            }
                            
                            // Try to copy to inventory (for mobs with inventory)
                            const targetInventory = entity.getComponent("minecraft:inventory");
                            if (sourceInventory && targetInventory) {
                                const sourceContainer = sourceInventory.container;
                                const targetContainer = targetInventory.container;
                                
                                if (sourceContainer && targetContainer) {
                                    const maxSlots = Math.min(sourceContainer.size, targetContainer.size);
                                    
                                    for (let slot = 0; slot < maxSlots; slot++) {
                                        try {
                                            const item = sourceContainer.getItem(slot);
                                            if (item) {
                                                // Try to add to inventory, if slot is occupied try next available
                                                const success = targetContainer.addItem(item.clone());
                                                if (success) {
                                                    entityCopies++;
                                                } else {
                                                    // Try direct slot placement if addItem failed
                                                    try {
                                                        targetContainer.setItem(slot, item.clone());
                                                        entityCopies++;
                                                    } catch (e) {
                                                        console.log(`Failed to set item in slot ${slot}: ${e}`);
                                                    }
                                                }
                                            }
                                        } catch (e) {
                                            console.log(`Failed to copy inventory slot ${slot}: ${e}`);
                                        }
                                    }
                                }
                            }
                            
                            totalSuccessfulCopies += entityCopies;
                        }
                        
                        if (origin.sourceEntity) {
                            if (totalSuccessfulCopies > 0) {
                                origin.sourceEntity.sendMessage(`§aSuccessfully copied ${totalSuccessfulCopies} items to ${entitiesProcessed} entities!`);
                            } else if (entitiesProcessed > 0) {
                                origin.sourceEntity.sendMessage(`§eNo items could be copied. Entities may not support equipment/inventory or source has no items.`);
                            } else {
                                origin.sourceEntity.sendMessage(`§cNo valid entities to copy items to.`);
                            }
                        }
                    }
                }
            }
            
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§aSpawned ${spawnedEntities.length} ${entityType} entities`);
            }
            
        } catch (e) {
            console.log("failed to spawn entity: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to spawn entities: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function godFunction(origin, targets = [origin.sourceEntity], duration = 12000) {
    system.run(() => {
        for (const entity of targets) {
            try {
                // Check if entity already has resistance 5
                const hasGodMode = entity.getEffect("resistance")?.amplifier >= 4;
                
                if (hasGodMode) {
                    entity.removeEffect("resistance");
                    entity.sendMessage("§cGod mode disabled");
                } else {
                    entity.addEffect("resistance", duration, { amplifier: 4, showParticles: false });
                    entity.sendMessage("§aGod mode enabled");
                }
            } catch (e) {
                console.log("failed to toggle god mode for " + entity.typeId + ": " + e);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function burnEntityFunction(origin, targets, duration) {
    system.run(() => {
        for (const entity of targets) {
            try {
                entity.setOnFire(duration, true);
                if (origin.sourceEntity) {
                    origin.sourceEntity.sendMessage(`§aSet ${entity.typeId} on fire for ${duration} seconds`);
                }
            } catch (e) {
                console.log("failed to burn entity " + entity.typeId + ": " + e);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function knockbackFunction(origin, targets, strength, direction = null, verticalStrength = 0.5) {
    system.run(() => {
        try {
            const sourceEntity = origin.sourceEntity;
            
            for (const entity of targets) {
                let knockbackDirection = direction;
                
                // If no direction specified, use player's facing direction
                if (knockbackDirection === null && sourceEntity) {
                    const rotation = sourceEntity.getRotation();
                    knockbackDirection = rotation.y;
                }
                
                if (knockbackDirection === null) knockbackDirection = 0;
                
                // Convert direction to radians and calculate velocity
                const radians = (knockbackDirection * Math.PI) / 180;
                const velocityX = Math.sin(radians) * strength;
                const velocityZ = -Math.cos(radians) * strength;
                const velocityY = verticalStrength;
                
                // Apply knockback
                entity.applyKnockback(velocityX, velocityZ, strength, velocityY);
                
                if (sourceEntity) {
                    sourceEntity.sendMessage(`§aApplied knockback to ${entity.typeId}`);
                }
            }
        } catch (e) {
            console.log("failed to apply knockback: " + e);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function durabilityFunction(origin, percentage, targets = [origin.sourceEntity]) {
    system.run(() => {
        if (percentage < 0 || percentage > 100) {
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage("§cDurability percentage must be between 0-100!");
            }
            return;
        }
        
        let itemsModified = 0;
        
        for (const entity of targets) {
            try {
                const equippable = entity.getComponent("minecraft:equippable");
                if (!equippable) continue;
                
                const item = equippable.getEquipment(EquipmentSlot.Mainhand);
                if (!item) continue;
                
                const durability = item.getComponent("minecraft:durability");
                if (!durability) {
                    entity.sendMessage("§cItem is not damageable!");
                    continue;
                }
                
                const maxDurability = durability.maxDurability;
                const newDurability = Math.floor((percentage / 100) * maxDurability);
                const damage = maxDurability - newDurability;
                
                const newItem = item.clone();
                const newDurabilityComponent = newItem.getComponent("minecraft:durability");
                newDurabilityComponent.damage = Math.max(0, Math.min(damage, maxDurability - 1));
                
                equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
                entity.sendMessage(`§aSet item durability to ${percentage}%`);
                itemsModified++;
                
            } catch (e) {
                console.log("failed to set durability for " + entity.typeId + ": " + e);
            }
        }
        
        if (origin.sourceEntity && itemsModified > 0) {
            origin.sourceEntity.sendMessage(`§aModified durability for ${itemsModified} items`);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function clearAreaFunction(origin, radius, location = origin.sourceEntity?.location, entityTypes = "") {
    system.run(() => {
        try {
            if (!location) {
                if (origin.sourceEntity) {
                    origin.sourceEntity.sendMessage("§cNo location specified and no source entity!");
                }
                return;
            }
            
            const dimension = origin.sourceEntity?.dimension || world.getDimension("overworld");
            
            // Get all entities in the area
            const entities = dimension.getEntities({
                location: location,
                maxDistance: radius
            });
            
            let removedCount = 0;
            let skippedPlayers = 0;
            
            // Parse entity types to clear (if specified)
            const typesToClear = entityTypes && entityTypes.trim() !== "" 
                ? entityTypes.split(',').map(type => type.trim().toLowerCase())
                : [];
            
            for (const entity of entities) {
                try {
                    // Never remove players unless explicitly specified
                    if (entity.typeId === "minecraft:player") {
                        if (typesToClear.length === 0 || !typesToClear.includes("minecraft:player")) {
                            skippedPlayers++;
                            continue;
                        }
                    }
                    
                    // Don't remove the command executor
                    if (entity === origin.sourceEntity) {
                        continue;
                    }
                    
                    // Check if we should remove this entity type
                    if (typesToClear.length > 0) {
                        const shouldRemove = typesToClear.some(type => 
                            entity.typeId.toLowerCase().includes(type) || 
                            type === "all"
                        );
                        if (!shouldRemove) continue;
                    }
                    
                    entity.remove();
                    removedCount++;
                    
                } catch (e) {
                    console.log(`Failed to remove entity ${entity.typeId}: ${e}`);
                }
            }
            
            if (origin.sourceEntity) {
                let message = `§aRemoved ${removedCount} entities in ${radius} block radius`;
                if (skippedPlayers > 0) {
                    message += ` (skipped ${skippedPlayers} players)`;
                }
                origin.sourceEntity.sendMessage(message);
                
                if (typesToClear.length > 0) {
                    origin.sourceEntity.sendMessage(`§7Filtered by: ${entityTypes}`);
                }
            }
            
        } catch (e) {
            console.log("failed to clear area: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to clear area: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function createPathFunction(origin, radius, startLoc, endLoc, waypoint1 = null, waypoint2 = null, waypoint3 = null, replaceBlocks = "ALL", pathBlock = "MAINHAND") {
    system.run(() => {
        try {
            const entity = origin.sourceEntity;
            if (!entity) return;
            
            const dimension = entity.dimension;
            
            // Build waypoints array
            const waypoints = [startLoc];
            if (waypoint1) waypoints.push(waypoint1);
            if (waypoint2) waypoints.push(waypoint2);
            if (waypoint3) waypoints.push(waypoint3);
            waypoints.push(endLoc);
            
            // Determine path block(s) to use
            let pathBlocks = [];
            let isMultiBlock = false;
            
            if (pathBlock === "MAINHAND" || pathBlock === "") {
                const equippable = entity.getComponent("minecraft:equippable");
                const item = equippable?.getEquipment(EquipmentSlot.Mainhand);
                
                if (!item) {
                    entity.sendMessage("§cNo item in mainhand! Specify a block type or hold a block.");
                    return;
                }
                
                // Check if it's a multiblock item
                const loreArray = item.getLore();
                if (loreArray && loreArray.some(lore => lore === "§6Multi-Block Item")) {
                    isMultiBlock = true;
                    let foundBlocksSection = false;
                    
                    for (const lore of loreArray) {
                        if (lore === "§7Blocks:") {
                            foundBlocksSection = true;
                            continue;
                        }
                        if (foundBlocksSection && lore.startsWith("§8- ")) {
                            const blockId = lore.replace("§8- ", "");
                            pathBlocks.push(blockId);
                        }
                    }
                    
                    if (pathBlocks.length === 0) {
                        entity.sendMessage("§cMulti-block item has no valid blocks!");
                        return;
                    }
                } else {
                    pathBlocks = [item.typeId];
                }
            } else if (pathBlock === "MULTIBLOCK") {
                entity.sendMessage("§cMULTIBLOCK option requires holding a multi-block item!");
                return;
            } else {
                pathBlocks = [pathBlock];
            }
            
            // Parse replace blocks
            const shouldReplaceAll = replaceBlocks === "ALL";
            const replaceList = shouldReplaceAll ? [] : replaceBlocks.split(',').map(block => block.trim());
            
            let totalBlocksPlaced = 0;
            
            // Create path between each pair of waypoints
            for (let i = 0; i < waypoints.length - 1; i++) {
                const from = waypoints[i];
                const to = waypoints[i + 1];
                
                const blocksPlaced = createPathSegment(dimension, from, to, radius, pathBlocks, isMultiBlock, shouldReplaceAll, replaceList);
                totalBlocksPlaced += blocksPlaced;
            }
            
            entity.sendMessage(`§aPath created with ${totalBlocksPlaced} blocks!`);
            if (isMultiBlock) {
                entity.sendMessage(`§7Used ${pathBlocks.length} different block types randomly`);
            }
            
        } catch (e) {
            console.log("failed to create path: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to create path: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Helper function to create path segment between two points
function createPathSegment(dimension, from, to, radius, pathBlocks, isMultiBlock, shouldReplaceAll, replaceList) {
    const distance = Math.sqrt(
        Math.pow(to.x - from.x, 2) + 
        Math.pow(to.y - from.y, 2) + 
        Math.pow(to.z - from.z, 2)
    );
    
    const steps = Math.ceil(distance * 2); // More steps for smoother path
    let blocksPlaced = 0;
    
    for (let step = 0; step <= steps; step++) {
        const t = step / steps;
        
        const centerX = Math.round(from.x + (to.x - from.x) * t);
        const centerY = Math.round(from.y + (to.y - from.y) * t);
        const centerZ = Math.round(from.z + (to.z - from.z) * t);
        
        // Create circular area around this point
        const radiusSquared = radius * radius;
        
        for (let x = centerX - Math.ceil(radius); x <= centerX + Math.ceil(radius); x++) {
            for (let y = centerY - Math.ceil(radius); y <= centerY + Math.ceil(radius); y++) {
                for (let z = centerZ - Math.ceil(radius); z <= centerZ + Math.ceil(radius); z++) {
                    const distanceSquared = 
                        Math.pow(x - centerX, 2) + 
                        Math.pow(y - centerY, 2) + 
                        Math.pow(z - centerZ, 2);
                    
                    if (distanceSquared <= radiusSquared) {
                        const location = { x, y, z };
                        
                        try {
                            // Check if we should replace this block
                            if (!shouldReplaceAll) {
                                const currentBlock = dimension.getBlock(location);
                                const currentBlockId = currentBlock.typeId;
                                
                                const shouldReplace = replaceList.some(replaceBlock => 
                                    currentBlockId.includes(replaceBlock) || replaceBlock === currentBlockId
                                );
                                
                                if (!shouldReplace) continue;
                            }
                            
                            // Choose block to place
                            const blockToPlace = isMultiBlock 
                                ? pathBlocks[Math.floor(Math.random() * pathBlocks.length)]
                                : pathBlocks[0];
                            
                            const blockPermutation = BlockPermutation.resolve(blockToPlace);
                            dimension.setBlockPermutation(location, blockPermutation);
                            blocksPlaced++;
                            
                        } catch (e) {
                            console.log(`Failed to place block ${pathBlocks[0]} at ${x},${y},${z}: ${e}`);
                        }
                    }
                }
            }
        }
    }
    
    return blocksPlaced;
}

function findSlotFunction(origin, itemQuery, mode = "first", targets = [origin.sourceEntity]) {
    system.run(() => {
        try {
            const searchAll = mode.toLowerCase() === "all";
            
            for (const entity of targets) {
                if (!entity || entity.typeId !== "minecraft:player") {
                    if (origin.sourceEntity) {
                        origin.sourceEntity.sendMessage("§cTarget must be a player!");
                    }
                    continue;
                }
                
                const results = findItemSlots(entity, itemQuery, searchAll);
                
                if (results.totalFound === 0) {
                    entity.sendMessage(`§cItem "${itemQuery}" not found in inventory!`);
                    continue;
                }
                
                // Show results
                const playerName = targets.length > 1 ? `${entity.name}'s ` : "";
                entity.sendMessage(`§a--- ${playerName}Item Search Results ---`);
                entity.sendMessage(`§7Query: "${itemQuery}" | Mode: ${searchAll ? "All" : "First"}`);
                
                // Show inventory slots
                if (results.inventory.length > 0) {
                    entity.sendMessage(`§e📦 Inventory:`);
                    for (const slot of results.inventory) {
                        const stackInfo = slot.amount > 1 ? ` §7(x${slot.amount})` : "";
                        entity.sendMessage(`  §b${slot.slot}§7: §f${slot.displayName}${stackInfo}`);
                    }
                }
                
                // Show equipment slots
                if (results.equipment.length > 0) {
                    entity.sendMessage(`§e⚔️ Equipment:`);
                    for (const slot of results.equipment) {
                        const stackInfo = slot.amount > 1 ? ` §7(x${slot.amount})` : "";
                        entity.sendMessage(`  §b${slot.slotName}§7: §f${slot.displayName}${stackInfo}`);
                    }
                }
                
                // Show summary
                entity.sendMessage(`§a📊 Total: ${results.totalFound} item${results.totalFound > 1 ? 's' : ''} found${results.totalAmount > results.totalFound ? ` (${results.totalAmount} total count)` : ""}`);
                
                // Show quick commands if applicable
                if (results.inventory.length > 0) {
                    const firstSlot = results.inventory[0];
                    entity.sendMessage(`§7💡 Quick: Use slot ${firstSlot.slot} with /replaceitem entity @s slot.hotbar ${firstSlot.slot}`);
                }
            }
            
        } catch (e) {
            console.log("failed to find slot: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to search inventory: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Helper function to find items in player inventory and equipment
function findItemSlots(player, itemQuery, searchAll) {
    const results = {
        inventory: [],
        equipment: [],
        totalFound: 0,
        totalAmount: 0
    };
    
    const query = itemQuery.toLowerCase();
    
    // Search inventory
    const inventory = player.getComponent("minecraft:inventory");
    if (inventory && inventory.container) {
        const container = inventory.container;
        
        for (let slot = 0; slot < container.size; slot++) {
            try {
                const item = container.getItem(slot);
                if (!item) continue;
                
                const itemId = item.typeId.toLowerCase();
                const displayName = item.nameTag || item.typeId;
                const displayNameLower = displayName.toLowerCase();
                
                // Check if item matches query (ID or display name)
                const matches = itemId.includes(query) || 
                               displayNameLower.includes(query) ||
                               itemId === query ||
                               displayNameLower === query;
                
                if (matches) {
                    results.inventory.push({
                        slot: slot,
                        itemId: item.typeId,
                        displayName: displayName,
                        amount: item.amount
                    });
                    
                    results.totalFound++;
                    results.totalAmount += item.amount;
                    
                    // If only looking for first match, stop after finding one
                    if (!searchAll && results.totalFound === 1) {
                        break;
                    }
                }
            } catch (e) {
                console.log(`Error checking inventory slot ${slot}: ${e}`);
            }
        }
    }
    
    // Search equipment slots (if searching all or no inventory matches found)
    if (searchAll || results.inventory.length === 0) {
        const equippable = player.getComponent("minecraft:equippable");
        if (equippable) {
            const equipmentSlots = [
                { slot: EquipmentSlot.Head, name: "Head" },
                { slot: EquipmentSlot.Chest, name: "Chest" },
                { slot: EquipmentSlot.Legs, name: "Legs" },
                { slot: EquipmentSlot.Feet, name: "Feet" },
                { slot: EquipmentSlot.Mainhand, name: "Mainhand" },
                { slot: EquipmentSlot.Offhand, name: "Offhand" }
            ];
            
            for (const equipSlot of equipmentSlots) {
                try {
                    const item = equippable.getEquipment(equipSlot.slot);
                    if (!item) continue;
                    
                    const itemId = item.typeId.toLowerCase();
                    const displayName = item.nameTag || item.typeId;
                    const displayNameLower = displayName.toLowerCase();
                    
                    // Check if item matches query
                    const matches = itemId.includes(query) || 
                                   displayNameLower.includes(query) ||
                                   itemId === query ||
                                   displayNameLower === query;
                    
                    if (matches) {
                        results.equipment.push({
                            slot: equipSlot.slot,
                            slotName: equipSlot.name,
                            itemId: item.typeId,
                            displayName: displayName,
                            amount: item.amount
                        });
                        
                        results.totalFound++;
                        results.totalAmount += item.amount;
                        
                        // If only looking for first match and we found one, stop
                        if (!searchAll && results.totalFound === 1) {
                            break;
                        }
                    }
                } catch (e) {
                    console.log(`Error checking equipment slot ${equipSlot.name}: ${e}`);
                }
            }
        }
    }
    
    return results;
}

function getSlotItemFunction(origin, slotNumber, targets = [origin.sourceEntity]) {
    system.run(() => {
        try {
            if (slotNumber < 0 || slotNumber > 35) {
                if (origin.sourceEntity) {
                    origin.sourceEntity.sendMessage("§cSlot number must be between 0-35!");
                }
                return;
            }
            
            for (const entity of targets) {
                if (!entity || entity.typeId !== "minecraft:player") {
                    if (origin.sourceEntity) {
                        origin.sourceEntity.sendMessage("§cTarget must be a player!");
                    }
                    continue;
                }
                
                const inventory = entity.getComponent("minecraft:inventory");
                if (!inventory || !inventory.container) {
                    entity.sendMessage("§cNo inventory found!");
                    continue;
                }
                
                const item = inventory.container.getItem(slotNumber);
                
                if (!item) {
                    entity.sendMessage(`§7Slot ${slotNumber}: §cEmpty`);
                } else {
                    const displayName = item.nameTag || item.typeId;
                    const durabilityInfo = getDurabilityInfo(item);
                    const enchantInfo = getEnchantmentInfo(item);
                    const loreInfo = item.getLore();
                    
                    entity.sendMessage(`§a--- Slot ${slotNumber} Info ---`);
                    entity.sendMessage(`§7Item: §f${displayName} §7(${item.typeId})`);
                    entity.sendMessage(`§7Amount: §f${item.amount}`);
                    
                    if (durabilityInfo) {
                        entity.sendMessage(`§7Durability: §f${durabilityInfo}`);
                    }
                    
                    if (enchantInfo.length > 0) {
                        entity.sendMessage(`§7Enchantments: §f${enchantInfo.join(", ")}`);
                    }
                    
                    if (loreInfo.length > 0) {
                        entity.sendMessage(`§7Lore Lines: §f${loreInfo.length}`);
                    }
                }
            }
            
        } catch (e) {
            console.log("failed to get slot item: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to get slot info: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Helper functions for item info
function getDurabilityInfo(item) {
    try {
        const durability = item.getComponent("minecraft:durability");
        if (durability) {
            const current = durability.maxDurability - durability.damage;
            const max = durability.maxDurability;
            const percentage = Math.round((current / max) * 100);
            return `${current}/${max} (${percentage}%)`;
        }
    } catch (e) {
        // Item doesn't have durability
    }
    return null;
}

function getEnchantmentInfo(item) {
    try {
        const enchantments = item.getComponent("minecraft:enchantable");
        if (enchantments) {
            const enchantList = [];
            // This would require iterating through enchantments if the API supports it
            // For now, just indicate if enchantments exist
            return ["Has enchantments"]; // Simplified - actual implementation would list specific enchantments
        }
    } catch (e) {
        // Item doesn't have enchantments
    }
    return [];
}

function getPathToolFunction(origin) {
    system.run(() => {
        try {
            const entity = origin.sourceEntity;
            if (!entity || entity.typeId !== "minecraft:player") return;
            
            const equippable = entity.getComponent("minecraft:equippable");
            
            // Create path tool (diamond shovel with special lore)
            const pathTool = new ItemStack("minecraft:diamond_shovel", 1);
            pathTool.nameTag = "§6Path Creation Tool";
            pathTool.setLore([
                "§r§r§s§v§e§r§t",
                "§7Right-click blocks to add waypoints",
                "§7Use /buildpath to create the path",
                "§8§l--- WAYPOINTS ---"
            ]);
            
            equippable.setEquipment(EquipmentSlot.Mainhand, pathTool);
            entity.sendMessage("§aPath tool created! Right-click blocks to add waypoints.");
            
        } catch (e) {
            console.log("failed to create path tool: " + e);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// GUI function for path building
function showBuildPathGUI(player) {
    // First check if player has path tool and waypoints
    const equippable = player.getComponent("minecraft:equippable");
    const item = equippable.getEquipment(EquipmentSlot.Mainhand);
    
    if (!item || !item.nameTag || !item.nameTag.includes("Path Creation Tool")) {
        player.sendMessage("§cYou must hold the Path Creation Tool to use this command!");
        return;
    }
    
    const loreArray = item.getLore();
    const waypoints = parseWaypointsFromLore(loreArray);
    
    if (waypoints.length < 2) {
        player.sendMessage("§cYou need at least 2 waypoints to create a path! Right-click blocks to add waypoints.");
        return;
    }
    
    const form = new ModalFormData()
        .title("§6Build Path")
        .textField(`Waypoints Found: ${waypoints.length}`, `${waypoints.map((w, i) => `${i+1}: ${w.x},${w.y},${w.z}`).join(' | ')}`)
        .slider("Path Radius", 1, 10)
        .dropdown("Path Mode", ["Flat (Y level)", "Vertical Flat (XZ plane)", "Spherical (3D)", "Square/Cubic"])
        .textField("Replace Blocks (ALL or comma separated):", "ALL")
        .dropdown("Block Source", ["Mainhand Item", "Offhand Item", "Hotbar Slot", "Custom Block ID"])
        .textField("If Custom Block ID or Hotbar Slot (0-8):", "minecraft:stone")
        .toggle("Preview Mode (shows affected area with particles)");
    
    form.show(player).then((response) => {
        if (response.canceled) return;
        
        const [waypointInfo, radius, mode, replaceBlocks, blockSource, customInput, previewMode] = response.formValues;
        
        if (previewMode) {
            showPathPreview(player, waypoints, radius, mode);
        } else {
            createPath(player, waypoints, radius, mode, replaceBlocks, blockSource, customInput);
        }
    });
}

// Configuration for block filling performance
const BLOCK_FILLING_CONFIG = {
    BLOCKS_PER_TICK: 500,        // How many blocks to place per tick
    TICK_DELAY: 2,               // Ticks to wait between batches (1 = every tick, 2 = every other tick)
    MAX_OPERATIONS: 1000000,       // Maximum blocks before requiring confirmation
    PROGRESS_UPDATE_INTERVAL: 1000 // Show progress every N blocks
};

// Updated multiBlockFillFunction with async processing
function multiBlockFillFunction(origin, fromLocation, toLocation) {
    system.run(() => {
        try {
            const entity = origin.sourceEntity;
            if (!entity) return;
            
            const equippable = entity.getComponent("minecraft:equippable");
            const item = equippable.getEquipment(EquipmentSlot.Mainhand);
            if (!item) {
                entity.sendMessage("§cNo item in mainhand!");
                return;
            }
            
            const loreArray = item.getLore();
            if (!loreArray || loreArray.length === 0) {
                entity.sendMessage("§cItem does not contain multi-block data!");
                return;
            }
            
            // Extract block list from lore
            const blockList = [];
            let foundBlocksSection = false;
            
            for (const lore of loreArray) {
                if (lore === "§7Blocks:") {
                    foundBlocksSection = true;
                    continue;
                }
                if (foundBlocksSection && lore.startsWith("§8- ")) {
                    const blockId = lore.replace("§8- ", "");
                    blockList.push(blockId);
                }
            }
            
            if (blockList.length === 0) {
                entity.sendMessage("§cNo valid blocks found in multi-block data!");
                return;
            }
            
            // Calculate total blocks to be placed
            const volume = Math.abs(toLocation.x - fromLocation.x + 1) * 
                          Math.abs(toLocation.y - fromLocation.y + 1) * 
                          Math.abs(toLocation.z - fromLocation.z + 1);
            
            if (volume > BLOCK_FILLING_CONFIG.MAX_OPERATIONS) {
                entity.sendMessage(`§cArea too large! ${volume} blocks would be placed. Maximum is ${BLOCK_FILLING_CONFIG.MAX_OPERATIONS}.`);
                entity.sendMessage("§7Consider using smaller areas or increase MAX_OPERATIONS in config.");
                return;
            }
            
            entity.sendMessage(`§aStarting async fill: ${volume} blocks with ${blockList.length} block types...`);
            
            fillAreaWithMultiBlockAsync(entity.dimension, fromLocation, toLocation, blockList, entity);
                
        } catch (e) {
            console.log("failed to start multi-block fill: " + e);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Async block filling function
function fillAreaWithMultiBlockAsync(dimension, from, to, blockList, entity) {
    const minX = Math.min(from.x, to.x);
    const maxX = Math.max(from.x, to.x);
    const minY = Math.min(from.y, to.y);
    const maxY = Math.max(from.y, to.y);
    const minZ = Math.min(from.z, to.z);
    const maxZ = Math.max(from.z, to.z);
    
    // Generate all positions to fill
    const positions = [];
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
                positions.push({ x, y, z });
            }
        }
    }
    
    // Shuffle positions for more natural filling pattern
    shuffleArray(positions);
    
    const fillState = {
        positions: positions,
        currentIndex: 0,
        totalBlocks: positions.length,
        placedBlocks: 0,
        failedBlocks: 0,
        startTime: Date.now(),
        dimension: dimension,
        blockList: blockList,
        entity: entity,
        intervalId: null
    };
    
    entity.sendMessage(`§7Starting to fill ${fillState.totalBlocks} blocks...`);
    
    // Start the filling process
    fillState.intervalId = system.runInterval(() => {
        processBatchFill(fillState);
    }, BLOCK_FILLING_CONFIG.TICK_DELAY);
}

// Process a batch of blocks
function processBatchFill(fillState) {
    const blocksToProcess = Math.min(
        BLOCK_FILLING_CONFIG.BLOCKS_PER_TICK,
        fillState.positions.length - fillState.currentIndex
    );
    
    for (let i = 0; i < blocksToProcess; i++) {
        if (fillState.currentIndex >= fillState.positions.length) {
            break;
        }
        
        const position = fillState.positions[fillState.currentIndex];
        const randomBlock = fillState.blockList[Math.floor(Math.random() * fillState.blockList.length)];
        
        try {
            const blockPermutation = BlockPermutation.resolve(randomBlock);
            fillState.dimension.setBlockPermutation(position, blockPermutation);
            fillState.placedBlocks++;
        } catch (e) {
            fillState.failedBlocks++;
            console.log(`Failed to place block ${randomBlock} at ${position.x},${position.y},${position.z}: ${e}`);
        }
        
        fillState.currentIndex++;
    }
    
    // Show progress updates
    if (fillState.placedBlocks % BLOCK_FILLING_CONFIG.PROGRESS_UPDATE_INTERVAL === 0 || 
        fillState.currentIndex >= fillState.positions.length) {
        const progress = Math.round((fillState.currentIndex / fillState.totalBlocks) * 100);
        const elapsed = Math.round((Date.now() - fillState.startTime) / 1000);
        
        fillState.entity.sendMessage(
            `§7Progress: ${progress}% (${fillState.placedBlocks}/${fillState.totalBlocks}) - ${elapsed}s elapsed`
        );
    }
    
    // Check if complete
    if (fillState.currentIndex >= fillState.positions.length) {
        const elapsed = Math.round((Date.now() - fillState.startTime) / 1000);
        const blocksPerSecond = Math.round(fillState.placedBlocks / elapsed);
        
        fillState.entity.sendMessage(`§aFill complete!`);
        fillState.entity.sendMessage(`§7Placed: ${fillState.placedBlocks}, Failed: ${fillState.failedBlocks}`);
        fillState.entity.sendMessage(`§7Time: ${elapsed}s (${blocksPerSecond} blocks/s)`);
        
        system.clearRun(fillState.intervalId);
    }
}

// Updated path creation with async filling
function fillAreaWithMultiBlockAsyncPath(dimension, from, to, blockList, entity, replaceBlocks = "ALL") {
    const minX = Math.min(from.x, to.x);
    const maxX = Math.max(from.x, to.x);
    const minY = Math.min(from.y, to.y);
    const maxY = Math.max(from.y, to.y);
    const minZ = Math.min(from.z, to.z);
    const maxZ = Math.max(from.z, to.z);
    
    const shouldReplaceAll = replaceBlocks === "ALL";
    const replaceList = shouldReplaceAll ? [] : replaceBlocks.split(',').map(block => block.trim());
    
    // Generate positions that need to be filled
    const positions = [];
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
                const location = { x, y, z };
                
                // Check replace conditions
                if (!shouldReplaceAll) {
                    try {
                        const currentBlock = dimension.getBlock(location);
                        const currentBlockId = currentBlock.typeId;
                        
                        const shouldReplace = replaceList.some(replaceBlock => 
                            currentBlockId.includes(replaceBlock) || replaceBlock === currentBlockId
                        );
                        
                        if (!shouldReplace) continue;
                    } catch (e) {
                        continue; // Skip if can't read block
                    }
                }
                
                positions.push(location);
            }
        }
    }
    
    if (positions.length === 0) {
        entity.sendMessage("§cNo blocks to replace found in area!");
        return;
    }
    
    // Use the same async filling system
    shuffleArray(positions);
    
    const fillState = {
        positions: positions,
        currentIndex: 0,
        totalBlocks: positions.length,
        placedBlocks: 0,
        failedBlocks: 0,
        startTime: Date.now(),
        dimension: dimension,
        blockList: blockList,
        entity: entity,
        intervalId: null
    };
    
    entity.sendMessage(`§7Starting path fill: ${fillState.totalBlocks} blocks to replace...`);
    
    fillState.intervalId = system.runInterval(() => {
        processBatchFill(fillState);
    }, BLOCK_FILLING_CONFIG.TICK_DELAY);
}

// Utility function to shuffle array (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function configFillFunction(origin, blocksPerTick = null, tickDelay = null, maxOps = null) {
    system.run(() => {
        const entity = origin.sourceEntity;
        if (!entity) return;
        
        if (blocksPerTick !== null && blocksPerTick > 0) {
            BLOCK_FILLING_CONFIG.BLOCKS_PER_TICK = blocksPerTick;
        }
        if (tickDelay !== null && tickDelay > 0) {
            BLOCK_FILLING_CONFIG.TICK_DELAY = tickDelay;
        }
        if (maxOps !== null && maxOps > 0) {
            BLOCK_FILLING_CONFIG.MAX_OPERATIONS = maxOps;
        }
        
        entity.sendMessage("§aBlock Filling Configuration:");
        entity.sendMessage(`§7Blocks per tick: §f${BLOCK_FILLING_CONFIG.BLOCKS_PER_TICK}`);
        entity.sendMessage(`§7Tick delay: §f${BLOCK_FILLING_CONFIG.TICK_DELAY}`);
        entity.sendMessage(`§7Max operations: §f${BLOCK_FILLING_CONFIG.MAX_OPERATIONS}`);
        entity.sendMessage(`§7Progress updates: §f${BLOCK_FILLING_CONFIG.PROGRESS_UPDATE_INTERVAL}`);
        
        const estimatedRate = Math.round((BLOCK_FILLING_CONFIG.BLOCKS_PER_TICK * 20) / BLOCK_FILLING_CONFIG.TICK_DELAY);
        entity.sendMessage(`§7Estimated rate: §f${estimatedRate} blocks/second`);
    });
    
    return { status: CustomCommandStatus.Success };
}

function buildPathFunction(origin) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            showBuildPathGUI(player);
        } catch (e) {
            console.log("failed to show build path GUI: " + e);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Parse waypoints from shovel lore
function parseWaypointsFromLore(loreArray) {
    const waypoints = [];
    let foundWaypointsSection = false;
    
    for (const lore of loreArray) {
        if (lore === "§8§l--- WAYPOINTS ---") {
            foundWaypointsSection = true;
            continue;
        }
        if (foundWaypointsSection && lore.startsWith("§b")) {
            // Parse format: "§b1: 100,64,200"
            const match = lore.match(/§b\d+: (-?\d+),(-?\d+),(-?\d+)/);
            if (match) {
                waypoints.push({
                    x: parseInt(match[1]),
                    y: parseInt(match[2]),
                    z: parseInt(match[3])
                });
            }
        }
    }
    
    return waypoints;
}

// Show path preview with particles
function showPathPreview(player, waypoints, radius, mode) {
    player.sendMessage("§aShowing path preview with particles...");
    
    let particleCount = 0;
    const maxParticles = 500; // Limit to prevent lag
    
    for (let i = 0; i < waypoints.length - 1; i++) {
        const from = waypoints[i];
        const to = waypoints[i + 1];
        
        particleCount += createPathPreviewSegment(player.dimension, from, to, radius, mode, maxParticles - particleCount);
        
        if (particleCount >= maxParticles) break;
    }
    
    player.sendMessage(`§7Preview shown with ${particleCount} particles. Use command again without preview to build.`);
}

// Create preview particles for path segment
function createPathPreviewSegment(dimension, from, to, radius, mode, remainingParticles) {
    const distance = Math.sqrt(
        Math.pow(to.x - from.x, 2) + 
        Math.pow(to.y - from.y, 2) + 
        Math.pow(to.z - from.z, 2)
    );
    
    const steps = Math.min(Math.ceil(distance), remainingParticles / 10);
    let particleCount = 0;
    
    for (let step = 0; step <= steps && particleCount < remainingParticles; step++) {
        const t = step / steps;
        
        const centerX = from.x + (to.x - from.x) * t;
        const centerY = from.y + (to.y - from.y) * t;
        const centerZ = from.z + (to.z - from.z) * t;
        
        // Show fewer particles for preview
        const previewRadius = Math.max(1, Math.ceil(radius));
        for (let x = centerX - previewRadius; x <= centerX + previewRadius && particleCount < remainingParticles; x += 2) {
            for (let y = centerY - previewRadius; y <= centerY + previewRadius && particleCount < remainingParticles; y += 2) {
                for (let z = centerZ - previewRadius; z <= centerZ + previewRadius && particleCount < remainingParticles; z += 2) {
                    if (shouldPlaceAtLocation(centerX, centerY, centerZ, x, y, z, radius, mode)) {
                        try {
                            dimension.spawnParticle("minecraft:heart_particle", {x, y: y + 0.5, z});
                            particleCount++;
                        } catch (e) {
                            // Particle failed, continue
                        }
                    }
                }
            }
        }
    }
    
    return particleCount;
}

// Main path creation function with async processing
function createPath(player, waypoints, radius, mode, replaceBlocks, blockSource, customInput) {
    try {
        // Determine blocks to use
        const pathBlocks = getPathBlocks(player, blockSource, customInput);
        if (!pathBlocks || pathBlocks.length === 0) {
            player.sendMessage("§cCould not determine blocks to use for path!");
            return;
        }
        
        // Parse replace blocks
        const shouldReplaceAll = replaceBlocks === "ALL";
        const replaceList = shouldReplaceAll ? [] : replaceBlocks.split(',').map(block => block.trim());
        
        // Calculate all positions for the entire path
        const allPositions = [];
        for (let i = 0; i < waypoints.length - 1; i++) {
            const from = waypoints[i];
            const to = waypoints[i + 1];
            
            const segmentPositions = calculatePathSegmentPositions(from, to, radius, mode, player.dimension, shouldReplaceAll, replaceList);
            allPositions.push(...segmentPositions);
        }
        
        if (allPositions.length === 0) {
            player.sendMessage("§cNo valid positions found for path creation!");
            return;
        }
        
        // Check if path is too large
        if (allPositions.length > 200) {
            player.sendMessage(`§cPath too large! ${allPositions.length} blocks would be placed. Maximum is 50,000.`);
            player.sendMessage("§7Consider using smaller radius or fewer waypoints.");
            return;
        }
        
        player.sendMessage(`§aStarting async path creation: ${allPositions.length} blocks...`);
        player.sendMessage(`§7Mode: ${["Flat", "Vertical Flat", "Spherical", "Square"][mode]}, Radius: ${radius}`);
        
        // Start async path creation
        createPathAsync(player, allPositions, pathBlocks);
        
    } catch (e) {
        player.sendMessage(`§cFailed to create path: ${e.message || e}`);
        console.log("Failed to create path: " + e);
    }
}

// Get blocks to use for path
function getPathBlocks(player, blockSource, customInput) {
    const equippable = player.getComponent("minecraft:equippable");
    
    switch (blockSource) {
        case 0: // Mainhand
            const mainhandItem = equippable.getEquipment(EquipmentSlot.Mainhand);
            if (mainhandItem && mainhandItem.nameTag && mainhandItem.nameTag.includes("Path Creation Tool")) {
                player.sendMessage("§cCannot use path tool as building block! Choose a different source.");
                return null;
            }
            return mainhandItem ? getBlocksFromItem(mainhandItem) : null;
            
        case 1: // Offhand
            const offhandItem = equippable.getEquipment(EquipmentSlot.Offhand);
            return offhandItem ? getBlocksFromItem(offhandItem) : null;
            
        case 2: // Hotbar slot
            const slot = parseInt(customInput);
            if (isNaN(slot) || slot < 0 || slot > 8) {
                player.sendMessage("§cInvalid hotbar slot! Use 0-8.");
                return null;
            }
            const inventory = player.getComponent("minecraft:inventory");
            const hotbarItem = inventory.container.getItem(slot);
            return hotbarItem ? getBlocksFromItem(hotbarItem) : null;
            
        case 3: // Custom block ID
            return [customInput];
    }
    
    return null;
}

// Extract blocks from item (handles multi-block items)
function getBlocksFromItem(item) {
    const loreArray = item.getLore();
    
    // Check if it's a multi-block item
    if (loreArray && loreArray.some(lore => lore === "§6Multi-Block Item")) {
        const blocks = [];
        let foundBlocksSection = false;
        
        for (const lore of loreArray) {
            if (lore === "§7Blocks:") {
                foundBlocksSection = true;
                continue;
            }
            if (foundBlocksSection && lore.startsWith("§8- ")) {
                const blockId = lore.replace("§8- ", "");
                blocks.push(blockId);
            }
        }
        
        return blocks.length > 0 ? blocks : [item.typeId];
    }
    
    return [item.typeId];
}

// Calculate positions for a path segment without placing blocks
function calculatePathSegmentPositions(from, to, radius, mode, dimension, shouldReplaceAll, replaceList) {
    const distance = Math.sqrt(
        Math.pow(to.x - from.x, 2) + 
        Math.pow(to.y - from.y, 2) + 
        Math.pow(to.z - from.z, 2)
    );
    
    const steps = Math.ceil(distance * 2);
    const positions = [];
    
    for (let step = 0; step <= steps; step++) {
        const t = step / steps;
        
        const centerX = from.x + (to.x - from.x) * t;
        const centerY = from.y + (to.y - from.y) * t;
        const centerZ = from.z + (to.z - from.z) * t;
        
        // Create area around this point based on mode
        for (let x = centerX - Math.ceil(radius); x <= centerX + Math.ceil(radius); x++) {
            for (let y = centerY - Math.ceil(radius); y <= centerY + Math.ceil(radius); y++) {
                for (let z = centerZ - Math.ceil(radius); z <= centerZ + Math.ceil(radius); z++) {
                    if (shouldPlaceAtLocation(centerX, centerY, centerZ, x, y, z, radius, mode)) {
                        const location = { x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) };
                        
                        // Check replacement rules
                        if (!shouldReplaceAll) {
                            try {
                                const currentBlock = dimension.getBlock(location);
                                const currentBlockId = currentBlock.typeId;
                                
                                const shouldReplace = replaceList.some(replaceBlock => 
                                    currentBlockId.includes(replaceBlock) || replaceBlock === currentBlockId
                                );
                                
                                if (!shouldReplace) continue;
                            } catch (e) {
                                continue; // Skip if can't read block
                            }
                        }
                        
                        // Avoid duplicate positions
                        const existing = positions.find(pos => 
                            pos.x === location.x && pos.y === location.y && pos.z === location.z
                        );
                        
                        if (!existing) {
                            positions.push(location);
                        }
                    }
                }
            }
        }
    }
    
    return positions;
}

// Async path creation function
function createPathAsync(player, positions, pathBlocks) {
    // Shuffle positions for more natural building pattern
    shuffleArray(positions);
    
    const pathState = {
        positions: positions,
        currentIndex: 0,
        totalBlocks: positions.length,
        placedBlocks: 0,
        failedBlocks: 0,
        startTime: Date.now(),
        dimension: player.dimension,
        pathBlocks: pathBlocks,
        player: player,
        intervalId: null
    };
    
    player.sendMessage(`§7Building path with ${pathState.totalBlocks} blocks...`);
    
    // Start the path building process
    pathState.intervalId = system.runInterval(() => {
        processPathBatch(pathState);
    }, 1); // Process every tick
}

// Process a batch of path blocks
function processPathBatch(pathState) {
    const blocksToProcess = Math.min(100, pathState.positions.length - pathState.currentIndex); // 100 blocks per tick
    
    for (let i = 0; i < blocksToProcess; i++) {
        if (pathState.currentIndex >= pathState.positions.length) {
            break;
        }
        
        const position = pathState.positions[pathState.currentIndex];
        const randomBlock = pathState.pathBlocks[Math.floor(Math.random() * pathState.pathBlocks.length)];
        
        try {
            const blockPermutation = BlockPermutation.resolve(randomBlock);
            pathState.dimension.setBlockPermutation(position, blockPermutation);
            pathState.placedBlocks++;
        } catch (e) {
            pathState.failedBlocks++;
            console.log(`Failed to place path block ${randomBlock} at ${position.x},${position.y},${position.z}: ${e}`);
        }
        
        pathState.currentIndex++;
    }
    
    // Show progress updates every 500 blocks
    if (pathState.placedBlocks % 500 === 0 || pathState.currentIndex >= pathState.positions.length) {
        const progress = Math.round((pathState.currentIndex / pathState.totalBlocks) * 100);
        const elapsed = Math.round((Date.now() - pathState.startTime) / 1000);
        
        pathState.player.sendMessage(
            `§7Path Progress: ${progress}% (${pathState.placedBlocks}/${pathState.totalBlocks}) - ${elapsed}s`
        );
    }
    
    // Check if complete
    if (pathState.currentIndex >= pathState.positions.length) {
        const elapsed = Math.round((Date.now() - pathState.startTime) / 1000);
        const blocksPerSecond = elapsed > 0 ? Math.round(pathState.placedBlocks / elapsed) : pathState.placedBlocks;
        
        pathState.player.sendMessage(`§aPath creation complete!`);
        pathState.player.sendMessage(`§7Placed: ${pathState.placedBlocks}, Failed: ${pathState.failedBlocks}`);
        pathState.player.sendMessage(`§7Time: ${elapsed}s (${blocksPerSecond} blocks/s)`);
        
        system.clearRun(pathState.intervalId);
    }
}

// Determine if block should be placed at location based on mode
function shouldPlaceAtLocation(centerX, centerY, centerZ, x, y, z, radius, mode) {
    const dx = x - centerX;
    const dy = y - centerY;
    const dz = z - centerZ;
    
    switch (mode) {
        case 0: // Flat (Y level) - only place at center Y level
            return Math.abs(dy) < 0.5 && Math.sqrt(dx*dx + dz*dz) <= radius;
            
        case 1: // Vertical Flat (XZ plane) - create vertical wall
            return Math.sqrt(dx*dx + dz*dz) <= radius;
            
        case 2: // Spherical (3D)
            return Math.sqrt(dx*dx + dy*dy + dz*dz) <= radius;
            
        case 3: // Square/Cubic
            return Math.abs(dx) <= radius && Math.abs(dy) <= radius && Math.abs(dz) <= radius;
    }
    
    return false;
}

// Event handler for path tool usage
world.afterEvents.itemUse.subscribe((ev) => {
    if (ev.source.typeId !== "minecraft:player" || !ev.itemStack) return;
    
    const player = ev.source;
    const itemStack = ev.itemStack;
    
    // Check if it's the path tool
    if (!itemStack.nameTag || !itemStack.nameTag.includes("Path Creation Tool")) return;
    
    try {
        // Get block player is looking at
        const blockFromView = player.getBlockFromViewDirection({ maxDistance: 10 });
        
        if (!blockFromView || !blockFromView.block) {
            player.sendMessage("§cNo block found in view direction!");
            return;
        }
        
        const targetLocation = blockFromView.block.location;
        const equippable = player.getComponent("minecraft:equippable");
        const currentTool = equippable.getEquipment(EquipmentSlot.Mainhand);
        
        if (!currentTool) return;
        
        // Get current lore and add new waypoint
        const currentLore = currentTool.getLore();
        const waypoints = parseWaypointsFromLore(currentLore);
        
        // Check if waypoint already exists
        const alreadyExists = waypoints.some(wp => 
            wp.x === targetLocation.x && wp.y === targetLocation.y && wp.z === targetLocation.z
        );
        
        if (alreadyExists) {
            player.sendMessage("§eWaypoint already exists at this location!");
            return;
        }
        
        // Add new waypoint to lore
        const newTool = currentTool.clone();
        const newLore = [...currentLore];
        
        const waypointNumber = waypoints.length + 1;
        newLore.push(`§b${waypointNumber}: ${targetLocation.x},${targetLocation.y},${targetLocation.z}`);
        
        newTool.setLore(newLore);
        equippable.setEquipment(EquipmentSlot.Mainhand, newTool);
        
        player.sendMessage(`§aWaypoint ${waypointNumber} added: ${targetLocation.x}, ${targetLocation.y}, ${targetLocation.z}`);
        player.sendMessage(`§7Total waypoints: ${waypointNumber}. Use /buildpath when ready.`);
        
    } catch (e) {
        console.log("Error adding waypoint: " + e);
        player.sendMessage("§cFailed to add waypoint!");
    }
});