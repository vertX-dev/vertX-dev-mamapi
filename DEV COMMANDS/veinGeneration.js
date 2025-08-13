import {
    system,
    world,
    CustomCommandStatus,
    EquipmentSlot,
    BlockPermutation,
    ItemStack
} from "@minecraft/server";

import {
    ModalFormData,
    ActionFormData
} from "@minecraft/server-ui";

// Global storage for vein tool states
const VEIN_TOOL_STATES = new Map(); // playerId -> { corners: [], breakCount: 0 }

// Main get vein tool function
export function getVeinToolFunction(origin) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") {
                console.log("Get vein tool requires a player");
                return;
            }
            
            createVeinTool(player);
            
        } catch (e) {
            console.log("Failed to create vein tool: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to create vein tool: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Create vein tool item
function createVeinTool(player) {
    try {
        const equippable = player.getComponent("minecraft:equippable");
        
        // Create vein tool (golden pickaxe with special lore)
        const veinTool = new ItemStack("minecraft:golden_pickaxe", 1);
        veinTool.nameTag = "§eVein Tool";
        
        // Initialize player state
        VEIN_TOOL_STATES.set(player.id, { corners: [], breakCount: 0 });
        
        // Create initial lore
        const loreLines = [
            "§7Right-click to mark exits",
            "§7Left-click blocks to set corners",
            "§8§l--- CORNERS ---",
            "§7Corner 1: §cNot set",
            "§7Corner 2: §cNot set",
            "§8§l--- EXITS ---"
        ];
        
        veinTool.setLore(loreLines);
        
        equippable.setEquipment(EquipmentSlot.Mainhand, veinTool);
        
        player.sendMessage("§aVein tool created!");
        player.sendMessage("§7Left-click: Set corners (break 3rd block to reset)");
        player.sendMessage("§7Right-click: Mark exits");
        
    } catch (e) {
        player.sendMessage(`§cFailed to create vein tool: ${e}`);
        console.log("Failed to create vein tool: " + e);
    }
}

// Update vein tool lore
function updateVeinToolLore(player, veinTool, toolState) {
    const loreLines = [
        "§7Right-click to mark exits",
        "§7Left-click blocks to set corners",
        "§8§l--- CORNERS ---"
    ];
    
    // Add corner information
    if (toolState.corners.length >= 1) {
        const corner1 = toolState.corners[0];
        loreLines.push(`§7Corner 1: §a${corner1.x}, ${corner1.y}, ${corner1.z}`);
    } else {
        loreLines.push("§7Corner 1: §cNot set");
    }
    
    if (toolState.corners.length >= 2) {
        const corner2 = toolState.corners[1];
        loreLines.push(`§7Corner 2: §a${corner2.x}, ${corner2.y}, ${corner2.z}`);
        
        // Calculate area size
        const dx = Math.abs(corner2.x - toolState.corners[0].x) + 1;
        const dy = Math.abs(corner2.y - toolState.corners[0].y) + 1;
        const dz = Math.abs(corner2.z - toolState.corners[0].z) + 1;
        const volume = dx * dy * dz;
        
        loreLines.push(`§7Area: §f${dx}×${dy}×${dz} §7(${volume.toLocaleString()} blocks)`);
    } else {
        loreLines.push("§7Corner 2: §cNot set");
    }
    
    loreLines.push("§8§l--- EXITS ---");
    
    // Add exit markers
    const exitCount = getExitMarkersCount(veinTool.getLore());
    if (exitCount > 0) {
        loreLines.push(`§7Total Exits: §f${exitCount}`);
        
        // Add exit positions from current lore
        const currentLore = veinTool.getLore();
        let inExitSection = false;
        
        for (const line of currentLore) {
            if (line === "§8§l--- EXITS ---") {
                inExitSection = true;
                continue;
            }
            if (inExitSection && line.startsWith("§6Exit")) {
                loreLines.push(line);
            }
        }
    } else {
        loreLines.push("§7No exits marked");
    }
    
    return loreLines;
}

// Get count of exit markers in lore
function getExitMarkersCount(loreArray) {
    let count = 0;
    let inExitSection = false;
    
    for (const line of loreArray) {
        if (line === "§8§l--- EXITS ---") {
            inExitSection = true;
            continue;
        }
        if (inExitSection && line.startsWith("§6Exit")) {
            count++;
        }
    }
    
    return count;
}

// Clear vein tool function
export function clearVeinToolFunction(origin) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            const equippable = player.getComponent("minecraft:equippable");
            const heldItem = equippable?.getEquipment(EquipmentSlot.Mainhand);
            
            // Check if holding vein tool
            if (!heldItem || !heldItem.nameTag || !heldItem.nameTag.includes("Vein Tool")) {
                player.sendMessage("§cYou must be holding a Vein Tool!");
                return;
            }
            
            // Reset tool state
            VEIN_TOOL_STATES.set(player.id, { corners: [], breakCount: 0 });
            
            // Reset tool lore
            const newTool = heldItem.clone();
            const resetLore = [
                "§7Right-click to mark exits",
                "§7Left-click blocks to set corners",
                "§8§l--- CORNERS ---",
                "§7Corner 1: §cNot set",
                "§7Corner 2: §cNot set",
                "§8§l--- EXITS ---",
                "§7No exits marked"
            ];
            
            newTool.setLore(resetLore);
            equippable.setEquipment(EquipmentSlot.Mainhand, newTool);
            
            player.sendMessage("§aVein tool data cleared!");
            
        } catch (e) {
            console.log("Failed to clear vein tool: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to clear vein tool: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Vein tool info function
export function veinToolInfoFunction(origin) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            const equippable = player.getComponent("minecraft:equippable");
            const heldItem = equippable?.getEquipment(EquipmentSlot.Mainhand);
            
            // Check if holding vein tool
            if (!heldItem || !heldItem.nameTag || !heldItem.nameTag.includes("Vein Tool")) {
                player.sendMessage("§cYou must be holding a Vein Tool!");
                return;
            }
            
            const toolState = VEIN_TOOL_STATES.get(player.id) || { corners: [], breakCount: 0 };
            
            player.sendMessage("§a--- Vein Tool Information ---");
            player.sendMessage(`§7Corners Set: §f${toolState.corners.length}/2`);
            player.sendMessage(`§7Break Count: §f${toolState.breakCount}`);
            
            if (toolState.corners.length >= 2) {
                const corner1 = toolState.corners[0];
                const corner2 = toolState.corners[1];
                const dx = Math.abs(corner2.x - corner1.x) + 1;
                const dy = Math.abs(corner2.y - corner1.y) + 1;
                const dz = Math.abs(corner2.z - corner1.z) + 1;
                const volume = dx * dy * dz;
                
                player.sendMessage(`§7Selected Area: §f${dx}×${dy}×${dz} (${volume.toLocaleString()} blocks)`);
                player.sendMessage(`§7From: §f${corner1.x}, ${corner1.y}, ${corner1.z}`);
                player.sendMessage(`§7To: §f${corner2.x}, ${corner2.y}, ${corner2.z}`);
            }
            
            const exitCount = getExitMarkersCount(heldItem.getLore());
            player.sendMessage(`§7Exits Marked: §f${exitCount}`);
            
        } catch (e) {
            console.log("Failed to show vein tool info: " + e);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Main generate veins function - opens GUI
export function generateVeinsFunction(origin) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") {
                console.log("Generate veins requires a player");
                return;
            }
            
            // Check if player has vein tool and corners set
            const equippable = player.getComponent("minecraft:equippable");
            const heldItem = equippable?.getEquipment(EquipmentSlot.Mainhand);
            
            if (!heldItem || !heldItem.nameTag || !heldItem.nameTag.includes("Vein Tool")) {
                player.sendMessage("§cYou must hold a Vein Tool to generate veins!");
                return;
            }
            
            const toolState = VEIN_TOOL_STATES.get(player.id) || { corners: [], breakCount: 0 };
            
            if (toolState.corners.length < 2) {
                player.sendMessage("§cYou must set both corners with the vein tool first!");
                return;
            }
            
            // Get exits from tool lore
            const exits = getExitsFromLore(heldItem.getLore());
            
            if (exits.length === 0) {
                player.sendMessage("§cYou must mark at least one exit with the vein tool!");
                return;
            }
            
            showVeinGenerationGUI(player, toolState, exits);
            
        } catch (e) {
            console.log("Failed to open vein generation GUI: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to open vein GUI: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Extract exits from vein tool lore
function getExitsFromLore(loreArray) {
    const exits = [];
    let inExitSection = false;
    
    for (const line of loreArray) {
        if (line === "§8§l--- EXITS ---") {
            inExitSection = true;
            continue;
        }
        if (inExitSection && line.startsWith("§6Exit")) {
            // Parse format: "§6Exit 1: §f100, 64, 200"
            const match = line.match(/§6Exit \d+: §f(-?\d+), (-?\d+), (-?\d+)/);
            if (match) {
                exits.push({
                    x: parseInt(match[1]),
                    y: parseInt(match[2]),
                    z: parseInt(match[3])
                });
            }
        }
    }
    
    return exits;
}

// Show vein generation GUI
function showVeinGenerationGUI(player, toolState, exits) {
    // Calculate area info for display
    const corner1 = toolState.corners[0];
    const corner2 = toolState.corners[1];
    const dx = Math.abs(corner2.x - corner1.x) + 1;
    const dy = Math.abs(corner2.y - corner1.y) + 1;
    const dz = Math.abs(corner2.z - corner1.z) + 1;
    const volume = dx * dy * dz;
    
    const form = new ModalFormData()
        .title("§6Generate Vein System")
        .textField(`Area: ${dx}×${dy}×${dz} (${volume.toLocaleString()} blocks), Exits: ${exits.length}`, 
                  `From: ${corner1.x},${corner1.y},${corner1.z} To: ${corner2.x},${corner2.y},${corner2.z}`)
        .slider("Vein Radius (thickness)", 1, 8)
        .slider("Random Points", 3, 50)
        .textField("Block Type (or leave empty for multiblock from offhand):", "minecraft:stone")
        .dropdown("Connection Type", ["Dense Network", "Linear Chain", "Star Pattern", "Random Web"])
        .toggle("Connect to All Exits", { defaultValue: true})
        .toggle("Fill Interior (not just surface)", { defaultValue: false})
        .toggle("Preview Mode (particles only)", { defaultValue: false});
    
    form.show(player).then((response) => {
        if (response.canceled) return;
        
        const [areaInfo, radius, randomPoints, blockType, connectionType, connectAllExits, fillInterior, previewMode] = response.formValues;
        
        const veinConfig = {
            corners: toolState.corners,
            exits: exits,
            radius: radius,
            randomPoints: randomPoints,
            blockType: blockType.trim(),
            connectionType: connectionType,
            connectAllExits: connectAllExits,
            fillInterior: fillInterior,
            previewMode: previewMode
        };
        
        if (previewMode) {
            showVeinPreview(player, veinConfig);
        } else {
            generateVeinSystem(player, veinConfig);
        }
    });
}

// Generate the actual vein system
function generateVeinSystem(player, veinConfig) {
    try {
        // Get blocks to use
        const blocks = getVeinBlocks(player, veinConfig.blockType);
        if (!blocks || blocks.length === 0) {
            player.sendMessage("§cNo valid blocks found! Check block type or offhand item.");
            return;
        }
        
        player.sendMessage("§aGenerating vein system...");
        player.sendMessage(`§7Radius: ${veinConfig.radius}, Points: ${veinConfig.randomPoints}, Blocks: ${blocks.length} type${blocks.length > 1 ? 's' : ''}`);
        
        // Start async vein generation
        generateVeinAsync(player, veinConfig, blocks);
        
    } catch (e) {
        player.sendMessage(`§cFailed to generate veins: ${e}`);
        console.log("Failed to generate veins: " + e);
    }
}

// Get blocks for vein generation
function getVeinBlocks(player, blockType) {
    if (blockType && blockType !== "") {
        // Use specified block type
        try {
            BlockPermutation.resolve(blockType);
            return [blockType];
        } catch (e) {
            return null; // Invalid block type
        }
    }
    
    // Use blocks from offhand (multiblock support)
    const equippable = player.getComponent("minecraft:equippable");
    const offhandItem = equippable?.getEquipment(EquipmentSlot.Offhand);
    
    if (!offhandItem) return null;
    
    // Check if it's a multi-block item
    const loreArray = offhandItem.getLore();
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
        
        return blocks.length > 0 ? blocks : [offhandItem.typeId];
    }
    
    return [offhandItem.typeId];
}

// Generate vein system asynchronously
function generateVeinAsync(player, veinConfig, blocks) {
    const veinState = {
        player: player,
        dimension: player.dimension,
        config: veinConfig,
        blocks: blocks,
        
        // Generated data
        randomPoints: [],
        veinPaths: [],
        exitPaths: [],
        allVeinPositions: [],
        
        // Progress tracking
        currentIndex: 0,
        blocksPlaced: 0,
        blocksFailed: 0,
        startTime: Date.now(),
        
        // Processing phases
        currentPhase: "generating_points", // generating_points, creating_paths, connecting_exits, placing_blocks
        intervalId: null
    };
    
    // Start generation process
    veinState.intervalId = system.runInterval(() => {
        processVeinGeneration(veinState);
    }, 1);
}

// Process vein generation phases
function processVeinGeneration(veinState) {
    switch (veinState.currentPhase) {
        case "generating_points":
            generateRandomPoints(veinState);
            break;
        case "creating_paths":
            createVeinPaths(veinState);
            break;
        case "connecting_exits":
            connectExitPaths(veinState);
            break;
        case "placing_blocks":
            placeVeinBlocks(veinState);
            break;
    }
}

// Phase 1: Generate random points within the area
function generateRandomPoints(veinState) {
    const corner1 = veinState.config.corners[0];
    const corner2 = veinState.config.corners[1];
    
    const minX = Math.min(corner1.x, corner2.x);
    const maxX = Math.max(corner1.x, corner2.x);
    const minY = Math.min(corner1.y, corner2.y);
    const maxY = Math.max(corner1.y, corner2.y);
    const minZ = Math.min(corner1.z, corner2.z);
    const maxZ = Math.max(corner1.z, corner2.z);
    
    for (let i = 0; i < veinState.config.randomPoints; i++) {
        const point = {
            x: Math.floor(Math.random() * (maxX - minX + 1)) + minX,
            y: Math.floor(Math.random() * (maxY - minY + 1)) + minY,
            z: Math.floor(Math.random() * (maxZ - minZ + 1)) + minZ
        };
        veinState.randomPoints.push(point);
    }
    
    veinState.player.sendMessage(`§7Generated ${veinState.randomPoints.length} random vein points`);
    veinState.currentPhase = "creating_paths";
}

// Phase 2: Create paths between random points
function createVeinPaths(veinState) {
    const points = veinState.randomPoints;
    const connectionType = veinState.config.connectionType;
    
    veinState.veinPaths = [];
    
    switch (connectionType) {
        case 0: // Dense Network - connect each point to 2-3 nearest neighbors
            for (let i = 0; i < points.length; i++) {
                const neighbors = findNearestPoints(points[i], points, 3);
                for (const neighbor of neighbors) {
                    if (neighbor !== points[i]) {
                        const path = createLinePath(points[i], neighbor);
                        veinState.veinPaths.push(...path);
                    }
                }
            }
            break;
            
        case 1: // Linear Chain - connect points in sequence
            for (let i = 0; i < points.length - 1; i++) {
                const path = createLinePath(points[i], points[i + 1]);
                veinState.veinPaths.push(...path);
            }
            break;
            
        case 2: // Star Pattern - connect all points to center point
            const centerPoint = points[0];
            for (let i = 1; i < points.length; i++) {
                const path = createLinePath(centerPoint, points[i]);
                veinState.veinPaths.push(...path);
            }
            break;
            
        case 3: // Random Web - random connections
            for (let i = 0; i < points.length; i++) {
                const connectionCount = Math.floor(Math.random() * 3) + 1; // 1-3 connections
                for (let j = 0; j < connectionCount; j++) {
                    const randomIndex = Math.floor(Math.random() * points.length);
                    if (randomIndex !== i) {
                        const path = createLinePath(points[i], points[randomIndex]);
                        veinState.veinPaths.push(...path);
                    }
                }
            }
            break;
    }
    
    // Remove duplicates
    veinState.veinPaths = removeDuplicatePositions(veinState.veinPaths);
    
    veinState.player.sendMessage(`§7Created vein network with ${veinState.veinPaths.length} path blocks`);
    veinState.currentPhase = "connecting_exits";
}

// Phase 3: Connect exits to the vein network
function connectExitPaths(veinState) {
    veinState.exitPaths = [];
    
    if (veinState.config.connectAllExits) {
        for (const exit of veinState.config.exits) {
            // Find closest vein path point to this exit
            const closestPoint = findClosestPoint(exit, veinState.veinPaths);
            if (closestPoint) {
                const exitPath = createLinePath(exit, closestPoint);
                veinState.exitPaths.push(...exitPath);
            }
        }
    }
    
    // Remove duplicates and combine all paths
    veinState.exitPaths = removeDuplicatePositions(veinState.exitPaths);
    veinState.allVeinPositions = removeDuplicatePositions([...veinState.veinPaths, ...veinState.exitPaths]);
    
    veinState.player.sendMessage(`§7Connected ${veinState.config.exits.length} exits, total path blocks: ${veinState.allVeinPositions.length}`);
    veinState.currentPhase = "placing_blocks";
}

// Phase 4: Place blocks with radius
function placeVeinBlocks(veinState) {
    const batchSize = 20; // Process 20 vein positions per tick
    let processed = 0;
    
    while (processed < batchSize && veinState.currentIndex < veinState.allVeinPositions.length) {
        const veinPos = veinState.allVeinPositions[veinState.currentIndex];
        
        // Place blocks in radius around this vein position
        const placedInRadius = placeBlocksInRadius(veinState, veinPos);
        veinState.blocksPlaced += placedInRadius.placed;
        veinState.blocksFailed += placedInRadius.failed;
        
        veinState.currentIndex++;
        processed++;
    }
    
    // Show progress
    if (veinState.currentIndex % 100 === 0 || veinState.currentIndex >= veinState.allVeinPositions.length) {
        const progress = Math.round((veinState.currentIndex / veinState.allVeinPositions.length) * 100);
        const elapsed = Math.round((Date.now() - veinState.startTime) / 1000);
        
        veinState.player.sendMessage(
            `§7Progress: ${progress}% (${veinState.currentIndex}/${veinState.allVeinPositions.length}) - ${veinState.blocksPlaced} blocks - ${elapsed}s`
        );
    }
    
    // Check if complete
    if (veinState.currentIndex >= veinState.allVeinPositions.length) {
        finishVeinGeneration(veinState);
    }
}

// Place blocks in radius around a vein position
function placeBlocksInRadius(veinState, centerPos) {
    let placed = 0;
    let failed = 0;
    const radius = veinState.config.radius;
    const fillInterior = veinState.config.fillInterior;
    
    for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
            for (let z = -radius; z <= radius; z++) {
                const distance = Math.sqrt(x*x + y*y + z*z);
                
                let shouldPlace = false;
                if (fillInterior) {
                    shouldPlace = distance <= radius;
                } else {
                    // Only surface (hollow)
                    shouldPlace = distance <= radius && distance > radius - 1;
                }
                
                if (shouldPlace) {
                    const blockPos = {
                        x: centerPos.x + x,
                        y: centerPos.y + y,
                        z: centerPos.z + z
                    };
                    
                    try {
                        const randomBlock = veinState.blocks[Math.floor(Math.random() * veinState.blocks.length)];
                        const blockPermutation = BlockPermutation.resolve(randomBlock);
                        veinState.dimension.setBlockPermutation(blockPos, blockPermutation);
                        placed++;
                    } catch (e) {
                        failed++;
                    }
                }
            }
        }
    }
    
    return { placed, failed };
}

// Helper functions
function findNearestPoints(targetPoint, allPoints, maxCount) {
    const distances = allPoints
        .filter(p => p !== targetPoint)
        .map(p => ({
            point: p,
            distance: Math.sqrt(
                Math.pow(p.x - targetPoint.x, 2) +
                Math.pow(p.y - targetPoint.y, 2) +
                Math.pow(p.z - targetPoint.z, 2)
            )
        }))
        .sort((a, b) => a.distance - b.distance);
    
    return distances.slice(0, maxCount).map(d => d.point);
}

function findClosestPoint(targetPoint, allPoints) {
    if (allPoints.length === 0) return null;
    
    let closestPoint = allPoints[0];
    let minDistance = calculateDistance(targetPoint, closestPoint);
    
    for (const point of allPoints) {
        const distance = calculateDistance(targetPoint, point);
        if (distance < minDistance) {
            minDistance = distance;
            closestPoint = point;
        }
    }
    
    return closestPoint;
}

function calculateDistance(point1, point2) {
    return Math.sqrt(
        Math.pow(point2.x - point1.x, 2) +
        Math.pow(point2.y - point1.y, 2) +
        Math.pow(point2.z - point1.z, 2)
    );
}

function createLinePath(start, end) {
    const path = [];
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);
    const dz = Math.abs(end.z - start.z);
    const steps = Math.max(dx, dy, dz);
    
    for (let i = 0; i <= steps; i++) {
        const t = steps === 0 ? 0 : i / steps;
        const x = Math.round(start.x + (end.x - start.x) * t);
        const y = Math.round(start.y + (end.y - start.y) * t);
        const z = Math.round(start.z + (end.z - start.z) * t);
        
        path.push({ x, y, z });
    }
    
    return path;
}

function removeDuplicatePositions(positions) {
    const unique = [];
    const seen = new Set();
    
    for (const pos of positions) {
        const key = `${pos.x},${pos.y},${pos.z}`;
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(pos);
        }
    }
    
    return unique;
}

// Show vein preview with particles
function showVeinPreview(player, veinConfig) {
    // This would show particles for preview - simplified version
    player.sendMessage("§aShowing vein preview...");
    player.sendMessage("§7This would show particles indicating where veins will be placed");
    player.sendMessage("§7Use form again without preview to generate actual veins");
}

// Finish vein generation
function finishVeinGeneration(veinState) {
    const elapsed = Math.round((Date.now() - veinState.startTime) / 1000);
    const rate = elapsed > 0 ? Math.round(veinState.blocksPlaced / elapsed) : 0;
    
    veinState.player.sendMessage(`§aVein system generation complete!`);
    veinState.player.sendMessage(`§7Network: ${veinState.veinPaths.length} vein blocks, ${veinState.exitPaths.length} exit connections`);
    veinState.player.sendMessage(`§7Blocks placed: ${veinState.blocksPlaced}, Failed: ${veinState.blocksFailed}`);
    veinState.player.sendMessage(`§7Time: ${elapsed}s (${rate} blocks/s)`);
    veinState.player.sendMessage(`§7Used ${veinState.blocks.length} different block type${veinState.blocks.length > 1 ? 's' : ''}`);
    
    system.clearRun(veinState.intervalId);
}

// Event handler for vein tool right-click (mark exits)
export function initializeVeinToolEvents() {
    world.afterEvents.itemUse.subscribe((ev) => {
        if (ev.source.typeId !== "minecraft:player" || !ev.itemStack) return;
        
        const player = ev.source;
        const itemStack = ev.itemStack;
        
        // Check if it's the vein tool
        if (!itemStack.nameTag || !itemStack.nameTag.includes("Vein Tool")) return;
        
        try {
            // Get block player is looking at
            const blockFromView = player.getBlockFromViewDirection({ maxDistance: 100 });
            
            if (!blockFromView || !blockFromView.block) {
                player.sendMessage("§cNo block found in view direction!");
                return;
            }
            
            const targetLocation = blockFromView.block.location;
            const equippable = player.getComponent("minecraft:equippable");
            const currentTool = equippable.getEquipment(EquipmentSlot.Mainhand);
            
            if (!currentTool) return;
            
            // Add exit marker to lore
            const currentLore = currentTool.getLore();
            const exitCount = getExitMarkersCount(currentLore) + 1;
            
            // Create new tool with updated lore
            const newTool = currentTool.clone();
            const newLore = [...currentLore];
            newLore.push(`§6Exit ${exitCount}: §f${targetLocation.x}, ${targetLocation.y}, ${targetLocation.z}`);
            
            newTool.setLore(newLore);
            equippable.setEquipment(EquipmentSlot.Mainhand, newTool);
            
            player.sendMessage(`§aExit ${exitCount} marked at ${targetLocation.x}, ${targetLocation.y}, ${targetLocation.z}`);
            
            // Show particle at exit location
            try {
                player.dimension.spawnParticle("minecraft:totem_particle", {
                    x: targetLocation.x + 0.5,
                    y: targetLocation.y + 1,
                    z: targetLocation.z + 0.5
                });
            } catch (e) {
                // Particle failed, but exit was still marked
            }
            
        } catch (e) {
            console.log("Error marking exit: " + e);
            player.sendMessage("§cFailed to mark exit!");
        }
    });

    // Event handler for vein tool left-click (set corners)
    world.beforeEvents.playerBreakBlock.subscribe((ev) => {
        const player = ev.player;
        const equippable = player.getComponent("minecraft:equippable");
        const heldItem = equippable?.getEquipment(EquipmentSlot.Mainhand);
        
        // Check if holding vein tool
        if (!heldItem || !heldItem.nameTag || !heldItem.nameTag.includes("Vein Tool")) return;
        
        // Cancel the break event
        ev.cancel = true;
        system.run(() => {
            try {
                const targetLocation = ev.block.location;
                let toolState = VEIN_TOOL_STATES.get(player.id);
                
                if (!toolState) {
                    toolState = { corners: [], breakCount: 0 };
                    VEIN_TOOL_STATES.set(player.id, toolState);
                }
                
                toolState.breakCount++;
                
                if (toolState.breakCount === 1) {
                    // Set first corner
                    toolState.corners = [{ x: targetLocation.x, y: targetLocation.y, z: targetLocation.z }];
                    player.sendMessage(`§aCorner 1 set at ${targetLocation.x}, ${targetLocation.y}, ${targetLocation.z}`);
                    
                    // Show particle
                    try {
                        player.dimension.spawnParticle("minecraft:villager_happy", {
                            x: targetLocation.x + 0.5,
                            y: targetLocation.y + 1,
                            z: targetLocation.z + 0.5
                        });
                    } catch (e) {
                        // Particle failed
                    }
                    
                } else if (toolState.breakCount === 2) {
                    // Set second corner
                    toolState.corners.push({ x: targetLocation.x, y: targetLocation.y, z: targetLocation.z });
                    player.sendMessage(`§aCorner 2 set at ${targetLocation.x}, ${targetLocation.y}, ${targetLocation.z}`);
                    
                    // Calculate and show area
                    const corner1 = toolState.corners[0];
                    const corner2 = toolState.corners[1];
                    const dx = Math.abs(corner2.x - corner1.x) + 1;
                    const dy = Math.abs(corner2.y - corner1.y) + 1;
                    const dz = Math.abs(corner2.z - corner1.z) + 1;
                    const volume = dx * dy * dz;
                    
                    player.sendMessage(`§7Selected area: §f${dx}×${dy}×${dz} §7(${volume.toLocaleString()} blocks)`);
                    
                    // Show particle
                    try {
                        player.dimension.spawnParticle("minecraft:villager_happy", {
                            x: targetLocation.x + 0.5,
                            y: targetLocation.y + 1,
                            z: targetLocation.z + 0.5
                        });
                    } catch (e) {
                        // Particle failed
                    }
                    
                } else if (toolState.breakCount >= 3) {
                    // Reset corners
                    toolState.corners = [];
                    toolState.breakCount = 0;
                    player.sendMessage("§eCorners reset! Click first corner to start over.");
                    
                    // Show reset particle
                    try {
                        player.dimension.spawnParticle("minecraft:critical_hit_emitter", {
                            x: targetLocation.x + 0.5,
                            y: targetLocation.y + 1,
                            z: targetLocation.z + 0.5
                        });
                    } catch (e) {
                        // Particle failed
                    }
                }
                
                // Update tool lore
                const newTool = heldItem.clone();
                const updatedLore = updateVeinToolLore(player, newTool, toolState);
                newTool.setLore(updatedLore);
                equippable.setEquipment(EquipmentSlot.Mainhand, newTool);
                
            } catch (e) {
                console.log("Error setting corner: " + e);
                player.sendMessage("§cFailed to set corner!");
            }
        });
    });
}