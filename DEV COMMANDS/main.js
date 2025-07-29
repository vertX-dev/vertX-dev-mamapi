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
const MULTIBLOCK_MARKER = '§m§u§l§t§i§b';

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

    // const createMultiBlockCommand = {
//         name: "vertx:createmultiblock",
//         description: "Create multi-block item",
//         permissionLevel: CommandPermissionLevel.GameDirectors,
//         mandatoryParameters: [
//             { type: CustomCommandParamType.BlockType, name: "Block ID"},
//             { type: CustomCommandParamType.String, name: "Name"},
//             { type: CustomCommandParamType.String, name: "Block list (comma separated, no spaces)"}
//         ],
//         optionalParameters: [
//             { type: CustomCommandParamType.EntitySelector, name: "Targets"}
//         ]
//     };

    const createMultiBlockGUICommand = {
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
    
    // Register all commands
    init.customCommandRegistry.registerCommand(addLoreCommand, addLoreFunction);
    init.customCommandRegistry.registerCommand(setLoreCommand, setLoreFunction);
    init.customCommandRegistry.registerCommand(bindCommandCommand, bindCommandFunction);
    init.customCommandRegistry.registerCommand(bindFunctionCommand, bindFunctionFunction);
    init.customCommandRegistry.registerCommand(explosionCommand, explosionFunction);
    init.customCommandRegistry.registerCommand(createMultiBlockCommand, createMultiBlockGUIFunction);
    init.customCommandRegistry.registerCommand(multiBlockFillCommand, multiBlockFillFunction);
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

// FIXED: multiBlockFillFunction - Fill area with blocks from multi-block item
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
            
            // Extract block list from lore (skip header lines)
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
            
            fillAreaWithMultiBlock(entity.dimension, fromLocation, toLocation, blockList);
            entity.sendMessage(`§aFilled area with ${blockList.length} different block types!`);
                
        } catch (e) {
            console.log("failed to fill with multi-block: " + e);
        }
    });
    
    return { status: CustomCommandStatus.Success };
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

// Utility Functions
function fillAreaWithMultiBlock(dimension, from, to, blockList) {
    const minX = Math.min(from.x, to.x);
    const maxX = Math.max(from.x, to.x);
    const minY = Math.min(from.y, to.y);
    const maxY = Math.max(from.y, to.y);
    const minZ = Math.min(from.z, to.z);
    const maxZ = Math.max(from.z, to.z);
    
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
                const randomBlock = blockList[Math.floor(Math.random() * blockList.length)];
                try {
                    const blockPermutation = BlockPermutation.resolve(randomBlock);
                    dimension.setBlockPermutation({x, y, z}, blockPermutation);
                } catch (e) {
                    console.log(`Failed to place block ${randomBlock} at ${x},${y},${z}: ${e}`);
                }
            }
        }
    }
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