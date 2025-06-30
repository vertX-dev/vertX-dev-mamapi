import { world, system } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { IFD, holdSens } from "./MSIFvData.js";

function parseItemIdToScoreboardObj(itemId) {
    return itemId.replace(/^.*?:/, "").replace(/[^a-zA-Z0-9]/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "").substring(0, 16);
}

function getScoreboardValue(scoreboard, player) {
    try {
        const scoreboardObj = world.scoreboard.getObjective(scoreboard);
        if (!scoreboardObj) return 0;
        
        // Use try-catch for getScore as it throws if player has no score
        try {
            return scoreboardObj.getScore(player);
        } catch {
            return 0; // Player has no score set
        }
    } catch (error) {
        console.warn(`Error getting scoreboard value for ${scoreboard}:`, error);
        return 0;
    }
}

function setscoreb(player, scoreboard, value) {
    try {
        // Ensure the objective exists before setting
        const scoreboardObj = world.scoreboard.getObjective(scoreboard);
        if (!scoreboardObj) {
            console.warn(`Scoreboard objective ${scoreboard} does not exist`);
            return false;
        }
        
        player.runCommand(`scoreboard players set @s ${scoreboard} ${value}`);
        return true;
    } catch (error) {
        console.warn(`Error setting scoreboard value for ${scoreboard}:`, error);
        return false;
    }
}

function ensureObjective(objectiveName) {
    try {
        if (!world.scoreboard.getObjective(objectiveName)) {
            world.scoreboard.addObjective(objectiveName, objectiveName);
        }
        return true;
    } catch (error) {
        console.warn(`Error creating objective ${objectiveName}:`, error);
        return false;
    }
}

// Track pending timeouts to prevent race conditions
const pendingTimeouts = new Map();

function clearPendingTimeout(playerId) {
    const timeoutId = pendingTimeouts.get(playerId);
    if (timeoutId) {
        system.clearRun(timeoutId);
        pendingTimeouts.delete(playerId);
    }
}

function setPendingTimeout(playerId, callback, delay) {
    // Clear any existing timeout first
    clearPendingTimeout(playerId);
    
    // Set new timeout and store its ID
    const timeoutId = system.runTimeout(callback, delay);
    pendingTimeouts.set(playerId, timeoutId);
    
    return timeoutId;
}

// Global initialization (once per world)
const initializedObjectives = new Set();
world.afterEvents.worldInitialize.subscribe(() => {
    console.log("Initializing MSIF objectives...");
    
    // Initialize IFD objectives
    for (const IID in IFD) {
        const PIID = IFD[IID];
        const scoreboardObj = PIID?.scoreboardObj ?? parseItemIdToScoreboardObj(IID);
        if (!initializedObjectives.has(scoreboardObj)) {
            if (ensureObjective(scoreboardObj)) {
                initializedObjectives.add(scoreboardObj);
            }
        }
    }

    // Initialize system objectives
    for (const sb of ["holdTrue", "holdSens", "holdBlock"]) {
        if (!initializedObjectives.has(sb)) {
            if (ensureObjective(sb)) {
                initializedObjectives.add(sb);
            }
        }
    }
    
    console.log(`Initialized ${initializedObjectives.size} objectives`);
});

// Per-player initialization on join
world.afterEvents.playerSpawn.subscribe((ev) => {
    const player = ev.player;
    
    // Wait a tick to ensure all objectives are ready
    system.runTimeout(() => {
        try {
            // Initialize system scoreboards
            setscoreb(player, "holdTrue", 0);
            setscoreb(player, "holdBlock", 0);
            setscoreb(player, "holdSens", holdSens);
            
            // Initialize item scoreboards
            for (const IID in IFD) {
                const PIID = IFD[IID];
                const scoreboardObj = PIID?.scoreboardObj ?? parseItemIdToScoreboardObj(IID);
                setscoreb(player, scoreboardObj, 0);
            }
            
            console.log(`Initialized player ${player.name} scoreboards`);
        } catch (error) {
            console.warn(`Error initializing player ${player.name}:`, error);
        }
    }, 1);
});

// Clean up when player leaves
world.afterEvents.playerLeave.subscribe((ev) => {
    const playerId = ev.playerId;
    clearPendingTimeout(playerId);
});

world.afterEvents.itemStopUse.subscribe((ev) => {
    try {
        const item = ev.itemStack;
        if (!(item.typeId in IFD)) return;
        
        const player = ev.source;
        const playerId = player.id;
        const PIID = IFD[item.typeId];

        // Clear any pending timeout to prevent race conditions
        clearPendingTimeout(playerId);

        const params = {
            functions: PIID.functions,
            skillNames: PIID?.skillNames ?? [],
            scoreboardObj: PIID?.scoreboardObj ?? parseItemIdToScoreboardObj(item.typeId),
            fontIcons: PIID?.fontIcons ?? []
        };

        const { functions, skillNames, scoreboardObj, fontIcons } = params;

        // Validate functions array
        if (!Array.isArray(functions) || functions.length === 0) {
            console.warn(`No functions defined for item ${item.typeId}`);
            return;
        }

        if (getScoreboardValue("holdTrue", player) === 1) {
            // This was a hold action - cycle through skills
            const currentIndex = getScoreboardValue(scoreboardObj, player);
            const newIndex = (currentIndex + 1) % functions.length;
            
            if (setscoreb(player, scoreboardObj, newIndex)) {
                const name = skillNames?.[newIndex] ?? `Skill ${newIndex}`;
                const icon = fontIcons?.[newIndex] ?? "";
                player.sendMessage(`Changed to ${name}${icon ? " " + icon : ""}`);
            }
        } else {
            // This was a quick use - execute function
            const currentIndex = getScoreboardValue(scoreboardObj, player);
            const functionName = functions[currentIndex];
            
            if (functionName) {
                try {
                    player.runCommand(`function ${functionName}`);
                } catch (error) {
                    console.warn(`Error running function ${functionName}:`, error);
                    player.sendMessage("§cError: Function not found or failed to execute");
                }
            }
        }

        // Reset both flags immediately after processing
        setscoreb(player, "holdTrue", 0);
        setscoreb(player, "holdBlock", 0);
        
    } catch (error) {
        console.warn("Error in itemStopUse event:", error);
    }
});

world.afterEvents.itemUse.subscribe((ev) => {
    try {
        const item = ev.itemStack;
        if (!(item.typeId in IFD)) return;
        
        const player = ev.source;
        const playerId = player.id;
        const sensitivity = getScoreboardValue("holdSens", player);
        
        // Set holdBlock immediately to prevent multiple triggers
        setscoreb(player, "holdBlock", 1);
        
        // Use our timeout management system
        setPendingTimeout(playerId, () => {
            // Only set holdTrue if holdBlock is still 1 (meaning itemStopUse hasn't fired yet)
            if (getScoreboardValue("holdBlock", player) === 1) {
                setscoreb(player, "holdTrue", 1);
                player.runCommand("playsound random.orb @s");
            }
        }, Math.max(1, sensitivity));
        
    } catch (error) {
        console.warn("Error in itemUse event:", error);
    }
});