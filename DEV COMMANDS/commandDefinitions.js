import {
    system,
    CustomCommandStatus
} from "@minecraft/server";

import {
    ActionFormData
} from "@minecraft/server-ui";

// All command definitions for help and search functionality
export const COMMANDS = [
    {
        command: "/addlore",
        description: "Add lore to item (saves existing lore)",
        keyWords: ["lore", "item", "text", "description", "add"]
    },
    {
        command: "/addblock",
        description: "Add block to multiblock",
        keyWords: ["block", "multiblock", "add", "building"]
    },
    {
        command: "/setlore",
        description: "Set lore to item (replace existing lore)",
        keyWords: ["lore", "item", "text", "description", "replace", "set"]
    },
    {
        command: "/bindcommand",
        description: "Bind command to item",
        keyWords: ["bind", "command", "item", "trigger", "execute"]
    },
    {
        command: "/bindfunction",
        description: "Bind function to item",
        keyWords: ["bind", "function", "item", "trigger", "execute"]
    },
    {
        command: "/explosion",
        description: "Create explosion",
        keyWords: ["explosion", "blast", "destroy", "boom", "tnt"]
    },
    {
        command: "/cloneitem",
        description: "Clone item from one entity's slot to another entity's slot",
        keyWords: ["clone", "item", "copy", "duplicate", "slot", "inventory"]
    },
    {
        command: "/setitemname",
        description: "Set custom name for held item",
        keyWords: ["name", "item", "rename", "title", "custom"]
    },
    {
        command: "/clearlore",
        description: "Clear lore from item",
        keyWords: ["clear", "lore", "remove", "delete", "item"]
    },
    {
        command: "/createmultiblock",
        description: "Create multi-block item with GUI",
        keyWords: ["multiblock", "create", "gui", "blocks", "item"]
    },
    {
        command: "/multiblockfill",
        description: "Fill area with multi-block from mainhand (~18000 blocks/s)",
        keyWords: ["multiblock", "fill", "area", "fast", "async", "building"]
    },
    {
        command: "/nv",
        description: "Give night vision",
        keyWords: ["night", "vision", "see", "dark", "effect"]
    },
    {
        command: "/heal",
        description: "Heal player to full health/hunger",
        keyWords: ["heal", "health", "hunger", "restore", "full"]
    },
    {
        command: "/setday",
        description: "Set specific day number",
        keyWords: ["day", "time", "set", "calendar", "date"]
    },
    {
        command: "/spawnentity",
        description: "Spawn entities with optional equipment and effects",
        keyWords: ["spawn", "entity", "mob", "creature", "summon"]
    },
    {
        command: "/god",
        description: "Toggle god mode (resistance 5)",
        keyWords: ["god", "invincible", "immortal", "resistance", "protection"]
    },
    {
        command: "/burnentity",
        description: "Set entity on fire",
        keyWords: ["burn", "fire", "flame", "ignite", "entity"]
    },
    {
        command: "/knockback",
        description: "Apply knockback force to entities",
        keyWords: ["knockback", "push", "force", "velocity", "launch"]
    },
    {
        command: "/durability",
        description: "Set item durability percentage",
        keyWords: ["durability", "damage", "repair", "item", "percentage"]
    },
    {
        command: "/cleararea",
        description: "Clear all entities/items in area",
        keyWords: ["clear", "area", "remove", "entities", "items", "cleanup"]
    },
    {
        command: "/createpath",
        description: "Create path between waypoints with specified radius",
        keyWords: ["path", "road", "waypoint", "connect", "route", "building"]
    },
    {
        command: "/getslotitem",
        description: "Get information about item in specific slot",
        keyWords: ["slot", "item", "info", "inventory", "check"]
    },
    {
        command: "/findslot",
        description: "Find item locations in inventory",
        keyWords: ["find", "slot", "search", "item", "inventory", "locate"]
    },
    {
        command: "/getpathtool",
        description: "Get path creation tool (shovel)",
        keyWords: ["path", "tool", "shovel", "waypoint", "building"]
    },
    {
        command: "/buildpath",
        description: "Build path using path tool data (opens GUI)",
        keyWords: ["build", "path", "gui", "waypoint", "construction"]
    },
    {
        command: "/configfill",
        description: "Configure block filling performance settings",
        keyWords: ["config", "fill", "performance", "blocks", "settings"]
    },
    {
        command: "/buildtext",
        description: "Build 3D text from blocks with customizable options",
        keyWords: ["text", "3d", "blocks", "font", "write", "building"]
    },
    {
        command: "/brush",
        description: "Configure and create brush tool",
        keyWords: ["brush", "tool", "paint", "sphere", "cube", "building"]
    },
    {
        command: "/largefill",
        description: "Fill large areas with blocks using async processing (up to 1M blocks)",
        keyWords: ["largefill", "fill", "area", "async", "massive", "building"]
    },
    {
        command: "/fillinfo",
        description: "Calculate fill area size and estimated time",
        keyWords: ["fillinfo", "calculate", "size", "estimate", "time", "area"]
    },
    {
        command: "/createfigure",
        description: "Create geometric figures (cube, sphere, cylinder, pyramid) with various options",
        keyWords: ["figure", "geometry", "cube", "sphere", "cylinder", "pyramid", "shape"]
    },
    {
        command: "/gm",
        description: "Change gamemode (defaults to creative)",
        keyWords: ["gamemode", "creative", "survival", "adventure", "spectator", "mode"]
    },
    {
        command: "/boost",
        description: "Apply impulse boost to entities",
        keyWords: ["boost", "launch", "jump", "velocity", "impulse", "force"]
    },
    {
        command: "/random",
        description: "Random number",
        keyWords: ["random", "number", "generate", "rng"]
    },
    {
        command: "/tlore",
        description: "Transfer lore from one item to another",
        keyWords: ["transfer", "lore", "copy", "move", "item"]
    },
    {
        command: "/remove",
        description: "Remove entities",
        keyWords: ["remove", "delete", "kill", "entity", "clear"]
    },
    {
        command: "/surface",
        description: "Create surface patterns (circle/square) on terrain",
        keyWords: ["surface", "terrain", "pattern", "circle", "square", "ground"]
    },
    {
        command: "/plain",
        description: "Create plains by removing blocks above ground level in specified shapes",
        keyWords: ["plain", "flatten", "terrain", "ground", "shape", "level"]
    },
    {
        command: "/worldinfo",
        description: "Get world information (time, day, moonphase, players, etc.)",
        keyWords: ["world", "info", "time", "day", "moon", "players", "statistics"]
    },
    {
        command: "/getveintool",
        description: "Get vein tool for marking corners and exits",
        keyWords: ["vein", "tool", "mining", "corners", "exits", "generation"]
    },
    {
        command: "/clearveintool",
        description: "Clear all vein tool data (corners and exits)",
        keyWords: ["clear", "vein", "tool", "reset", "corners", "exits"]
    },
    {
        command: "/veintoolinfo",
        description: "Show current vein tool information",
        keyWords: ["vein", "tool", "info", "status", "corners", "exits"]
    },
    {
        command: "/generateveins",
        description: "Generate vein system using vein tool data",
        keyWords: ["generate", "vein", "system", "mining", "network", "cave"]
    },
    {
        command: "/hiddenblocks",
        description: "Get hidden/creative blocks",
        keyWords: ["hidden", "blocks", "creative", "special", "command", "barrier"]
    },
    {
        command: "/copyentitytool",
        description: "Get copy entity tool",
        keyWords: ["copy", "entity", "tool", "duplicate", "clone", "mob"]
    },
    {
        command: "/loadentity",
        description: "Load entity from structure/code",
        keyWords: ["load", "entity", "structure", "code", "spawn", "restore"]
    },
    {
        command: "/saveposition",
        description: "Save current position with a name",
        keyWords: ["save", "position", "location", "coordinates", "waypoint", "teleport"]
    },
    {
        command: "/tps",
        description: "Teleport to saved position",
        keyWords: ["teleport", "position", "saved", "location", "travel", "warp"]
    },
    {
        command: "/tpsg",
        description: "Teleport to saved position using GUI",
        keyWords: ["teleport", "gui", "position", "saved", "location", "travel", "warp"]
    },
    {
        command: "/clearpositions",
        description: "Clear all saved positions",
        keyWords: ["clear", "positions", "saved", "locations", "reset"]
    },
    {
        command: "/rtp",
        description: "Random teleport within specified distance",
        keyWords: ["random", "teleport", "travel", "explore", "adventure"]
    }
];

// Help command function
export function helpFunction(origin) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            showHelpGUI(player);
            
        } catch (e) {
            console.log("Failed to show help: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to show help: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Search command function
export function searchFunction(origin, searchTerm) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            if (!searchTerm || searchTerm.trim() === "") {
                player.sendMessage("§cPlease provide a search term!");
                player.sendMessage("§7Usage: /search <term>");
                return;
            }
            
            const results = searchCommands(searchTerm.toLowerCase().trim());
            
            if (results.length === 0) {
                player.sendMessage(`§cNo commands found matching "${searchTerm}"`);
                player.sendMessage("§7Try searching for: build, fill, item, entity, tool, teleport, etc.");
                return;
            }
            
            player.sendMessage(`§a--- Search Results for "${searchTerm}" ---`);
            player.sendMessage(`§7Found ${results.length} command${results.length > 1 ? 's' : ''}`);
            
            for (let i = 0; i < Math.min(results.length, 10); i++) {
                const cmd = results[i];
                player.sendMessage(`§b${cmd.command}§7: ${cmd.description}`);
            }
            
            if (results.length > 10) {
                player.sendMessage(`§7... and ${results.length - 10} more commands. Use /help for all commands.`);
            }
            
        } catch (e) {
            console.log("Failed to search commands: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to search commands: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Show help GUI with categorized commands
function showHelpGUI(player) {
    const form = new ActionFormData()
        .title("§6Dev Commands Help")
        .body("§7Choose a category to view commands:");
    
    // Categories
    const categories = [
        { name: "Item Commands", icon: "textures/items/diamond_sword" },
        { name: "Building Commands", icon: "textures/blocks/grass_side_carried" },
        { name: "Entity Commands", icon: "textures/items/spawn_egg" },
        { name: "Teleport Commands", icon: "textures/items/ender_pearl" },
        { name: "Tool Commands", icon: "textures/items/diamond_pickaxe" },
        { name: "World Commands", icon: "textures/blocks/grass_block_top" },
        { name: "All Commands", icon: "textures/items/book_writable" }
    ];
    
    categories.forEach(category => {
        form.button(category.name, category.icon);
    });
    
    form.show(player).then((response) => {
        if (response.canceled) return;
        
        const selectedCategory = categories[response.selection];
        showCategoryCommands(player, selectedCategory.name);
    });
}

// Show commands for specific category
function showCategoryCommands(player, categoryName) {
    let filteredCommands = [];
    
    switch (categoryName) {
        case "Item Commands":
            filteredCommands = COMMANDS.filter(cmd => 
                cmd.keyWords.some(keyword => 
                    ["item", "lore", "durability", "name", "slot", "inventory"].includes(keyword)
                )
            );
            break;
            
        case "Building Commands":
            filteredCommands = COMMANDS.filter(cmd => 
                cmd.keyWords.some(keyword => 
                    ["build", "fill", "block", "multiblock", "path", "text", "brush", "figure", "surface", "plain"].includes(keyword)
                )
            );
            break;
            
        case "Entity Commands":
            filteredCommands = COMMANDS.filter(cmd => 
                cmd.keyWords.some(keyword => 
                    ["entity", "spawn", "mob", "creature", "copy", "remove", "heal", "god", "burn", "knockback"].includes(keyword)
                )
            );
            break;
            
        case "Teleport Commands":
            filteredCommands = COMMANDS.filter(cmd => 
                cmd.keyWords.some(keyword => 
                    ["teleport", "position", "save", "travel", "warp", "random"].includes(keyword)
                )
            );
            break;
            
        case "Tool Commands":
            filteredCommands = COMMANDS.filter(cmd => 
                cmd.keyWords.some(keyword => 
                    ["tool", "vein", "path", "brush", "copy"].includes(keyword)
                )
            );
            break;
            
        case "World Commands":
            filteredCommands = COMMANDS.filter(cmd => 
                cmd.keyWords.some(keyword => 
                    ["world", "day", "time", "gamemode", "clear", "info"].includes(keyword)
                )
            );
            break;
            
        case "All Commands":
        default:
            filteredCommands = COMMANDS;
            break;
    }
    
    // Sort commands alphabetically
    filteredCommands.sort((a, b) => a.command.localeCompare(b.command));
    
    player.sendMessage(`§a--- ${categoryName} (${filteredCommands.length} commands) ---`);
    
    // Split into chunks to avoid message spam
    const chunksOf = 8;
    for (let i = 0; i < filteredCommands.length; i += chunksOf) {
        const chunk = filteredCommands.slice(i, i + chunksOf);
        
        system.runTimeout(() => {
            for (const cmd of chunk) {
                player.sendMessage(`§b${cmd.command}§7: ${cmd.description}`);
            }
            
            if (i + chunksOf >= filteredCommands.length) {
                player.sendMessage("§7Use /search <term> to find specific commands");
            }
        }, Math.floor(i / chunksOf) * 10); // Delay each chunk by 10 ticks
    }
}

// Search commands by term
function searchCommands(searchTerm) {
    const results = [];
    const searchLower = searchTerm.toLowerCase();
    
    for (const cmd of COMMANDS) {
        let score = 0;
        
        // Check command name
        if (cmd.command.toLowerCase().includes(searchLower)) {
            score += 10;
        }
        
        // Check description
        if (cmd.description.toLowerCase().includes(searchLower)) {
            score += 5;
        }
        
        // Check keywords
        for (const keyword of cmd.keyWords) {
            if (keyword.toLowerCase().includes(searchLower)) {
                score += 3;
            }
            if (keyword.toLowerCase() === searchLower) {
                score += 7; // Exact keyword match
            }
        }
        
        if (score > 0) {
            results.push({ ...cmd, score });
        }
    }
    
    // Sort by score (descending)
    results.sort((a, b) => b.score - a.score);
    
    return results;
}