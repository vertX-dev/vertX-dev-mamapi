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

import { FONTS } from "./buildTextFont.js";
import { PALLETS } from "./blockPallets.js";


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
            { type: CustomCommandParamType.Integer, name: "Blocks per tick (default 500)" },
            { type: CustomCommandParamType.Integer, name: "Tick delay (default 2)" },
            { type: CustomCommandParamType.Integer, name: "Max operations (default 100000)" }
        ]
    };    
    
    const buildTextCommand = {
        name: "vertx:buildtext",
        description: "Build 3D text from blocks with customizable options",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: "Text to build" }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Location, name: "Start location" },
            { type: CustomCommandParamType.Integer, name: "Scale (1-10, default: 3)" },
            { type: CustomCommandParamType.String, name: "Direction (north/south/east/west, default: north)" },
            { type: CustomCommandParamType.Boolean, name: "Vertical text (default: false)" },
            { type: CustomCommandParamType.String, name: "Font style (block/slim, default: block)" }
        ]
    };
    
    const brushCommand = {
        name: "vertx:brush",
        description: "Configure and create brush tool",
        permissionLevel: CommandPermissionLevel.GameDirectors
    };
    
    const largeFillCommand = {
        name: "vertx:largefill",
        description: "Fill large areas with blocks using async processing (up to 1M blocks)",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.Location, name: "From location" },
            { type: CustomCommandParamType.Location, name: "To location" },
            { type: CustomCommandParamType.String, name: "Block to place" }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.String, name: "Fill mode (replace/keep/outline/hollow/destroy, default: replace)" },
            { type: CustomCommandParamType.String, name: "Replace block filter (for replace mode, default: all)" }
        ]
    };
    
    const fillInfoCommand = {
        name: "vertx:fillinfo",
        description: "Calculate fill area size and estimated time",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.Location, name: "From location" },
            { type: CustomCommandParamType.Location, name: "To location" }
        ]
    };
    
    const createFigureCommand = {
        name: "vertx:createfigure",
        description: "Create geometric figures (cube, sphere, cylinder, pyramid) with various options",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: "Figure type (cube/sphere/cylinder/pyramid)" },
            { type: CustomCommandParamType.Location, name: "Center location" },
            { type: CustomCommandParamType.String, name: "Block type" },
            { type: CustomCommandParamType.Integer, name: "Size (radius/half-width)" }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.String, name: "Mode (solid/hollow/keep, default: solid)" },
            { type: CustomCommandParamType.Integer, name: "Rotation in degrees (default: 0)" },
            { type: CustomCommandParamType.Integer, name: "Height (for cylinder/pyramid, default: size)" }
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
    init.customCommandRegistry.registerCommand(buildTextCommand, buildTextFunction);
    init.customCommandRegistry.registerCommand(brushCommand, brushFunction);
    init.customCommandRegistry.registerCommand(fillInfoCommand, fillInfoFunction);
    init.customCommandRegistry.registerCommand(largeFillCommand, largeFillFunction);
    init.customCommandRegistry.registerCommand(createFigureCommand, createFigureFunction);
    
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
// Updated: Main path creation function
function createPath(player, waypoints, radius, mode, replaceBlocks, blockSource, customInput) {
    try {
        const pathBlocks = getPathBlocks(player, blockSource, customInput);
        if (!pathBlocks || pathBlocks.length === 0) {
            player.sendMessage("§cCould not determine blocks to use for path!");
            return;
        }
        
        const shouldReplaceAll = replaceBlocks === "ALL";
        const replaceList = shouldReplaceAll ? [] : replaceBlocks.split(',').map(block => block.trim());
        
        player.sendMessage(`§aStarting connected path creation...`);
        player.sendMessage(`§7Mode: ${["Flat", "Vertical Flat", "Spherical", "Square"][mode]}, Radius: ${radius}`);
        
        // Start building the connected path
        createConnectedPathAsync(player, waypoints, radius, mode, pathBlocks, shouldReplaceAll, replaceList);
        
    } catch (e) {
        player.sendMessage(`§cFailed to create path: ${e.message || e}`);
        console.log("Failed to create path: " + e);
    }
}

// New: Connected path creation with smooth interpolation
function createConnectedPathAsync(player, waypoints, radius, mode, pathBlocks, shouldReplaceAll, replaceList) {
    const pathState = {
        waypoints: waypoints,
        currentSegment: 0,
        totalSegments: waypoints.length - 1,
        radius: radius,
        mode: mode,
        pathBlocks: pathBlocks,
        shouldReplaceAll: shouldReplaceAll,
        replaceList: replaceList,
        dimension: player.dimension,
        player: player,
        
        // Current interpolation state
        currentStep: 0,
        totalSteps: 0,
        segmentFrom: null,
        segmentTo: null,
        
        // Statistics
        totalPlaced: 0,
        totalFailed: 0,
        startTime: Date.now(),
        
        // Control
        intervalId: null
    };
    
    // Initialize first segment
    initializeSegment(pathState);
    
    // Start processing
    pathState.intervalId = system.runInterval(() => {
        processConnectedPath(pathState);
    }, 1);
}

// Initialize current segment for processing
function initializeSegment(pathState) {
    if (pathState.currentSegment >= pathState.totalSegments) {
        return false; // No more segments
    }
    
    pathState.segmentFrom = pathState.waypoints[pathState.currentSegment];
    pathState.segmentTo = pathState.waypoints[pathState.currentSegment + 1];
    
    const distance = Math.sqrt(
        Math.pow(pathState.segmentTo.x - pathState.segmentFrom.x, 2) + 
        Math.pow(pathState.segmentTo.y - pathState.segmentFrom.y, 2) + 
        Math.pow(pathState.segmentTo.z - pathState.segmentFrom.z, 2)
    );
    
    pathState.totalSteps = Math.min(Math.ceil(distance * 2), 300); // Cap steps per segment
    pathState.currentStep = 0;
    
    pathState.player.sendMessage(`§7Segment ${pathState.currentSegment + 1}/${pathState.totalSegments} - ${pathState.totalSteps} steps`);
    
    return true;
}

// Process connected path step by step
function processConnectedPath(pathState) {
    if (pathState.currentStep >= pathState.totalSteps) {
        // Current segment complete, move to next
        pathState.currentSegment++;
        
        if (!initializeSegment(pathState)) {
            // All segments complete
            finishConnectedPath(pathState);
            return;
        }
    }
    
    // Process current step
    const blocksPerStep = 100; // Blocks to process per step
    let stepPlaced = 0;
    
    for (let b = 0; b < blocksPerStep && pathState.currentStep < pathState.totalSteps; b++) {
        const t = pathState.currentStep / pathState.totalSteps;
        
        const centerX = pathState.segmentFrom.x + (pathState.segmentTo.x - pathState.segmentFrom.x) * t;
        const centerY = pathState.segmentFrom.y + (pathState.segmentTo.y - pathState.segmentFrom.y) * t;
        const centerZ = pathState.segmentFrom.z + (pathState.segmentTo.z - pathState.segmentFrom.z) * t;
        
        // Place blocks in area around this point
        const placed = placeBlocksAtStep(pathState, centerX, centerY, centerZ);
        stepPlaced += placed;
        
        pathState.currentStep++;
    }
    
    pathState.totalPlaced += stepPlaced;
    
    // Show progress every 50 steps
    if (pathState.currentStep % 20 === 0 || pathState.currentStep >= pathState.totalSteps) {
        const segmentProgress = Math.round((pathState.currentStep / pathState.totalSteps) * 100);
        const elapsed = Math.round((Date.now() - pathState.startTime) / 1000);
        
        pathState.player.sendMessage(
            `§7Step ${pathState.currentStep}/${pathState.totalSteps} (${segmentProgress}%) - ${pathState.totalPlaced} blocks placed - ${elapsed}s`
        );
    }
}

// Place blocks at current step position
function placeBlocksAtStep(pathState, centerX, centerY, centerZ) {
    let placed = 0;
    const maxRadius = Math.min(pathState.radius, 8); // Cap radius for performance
    
    // Limit area scan to prevent hangs
    for (let x = centerX - Math.ceil(maxRadius); x <= centerX + Math.ceil(maxRadius); x++) {
        for (let y = centerY - Math.ceil(maxRadius); y <= centerY + Math.ceil(maxRadius); y++) {
            for (let z = centerZ - Math.ceil(maxRadius); z <= centerZ + Math.ceil(maxRadius); z++) {
                if (shouldPlaceAtLocation(centerX, centerY, centerZ, x, y, z, pathState.radius, pathState.mode)) {
                    const location = { x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) };
                    
                    // Check replacement rules
                    if (!pathState.shouldReplaceAll && pathState.replaceList.length > 0) {
                        try {
                            const currentBlock = pathState.dimension.getBlock(location);
                            const currentBlockId = currentBlock.typeId;
                            
                            const shouldReplace = pathState.replaceList.some(replaceBlock => 
                                currentBlockId.includes(replaceBlock)
                            );
                            
                            if (!shouldReplace) continue;
                        } catch (e) {
                            continue;
                        }
                    }
                    
                    // Place block
                    try {
                        const randomBlock = pathState.pathBlocks[Math.floor(Math.random() * pathState.pathBlocks.length)];
                        const blockPermutation = BlockPermutation.resolve(randomBlock);
                        pathState.dimension.setBlockPermutation(location, blockPermutation);
                        placed++;
                    } catch (e) {
                        pathState.totalFailed++;
                        console.log(`Failed to place block at ${location.x},${location.y},${location.z}: ${e}`);
                    }
                }
            }
        }
    }
    
    return placed;
}

// Finish connected path creation
function finishConnectedPath(pathState) {
    const elapsed = Math.round((Date.now() - pathState.startTime) / 1000);
    const blocksPerSecond = elapsed > 0 ? Math.round(pathState.totalPlaced / elapsed) : pathState.totalPlaced;
    
    pathState.player.sendMessage(`§aConnected path creation complete!`);
    pathState.player.sendMessage(`§7Total placed: ${pathState.totalPlaced}, Failed: ${pathState.totalFailed}`);
    pathState.player.sendMessage(`§7Time: ${elapsed}s (${blocksPerSecond} blocks/s)`);
    pathState.player.sendMessage(`§7Path connects all ${pathState.waypoints.length} waypoints smoothly!`);
    
    system.clearRun(pathState.intervalId);
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

// Async path creation with segment-by-segment processing
function createPathAsyncWithCalculation(player, waypoints, radius, mode, pathBlocks, shouldReplaceAll, replaceList) {
    const pathState = {
        waypoints: waypoints,
        currentSegment: 0,
        totalSegments: waypoints.length - 1,
        radius: radius,
        mode: mode,
        pathBlocks: pathBlocks,
        shouldReplaceAll: shouldReplaceAll,
        replaceList: replaceList,
        dimension: player.dimension,
        player: player,
        
        // Current segment processing
        positions: [],
        currentIndex: 0,
        
        // Statistics
        totalPlaced: 0,
        totalFailed: 0,
        startTime: Date.now(),
        
        // Control
        intervalId: null,
        isCalculating: true
    };
    
    // Start processing segments one by one
    pathState.intervalId = system.runInterval(() => {
        if (pathState.isCalculating) {
            processSegmentCalculation(pathState);
        } else {
            processSegmentBuilding(pathState);
        }
    }, 1); // Every tick
}

// Calculate positions for current segment in small batches
function processSegmentCalculation(pathState) {
    if (pathState.currentSegment >= pathState.totalSegments) {
        // All segments calculated and built, finish
        finishPathCreation(pathState);
        return;
    }
    
    const from = pathState.waypoints[pathState.currentSegment];
    const to = pathState.waypoints[pathState.currentSegment + 1];
    
    // Calculate this segment's positions (in small batches to avoid hang)
    const segmentPositions = calculatePathSegmentPositionsBatched(
        from, to, pathState.radius, pathState.mode, 
        pathState.dimension, pathState.shouldReplaceAll, pathState.replaceList
    );
    
    if (segmentPositions.length === 0) {
        // No positions in this segment, move to next
        pathState.currentSegment++;
        pathState.player.sendMessage(`§7Segment ${pathState.currentSegment}/${pathState.totalSegments} - no valid positions`);
        return;
    }
    
    // Shuffle positions for natural building
    shuffleArray(segmentPositions);
    
    pathState.positions = segmentPositions;
    pathState.currentIndex = 0;
    pathState.isCalculating = false;
    
    pathState.player.sendMessage(`§7Segment ${pathState.currentSegment + 1}/${pathState.totalSegments} - building ${segmentPositions.length} blocks...`);
}

// Build current segment in small batches
function processSegmentBuilding(pathState) {
    const blocksToProcess = Math.min(100, pathState.positions.length - pathState.currentIndex);
    let segmentPlaced = 0;
    let segmentFailed = 0;
    
    for (let i = 0; i < blocksToProcess; i++) {
        if (pathState.currentIndex >= pathState.positions.length) {
            break;
        }
        
        const position = pathState.positions[pathState.currentIndex];
        const randomBlock = pathState.pathBlocks[Math.floor(Math.random() * pathState.pathBlocks.length)];
        
        try {
            const blockPermutation = BlockPermutation.resolve(randomBlock);
            pathState.dimension.setBlockPermutation(position, blockPermutation);
            segmentPlaced++;
            pathState.totalPlaced++;
        } catch (e) {
            segmentFailed++;
            pathState.totalFailed++;
            console.log(`Failed to place path block ${randomBlock} at ${position.x},${position.y},${position.z}: ${e}`);
        }
        
        pathState.currentIndex++;
    }
    
    // Check if current segment is complete
    if (pathState.currentIndex >= pathState.positions.length) {
        // Segment complete, move to next
        pathState.currentSegment++;
        pathState.isCalculating = true;
        
        const elapsed = Math.round((Date.now() - pathState.startTime) / 1000);
        pathState.player.sendMessage(`§aSegment complete! Total: ${pathState.totalPlaced} blocks placed (${elapsed}s)`);
    }
}

// Finish path creation
function finishPathCreation(pathState) {
    const elapsed = Math.round((Date.now() - pathState.startTime) / 1000);
    const blocksPerSecond = elapsed > 0 ? Math.round(pathState.totalPlaced / elapsed) : pathState.totalPlaced;
    
    pathState.player.sendMessage(`§aPath creation complete!`);
    pathState.player.sendMessage(`§7Total placed: ${pathState.totalPlaced}, Failed: ${pathState.totalFailed}`);
    pathState.player.sendMessage(`§7Time: ${elapsed}s (${blocksPerSecond} blocks/s)`);
    
    system.clearRun(pathState.intervalId);
}

// Calculate positions for a single segment with lighter processing
function calculatePathSegmentPositionsBatched(from, to, radius, mode, dimension, shouldReplaceAll, replaceList) {
    const distance = Math.sqrt(
        Math.pow(to.x - from.x, 2) + 
        Math.pow(to.y - from.y, 2) + 
        Math.pow(to.z - from.z, 2)
    );
    
    // Limit steps to prevent massive calculations
    const maxSteps = Math.min(Math.ceil(distance * 2), 200); // Cap at 200 steps per segment
    const positions = [];
    const maxPositions = 5000; // Cap positions per segment
    
    for (let step = 0; step <= maxSteps && positions.length < maxPositions; step++) {
        const t = step / maxSteps;
        
        const centerX = from.x + (to.x - from.x) * t;
        const centerY = from.y + (to.y - from.y) * t;
        const centerZ = from.z + (to.z - from.z) * t;
        
        // Limit radius scanning to prevent massive loops
        const scanRadius = Math.min(radius, 10); // Cap scan radius
        
        for (let x = centerX - Math.ceil(scanRadius); x <= centerX + Math.ceil(scanRadius) && positions.length < maxPositions; x++) {
            for (let y = centerY - Math.ceil(scanRadius); y <= centerY + Math.ceil(scanRadius) && positions.length < maxPositions; y++) {
                for (let z = centerZ - Math.ceil(scanRadius); z <= centerZ + Math.ceil(scanRadius) && positions.length < maxPositions; z++) {
                    if (shouldPlaceAtLocation(centerX, centerY, centerZ, x, y, z, radius, mode)) {
                        const location = { x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) };
                        
                        // Quick duplicate check (only check last few positions for performance)
                        const recentPositions = positions.slice(-50);
                        const isDuplicate = recentPositions.some(pos => 
                            pos.x === location.x && pos.y === location.y && pos.z === location.z
                        );
                        
                        if (!isDuplicate) {
                            // Simplified replacement check (only for critical blocks)
                            if (!shouldReplaceAll && replaceList.length > 0) {
                                try {
                                    const currentBlock = dimension.getBlock(location);
                                    const currentBlockId = currentBlock.typeId;
                                    
                                    const shouldReplace = replaceList.some(replaceBlock => 
                                        currentBlockId.includes(replaceBlock)
                                    );
                                    
                                    if (!shouldReplace) continue;
                                } catch (e) {
                                    continue;
                                }
                            }
                            
                            positions.push(location);
                        }
                    }
                }
            }
        }
    }
    
    return positions;
}

// Utility function to shuffle array (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
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
        const blockFromView = player.getBlockFromViewDirection({ maxDistance: 64 });
        
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



// Main build text function
function buildTextFunction(origin, text, location = null, scale = 3, direction = "north", vertical = false, fontStyle = "slim") {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") {
                console.log("Build text requires a player");
                return;
            }
            
            // Validate inputs
            const validationResult = validateTextInput(text, scale, direction, fontStyle, player);
            if (!validationResult.valid) {
                return;
            }
            
            const startLocation = location || player.location;
            
            // Get blocks to use
            const blocks = getTextBlocks(player);
            if (!blocks || blocks.length === 0) {
                player.sendMessage("§cNo valid blocks found! Hold a block or multi-block item.");
                return;
            }
            
            player.sendMessage(`§aStarting text build: "${text}"`);
            player.sendMessage(`§7Font: ${fontStyle}, Scale: ${scale}x, Direction: ${direction}${vertical ? " (vertical)" : ""}`);
            
            // Start async text building
            buildTextAsync(player, text, startLocation, scale, direction, vertical, fontStyle, blocks);
            
        } catch (e) {
            console.log("Failed to build text: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to build text: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Validate input parameters
function validateTextInput(text, scale, direction, fontStyle, player) {
    // Check text length
    if (text.length > 20) {
        player.sendMessage("§cText too long! Maximum 20 characters.");
        return { valid: false };
    }
    
    // Check scale
    if (scale < 1 || scale > 10) {
        player.sendMessage("§cInvalid scale! Use 1-10.");
        return { valid: false };
    }
    
    // Check direction
    const validDirections = ["north", "south", "east", "west"];
    if (!validDirections.includes(direction.toLowerCase())) {
        player.sendMessage("§cInvalid direction! Use: north, south, east, west");
        return { valid: false };
    }
    
    // Check font style
    if (!FONTS[fontStyle]) {
        player.sendMessage(`§cInvalid font style! Available: ${Object.keys(FONTS).join(", ")}`);
        return { valid: false };
    }
    
    // Check for unsupported characters
    const font = FONTS[fontStyle];
    const unsupported = [];
    for (const char of text.toUpperCase()) {
        if (!font[char]) {
            unsupported.push(char);
        }
    }
    
    if (unsupported.length > 0) {
        player.sendMessage(`§cUnsupported characters: ${unsupported.join(", ")}`);
        player.sendMessage(`§7Available: ${Object.keys(font).join("")}`);
        return { valid: false };
    }
    
    return { valid: true };
}

// Get blocks from player's item
function getTextBlocks(player) {
    const equippable = player.getComponent("minecraft:equippable");
    const item = equippable?.getEquipment(EquipmentSlot.Mainhand);
    
    if (!item) return null;
    
    // Check if it's a multi-block item
    const loreArray = item.getLore();
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

// Main async text building function
function buildTextAsync(player, text, startLocation, scale, direction, vertical, fontStyle, blocks) {
    const font = FONTS[fontStyle];
    const upperText = text.toUpperCase();
    
    // Calculate text dimensions and positions
    const textInfo = calculateTextLayout(upperText, font, scale, direction, vertical);
    
    // Estimate total blocks
    const estimatedBlocks = estimateBlockCount(upperText, font, scale);
    if (estimatedBlocks > 500000) {
        player.sendMessage(`§cText too large! Estimated ${estimatedBlocks} blocks. Maximum is 50,000.`);
        player.sendMessage("§7Try smaller scale or shorter text.");
        return;
    }
    
    player.sendMessage(`§7Building ${upperText.length} characters, estimated ${estimatedBlocks} blocks...`);
    
    // Initialize build state
    const buildState = {
        player: player,
        text: upperText,
        font: font,
        startLocation: startLocation,
        scale: scale,
        direction: direction,
        vertical: vertical,
        blocks: blocks,
        textInfo: textInfo,
        dimension: player.dimension,
        
        // Progress tracking
        currentChar: 0,
        currentRow: 0,
        totalChars: upperText.length,
        blocksPlaced: 0,
        blocksFailed: 0,
        startTime: Date.now(),
        
        // Control
        intervalId: null
    };
    
    // Start building
    buildState.intervalId = system.runInterval(() => {
        processTextBuilding(buildState);
    }, 1);
}

// Calculate text layout and dimensions
function calculateTextLayout(text, font, scale, direction, vertical) {
    let totalWidth = 0;
    let maxHeight = 0;
    const charWidths = [];
    
    // Calculate dimensions
    for (const char of text) {
        const pattern = font[char];
        if (pattern) {
            const charWidth = pattern[0].length;
            charWidths.push(charWidth);
            totalWidth += charWidth + 1; // +1 for spacing between characters
            maxHeight = Math.max(maxHeight, pattern.length);
        }
    }
    
    totalWidth = Math.max(0, totalWidth - 1); // Remove last spacing
    
    return {
        totalWidth: totalWidth * scale,
        totalHeight: maxHeight * scale,
        charWidths: charWidths,
        maxHeight: maxHeight
    };
}

// Estimate total block count
function estimateBlockCount(text, font, scale) {
    let totalBlocks = 0;
    
    for (const char of text) {
        const pattern = font[char];
        if (pattern) {
            for (const row of pattern) {
                for (const pixel of row) {
                    if (pixel === '#') {
                        totalBlocks += scale * scale; // Each pixel becomes scale×scale blocks
                    }
                }
            }
        }
    }
    
    return totalBlocks;
}

// Process text building character by character
function processTextBuilding(buildState) {
    if (buildState.currentChar >= buildState.totalChars) {
        // Building complete
        finishTextBuilding(buildState);
        return;
    }
    
    const char = buildState.text[buildState.currentChar];
    const pattern = buildState.font[char];
    
    if (!pattern) {
        // Skip unsupported character
        buildState.currentChar++;
        buildState.currentRow = 0;
        return;
    }
    
    // Process current row of current character
    const blocksThisTick = buildCharacterRow(buildState, char, pattern);
    buildState.blocksPlaced += blocksThisTick;
    
    buildState.currentRow++;
    
    // Check if character is complete
    if (buildState.currentRow >= pattern.length) {
        buildState.currentChar++;
        buildState.currentRow = 0;
        
        // Show progress
        const progress = Math.round((buildState.currentChar / buildState.totalChars) * 100);
        const elapsed = Math.round((Date.now() - buildState.startTime) / 1000);
        
        buildState.player.sendMessage(
            `§7Character ${buildState.currentChar}/${buildState.totalChars} (${progress}%) - ${buildState.blocksPlaced} blocks - ${elapsed}s`
        );
    }
}

// Build one row of a character
function buildCharacterRow(buildState, char, pattern) {
    const row = pattern[buildState.currentRow];
    let blocksPlaced = 0;
    
    // Calculate character start position
    const charStartX = calculateCharacterStartX(buildState);
    const charStartY = calculateCharacterStartY(buildState);
    const charStartZ = calculateCharacterStartZ(buildState);
    
    // Build each pixel in the row
    for (let col = 0; col < row.length; col++) {
        if (row[col] === '#') {
            // Calculate pixel position
            const pixelPos = calculatePixelPosition(
                charStartX, charStartY, charStartZ,
                col, buildState.currentRow,
                buildState.scale, buildState.direction, buildState.vertical, buildState
            );
            
            // Place scaled block(s) for this pixel
            blocksPlaced += placeScaledPixel(buildState, pixelPos);
        }
    }
    
    return blocksPlaced;
}

// Calculate character starting X position
function calculateCharacterStartX(buildState) {
    let offsetX = 0;
    
    // Calculate offset for current character
    for (let i = 0; i < buildState.currentChar; i++) {
        const char = buildState.text[i];
        const pattern = buildState.font[char];
        if (pattern) {
            offsetX += (pattern[0].length + 1) * buildState.scale; // +1 for spacing
        }
    }
    
    // Apply direction
    switch (buildState.direction.toLowerCase()) {
        case "north": return buildState.startLocation.x - offsetX;
        case "south": return buildState.startLocation.x + offsetX;
        case "east": return buildState.startLocation.x;
        case "west": return buildState.startLocation.x;
        default: return buildState.startLocation.x - offsetX;
    }
}

// Calculate character starting Y position
function calculateCharacterStartY(buildState) {
    if (buildState.vertical) {
        // In vertical mode, each character goes down by character height + spacing
        const charHeight = buildState.textInfo.maxHeight * buildState.scale;
        const spacing = buildState.scale; // Gap between characters
        return buildState.startLocation.y - (buildState.currentChar * (charHeight + spacing));
    }
    return buildState.startLocation.y;
}

// Calculate character starting Z position
function calculateCharacterStartZ(buildState) {
    let offsetZ = 0;
    
    // Calculate offset for current character
    for (let i = 0; i < buildState.currentChar; i++) {
        const char = buildState.text[i];
        const pattern = buildState.font[char];
        if (pattern) {
            offsetZ += (pattern[0].length + 1) * buildState.scale;
        }
    }
    
    // Apply direction
    switch (buildState.direction.toLowerCase()) {
        case "north": return buildState.startLocation.z;
        case "south": return buildState.startLocation.z;
        case "east": return buildState.startLocation.z + offsetZ;
        case "west": return buildState.startLocation.z - offsetZ;
        default: return buildState.startLocation.z;
    }
}

// Calculate pixel position in world coordinates
function calculatePixelPosition(startX, startY, startZ, col, row, scale, direction, vertical, buildState) {
    let pixelX = startX;
    let pixelY = startY;
    let pixelZ = startZ;
    
    if (vertical) {
        // Vertical text - characters stack vertically, but each character is still readable
        // Y position is based on the row within the character (same as horizontal)
        pixelY = startY + ((buildState.font[buildState.text[buildState.currentChar]].length - 1 - row) * scale);
        
        // X/Z position is based on column within character (same orientation as horizontal)
        switch (direction.toLowerCase()) {
            case "north":
                pixelX = startX - (col * scale);
                break;
            case "south":
                pixelX = startX + (col * scale);
                break;
            case "east":
                pixelZ = startZ + (col * scale);
                break;
            case "west":
                pixelZ = startZ - (col * scale);
                break;
        }
    } else {
        // Horizontal text - same as before
        pixelY = startY + ((buildState.font[buildState.text[buildState.currentChar]].length - 1 - row) * scale);
        
        switch (direction.toLowerCase()) {
            case "north":
                pixelX = startX - (col * scale);
                break;
            case "south":
                pixelX = startX + (col * scale);
                break;
            case "east":
                pixelZ = startZ + (col * scale);
                break;
            case "west":
                pixelZ = startZ - (col * scale);
                break;
        }
    }
    
    return { x: Math.floor(pixelX), y: Math.floor(pixelY), z: Math.floor(pixelZ) };
}

// Place scaled pixel (scale×scale blocks)
function placeScaledPixel(buildState, basePos) {
    let blocksPlaced = 0;
    
    for (let x = 0; x < buildState.scale; x++) {
        for (let y = 0; y < buildState.scale; y++) {
            for (let z = 0; z < buildState.scale; z++) {
                const blockPos = {
                    x: basePos.x + x,
                    y: basePos.y + y,
                    z: basePos.z + z
                };
                
                try {
                    const randomBlock = buildState.blocks[Math.floor(Math.random() * buildState.blocks.length)];
                    const blockPermutation = BlockPermutation.resolve(randomBlock);
                    buildState.dimension.setBlockPermutation(blockPos, blockPermutation);
                    blocksPlaced++;
                } catch (e) {
                    buildState.blocksFailed++;
                    console.log(`Failed to place text block at ${blockPos.x},${blockPos.y},${blockPos.z}: ${e}`);
                }
            }
        }
    }
    
    return blocksPlaced;
}

// Finish text building
function finishTextBuilding(buildState) {
    const elapsed = Math.round((Date.now() - buildState.startTime) / 1000);
    const blocksPerSecond = elapsed > 0 ? Math.round(buildState.blocksPlaced / elapsed) : buildState.blocksPlaced;
    
    buildState.player.sendMessage(`§aText building complete!`);
    buildState.player.sendMessage(`§7Text: "${buildState.text}"`);
    buildState.player.sendMessage(`§7Blocks placed: ${buildState.blocksPlaced}, Failed: ${buildState.blocksFailed}`);
    buildState.player.sendMessage(`§7Time: ${elapsed}s (${blocksPerSecond} blocks/s)`);
    buildState.player.sendMessage(`§7Font: ${Object.keys(FONTS).find(key => FONTS[key] === buildState.font)}, Scale: ${buildState.scale}x`);
    
    system.clearRun(buildState.intervalId);
}



// Global brush storage for active brushes
const ACTIVE_BRUSHES = new Map(); // playerId -> brushConfig

// Main brush function - opens GUI
function brushFunction(origin) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") {
                console.log("Brush requires a player");
                return;
            }
            
            showBrushConfigGUI(player);
            
        } catch (e) {
            console.log("Failed to open brush GUI: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to open brush GUI: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Show brush configuration GUI
function showBrushConfigGUI(player) {
    // Get current brush config if exists
    const currentBrush = ACTIVE_BRUSHES.get(player.id) || {
        form: "sphere",
        size: 3,
        range: 50,
        blockSource: "offhand",
        customBlock: "minecraft:stone",
        replaceMode: "all",
        replaceBlocks: "air"
    };
    
    const form = new ModalFormData()
        .title("§6Brush Configuration")
        .dropdown("Brush Form", ["Sphere", "Cube", "Cylinder", "Cone"], 
            { defaultValueIndex: ["sphere", "cube", "cylinder", "cone"].indexOf(currentBrush.form)})
        .slider("Brush Size", 1, 20, { defaultValue: currentBrush.size})
        .slider("Brush Range (blocks)", 10, 100, { defaultValue: currentBrush.range})
        .dropdown("Block Source", ["Offhand Item", "Mainhand Item", "Custom Block ID"], 
            { defaultValueIndex: ["offhand", "mainhand", "custom"].indexOf(currentBrush.blockSource)})
        .textField("Custom Block ID (if Custom selected):", currentBrush.customBlock, { defaultValue: currentBrush.customBlock})
        .dropdown("Replace Mode", ["Replace All", "Replace Specific"], 
            { defaultValueIndex: ["all", "specific"].indexOf(currentBrush.replaceMode)})
        .textField("Blocks to Replace (comma separated, if Specific):", currentBrush.replaceBlocks, { defaultValue: currentBrush.replaceBlocks})
        .toggle("Preview Mode (show affected area with particles)");
    
    form.show(player).then((response) => {
        if (response.canceled) return;
        
        const [formIndex, size, range, blockSourceIndex, customBlock, replaceModeIndex, replaceBlocks, previewMode] = response.formValues;
        
        const forms = ["sphere", "cube", "cylinder", "cone"];
        const blockSources = ["offhand", "mainhand", "custom"];
        const replaceModes = ["all", "specific"];
        
        const brushConfig = {
            form: forms[formIndex],
            size: size,
            range: range,
            blockSource: blockSources[blockSourceIndex],
            customBlock: customBlock,
            replaceMode: replaceModes[replaceModeIndex],
            replaceBlocks: replaceBlocks
        };
        
        if (previewMode) {
            // Show preview without creating brush
            showBrushPreview(player, brushConfig);
        } else {
            // Create/update brush
            createBrushTool(player, brushConfig);
        }
    });
}

// Create brush tool item
function createBrushTool(player, brushConfig) {
    try {
        const equippable = player.getComponent("minecraft:equippable");
        
        // Create brush tool (wooden axe with special lore)
        const brushTool = new ItemStack("minecraft:wooden_axe", 1);
        brushTool.nameTag = "§eBrush Tool";
        
        // Create lore with configuration
        const loreLines = [
            "§7Right-click to brush at target block",
            "§7Left-click to open configuration",
            "§8§l--- BRUSH CONFIG ---",
            `§7Form: §f${brushConfig.form.charAt(0).toUpperCase() + brushConfig.form.slice(1)}`,
            `§7Size: §f${brushConfig.size} blocks`,
            `§7Range: §f${brushConfig.range} blocks`,
            `§7Block Source: §f${brushConfig.blockSource}`,
            `§7Replace Mode: §f${brushConfig.replaceMode}`
        ];
        
        if (brushConfig.blockSource === "custom") {
            loreLines.push(`§7Custom Block: §f${brushConfig.customBlock}`);
        }
        
        if (brushConfig.replaceMode === "specific") {
            loreLines.push(`§7Replace: §f${brushConfig.replaceBlocks}`);
        }
        
        brushTool.setLore(loreLines);
        
        equippable.setEquipment(EquipmentSlot.Mainhand, brushTool);
        
        // Store brush config
        ACTIVE_BRUSHES.set(player.id, brushConfig);
        
        player.sendMessage("§aBrush tool created!");
        player.sendMessage(`§7${brushConfig.form} brush, size ${brushConfig.size}, range ${brushConfig.range}`);
        player.sendMessage("§7Right-click blocks to brush, left-click tool to reconfigure");
        
    } catch (e) {
        player.sendMessage(`§cFailed to create brush tool: ${e}`);
        console.log("Failed to create brush tool: " + e);
    }
}

// Show brush preview with particles
function showBrushPreview(player, brushConfig) {
    // Get target block player is looking at
    const blockFromView = player.getBlockFromViewDirection({ maxDistance: brushConfig.range });
    
    if (!blockFromView || !blockFromView.block) {
        player.sendMessage("§cNo block found in view direction within range!");
        return;
    }
    
    const targetLocation = blockFromView.block.location;
    player.sendMessage(`§aShowing brush preview at ${targetLocation.x}, ${targetLocation.y}, ${targetLocation.z}`);
    
    // Generate preview positions
    const positions = generateBrushPositions(targetLocation, brushConfig);
    
    // Show particles (limit to prevent lag)
    const maxParticles = Math.min(positions.length, 200);
    let particleCount = 0;
    
    for (const pos of positions) {
        if (particleCount >= maxParticles) break;
        
        try {
            player.dimension.spawnParticle("minecraft:heart_particle", {
                x: pos.x + 0.5,
                y: pos.y + 0.5,
                z: pos.z + 0.5
            });
            particleCount++;
        } catch (e) {
            // Particle failed, continue
        }
    }
    
    player.sendMessage(`§7Preview: ${particleCount} particles shown (${positions.length} total positions)`);
    player.sendMessage("§7Use form again without preview to create brush tool");
}

// Generate positions based on brush form and size
function generateBrushPositions(centerLocation, brushConfig) {
    const positions = [];
    const { form, size } = brushConfig;
    
    switch (form) {
        case "sphere":
            positions.push(...generateSpherePositions(centerLocation, size));
            break;
        case "cube":
            positions.push(...generateCubePositions(centerLocation, size));
            break;
        case "cylinder":
            positions.push(...generateCylinderPositions(centerLocation, size));
            break;
        case "cone":
            positions.push(...generateConePositions(centerLocation, size));
            break;
    }
    
    return positions;
}

// Generate sphere positions
function generateSpherePositions(center, radius) {
    const positions = [];
    
    for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
            for (let z = -radius; z <= radius; z++) {
                const distance = Math.sqrt(x * x + y * y + z * z);
                if (distance <= radius) {
                    positions.push({
                        x: center.x + x,
                        y: center.y + y,
                        z: center.z + z
                    });
                }
            }
        }
    }
    
    return positions;
}

// Generate cube positions
function generateCubePositions(center, size) {
    const positions = [];
    
    for (let x = -size; x <= size; x++) {
        for (let y = -size; y <= size; y++) {
            for (let z = -size; z <= size; z++) {
                positions.push({
                    x: center.x + x,
                    y: center.y + y,
                    z: center.z + z
                });
            }
        }
    }
    
    return positions;
}

// Generate cylinder positions (vertical)
function generateCylinderPositions(center, radius) {
    const positions = [];
    
    for (let x = -radius; x <= radius; x++) {
        for (let z = -radius; z <= radius; z++) {
            const distance = Math.sqrt(x * x + z * z);
            if (distance <= radius) {
                for (let y = -radius; y <= radius; y++) {
                    positions.push({
                        x: center.x + x,
                        y: center.y + y,
                        z: center.z + z
                    });
                }
            }
        }
    }
    
    return positions;
}

// Generate cone positions (point up)
function generateConePositions(center, size) {
    const positions = [];
    
    for (let y = 0; y <= size; y++) {
        const currentRadius = size - y;
        
        for (let x = -currentRadius; x <= currentRadius; x++) {
            for (let z = -currentRadius; z <= currentRadius; z++) {
                const distance = Math.sqrt(x * x + z * z);
                if (distance <= currentRadius) {
                    positions.push({
                        x: center.x + x,
                        y: center.y + y,
                        z: center.z + z
                    });
                }
            }
        }
    }
    
    return positions;
}

// Get blocks for brushing
function getBrushBlocks(player, brushConfig) {
    const equippable = player.getComponent("minecraft:equippable");
    
    switch (brushConfig.blockSource) {
        case "mainhand":
            const mainhandItem = equippable.getEquipment(EquipmentSlot.Mainhand);
            // Don't use the brush tool itself
            if (mainhandItem && (!mainhandItem.nameTag || !mainhandItem.nameTag.includes("Brush Tool"))) {
                return getBlocksFromItem(mainhandItem);
            }
            break;
            
        case "offhand":
            const offhandItem = equippable.getEquipment(EquipmentSlot.Offhand);
            if (offhandItem) {
                return getBlocksFromItem(offhandItem);
            }
            break;
            
        case "custom":
            return [brushConfig.customBlock];
    }
    
    return null;
}

// Perform brush operation
function performBrushOperation(player, targetLocation, brushConfig) {
    try {
        // Get blocks to use
        const blocks = getBrushBlocks(player, brushConfig);
        if (!blocks || blocks.length === 0) {
            player.sendMessage("§cNo blocks available for brushing! Check your block source.");
            return;
        }
        
        // Generate positions
        const positions = generateBrushPositions(targetLocation, brushConfig);
        
        if (positions.length > 10000) {
            player.sendMessage(`§cBrush too large! ${positions.length} blocks. Maximum 10000 per brush.`);
            return;
        }
        
        // Filter positions based on replace mode
        const validPositions = filterPositionsByReplaceMode(player.dimension, positions, brushConfig);
        
        if (validPositions.length === 0) {
            player.sendMessage("§eNo valid blocks to replace found.");
            return;
        }
        
        // Start async brushing
        player.sendMessage(`§7Brushing ${validPositions.length} blocks...`);
        performAsyncBrush(player, validPositions, blocks);
        
    } catch (e) {
        player.sendMessage(`§cBrush operation failed: ${e}`);
        console.log("Brush operation failed: " + e);
    }
}

// Filter positions by replace mode
function filterPositionsByReplaceMode(dimension, positions, brushConfig) {
    if (brushConfig.replaceMode === "all") {
        return positions;
    }
    
    // Specific replacement mode
    const replaceList = brushConfig.replaceBlocks.split(',').map(block => block.trim().toLowerCase());
    const validPositions = [];
    
    for (const pos of positions) {
        try {
            const currentBlock = dimension.getBlock(pos);
            const currentBlockId = currentBlock.typeId.toLowerCase();
            
            const shouldReplace = replaceList.some(replaceBlock => 
                currentBlockId.includes(replaceBlock) || replaceBlock === "air" && currentBlockId === "minecraft:air"
            );
            
            if (shouldReplace) {
                validPositions.push(pos);
            }
        } catch (e) {
            // Skip invalid positions
        }
    }
    
    return validPositions;
}

// Perform async brush operation
function performAsyncBrush(player, positions, blocks) {
    const brushState = {
        player: player,
        positions: positions,
        blocks: blocks,
        currentIndex: 0,
        blocksPlaced: 0,
        blocksFailed: 0,
        startTime: Date.now(),
        dimension: player.dimension,
        intervalId: null
    };
    
    // Shuffle positions for more natural brushing
    shuffleArray(brushState.positions);
    
    brushState.intervalId = system.runInterval(() => {
        const blocksPerTick = Math.min(500, brushState.positions.length - brushState.currentIndex);
        
        for (let i = 0; i < blocksPerTick; i++) {
            if (brushState.currentIndex >= brushState.positions.length) break;
            
            const position = brushState.positions[brushState.currentIndex];
            const randomBlock = brushState.blocks[Math.floor(Math.random() * brushState.blocks.length)];
            
            try {
                const blockPermutation = BlockPermutation.resolve(randomBlock);
                brushState.dimension.setBlockPermutation(position, blockPermutation);
                brushState.blocksPlaced++;
            } catch (e) {
                brushState.blocksFailed++;
            }
            
            brushState.currentIndex++;
        }
        
        // Check if complete
        if (brushState.currentIndex >= brushState.positions.length) {
            const elapsed = Math.round((Date.now() - brushState.startTime) / 1000);
            brushState.player.sendMessage(`§aBrush complete! ${brushState.blocksPlaced} blocks placed (${elapsed}s)`);
            
            system.clearRun(brushState.intervalId);
        }
    }, 1);
}

// Event handler for brush tool left-click - OPEN CONFIG GUI
world.beforeEvents.playerBreakBlock.subscribe((ev) => {
    const player = ev.player;
    const equippable = player.getComponent("minecraft:equippable");
    const heldItem = equippable?.getEquipment(EquipmentSlot.Mainhand);
    
    // Check if holding brush tool
    if (!heldItem || !heldItem.nameTag || !heldItem.nameTag.includes("Brush Tool")) return;
    
    // Cancel the break event
    ev.cancel = true;
    
    // Left-click opens configuration GUI
    system.runTimeout(() => showBrushConfigGUI(player), 5);
});

// Event handler for brush tool right-click - BRUSH OPERATION
world.afterEvents.itemUse.subscribe((ev) => {
    if (ev.source.typeId !== "minecraft:player" || !ev.itemStack) return;
    
    const player = ev.source;
    const itemStack = ev.itemStack;
    
    // Check if it's the brush tool
    if (!itemStack.nameTag || !itemStack.nameTag.includes("Brush Tool")) return;
    
    // Get target block player is looking at
    const brushConfig = ACTIVE_BRUSHES.get(player.id);
    if (!brushConfig) {
        player.sendMessage("§cBrush not configured! Left-click the tool to configure.");
        return;
    }
    
    const blockFromView = player.getBlockFromViewDirection({ maxDistance: brushConfig.range });
    if (!blockFromView || !blockFromView.block) {
        player.sendMessage("§cNo block found in view direction within range!");
        return;
    }
    
    // Perform brush operation at target location
    performBrushOperation(player, blockFromView.block.location, brushConfig);
});




// Main large fill function
function largeFillFunction(origin, fromLocation, toLocation, blockType, fillMode = "replace", replaceFilter = "all") {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player) {
                console.log("Large fill requires a player source");
                return;
            }
            
            // Validate fill mode
            const validModes = ["replace", "keep", "outline", "hollow", "destroy"];
            if (!validModes.includes(fillMode.toLowerCase())) {
                player.sendMessage(`§cInvalid fill mode! Use: ${validModes.join(", ")}`);
                return;
            }
            
            // Calculate area size
            const volume = Math.abs(toLocation.x - fromLocation.x + 1) * 
                          Math.abs(toLocation.y - fromLocation.y + 1) * 
                          Math.abs(toLocation.z - fromLocation.z + 1);
            
            // Size validation
            if (volume > 1000000) {
                player.sendMessage(`§cArea too large! ${volume.toLocaleString()} blocks. Maximum is 1,000,000.`);
                player.sendMessage("§7Consider breaking the fill into smaller sections.");
                return;
            }
            
            if (volume > 100000) {
                player.sendMessage(`§eWarning: Large fill of ${volume.toLocaleString()} blocks. This will take time!`);
            }
            
            // Validate block type
            try {
                BlockPermutation.resolve(blockType);
            } catch (e) {
                player.sendMessage(`§cInvalid block type: ${blockType}`);
                return;
            }
            
            player.sendMessage(`§aStarting large fill: ${volume.toLocaleString()} blocks`);
            player.sendMessage(`§7Mode: ${fillMode}, Block: ${blockType}`);
            if (fillMode === "replace" && replaceFilter !== "all") {
                player.sendMessage(`§7Replace filter: ${replaceFilter}`);
            }
            
            // Start async fill operation
            performLargeFillAsync(player, fromLocation, toLocation, blockType, fillMode.toLowerCase(), replaceFilter);
            
        } catch (e) {
            console.log("Failed to perform large fill: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to perform large fill: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Perform async large fill operation
function performLargeFillAsync(player, fromLoc, toLoc, blockType, fillMode, replaceFilter) {
    // Calculate bounds
    const minX = Math.min(fromLoc.x, toLoc.x);
    const maxX = Math.max(fromLoc.x, toLoc.x);
    const minY = Math.min(fromLoc.y, toLoc.y);
    const maxY = Math.max(fromLoc.y, toLoc.y);
    const minZ = Math.min(fromLoc.z, toLoc.z);
    const maxZ = Math.max(fromLoc.z, toLoc.z);
    
    const fillState = {
        player: player,
        dimension: player.dimension,
        minX, maxX, minY, maxY, minZ, maxZ,
        blockType: blockType,
        fillMode: fillMode,
        replaceFilter: replaceFilter,
        
        // Progress tracking
        currentX: minX,
        currentY: minY,
        currentZ: minZ,
        totalVolume: (maxX - minX + 1) * (maxY - minY + 1) * (maxZ - minZ + 1),
        processedBlocks: 0,
        placedBlocks: 0,
        skippedBlocks: 0,
        failedBlocks: 0,
        startTime: Date.now(),
        
        // Control
        intervalId: null,
        isComplete: false
    };
    
    // Parse replace filter if needed
    if (fillMode === "replace" && replaceFilter !== "all") {
        fillState.replaceList = replaceFilter.split(',').map(block => block.trim().toLowerCase());
    }
    
    // Prepare block permutation
    fillState.blockPermutation = BlockPermutation.resolve(blockType);
    
    player.sendMessage(`§7Processing ${fillState.totalVolume.toLocaleString()} block area...`);
    
    // Start processing
    fillState.intervalId = system.runInterval(() => {
        processLargeFillBatch(fillState);
    }, 1);
}

// Process a batch of blocks for large fill
function processLargeFillBatch(fillState) {
    const batchSize = 500; // Blocks per tick - can handle larger batches for fills
    let processed = 0;
    
    while (processed < batchSize && !fillState.isComplete) {
        const location = {
            x: fillState.currentX,
            y: fillState.currentY,
            z: fillState.currentZ
        };
        
        // Process current block based on fill mode
        const blockPlaced = processLargeFillBlock(fillState, location);
        if (blockPlaced) {
            fillState.placedBlocks++;
        } else if (blockPlaced === false) {
            fillState.skippedBlocks++;
        } else {
            fillState.failedBlocks++;
        }
        
        fillState.processedBlocks++;
        processed++;
        
        // Move to next position
        fillState.currentZ++;
        if (fillState.currentZ > fillState.maxZ) {
            fillState.currentZ = fillState.minZ;
            fillState.currentY++;
            if (fillState.currentY > fillState.maxY) {
                fillState.currentY = fillState.minY;
                fillState.currentX++;
                if (fillState.currentX > fillState.maxX) {
                    fillState.isComplete = true;
                    break;
                }
            }
        }
    }
    
    // Show progress updates
    if (fillState.processedBlocks % 10000 === 0 || fillState.isComplete) {
        const progress = Math.round((fillState.processedBlocks / fillState.totalVolume) * 100);
        const elapsed = Math.round((Date.now() - fillState.startTime) / 1000);
        const rate = elapsed > 0 ? Math.round(fillState.processedBlocks / elapsed) : 0;
        
        fillState.player.sendMessage(
            `§7Progress: ${progress}% (${fillState.processedBlocks.toLocaleString()}/${fillState.totalVolume.toLocaleString()}) - ${rate}/s - ${elapsed}s`
        );
    }
    
    // Check if complete
    if (fillState.isComplete) {
        finishLargeFill(fillState);
    }
}

// Process a single block for large fill
function processLargeFillBlock(fillState, location) {
    try {
        const currentBlock = fillState.dimension.getBlock(location);
        const currentBlockType = currentBlock.typeId;
        
        switch (fillState.fillMode) {
            case "replace":
                return processReplaceMode(fillState, location, currentBlock, currentBlockType);
                
            case "keep":
                // Only place if current block is air
                if (currentBlockType === "minecraft:air") {
                    fillState.dimension.setBlockPermutation(location, fillState.blockPermutation);
                    return true;
                }
                return false;
                
            case "outline":
                return processOutlineMode(fillState, location);
                
            case "hollow":
                return processHollowMode(fillState, location);
                
            case "destroy":
                // Always place, destroying what's there
                fillState.dimension.setBlockPermutation(location, fillState.blockPermutation);
                return true;
                
            default:
                return null; // Error case
        }
        
    } catch (e) {
        console.log(`Failed to process block at ${location.x},${location.y},${location.z}: ${e}`);
        return null; // Failed
    }
}

// Process replace mode
function processReplaceMode(fillState, location, currentBlock, currentBlockType) {
    if (fillState.replaceFilter === "all") {
        // Replace everything
        fillState.dimension.setBlockPermutation(location, fillState.blockPermutation);
        return true;
    } else {
        // Replace only specific blocks
        const shouldReplace = fillState.replaceList.some(replaceBlock => 
            currentBlockType.toLowerCase().includes(replaceBlock) ||
            replaceBlock === "air" && currentBlockType === "minecraft:air"
        );
        
        if (shouldReplace) {
            fillState.dimension.setBlockPermutation(location, fillState.blockPermutation);
            return true;
        }
        return false;
    }
}

// Process outline mode - only edges of the area
function processOutlineMode(fillState, location) {
    const isEdge = location.x === fillState.minX || location.x === fillState.maxX ||
                   location.y === fillState.minY || location.y === fillState.maxY ||
                   location.z === fillState.minZ || location.z === fillState.maxZ;
    
    if (isEdge) {
        fillState.dimension.setBlockPermutation(location, fillState.blockPermutation);
        return true;
    }
    return false;
}

// Process hollow mode - only outer shell
function processHollowMode(fillState, location) {
    // Check if this is on the outer shell (at least one coordinate is at min/max)
    const isOnShell = (location.x === fillState.minX || location.x === fillState.maxX) ||
                      (location.y === fillState.minY || location.y === fillState.maxY) ||
                      (location.z === fillState.minZ || location.z === fillState.maxZ);
    
    if (isOnShell) {
        fillState.dimension.setBlockPermutation(location, fillState.blockPermutation);
        return true;
    }
    return false;
}

// Finish large fill operation
function finishLargeFill(fillState) {
    const elapsed = Math.round((Date.now() - fillState.startTime) / 1000);
    const rate = elapsed > 0 ? Math.round(fillState.processedBlocks / elapsed) : 0;
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    
    fillState.player.sendMessage(`§aLarge fill complete!`);
    fillState.player.sendMessage(`§7Processed: ${fillState.processedBlocks.toLocaleString()} blocks`);
    fillState.player.sendMessage(`§7Placed: ${fillState.placedBlocks.toLocaleString()}, Skipped: ${fillState.skippedBlocks.toLocaleString()}, Failed: ${fillState.failedBlocks.toLocaleString()}`);
    fillState.player.sendMessage(`§7Time: ${timeStr} (${rate.toLocaleString()} blocks/s)`);
    fillState.player.sendMessage(`§7Mode: ${fillState.fillMode}, Block: ${fillState.blockType}`);
    
    system.clearRun(fillState.intervalId);
}

function fillInfoFunction(origin, fromLocation, toLocation) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player) return;
            
            const volume = Math.abs(toLocation.x - fromLocation.x + 1) * 
                          Math.abs(toLocation.y - fromLocation.y + 1) * 
                          Math.abs(toLocation.z - fromLocation.z + 1);
            
            const dimensions = `${Math.abs(toLocation.x - fromLocation.x + 1)}×${Math.abs(toLocation.y - fromLocation.y + 1)}×${Math.abs(toLocation.z - fromLocation.z + 1)}`;
            
            // Estimate time (based on 500 blocks/tick, 20 ticks/second)
            const estimatedSeconds = Math.ceil(volume / (500 * 20));
            const estimatedMinutes = Math.floor(estimatedSeconds / 60);
            const remainingSeconds = estimatedSeconds % 60;
            
            player.sendMessage(`§a--- Fill Area Information ---`);
            player.sendMessage(`§7Dimensions: §f${dimensions}`);
            player.sendMessage(`§7Total volume: §f${volume.toLocaleString()} blocks`);
            
            if (volume > 1000000) {
                player.sendMessage(`§cToo large for largefill! Maximum is 1,000,000 blocks.`);
            } else if (volume > 100000) {
                const timeStr = estimatedMinutes > 0 ? `${estimatedMinutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
                player.sendMessage(`§eEstimated time: §f~${timeStr}`);
                player.sendMessage(`§7This is a large operation - ensure good performance before starting.`);
            } else {
                const timeStr = estimatedMinutes > 0 ? `${estimatedMinutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
                player.sendMessage(`§aEstimated time: §f~${timeStr}`);
            }
            
            player.sendMessage(`§7Use: §f/largefill ${fromLocation.x} ${fromLocation.y} ${fromLocation.z} ${toLocation.x} ${toLocation.y} ${toLocation.z} <block> [mode]`);
            
        } catch (e) {
            console.log("Failed to calculate fill info: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to calculate fill info: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}



// Main create figure function
function createFigureFunction(origin, figureType, centerLocation, blockType, size, mode = "solid", rotation = 0, height = null) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player) {
                console.log("Create figure requires a player source");
                return;
            }
            
            // Validate figure type
            const validFigures = ["cube", "sphere", "cylinder", "pyramid"];
            if (!validFigures.includes(figureType.toLowerCase())) {
                player.sendMessage(`§cInvalid figure type! Use: ${validFigures.join(", ")}`);
                return;
            }
            
            // Validate mode
            const validModes = ["solid", "hollow", "keep"];
            if (!validModes.includes(mode.toLowerCase())) {
                player.sendMessage(`§cInvalid mode! Use: ${validModes.join(", ")}`);
                return;
            }
            
            // Validate size
            if (size < 1 || size > 50) {
                player.sendMessage("§cSize must be between 1 and 50!");
                return;
            }
            
            // Validate rotation
            rotation = ((rotation % 360) + 360) % 360; // Normalize to 0-359
            
            // Set default height for cylinder/pyramid
            if (height === null) {
                height = size;
            }
            
            // Validate height
            if (height < 1 || height > 100) {
                player.sendMessage("§cHeight must be between 1 and 100!");
                return;
            }
            
            // Validate block type
            try {
                BlockPermutation.resolve(blockType);
            } catch (e) {
                player.sendMessage(`§cInvalid block type: ${blockType}`);
                return;
            }
            
            // Calculate estimated block count
            const estimatedBlocks = estimateFigureBlocks(figureType.toLowerCase(), size, height, mode.toLowerCase());
            
            if (estimatedBlocks > 100000) {
                player.sendMessage(`§cFigure too large! Estimated ${estimatedBlocks.toLocaleString()} blocks. Maximum is 100,000.`);
                return;
            }
            
            player.sendMessage(`§aCreating ${figureType.toLowerCase()} figure...`);
            player.sendMessage(`§7Size: ${size}, Mode: ${mode.toLowerCase()}, Rotation: ${rotation}°`);
            if (["cylinder", "pyramid"].includes(figureType.toLowerCase())) {
                player.sendMessage(`§7Height: ${height}`);
            }
            player.sendMessage(`§7Estimated blocks: ${estimatedBlocks.toLocaleString()}`);
            
            // Start async figure creation
            createFigureAsync(player, figureType.toLowerCase(), centerLocation, blockType, size, mode.toLowerCase(), rotation, height);
            
        } catch (e) {
            console.log("Failed to create figure: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to create figure: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Estimate block count for different figures
function estimateFigureBlocks(figureType, size, height, mode) {
    let estimate = 0;
    
    switch (figureType) {
        case "cube":
            if (mode === "solid") {
                estimate = (size * 2 + 1) ** 3;
            } else if (mode === "hollow") {
                const outer = (size * 2 + 1) ** 3;
                const inner = Math.max(0, (size * 2 - 1) ** 3);
                estimate = outer - inner;
            }
            break;
            
        case "sphere":
            if (mode === "solid") {
                estimate = Math.floor((4/3) * Math.PI * size ** 3);
            } else if (mode === "hollow") {
                const outer = Math.floor((4/3) * Math.PI * size ** 3);
                const inner = Math.floor((4/3) * Math.PI * Math.max(0, size - 1) ** 3);
                estimate = outer - inner;
            }
            break;
            
        case "cylinder":
            if (mode === "solid") {
                estimate = Math.floor(Math.PI * size ** 2 * height);
            } else if (mode === "hollow") {
                const outer = Math.floor(Math.PI * size ** 2 * height);
                const inner = Math.floor(Math.PI * Math.max(0, size - 1) ** 2 * height);
                estimate = outer - inner;
            }
            break;
            
        case "pyramid":
            if (mode === "solid") {
                estimate = Math.floor((size ** 2 * height) / 3);
            } else if (mode === "hollow") {
                estimate = Math.floor(size ** 2 * 0.3); // Rough estimate for hollow pyramid
            }
            break;
    }
    
    return Math.max(1, estimate);
}

// Create figure asynchronously
function createFigureAsync(player, figureType, centerLocation, blockType, size, mode, rotation, height) {
    const figureState = {
        player: player,
        dimension: player.dimension,
        figureType: figureType,
        centerLocation: centerLocation,
        blockType: blockType,
        size: size,
        mode: mode,
        rotation: rotation,
        height: height,
        
        // Generate all positions first
        positions: [],
        currentIndex: 0,
        
        // Progress tracking
        blocksPlaced: 0,
        blocksSkipped: 0,
        blocksFailed: 0,
        startTime: Date.now(),
        
        // Control
        intervalId: null,
        blockPermutation: BlockPermutation.resolve(blockType)
    };
    
    // Generate all positions for the figure
    figureState.positions = generateFigurePositions(figureState);
    
    if (figureState.positions.length === 0) {
        player.sendMessage("§cNo valid positions generated for figure!");
        return;
    }
    
    player.sendMessage(`§7Building ${figureState.positions.length} blocks...`);
    
    // Start building
    figureState.intervalId = system.runInterval(() => {
        processFigureBatch(figureState);
    }, 1);
}

// Generate positions for different figure types
function generateFigurePositions(figureState) {
    switch (figureState.figureType) {
        case "cube":
            return generateCubePositions2(figureState);
        case "sphere":
            return generateSpherePositions2(figureState);
        case "cylinder":
            return generateCylinderPositions2(figureState);
        case "pyramid":
            return generatePyramidPositions2(figureState);
        default:
            return [];
    }
}

// Generate cube positions
function generateCubePositions2(figureState) {
    const positions = [];
    const { centerLocation, size, mode, rotation } = figureState;
    
    for (let x = -size; x <= size; x++) {
        for (let y = -size; y <= size; y++) {
            for (let z = -size; z <= size; z++) {
                let shouldPlace = false;
                
                if (mode === "solid") {
                    shouldPlace = true;
                } else if (mode === "hollow") {
                    // Only place on faces of the cube
                    shouldPlace = (Math.abs(x) === size || Math.abs(y) === size || Math.abs(z) === size);
                }
                
                if (shouldPlace) {
                    const rotatedPos = rotatePosition(x, y, z, rotation);
                    positions.push({
                        x: centerLocation.x + rotatedPos.x,
                        y: centerLocation.y + rotatedPos.y,
                        z: centerLocation.z + rotatedPos.z
                    });
                }
            }
        }
    }
    
    return positions;
}

// Generate sphere positions
function generateSpherePositions2(figureState) {
    const positions = [];
    const { centerLocation, size, mode, rotation } = figureState;
    
    for (let x = -size; x <= size; x++) {
        for (let y = -size; y <= size; y++) {
            for (let z = -size; z <= size; z++) {
                const distance = Math.sqrt(x * x + y * y + z * z);
                let shouldPlace = false;
                
                if (mode === "solid") {
                    shouldPlace = distance <= size;
                } else if (mode === "hollow") {
                    shouldPlace = distance <= size && distance > size - 1;
                }
                
                if (shouldPlace) {
                    const rotatedPos = rotatePosition(x, y, z, rotation);
                    positions.push({
                        x: centerLocation.x + rotatedPos.x,
                        y: centerLocation.y + rotatedPos.y,
                        z: centerLocation.z + rotatedPos.z
                    });
                }
            }
        }
    }
    
    return positions;
}

// Generate cylinder positions
function generateCylinderPositions2(figureState) {
    const positions = [];
    const { centerLocation, size, mode, rotation, height } = figureState;
    const halfHeight = Math.floor(height / 2);
    
    for (let x = -size; x <= size; x++) {
        for (let z = -size; z <= size; z++) {
            const distance = Math.sqrt(x * x + z * z);
            let shouldPlaceXZ = false;
            
            if (mode === "solid") {
                shouldPlaceXZ = distance <= size;
            } else if (mode === "hollow") {
                shouldPlaceXZ = distance <= size && distance > size - 1;
            }
            
            if (shouldPlaceXZ) {
                for (let y = -halfHeight; y <= halfHeight; y++) {
                    let shouldPlace = true;
                    
                    if (mode === "hollow" && Math.abs(y) < halfHeight) {
                        // For hollow cylinder, only place on top/bottom circles or outer ring
                        shouldPlace = distance > size - 1 || Math.abs(y) === halfHeight;
                    }
                    
                    if (shouldPlace) {
                        const rotatedPos = rotatePosition(x, y, z, rotation);
                        positions.push({
                            x: centerLocation.x + rotatedPos.x,
                            y: centerLocation.y + rotatedPos.y,
                            z: centerLocation.z + rotatedPos.z
                        });
                    }
                }
            }
        }
    }
    
    return positions;
}

// Generate pyramid positions
function generatePyramidPositions2(figureState) {
    const positions = [];
    const { centerLocation, size, mode, rotation, height } = figureState;
    
    for (let y = 0; y < height; y++) {
        // Calculate radius at this height (linear reduction)
        const currentRadius = size * (1 - y / height);
        const currentSize = Math.floor(currentRadius);
        
        if (currentSize < 1 && y < height - 1) continue;
        
        for (let x = -currentSize; x <= currentSize; x++) {
            for (let z = -currentSize; z <= currentSize; z++) {
                let shouldPlace = false;
                
                if (mode === "solid") {
                    shouldPlace = true;
                } else if (mode === "hollow") {
                    // Only place on the edges or top
                    shouldPlace = (Math.abs(x) === currentSize || Math.abs(z) === currentSize || y === height - 1 || y === 0);
                }
                
                if (shouldPlace) {
                    const rotatedPos = rotatePosition(x, y, z, rotation);
                    positions.push({
                        x: centerLocation.x + rotatedPos.x,
                        y: centerLocation.y + rotatedPos.y,
                        z: centerLocation.z + rotatedPos.z
                    });
                }
            }
        }
    }
    
    return positions;
}

// Rotate position around Y axis
function rotatePosition(x, y, z, rotation) {
    if (rotation === 0) {
        return { x, y, z };
    }
    
    const radians = (rotation * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    
    return {
        x: Math.round(x * cos - z * sin),
        y: y,
        z: Math.round(x * sin + z * cos)
    };
}

// Process batch of figure blocks
function processFigureBatch(figureState) {
    const batchSize = 100; // Blocks per tick
    let processed = 0;
    
    while (processed < batchSize && figureState.currentIndex < figureState.positions.length) {
        const position = figureState.positions[figureState.currentIndex];
        
        try {
            if (figureState.mode === "keep") {
                // Only place if current block is air
                const currentBlock = figureState.dimension.getBlock(position);
                if (currentBlock.typeId === "minecraft:air") {
                    figureState.dimension.setBlockPermutation(position, figureState.blockPermutation);
                    figureState.blocksPlaced++;
                } else {
                    figureState.blocksSkipped++;
                }
            } else {
                // Solid or hollow mode - always place
                figureState.dimension.setBlockPermutation(position, figureState.blockPermutation);
                figureState.blocksPlaced++;
            }
        } catch (e) {
            figureState.blocksFailed++;
            console.log(`Failed to place figure block at ${position.x},${position.y},${position.z}: ${e}`);
        }
        
        figureState.currentIndex++;
        processed++;
    }
    
    // Show progress updates
    if (figureState.currentIndex % 1000 === 0 || figureState.currentIndex >= figureState.positions.length) {
        const progress = Math.round((figureState.currentIndex / figureState.positions.length) * 100);
        const elapsed = Math.round((Date.now() - figureState.startTime) / 1000);
        
        figureState.player.sendMessage(
            `§7Progress: ${progress}% (${figureState.currentIndex}/${figureState.positions.length}) - ${elapsed}s`
        );
    }
    
    // Check if complete
    if (figureState.currentIndex >= figureState.positions.length) {
        finishFigureCreation(figureState);
    }
}

// Finish figure creation
function finishFigureCreation(figureState) {
    const elapsed = Math.round((Date.now() - figureState.startTime) / 1000);
    const rate = elapsed > 0 ? Math.round(figureState.blocksPlaced / elapsed) : 0;
    
    figureState.player.sendMessage(`§aFigure creation complete!`);
    figureState.player.sendMessage(`§7Figure: ${figureState.figureType} (${figureState.mode} mode)`);
    figureState.player.sendMessage(`§7Size: ${figureState.size}, Rotation: ${figureState.rotation}°`);
    if (["cylinder", "pyramid"].includes(figureState.figureType)) {
        figureState.player.sendMessage(`§7Height: ${figureState.height}`);
    }
    figureState.player.sendMessage(`§7Blocks placed: ${figureState.blocksPlaced}, Skipped: ${figureState.blocksSkipped}, Failed: ${figureState.blocksFailed}`);
    figureState.player.sendMessage(`§7Time: ${elapsed}s (${rate} blocks/s)`);
    
    system.clearRun(figureState.intervalId);
}