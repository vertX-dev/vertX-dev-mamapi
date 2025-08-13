import {
    system,
    world,
    CustomCommandStatus,
    EquipmentSlot,
    BlockPermutation,
    ItemStack
} from "@minecraft/server";

import {
    ModalFormData
} from "@minecraft/server-ui";

// Configuration for block filling performance
const BLOCK_FILLING_CONFIG = {
    BLOCKS_PER_TICK: 500,        // How many blocks to place per tick
    TICK_DELAY: 2,               // Ticks to wait between batches (1 = every tick, 2 = every other tick)
    MAX_OPERATIONS: 1000000,       // Maximum blocks before requiring confirmation
    PROGRESS_UPDATE_INTERVAL: 1000 // Show progress every N blocks
};

// Main create path function
export function createPathFunction(origin, radius, startLoc, endLoc, waypoint1 = null, waypoint2 = null, waypoint3 = null, replaceBlocks = "ALL", pathBlock = "MAINHAND") {
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

// Get path tool function
export function getPathToolFunction(origin) {
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

// Build path function
export function buildPathFunction(origin) {
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

// Updated multiBlockFillFunction with async processing
export function multiBlockFillFunction(origin, fromLocation, toLocation) {
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

// Config fill function
export function configFillFunction(origin, blocksPerTick = null, tickDelay = null, maxOps = null) {
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

// Utility function to shuffle array (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Initialize path tool events
export function initializePathToolEvents() {
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
}