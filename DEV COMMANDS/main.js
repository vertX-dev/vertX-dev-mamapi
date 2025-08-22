import {
    system,
    world,
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    EquipmentSlot,
    BlockPermutation,
    ItemStack,
    MoonPhase,
    EnchantmentSlot
} from "@minecraft/server";

import {
    uiManager,
    ActionFormData,
    ModalFormData
} from "@minecraft/server-ui";

import { FONTS } from "./buildTextFont.js";
import { PALLETS } from "./blockPallets.js";
import { COMMANDS } from "./commandsSearch.js";


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
    // Register enums for parameters that previously used raw strings
    init.customCommandRegistry.registerEnum("vertx:LargeFillMode", ["replace", "keep", "outline", "hollow", "destroy"]);
    init.customCommandRegistry.registerEnum("vertx:FigureMode", ["solid", "hollow", "keep"]);
    init.customCommandRegistry.registerEnum("vertx:FindSlotMode", ["first", "all"]);
    init.customCommandRegistry.registerEnum("vertx:HealMode", ["health", "hunger", "both"]);
    init.customCommandRegistry.registerEnum("vertx:Direction", ["north", "south", "east", "west"]);
    init.customCommandRegistry.registerEnum("vertx:FigureType", ["cube", "sphere", "cylinder", "pyramid"]);
    init.customCommandRegistry.registerEnum("vertx:FontStyle", Object.keys(FONTS));
    init.customCommandRegistry.registerEnum("vertx:GameMode", ["survival", "creative", "adventure", "spectator", "s", "c", "a", "sp"]);
    init.customCommandRegistry.registerEnum("vertx:BoostDirection", ["up", "forward", "backward", "left", "right", "down"]);
    init.customCommandRegistry.registerEnum("vertx:SurfaceMode", ["circle", "square"]);
    init.customCommandRegistry.registerEnum("vertx:PlainMode", ["square", "triangle", "circle"]);
    init.customCommandRegistry.registerEnum("vertx:WorldInfoType", ["time", "day", "moonphase", "players", "difficulty", "absolutetime", "weather", "spawn", "entities", "dimensions", "all"]);
    init.customCommandRegistry.registerEnum("vertx:EnchantVariant", ["all","sword","swordZombie","axe","pickaxe","shovel","bowInfinity","bowMending","crossbow","helmet","chestplate","leggings","boots","tridentLoyalty","tridentRiptide","fishing_rod"]);


    
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
            { type: CustomCommandParamType.Enum, name: "vertx:HealMode"},
            { type: CustomCommandParamType.Boolean, name: "vertx:PlayerEntity"}
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
            { type: CustomCommandParamType.EntityType, name: "EntityType"},
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
            { type: CustomCommandParamType.Enum, name: "vertx:FindSlotMode" },
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
            { type: CustomCommandParamType.Enum, name: "vertx:Direction" },
            { type: CustomCommandParamType.Boolean, name: "Vertical text (default: false)" },
            { type: CustomCommandParamType.Enum, name: "vertx:FontStyle" }
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
            { type: CustomCommandParamType.BlockType, name: "Block" }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Enum, name: "vertx:LargeFillMode" },
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
            { type: CustomCommandParamType.Enum, name: "vertx:FigureType" },
            { type: CustomCommandParamType.Location, name: "Center location" },
            { type: CustomCommandParamType.BlockType, name: "Block" },
            { type: CustomCommandParamType.Integer, name: "Size (radius/half-width)" }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Enum, name: "vertx:FigureMode" },
            { type: CustomCommandParamType.Integer, name: "Rotation in degrees (default: 0)" },
            { type: CustomCommandParamType.Integer, name: "Height (for cylinder/pyramid, default: size)" }
        ]
    };
    
    const gamemodeCommand = {
        name: "vertx:gm",
        description: "Change gamemode (defaults to creative)",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { type: CustomCommandParamType.Enum, name: "vertx:GameMode" },
            { type: CustomCommandParamType.EntitySelector, name: "Target player(s)" }
        ]
    };
    
    const boostCommand = {
        name: "vertx:boost",
        description: "Apply impulse boost to entities",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.Float, name: "Power (0.1-100.0)" }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Enum, name: "vertx:BoostDirection" },
            { type: CustomCommandParamType.EntitySelector, name: "Target entities" },
            { type: CustomCommandParamType.Location, name: "Custom direction" },
        ]
    };
    
    const randomCommand = {
        name: "vertx:random",
        description: "Random number",
        permissionLevel: CommandPermissionLevel.Any,
        mandatoryParameters: [
            { type: CustomCommandParamType.Integer, name: "Max"}
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Integer, name: "Min"},
            { type: CustomCommandParamType.Boolean, name: "FloorResult"}
        ]
    };
    
    const transferLoreCommand = {
        name: "vertx:tlore",
        description: "Transfer lore from one item to another",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "FromEntity"},
            { type: CustomCommandParamType.Integer, name: "FromSlot"},
            { type: CustomCommandParamType.EntitySelector, name: "ToEntity"},
            { type: CustomCommandParamType.Integer, name: "ToSlot"}
        ]
    };
    
    const removeCommand = {
        name: "vertx:remove",
        description: "Remove entities",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "Targets"}
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Boolean, name: "Show removed entities"}
        ]
    };
    
    const surfaceCommand = {
        name: "vertx:surface",
        description: "Create surface patterns (circle/square) on terrain",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.Enum, name: "vertx:SurfaceMode" },
            { type: CustomCommandParamType.Location, name: "Center" },
            { type: CustomCommandParamType.Integer, name: "Radius" },
            { type: CustomCommandParamType.BlockType, name: "Block" }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Integer, name: "MaxHeight" },
            { type: CustomCommandParamType.Integer, name: "MinHeight" },
            { type: CustomCommandParamType.Boolean, name: "ReplaceBelow" },
            { type: CustomCommandParamType.Boolean, name: "MainhandBlock" }
        ]
    };    
    
    const plainCommand = {
        name: "vertx:plain",
        description: "Create plains by removing blocks above ground level in specified shapes",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.Location, name: "Center position" },
            { type: CustomCommandParamType.Integer, name: "Radius" },
            { type: CustomCommandParamType.Enum, name: "vertx:PlainMode" }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Integer, name: "Max height (default: 320)" }
        ]
    };    
    
    const getWorldInfoCommand = {
        name: "vertx:getworldinfo",
        description: "Get various world information",
        permissionLevel: CommandPermissionLevel.Any,
        mandatoryParameters: [
            { type: CustomCommandParamType.Enum, name: "vertx:WorldInfoType" }
        ]
    };    
    
    const getVeinToolCommand = {
        name: "vertx:getveintool",
        description: "Get vein tool for marking corners and exits",
        permissionLevel: CommandPermissionLevel.GameDirectors
    };    
        
    const clearVeinToolCommand = {
        name: "vertx:clearveintool",
        description: "Clear all vein tool data (corners and exits)",
        permissionLevel: CommandPermissionLevel.GameDirectors
    };    
        
    const veinToolInfoCommand = {
        name: "vertx:veintoolinfo",
        description: "Show current vein tool information",
        permissionLevel: CommandPermissionLevel.Any
    };

    const generateVeinsCommand = {
        name: "vertx:generateveins",
        description: "Generate vein system using vein tool data",
        permissionLevel: CommandPermissionLevel.GameDirectors
    };

    const hiddenBlocksCommand = {
        name: "vertx:hblocks",
        description: "Open menu with all hidden blocks",
        permissionLevel: CommandPermissionLevel.GameDirectors
    };
    
    const copyEntityToolCommand = {
        name: "vertx:copyentitytool",
        description: "Get tool that allow copy entities",
        permissionLevel: CommandPermissionLevel.GameDirectors
    };    
    
    const loadEntityCommand = {
        name: "vertx:loadentity",
        description: "Spawn entities with optional equipment and effects",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { type: CustomCommandParamType.Location, name: "Location"},
            { type: CustomCommandParamType.Integer, name: "Amount"},
            { type: CustomCommandParamType.String, name: "EntityId"}
        ]
    };
    
    const maxEnchantCommand = {
        name: "vertx:maxenchant",
        description: "Apply maximum enchantments to held item",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { type: CustomCommandParamType.Enum, name: "vertx:EnchantVariant" },
            { type: CustomCommandParamType.EntitySelector, name: "Target player" }
        ]
    };    
    
    const mobFightCommand = {
        name: "vertx:mobfight",
        description: "Get tool that allow copy entities",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "Entity"},
            { type: CustomCommandParamType.EntitySelector, name: "Entity"}
        ]
    };    
    
    const savePositionCommand = {
        name: "vertx:saveposition",
        description: "Save current position with a name",
        permissionLevel: CommandPermissionLevel.Any,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: "Location name" }
        ]
    };
    
    const tpsCommand = {
        name: "vertx:tps",
        description: "Teleport to saved position",
        permissionLevel: CommandPermissionLevel.Any,
        optionalParameters: [
            { type: CustomCommandParamType.String, name: "Location name (leave empty for GUI)" }
        ]
    };
    
    const tpsgCommand = {
        name: "vertx:tpsg",
        description: "Teleport to saved position with GUI",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const rtpCommand = {
        name: "vertx:rtp",
        description: "Random teleport within specified range",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { type: CustomCommandParamType.Integer, name: "Min distance (default: 100)" },
            { type: CustomCommandParamType.Integer, name: "Max distance (default: 2000)" }
        ]
    };    
    
    const clearPositionsCommand = {
        name: "vertx:clearpositions",
        description: "Clear all saved positions",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const helpCommand = {
        name: "vertx:help",
        description: "Get list with all commands",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const searchCommand = {
        name: "vertx:search",
        description: "Get gui based on search",
        permissionLevel: CommandPermissionLevel.Any,
        optionalParameters: [
            { type: CustomCommandParamType.String, name: "search query"}
        ]
    };
    
    const throwTagToolCommand = {
        name: "vertx:throwtagtool",
        description: "Get throw tag tool for applying tags to entities",
        permissionLevel: CommandPermissionLevel.GameDirectors
    };
    
    const tagToolAddCommand = {
        name: "vertx:tagtooladd",
        description: "Add tag to throw tag tool",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: "Tag to add" }
        ]
    };
    
    const tagToolRemoveCommand = {
        name: "vertx:tagtoolremove",
        description: "Remove tag from throw tag tool",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: "Tag to remove" }
        ]
    };
    
    const tagToolClearCommand = {
        name: "vertx:tagtoolclear",
        description: "Remove all tags from throw tag tool",
        permissionLevel: CommandPermissionLevel.GameDirectors
    };
    
    const removeTagToolCommand = {
        name: "vertx:removetagtool",
        description: "Get remove tag tool for removing tags from entities",
        permissionLevel: CommandPermissionLevel.GameDirectors
    };    
    
    const copyPasteToolCommand = {
        name: "vertx:copypastetool",
        description: "Get copy paste tool for structure operations",
        permissionLevel: CommandPermissionLevel.GameDirectors
    };
    
    const setposCommand = {
        name: "vertx:setpos",
        description: "Set position for copy paste tool",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.Location, name: "Position coordinates" },
            { type: CustomCommandParamType.Location, name: "Position coordinates" }
        ]
    };
    
    const pos1Command = {
        name: "vertx:pos1",
        description: "Set position 1 for copy paste tool",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { type: CustomCommandParamType.Location, name: "Position coordinates (default: current)" }
        ]
    };
    
    const pos2Command = {
        name: "vertx:pos2", 
        description: "Set position 2 for copy paste tool",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { type: CustomCommandParamType.Location, name: "Position coordinates (default: current)" }
        ]
    };
    
    const clearposCommand = {
        name: "vertx:clearpos",
        description: "Clear saved positions for copy paste tool",
        permissionLevel: CommandPermissionLevel.GameDirectors
    };
    
    const copyCommand = {
        name: "vertx:copy",
        description: "Copy selected area as structure",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { type: CustomCommandParamType.Boolean, name: "Include entities (default: false)" }
        ]
    };
    
    const pasteCommand = {
        name: "vertx:paste",
        description: "Paste copied structure at location",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { type: CustomCommandParamType.Location, name: "Paste location (default: current)" }
        ]
    };
    
    const cutCommand = {
        name: "vertx:cut",
        description: "Cut selected area (copy + clear original)",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { type: CustomCommandParamType.Boolean, name: "Include entities (default: false)" }
        ]
    };
    
    const moveCommand = {
        name: "vertx:move",
        description: "Move selected area to new location",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.Location, name: "Move to location" }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Boolean, name: "Include entities (default: false)" }
        ]
    };    
    
    const mathCommand = {
        name: "vertx:math",
        description: "Evaluate mathematical expressions (unrestricted - creative mode only)",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: "Mathematical expression" }
        ]
    };    
    
    const mathSafeCommand = {
        name: "vertx:mathsafe",
        description: "Evaluate safe mathematical expressions",
        permissionLevel: CommandPermissionLevel.Any,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: "Mathematical expression" }
        ]
    };    
    
    const mathHelpCommand = {
        name: "vertx:mathhelp",
        description: "Show available mathematical functions",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const convertCommand = {
        name: "vertx:convert",
        description: "Convert between common units",
        permissionLevel: CommandPermissionLevel.Any,
        mandatoryParameters: [
            { type: CustomCommandParamType.Float, name: "Value" },
            { type: CustomCommandParamType.String, name: "From unit" },
            { type: CustomCommandParamType.String, name: "To unit" }
        ]
    };    
        
    const calcCommand = {
        name: "vertx:calc",
        description: "Quick calculator (alias for mathsafe)",
        permissionLevel: CommandPermissionLevel.Any,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: "Mathematical expression" }
        ]
    };    
    
    const freezeStatusCommand = {
        name: "vertx:freezestatus",
        description: "Check freeze status of players",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "Target player (default: all frozen players)" }
        ]
    };    
        
    const freezeCommand = {
        name: "vertx:freeze",
        description: "Freeze player (disable movement and permissions)",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "Target player(s)" }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Boolean, name: "Show message (default: true)" },
            { type: CustomCommandParamType.String, name: "Custom message (optional)" },
            { type: CustomCommandParamType.Integer, name: "Time in seconds (-1 for infinite, default: 60)" }
        ]
    };
    
    const unfreezeCommand = {
        name: "vertx:unfreeze",
        description: "Unfreeze player (restore movement and permissions)",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.EntitySelector, name: "Target player(s)" }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Boolean, name: "Show message (default: true)" },
            { type: CustomCommandParamType.String, name: "Custom message (optional)" }
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
    init.customCommandRegistry.registerCommand(gamemodeCommand, gamemodeFunction);
    init.customCommandRegistry.registerCommand(boostCommand, boostFunction);
    init.customCommandRegistry.registerCommand(randomCommand, randomFunction);
    init.customCommandRegistry.registerCommand(transferLoreCommand, transferLoreFunction);
    init.customCommandRegistry.registerCommand(removeCommand, removeFunction);
    init.customCommandRegistry.registerCommand(surfaceCommand, surfaceFunction);
    init.customCommandRegistry.registerCommand(plainCommand, plainFunction);
    init.customCommandRegistry.registerCommand(getWorldInfoCommand, getWorldInfoFunction);
    init.customCommandRegistry.registerCommand(getVeinToolCommand, getVeinToolFunction);
    init.customCommandRegistry.registerCommand(clearVeinToolCommand, clearVeinToolFunction);
    init.customCommandRegistry.registerCommand(veinToolInfoCommand, veinToolInfoFunction);
    init.customCommandRegistry.registerCommand(generateVeinsCommand, generateVeinsFunction);
    init.customCommandRegistry.registerCommand(hiddenBlocksCommand, hiddenBlocksFunction);
    init.customCommandRegistry.registerCommand(copyEntityToolCommand, copyEntityToolFunction);
    init.customCommandRegistry.registerCommand(loadEntityCommand, loadEntityFunction);
    init.customCommandRegistry.registerCommand(maxEnchantCommand, maxEnchantFunction);
    init.customCommandRegistry.registerCommand(mobFightCommand, mobFightFunction);
    init.customCommandRegistry.registerCommand(savePositionCommand, savePositionFunction);
    init.customCommandRegistry.registerCommand(tpsCommand, tpsFunction);
    init.customCommandRegistry.registerCommand(tpsgCommand, tpsgFunction);
    init.customCommandRegistry.registerCommand(rtpCommand, rtpFunction);
    init.customCommandRegistry.registerCommand(clearPositionsCommand, clearPositionsFunction);
    init.customCommandRegistry.registerCommand(helpCommand, helpFunction);
    init.customCommandRegistry.registerCommand(searchCommand, searchFunction);
    init.customCommandRegistry.registerCommand(throwTagToolCommand, throwTagToolFunction);
    init.customCommandRegistry.registerCommand(tagToolAddCommand, tagToolAddFunction);
    init.customCommandRegistry.registerCommand(tagToolRemoveCommand, tagToolRemoveFunction);
    init.customCommandRegistry.registerCommand(tagToolClearCommand, tagToolClearFunction);
    init.customCommandRegistry.registerCommand(removeTagToolCommand, removeTagToolFunction);
    init.customCommandRegistry.registerCommand(copyPasteToolCommand, copyPasteToolFunction);
    init.customCommandRegistry.registerCommand(setposCommand, setposFunction);
    init.customCommandRegistry.registerCommand(pos1Command, pos1Function);
    init.customCommandRegistry.registerCommand(pos2Command, pos2Function);
    init.customCommandRegistry.registerCommand(clearposCommand, clearposFunction);
    init.customCommandRegistry.registerCommand(copyCommand, copyFunction);
    init.customCommandRegistry.registerCommand(pasteCommand, pasteFunction);
    init.customCommandRegistry.registerCommand(cutCommand, cutFunction);
    init.customCommandRegistry.registerCommand(moveCommand, moveFunction);
    init.customCommandRegistry.registerCommand(mathCommand, mathFunction);
    init.customCommandRegistry.registerCommand(mathSafeCommand, mathSafeFunction);
    init.customCommandRegistry.registerCommand(mathHelpCommand, mathHelpFunction);
    init.customCommandRegistry.registerCommand(convertCommand, convertFunction);
    init.customCommandRegistry.registerCommand(calcCommand, (origin, expression) => mathSafeFunction(origin, expression));
    init.customCommandRegistry.registerCommand(freezeCommand, freezeFunction);
    init.customCommandRegistry.registerCommand(unfreezeCommand, unfreezeFunction);
    init.customCommandRegistry.registerCommand(freezeStatusCommand, freezeStatusFunction);



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

function randomFunction(origin, max, min = 0, floor = true) {
    system.run(() => {
        let rnum = (Math.random() * (max - min)) + min;
        if (floor) {
            rnum = Math.floor(rnum);
        }
        origin.sourceEntity.sendMessage("Random number: " + rnum);
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

function transferLoreFunction(origin, FromEntity, FromSlot, ToEntity, ToSlot) {
    system.run(() => {
        const fromInventory = FromEntity[0]?.getComponent("minecraft:inventory")?.container;
        const fromItem = fromInventory?.getItem(FromSlot);
    
        // If no item or no lore, fail gracefully
        if (!fromItem) {
            return { status: CustomCommandStatus.Invalid };
        }
    
        const itemLore = fromItem.getLore();
    
        for (const toEntity of ToEntity) {
            const toInventory = toEntity?.getComponent("minecraft:inventory")?.container;
            const targetItem = toInventory?.getItem(ToSlot);
    
            // Only update if there’s an item in the target slot
            if (targetItem) {
                const clonedItem = targetItem.clone();
                clonedItem.setLore(itemLore);
                toInventory.setItem(ToSlot, clonedItem);
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

function cloneItemFunction(origin, fromEntityArr, fromSlot, toEntityArr, toSlot, amount = 1) {
    system.run(() => {
        try {
            if (!fromEntityArr.length) {
                world.sendMessage("§cError: No source entity provided.");
                return;
            }

            const fromEntity = fromEntityArr[0];
            const fromInventory = fromEntity.getComponent("minecraft:inventory")?.container;
            if (!fromInventory) {
                fromEntity.sendMessage("§cError: Source entity has no inventory.");
                return;
            }

            const sourceItem = fromInventory.getItem(fromSlot);
            if (!sourceItem) {
                fromEntity.sendMessage("§cError: No item in source slot.");
                return;
            }

            // Clone item safely
            const clonedItem = sourceItem.clone();

            // Give to each target entity
            for (const target of toEntityArr) {
                const toInventory = target.getComponent("minecraft:inventory")?.container;
                if (!toInventory) {
                    target.sendMessage("§cError: Target has no inventory.");
                    continue;
                }
                toInventory.setItem(toSlot, clonedItem);
                target.sendMessage(`§aReceived '${sourceItem.typeId}' x${amount} in slot ${toSlot}.`);
            }

            fromEntity.sendMessage(`§aCloned item '${sourceItem.typeId}' x${amount} to ${toEntityArr.length} entities.`);
        } catch (e) {
            world.sendMessage(`§cCloneItemFunction Error: ${e}`);
        }
    });

    return { status: CustomCommandStatus.Success };
}


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

function healFunction(origin, targets = [origin.sourceEntity], healType = "both", playerEntity = false) {
    system.run(() => {
        for (const entity of targets) {
            try {
                const health = entity.getComponent("minecraft:health");
                
                if (healType === "health" || healType === "both") {
                    if (health) {
                        health.setCurrentValue(health.effectiveMax);
                    }
                }
                
                if (healType === "hunger" || healType === "both") {
                    entity.addEffect("saturation", 30, { amplifier: 200});
                }
                
                if (playerEntity) entity.sendMessage("§aYou have been healed!");
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
                const entity = dimension.spawnEntity(entityType.id ?? entityType, location);
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
                origin.sourceEntity.sendMessage(`§aSpawned ${spawnedEntities.length} ${entityType.id ?? entityType} entities`);
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
                entity.applyKnockback({ x: velocityX, z: velocityZ }, strength);
                
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
        
        if (positions.length > 100000) {
            player.sendMessage(`§cBrush too large! ${positions.length} blocks. Maximum 100000 per brush.`);
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
function largeFillFunction(origin, fromLocation, toLocation, block, fillMode = "replace", replaceFilter = "all") {
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
            if (volume > 5000000) {
                player.sendMessage(`§cArea too large! ${volume.toLocaleString()} blocks. Maximum is 5,000,000.`);
                player.sendMessage("§7Consider breaking the fill into smaller sections.");
                return;
            }
            
            if (volume > 100000) {
                player.sendMessage(`§eWarning: Large fill of ${volume.toLocaleString()} blocks. This will take time!`);
            }
            
            // Validate block type
            try {
                BlockPermutation.resolve(block.id);
            } catch (e) {
                player.sendMessage(`§cInvalid block type: ${block?.id}`);
                return;
            }
            
            player.sendMessage(`§aStarting large fill: ${volume.toLocaleString()} blocks`);
            player.sendMessage(`§7Mode: ${fillMode}, Block: ${block.id}`);
            if (fillMode === "replace" && replaceFilter !== "all") {
                player.sendMessage(`§7Replace filter: ${replaceFilter}`);
            }
            
            // Start async fill operation
            performLargeFillAsync(player, fromLocation, toLocation, block.id, fillMode.toLowerCase(), replaceFilter);
            
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
            
            if (volume > 5000000) {
                player.sendMessage(`§cToo large for largefill! Maximum is 5,000,000 blocks.`);
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
function createFigureFunction(origin, figureType, centerLocation, block, size, mode = "solid", rotation = 0, height = null) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player) {
                console.log("Create figure requires a player source");
                return;
            }
            
            // Validate figure type
            const validFigures = ["cube", "sphere", "cylinder", "pyramid"];
            if (!validFigures.includes((figureType?.toLowerCase?.() ?? figureType).toLowerCase())) {
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
                BlockPermutation.resolve(block.id);
            } catch (e) {
                player.sendMessage(`§cInvalid block type: ${block?.id}`);
                return;
            }
            
            // Calculate estimated block count
            const figureTypeStr = (figureType?.toLowerCase?.() ?? figureType).toLowerCase();
            const estimatedBlocks = estimateFigureBlocks(figureTypeStr, size, height, mode.toLowerCase());
            
            if (estimatedBlocks > 100000) {
                player.sendMessage(`§cFigure too large! Estimated ${estimatedBlocks.toLocaleString()} blocks. Maximum is 100,000.`);
                return;
            }
            
            player.sendMessage(`§aCreating ${figureTypeStr} figure...`);
            player.sendMessage(`§7Size: ${size}, Mode: ${mode.toLowerCase()}, Rotation: ${rotation}°`);
            if (["cylinder", "pyramid"].includes(figureTypeStr)) {
                player.sendMessage(`§7Height: ${height}`);
            }
            player.sendMessage(`§7Estimated blocks: ${estimatedBlocks.toLocaleString()}`);
            
            // Start async figure creation
            createFigureAsync(player, figureTypeStr, centerLocation, block.id, size, mode.toLowerCase(), rotation, height);
            
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


// Main gamemode function
function gamemodeFunction(origin, gamemode = "creative", targets = [origin.sourceEntity]) {
    system.run(() => {
        try {
            if (!targets || targets.length === 0) {
                if (origin.sourceEntity) {
                    origin.sourceEntity.sendMessage("§cNo valid targets specified!");
                }
                return;
            }
            
            // Map gamemode names to Minecraft gamemode IDs
            const gamemodeMap = {
                "survival": "s",
                "creative": "c", 
                "adventure": "a",
                "spectator": "spectator",
                "s": "s",
                "c": "c",
                "a": "a",
                "sp": "spectator"
            };
            
            const gamemodeId = gamemodeMap[gamemode.toLowerCase()];
            if (!gamemodeId) {
                if (origin.sourceEntity) {
                    origin.sourceEntity.sendMessage(`§cInvalid gamemode: ${gamemode}`);
                    origin.sourceEntity.sendMessage("§7Valid modes: survival, creative, adventure, spectator");
                }
                return;
            }
            
            let successCount = 0;
            let failCount = 0;
            
            // Apply gamemode to all targets
            for (const target of targets) {
                try {
                    if (target.typeId !== "minecraft:player") {
                        failCount++;
                        continue;
                    }
                    
                    // Use the vanilla gamemode command
                    target.runCommand(`gamemode ${gamemodeId}`);
                    successCount++;
                    
                    // Send confirmation to the target
                    const modeDisplayName = gamemode.charAt(0).toUpperCase() + gamemode.slice(1);
                    target.sendMessage(`§aGamemode set to §e${modeDisplayName}`);
                    
                } catch (e) {
                    console.log(`Failed to set gamemode for ${target.name}: ${e}`);
                    failCount++;
                }
            }
            
            // Send summary to command executor (if different from targets)
            if (origin.sourceEntity && (targets.length > 1 || !targets.includes(origin.sourceEntity))) {
                const modeDisplayName = gamemode.charAt(0).toUpperCase() + gamemode.slice(1);
                
                if (successCount > 0) {
                    origin.sourceEntity.sendMessage(`§aSet gamemode to §e${modeDisplayName} §afor §f${successCount} §aplayer${successCount > 1 ? 's' : ''}`);
                }
                
                if (failCount > 0) {
                    origin.sourceEntity.sendMessage(`§cFailed to change gamemode for §f${failCount} §ctarget${failCount > 1 ? 's' : ''}`);
                }
            }
            
        } catch (e) {
            console.log("Failed to change gamemode: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to change gamemode: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}


// Main boost function
function boostFunction(origin, power, direction = "up", targets = [origin.sourceEntity], location = {x: null, y: null, z: null}) {
    system.run(() => {
        try {
            if (!targets || targets.length === 0) {
                if (origin.sourceEntity) {
                    origin.sourceEntity.sendMessage("§cNo valid targets specified!");
                }
                return;
            }
            
            // Validate power
            if (power < 0.1 || power > 100.0) {
                if (origin.sourceEntity) {
                    origin.sourceEntity.sendMessage("§cPower must be between 0.1 and 10.0!");
                }
                return;
            }
            
            let impulseVector = { x: 0, y: 0, z: 0 };
            
            // Use custom direction if all three components are provided
            if (location.x !== null && location.y !== null && location.z !== null) {
                impulseVector = { x: location.x, y: location.y, z: location.z };
                
                // Normalize and apply power
                const magnitude = Math.sqrt(location.x * location.x + location.y * location.y + location.z * location.z);
                if (magnitude > 0) {
                    impulseVector.x = (location.x / magnitude) * power;
                    impulseVector.y = (location.y / magnitude) * power;
                    impulseVector.z = (location.z / magnitude) * power;
                }
            } else {
                // Use predefined direction
                impulseVector = calculateDirectionVector(origin.sourceEntity, direction, power);
            }
            
            let successCount = 0;
            let failCount = 0;
            
            // Apply boost to all targets
            for (const target of targets) {
                try {
                    // Apply the impulse
                    target.applyImpulse(impulseVector);
                    successCount++;
                    
                    // Visual/audio feedback
                    try {
                        // Spawn boost particles
                        target.dimension.spawnParticle("minecraft:huge_explosion_emitter", {
                            x: target.location.x,
                            y: target.location.y + 1,
                            z: target.location.z
                        });
                        
                        // Play boost sound
                        target.dimension.playSound("firework.launch", target.location, { volume: 0.5, pitch: 1.2 });
                    } catch (e) {
                        // Visual effects failed, but boost still worked
                    }
                    
                    // Send feedback to boosted entity (if it's a player)
                    if (target.typeId === "minecraft:player") {
                        const directionText = location.x !== null ? "custom direction" : direction;
                        target.sendMessage(`§aYou were boosted ${directionText} with power ${power}!`);
                    }
                    
                } catch (e) {
                    console.log(`Failed to boost ${target.typeId}: ${e}`);
                    failCount++;
                }
            }
            
            // Send summary to command executor
            if (origin.sourceEntity) {
                const directionText = location.x !== null ? 
                    `custom (${location.x.toFixed(1)}, ${location.y.toFixed(1)}, ${location.z.toFixed(1)})` : 
                    direction;
                
                if (successCount > 0) {
                    origin.sourceEntity.sendMessage(`§aBoosted §f${successCount} §aentit${successCount > 1 ? 'ies' : 'y'} §a${directionText} with power §f${power}`);
                }
                
                if (failCount > 0) {
                    origin.sourceEntity.sendMessage(`§cFailed to boost §f${failCount} §centit${failCount > 1 ? 'ies' : 'y'}`);
                }
            }
            
        } catch (e) {
            console.log("Failed to execute boost command: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to boost: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Calculate direction vector based on direction name and player facing
function calculateDirectionVector(player, direction, power) {
    let vector = { x: 0, y: 0, z: 0 };
    
    switch (direction.toLowerCase()) {
        case "up":
            vector = { x: 0, y: power, z: 0 };
            break;
            
        case "down":
            vector = { x: 0, y: -power, z: 0 };
            break;
            
        case "forward":
            if (player) {
                const rotation = player.getRotation();
                const yawRadians = (rotation.y * Math.PI) / 180;
                vector = {
                    x: Math.sin(yawRadians) * power,
                    y: 0,
                    z: -Math.cos(yawRadians) * power
                };
            } else {
                vector = { x: 0, y: 0, z: -power }; // Default forward (north)
            }
            break;
            
        case "backward":
            if (player) {
                const rotation = player.getRotation();
                const yawRadians = (rotation.y * Math.PI) / 180;
                vector = {
                    x: -Math.sin(yawRadians) * power,
                    y: 0,
                    z: Math.cos(yawRadians) * power
                };
            } else {
                vector = { x: 0, y: 0, z: power }; // Default backward (south)
            }
            break;
            
        case "left":
            if (player) {
                const rotation = player.getRotation();
                const yawRadians = (rotation.y * Math.PI) / 180;
                vector = {
                    x: -Math.cos(yawRadians) * power,
                    y: 0,
                    z: -Math.sin(yawRadians) * power
                };
            } else {
                vector = { x: -power, y: 0, z: 0 }; // Default left (west)
            }
            break;
            
        case "right":
            if (player) {
                const rotation = player.getRotation();
                const yawRadians = (rotation.y * Math.PI) / 180;
                vector = {
                    x: Math.cos(yawRadians) * power,
                    y: 0,
                    z: Math.sin(yawRadians) * power
                };
            } else {
                vector = { x: power, y: 0, z: 0 }; // Default right (east)
            }
            break;
            
        default:
            vector = { x: 0, y: power, z: 0 }; // Default to up
    }
    
    return vector;
}


function removeFunction(origin, entities, log = false) {
    system.run(() => {
        let logEntity = [];
        for (const entity of entities) {
            if (entity.typeId == "minecraft:player") continue;
            logEntity.push(entity.typeId);
            entity.remove();
        }
        if (log) {
            origin.sourceEntity.sendMessage(`§2${logEntity.length} entities was removed.\n§eEntities:\n${logEntity.join(", ")}`);
        } else {
            origin.sourceEntity.sendMessage("§2Removed entities: " + logEntity.length);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}


// Main surface function
function surfaceFunction(origin, mode, centerPosition, radius, blockType, maxH= 6, minH = 4, replaceBelow = false, useMainhand = false) {
    system.run(() => {
        try {
            const minHeight = centerPosition.y - minH;
            const maxHeight = centerPosition.y + maxH;
            const player = origin.sourceEntity;
            if (!player) {
                console.log("Surface command requires a player source");
                return;
            }
            
            // Validate radius
            if (radius < 1 || radius > 100) {
                player.sendMessage("§cRadius must be between 1 and 100!");
                return;
            }
            
            // Validate height range
            if (minHeight > maxHeight) {
                player.sendMessage("§cMin height cannot be greater than max height!");
                return;
            }
            
            if (maxHeight > 320 || minHeight < -64) {
                player.sendMessage("§cHeight must be between -64 and 320!");
                return;
            }
            
            // Get blocks to use
            let blocksToUse = [];
            
            if (useMainhand) {
                const blocks = getMainhandBlocks(player);
                if (!blocks || blocks.length === 0) {
                    player.sendMessage("§cNo valid blocks in mainhand! Hold a block or multi-block item.");
                    return;
                }
                blocksToUse = blocks;
            } else {
                // Validate block type
                try {
                    BlockPermutation.resolve(blockType.id);
                    blocksToUse = [blockType.id];
                } catch (e) {
                    player.sendMessage(`§cInvalid block type: ${blockType.id}`);
                    return;
                }
            }
            
            // Calculate estimated area
            const estimatedArea = mode === "circle" 
                ? Math.floor(Math.PI * radius * radius)
                : (radius * 2 + 1) * (radius * 2 + 1);
            
            if (estimatedArea > 500000) {
                player.sendMessage(`§cSurface area too large! ${estimatedArea.toLocaleString()} positions. Maximum is 500,000.`);
                return;
            }
            
            player.sendMessage(`§aStarting surface creation...`);
            player.sendMessage(`§7Mode: ${mode}, Radius: ${radius}, Area: ~${estimatedArea.toLocaleString()} positions`);
            player.sendMessage(`§7Height range: ${minHeight} to ${maxHeight}`);
            player.sendMessage(`§7Replace ${replaceBelow ? "below" : "at"} surface level`);
            
            if (useMainhand) {
                player.sendMessage(`§7Using ${blocksToUse.length} block type${blocksToUse.length > 1 ? 's' : ''} from mainhand`);
            } else {
                player.sendMessage(`§7Using block: ${blockType}`);
            }
            
            // Start async surface creation
            createSurfaceAsync(player, mode, centerPosition, radius, blocksToUse, maxHeight, minHeight, replaceBelow);
            
        } catch (e) {
            console.log("Failed to create surface: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to create surface: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Get blocks from player's mainhand
function getMainhandBlocks(player) {
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

// Create surface asynchronously
function createSurfaceAsync(player, mode, centerPosition, radius, blocksToUse, maxHeight, minHeight, replaceBelow) {
    const surfaceState = {
        player: player,
        dimension: player.dimension,
        mode: mode,
        centerPosition: centerPosition,
        radius: radius,
        blocksToUse: blocksToUse,
        maxHeight: maxHeight,
        minHeight: minHeight,
        replaceBelow: replaceBelow,
        
        // Generate positions to check
        positions: [],
        currentIndex: 0,
        
        // Progress tracking
        positionsProcessed: 0,
        blocksPlaced: 0,
        positionsSkipped: 0,
        positionsFailed: 0,
        startTime: Date.now(),
        
        // Control
        intervalId: null
    };
    
    // Generate all positions within the shape
    surfaceState.positions = generateSurfacePositions(surfaceState);
    
    if (surfaceState.positions.length === 0) {
        player.sendMessage("§cNo valid positions found for surface creation!");
        return;
    }
    
    player.sendMessage(`§7Processing ${surfaceState.positions.length} positions...`);
    
    // Start processing
    surfaceState.intervalId = system.runInterval(() => {
        processSurfaceBatch(surfaceState);
    }, 1);
}

// Generate positions based on surface mode
function generateSurfacePositions(surfaceState) {
    const positions = [];
    const { mode, centerPosition, radius } = surfaceState;
    
    if (mode === "circle") {
        // Generate circle positions
        for (let x = -radius; x <= radius; x++) {
            for (let z = -radius; z <= radius; z++) {
                const distance = Math.sqrt(x * x + z * z);
                if (distance <= radius) {
                    positions.push({
                        x: centerPosition.x + x,
                        z: centerPosition.z + z
                    });
                }
            }
        }
    } else if (mode === "square") {
        // Generate square positions
        for (let x = -radius; x <= radius; x++) {
            for (let z = -radius; z <= radius; z++) {
                positions.push({
                    x: centerPosition.x + x,
                    z: centerPosition.z + z
                });
            }
        }
    }
    
    return positions;
}

// Process batch of surface positions
function processSurfaceBatch(surfaceState) {
    const batchSize = 500; // Positions per tick
    let processed = 0;
    
    while (processed < batchSize && surfaceState.currentIndex < surfaceState.positions.length) {
        const position = surfaceState.positions[surfaceState.currentIndex];
        
        // Find surface level for this X,Z position
        const surfaceResult = findSurfaceLevel(surfaceState, position.x, position.z);
        
        if (surfaceResult.found) {
            // Place block at or below surface
            const targetY = surfaceState.replaceBelow ? surfaceResult.y : surfaceResult.y + 1;
            const blockPosition = { x: position.x, y: targetY, z: position.z };
            
            try {
                const randomBlock = surfaceState.blocksToUse[Math.floor(Math.random() * surfaceState.blocksToUse.length)];
                const blockPermutation = BlockPermutation.resolve(randomBlock);
                surfaceState.dimension.setBlockPermutation(blockPosition, blockPermutation);
                surfaceState.blocksPlaced++;
            } catch (e) {
                surfaceState.positionsFailed++;
                console.log(`Failed to place surface block at ${blockPosition.x},${blockPosition.y},${blockPosition.z}: ${e}`);
            }
        } else {
            surfaceState.positionsSkipped++;
        }
        
        surfaceState.positionsProcessed++;
        surfaceState.currentIndex++;
        processed++;
    }
    
    // Show progress updates
    if (surfaceState.positionsProcessed % 500 === 0 || surfaceState.currentIndex >= surfaceState.positions.length) {
        const progress = Math.round((surfaceState.currentIndex / surfaceState.positions.length) * 100);
        const elapsed = Math.round((Date.now() - surfaceState.startTime) / 1000);
        
        surfaceState.player.sendMessage(
            `§7Progress: ${progress}% (${surfaceState.currentIndex}/${surfaceState.positions.length}) - ${elapsed}s`
        );
    }
    
    // Check if complete
    if (surfaceState.currentIndex >= surfaceState.positions.length) {
        finishSurfaceCreation(surfaceState);
    }
}

// Find surface level at given X,Z coordinates
function findSurfaceLevel(surfaceState, x, z) {
    const { dimension, maxHeight, minHeight } = surfaceState;
    
    // Scan from top to bottom to find the first non-air block
    for (let y = maxHeight; y >= minHeight; y--) {
        try {
            const block = dimension.getBlock({ x, y, z });
            if (block.typeId !== "minecraft:air") {
                return { found: true, y: y };
            }
        } catch (e) {
            // Block read failed, skip this position
            continue;
        }
    }
    
    return { found: false, y: minHeight };
}

// Finish surface creation
function finishSurfaceCreation(surfaceState) {
    const elapsed = Math.round((Date.now() - surfaceState.startTime) / 1000);
    const rate = elapsed > 0 ? Math.round(surfaceState.positionsProcessed / elapsed) : 0;
    
    surfaceState.player.sendMessage(`§aSurface creation complete!`);
    surfaceState.player.sendMessage(`§7Mode: ${surfaceState.mode}, Radius: ${surfaceState.radius}`);
    surfaceState.player.sendMessage(`§7Positions processed: ${surfaceState.positionsProcessed.toLocaleString()}`);
    surfaceState.player.sendMessage(`§7Blocks placed: ${surfaceState.blocksPlaced}, Skipped: ${surfaceState.positionsSkipped}, Failed: ${surfaceState.positionsFailed}`);
    surfaceState.player.sendMessage(`§7Time: ${elapsed}s (${rate} positions/s)`);
    
    if (surfaceState.blocksToUse.length > 1) {
        surfaceState.player.sendMessage(`§7Used ${surfaceState.blocksToUse.length} different block types`);
    } else {
        surfaceState.player.sendMessage(`§7Block used: ${surfaceState.blocksToUse[0]}`);
    }
    
    system.clearRun(surfaceState.intervalId);
}



// Main plain function
function plainFunction(origin, centerPosition, radius, mode, maxHeight = 320) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player) {
                console.log("Plain command requires a player source");
                return;
            }
            
            // Validate radius
            if (radius < 1 || radius > 100) {
                player.sendMessage("§cRadius must be between 1 and 100!");
                return;
            }
            
            // Validate max height
            if (maxHeight < centerPosition.y || maxHeight > 320) {
                player.sendMessage(`§cMax height must be between ${centerPosition.y} and 320!`);
                return;
            }
            
            // Calculate estimated positions
            let estimatedPositions = 0;
            switch (mode) {
                case "circle":
                    estimatedPositions = Math.floor(Math.PI * radius * radius);
                    break;
                case "square":
                    estimatedPositions = (radius * 2 + 1) * (radius * 2 + 1);
                    break;
                case "triangle":
                    estimatedPositions = Math.floor((radius * radius * Math.PI) / 2);
                    break;
            }
            
            // Estimate total blocks to remove (positions × average height)
            const avgHeight = Math.max(1, maxHeight - centerPosition.y);
            const estimatedBlocks = estimatedPositions * avgHeight;
            
            if (estimatedBlocks > 1000000) {
                player.sendMessage(`§cPlain area too large! Estimated ${estimatedBlocks.toLocaleString()} blocks. Maximum is 1000,000.`);
                player.sendMessage("§7Try smaller radius or lower max height.");
                return;
            }
            
            if (estimatedBlocks > 100000) {
                player.sendMessage(`§eWarning: Large plain operation! Estimated ${estimatedBlocks.toLocaleString()} blocks to remove.`);
            }
            
            player.sendMessage(`§aStarting plain creation...`);
            player.sendMessage(`§7Mode: ${mode}, Radius: ${radius}, Max height: ${maxHeight}`);
            player.sendMessage(`§7Center height: ${centerPosition.y}, Estimated positions: ${estimatedPositions.toLocaleString()}`);
            player.sendMessage(`§7This will remove all blocks above ground level in the specified area.`);
            
            // Start async plain creation
            createPlainAsync(player, centerPosition, radius, mode, maxHeight);
            
        } catch (e) {
            console.log("Failed to create plain: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to create plain: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Create plain asynchronously
function createPlainAsync(player, centerPosition, radius, mode, maxHeight) {
    const plainState = {
        player: player,
        dimension: player.dimension,
        centerPosition: centerPosition,
        radius: radius,
        mode: mode,
        maxHeight: maxHeight,
        
        // Generate positions to process
        positions: [],
        currentIndex: 0,
        
        // Progress tracking
        positionsProcessed: 0,
        blocksRemoved: 0,
        positionsSkipped: 0,
        blocksFailed: 0,
        startTime: Date.now(),
        
        // Control
        intervalId: null
    };
    
    // Generate all X,Z positions within the shape
    plainState.positions = generatePlainPositions(plainState);
    
    if (plainState.positions.length === 0) {
        player.sendMessage("§cNo valid positions found for plain creation!");
        return;
    }
    
    player.sendMessage(`§7Processing ${plainState.positions.length} positions...`);
    
    // Start processing
    plainState.intervalId = system.runInterval(() => {
        processPlainBatch(plainState);
    }, 1);
}

// Generate positions based on plain mode
function generatePlainPositions(plainState) {
    const positions = [];
    const { mode, centerPosition, radius } = plainState;
    
    switch (mode) {
        case "circle":
            // Generate circle positions
            for (let x = -radius; x <= radius; x++) {
                for (let z = -radius; z <= radius; z++) {
                    const distance = Math.sqrt(x * x + z * z);
                    if (distance <= radius) {
                        positions.push({
                            x: centerPosition.x + x,
                            z: centerPosition.z + z
                        });
                    }
                }
            }
            break;
            
        case "square":
            // Generate square positions
            for (let x = -radius; x <= radius; x++) {
                for (let z = -radius; z <= radius; z++) {
                    positions.push({
                        x: centerPosition.x + x,
                        z: centerPosition.z + z
                    });
                }
            }
            break;
            
        case "triangle":
            // Generate triangle positions (equilateral triangle pointing north)
            for (let x = -radius; x <= radius; x++) {
                for (let z = -radius; z <= radius; z++) {
                    if (isInTriangle(x, z, radius)) {
                        positions.push({
                            x: centerPosition.x + x,
                            z: centerPosition.z + z
                        });
                    }
                }
            }
            break;
    }
    
    return positions;
}

// Check if point is inside triangle
function isInTriangle(x, z, radius) {
    // Equilateral triangle pointing north
    // Vertices at: (0, -radius), (-radius*sqrt(3)/2, radius/2), (radius*sqrt(3)/2, radius/2)
    
    const height = radius * Math.sqrt(3) / 2;
    
    // Point 1: (0, -radius) - top point
    // Point 2: (-height, radius/2) - bottom left
    // Point 3: (height, radius/2) - bottom right
    
    const p1x = 0, p1z = -radius;
    const p2x = -height, p2z = radius / 2;
    const p3x = height, p3z = radius / 2;
    
    // Use barycentric coordinates to check if point is inside triangle
    const denom = (p2z - p3z) * (p1x - p3x) + (p3x - p2x) * (p1z - p3z);
    const a = ((p2z - p3z) * (x - p3x) + (p3x - p2x) * (z - p3z)) / denom;
    const b = ((p3z - p1z) * (x - p3x) + (p1x - p3x) * (z - p3z)) / denom;
    const c = 1 - a - b;
    
    return a >= 0 && b >= 0 && c >= 0;
}

// Process batch of plain positions
function processPlainBatch(plainState) {
    const batchSize = 25; // Positions per tick (each position processes multiple Y levels)
    let processed = 0;
    
    while (processed < batchSize && plainState.currentIndex < plainState.positions.length) {
        const position = plainState.positions[plainState.currentIndex];
        
        // Process this X,Z column from center Y up to max height
        const result = processPlainColumn(plainState, position.x, position.z);
        
        plainState.blocksRemoved += result.removed;
        plainState.blocksFailed += result.failed;
        
        if (result.removed > 0 || result.failed > 0) {
            plainState.positionsProcessed++;
        } else {
            plainState.positionsSkipped++;
        }
        
        plainState.currentIndex++;
        processed++;
    }
    
    // Show progress updates
    if (plainState.currentIndex % 200 === 0 || plainState.currentIndex >= plainState.positions.length) {
        const progress = Math.round((plainState.currentIndex / plainState.positions.length) * 100);
        const elapsed = Math.round((Date.now() - plainState.startTime) / 1000);
        const rate = elapsed > 0 ? Math.round(plainState.blocksRemoved / elapsed) : 0;
        
        plainState.player.sendMessage(
            `§7Progress: ${progress}% (${plainState.currentIndex}/${plainState.positions.length}) - ${plainState.blocksRemoved.toLocaleString()} removed - ${rate}/s - ${elapsed}s`
        );
    }
    
    // Check if complete
    if (plainState.currentIndex >= plainState.positions.length) {
        finishPlainCreation(plainState);
    }
}

// Process a single X,Z column for plain creation
function processPlainColumn(plainState, x, z) {
    let removed = 0;
    let failed = 0;
    
    // Remove blocks from center Y + 1 up to max height
    const startY = plainState.centerPosition.y + 1;
    
    for (let y = startY; y <= plainState.maxHeight; y++) {
        const blockPos = { x, y, z };
        
        try {
            const block = plainState.dimension.getBlock(blockPos);
            
            // Only remove if it's not already air
            if (block.typeId !== "minecraft:air") {
                plainState.dimension.setBlockPermutation(blockPos, BlockPermutation.resolve("minecraft:air"));
                removed++;
            }
        } catch (e) {
            failed++;
            console.log(`Failed to remove block at ${x},${y},${z}: ${e}`);
        }
    }
    
    return { removed, failed };
}

// Finish plain creation
function finishPlainCreation(plainState) {
    const elapsed = Math.round((Date.now() - plainState.startTime) / 1000);
    const rate = elapsed > 0 ? Math.round(plainState.blocksRemoved / elapsed) : 0;
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    
    plainState.player.sendMessage(`§aPlain creation complete!`);
    plainState.player.sendMessage(`§7Mode: ${plainState.mode}, Radius: ${plainState.radius}, Max height: ${plainState.maxHeight}`);
    plainState.player.sendMessage(`§7Positions processed: ${plainState.positionsProcessed.toLocaleString()}, Skipped: ${plainState.positionsSkipped.toLocaleString()}`);
    plainState.player.sendMessage(`§7Blocks removed: ${plainState.blocksRemoved.toLocaleString()}, Failed: ${plainState.blocksFailed.toLocaleString()}`);
    plainState.player.sendMessage(`§7Time: ${timeStr} (${rate.toLocaleString()} blocks/s)`);
    plainState.player.sendMessage(`§7Area cleared above height ${plainState.centerPosition.y}`);
    
    system.clearRun(plainState.intervalId);
}


// Main get world info function
function getWorldInfoFunction(origin, infoType) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player) {
                console.log("Get world info requires a player source");
                return;
            }
            
            switch (infoType.toLowerCase()) {
                case "time":
                    showTimeInfo(player);
                    break;
                case "day":
                    showDayInfo(player);
                    break;
                case "moonphase":
                    showMoonPhaseInfo(player);
                    break;
                case "players":
                    showPlayersInfo(player);
                    break;
                case "difficulty":
                    showDifficultyInfo(player);
                    break;
                case "absolutetime":
                    showAbsoluteTimeInfo(player);
                    break;
                case "weather":
                    showWeatherInfo(player);
                    break;
                case "spawn":
                    showSpawnInfo(player);
                    break;
                case "entities":
                    showEntitiesInfo(player);
                    break;
                case "dimensions":
                    showDimensionsInfo(player);
                    break;
                case "all":
                    showAllInfo(player);
                    break;
                default:
                    player.sendMessage(`§cInvalid info type: ${infoType}`);
                    break;
            }
            
        } catch (e) {
            console.log("Failed to get world info: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to get world info: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Show time information
function showTimeInfo(player) {
    try {
        const timeOfDay = world.getTimeOfDay();
        const timeFormatted = formatMinecraftTime(timeOfDay);
        const timePhase = getTimePhase(timeOfDay);
        
        player.sendMessage("§a--- Time Information ---");
        player.sendMessage(`§7Time of Day: §f${timeOfDay} ticks`);
        player.sendMessage(`§7Formatted Time: §f${timeFormatted}`);
        player.sendMessage(`§7Time Phase: §f${timePhase}`);
        player.sendMessage(`§7Progress to Night: §f${Math.round((timeOfDay / 24000) * 100)}%`);
        
    } catch (e) {
        player.sendMessage("§cFailed to get time information");
        console.log("Time info error: " + e);
    }
}

// Show day information
function showDayInfo(player) {
    try {
        const absoluteTime = world.getAbsoluteTime();
        const currentDay = Math.floor(absoluteTime / 24000) + 1;
        const timeOfDay = world.getTimeOfDay();
        
        player.sendMessage("§a--- Day Information ---");
        player.sendMessage(`§7Current Day: §f${currentDay}`);
        player.sendMessage(`§7Day Progress: §f${Math.round((timeOfDay / 24000) * 100)}%`);
        player.sendMessage(`§7Days Since World Creation: §f${currentDay - 1}`);
        
    } catch (e) {
        player.sendMessage("§cFailed to get day information");
        console.log("Day info error: " + e);
    }
}

// Show moon phase information
function showMoonPhaseInfo(player) {
    try {
        const moonPhase = world.getMoonPhase();
        const moonPhaseName = getMoonPhaseName(moonPhase);
        const moonPhaseDescription = getMoonPhaseDescription(moonPhase);
        
        player.sendMessage("§a--- Moon Phase Information ---");
        player.sendMessage(`§7Moon Phase: §f${moonPhase}`);
        player.sendMessage(`§7Phase Name: §f${moonPhaseName}`);
        player.sendMessage(`§7Description: §f${moonPhaseDescription}`);
        player.sendMessage(`§7Monster Spawn Rate: §f${getMoonPhaseSpawnRate(moonPhase)}`);
        
    } catch (e) {
        player.sendMessage("§cFailed to get moon phase information");
        console.log("Moon phase info error: " + e);
    }
}

// Show players information
function showPlayersInfo(player) {
    try {
        const allPlayers = world.getAllPlayers();
        const onlinePlayers = allPlayers.filter(p => p.isValid);
        
        player.sendMessage("§a--- Players Information ---");
        player.sendMessage(`§7Total Players Online: §f${onlinePlayers.length}`);
        
        if (onlinePlayers.length > 0) {
            player.sendMessage("§7Online Players:");
            for (let i = 0; i < Math.min(onlinePlayers.length, 20); i++) { // Limit to 20 to avoid spam
                const p = onlinePlayers[i];
                const dimension = getDimensionName(p.dimension.id);
                const gamemode = getPlayerGamemode(p);
                player.sendMessage(`  §f${p.name} §7(${dimension}, ${gamemode})`);
            }
            
            if (onlinePlayers.length > 20) {
                player.sendMessage(`  §7... and ${onlinePlayers.length - 20} more players`);
            }
        }
        
    } catch (e) {
        player.sendMessage("§cFailed to get players information");
        console.log("Players info error: " + e);
    }
}

// Show difficulty information
function showDifficultyInfo(player) {
    try {
        // Note: Difficulty info might not be directly accessible via API
        // This is a placeholder implementation
        player.sendMessage("§a--- Difficulty Information ---");
        player.sendMessage("§7World Difficulty: §fNot directly accessible via API");
        player.sendMessage("§7Mob Spawning: §fEnabled (assumed)");
        player.sendMessage("§7Mob Griefing: §fUse /gamerule mobGriefing to check");
        player.sendMessage("§7Keep Inventory: §fUse /gamerule keepInventory to check");
        
    } catch (e) {
        player.sendMessage("§cFailed to get difficulty information");
        console.log("Difficulty info error: " + e);
    }
}

// Show absolute time information
function showAbsoluteTimeInfo(player) {
    try {
        const absoluteTime = world.getAbsoluteTime();
        const totalDays = Math.floor(absoluteTime / 24000);
        const currentDayTime = absoluteTime % 24000;
        const realTimeElapsed = calculateRealTimeElapsed(absoluteTime);
        
        player.sendMessage("§a--- Absolute Time Information ---");
        player.sendMessage(`§7Absolute Time: §f${absoluteTime.toLocaleString()} ticks`);
        player.sendMessage(`§7Total Days Elapsed: §f${totalDays}`);
        player.sendMessage(`§7Current Day Time: §f${currentDayTime} ticks`);
        player.sendMessage(`§7Estimated Real Time: §f${realTimeElapsed}`);
        player.sendMessage(`§7World Age: §f${Math.round(absoluteTime / 1200)} minutes`);
        
    } catch (e) {
        player.sendMessage("§cFailed to get absolute time information");
        console.log("Absolute time info error: " + e);
    }
}

// Show weather information
function showWeatherInfo(player) {
    try {
        // Note: Weather info might require dimension-specific queries
        const dimension = player.dimension;
        
        player.sendMessage("§a--- Weather Information ---");
        player.sendMessage(`§7Current Dimension: §f${getDimensionName(dimension.id)}`);
        player.sendMessage("§7Weather: §fAPI access limited");
        player.sendMessage("§7Use vanilla /weather query for detailed info");
        
    } catch (e) {
        player.sendMessage("§cFailed to get weather information");
        console.log("Weather info error: " + e);
    }
}

// Show spawn information
function showSpawnInfo(player) {
    try {
        const spawnPoint = world.getDefaultSpawnLocation();
        
        player.sendMessage("§a--- Spawn Information ---");
        player.sendMessage(`§7World Spawn: §f${spawnPoint.x}, ${spawnPoint.y}, ${spawnPoint.z}`);
        player.sendMessage(`§7Your Location: §f${Math.floor(player.location.x)}, ${Math.floor(player.location.y)}, ${Math.floor(player.location.z)}`);
        
        // Calculate distance to spawn
        const distance = Math.sqrt(
            Math.pow(player.location.x - spawnPoint.x, 2) +
            Math.pow(player.location.z - spawnPoint.z, 2)
        );
        player.sendMessage(`§7Distance to Spawn: §f${Math.round(distance)} blocks`);
        
    } catch (e) {
        player.sendMessage("§cFailed to get spawn information");
        console.log("Spawn info error: " + e);
    }
}

// Show entities information
function showEntitiesInfo(player) {
    try {
        const dimension = player.dimension;
        const nearbyEntities = dimension.getEntities({ maxDistance: 100, location: player.location });
        const allEntities = dimension.getEntities();
        
        // Count entities by type
        const entityCounts = {};
        for (const entity of allEntities) {
            const type = entity.typeId;
            entityCounts[type] = (entityCounts[type] || 0) + 1;
        }
        
        player.sendMessage("§a--- Entities Information ---");
        player.sendMessage(`§7Total Entities in Dimension: §f${allEntities.length}`);
        player.sendMessage(`§7Entities within 100 blocks: §f${nearbyEntities.length}`);
        
        // Show top entity types
        const sortedEntities = Object.entries(entityCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
        
        if (sortedEntities.length > 0) {
            player.sendMessage("§7Top Entity Types:");
            for (const [type, count] of sortedEntities) {
                const simpleName = type.replace("minecraft:", "");
                player.sendMessage(`  §f${simpleName}: §7${count}`);
            }
        }
        
    } catch (e) {
        player.sendMessage("§cFailed to get entities information");
        console.log("Entities info error: " + e);
    }
}

// Show dimensions information
function showDimensionsInfo(player) {
    try {
        const currentDimension = getDimensionName(player.dimension.id);
        
        player.sendMessage("§a--- Dimensions Information ---");
        player.sendMessage(`§7Current Dimension: §f${currentDimension}`);
        player.sendMessage("§7Available Dimensions:");
        player.sendMessage("  §fOverworld §7(minecraft:overworld)");
        player.sendMessage("  §fNether §7(minecraft:nether)");
        player.sendMessage("  §fEnd §7(minecraft:the_end)");
        
        // Show current dimension details
        const dim = player.dimension;
        player.sendMessage(`§7Current Dimension ID: §f${dim.id}`);
        
    } catch (e) {
        player.sendMessage("§cFailed to get dimensions information");
        console.log("Dimensions info error: " + e);
    }
}

// Show all information
function showAllInfo(player) {
    player.sendMessage("§e=== WORLD INFORMATION SUMMARY ===");
    showTimeInfo(player);
    player.sendMessage("");
    showDayInfo(player);
    player.sendMessage("");
    showMoonPhaseInfo(player);
    player.sendMessage("");
    showPlayersInfo(player);
    player.sendMessage("");
    showSpawnInfo(player);
    player.sendMessage("");
    showEntitiesInfo(player);
    player.sendMessage("");
    showDimensionsInfo(player);
    player.sendMessage("§e=== END SUMMARY ===");
}

// Helper functions
function formatMinecraftTime(ticks) {
    const totalMinutes = Math.floor((ticks + 6000) / 1000 * 60 / 60); // Offset by 6000 for 6 AM start
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function getTimePhase(ticks) {
    if (ticks >= 23000 || ticks < 1000) return "Night";
    if (ticks >= 1000 && ticks < 6000) return "Morning";
    if (ticks >= 6000 && ticks < 12000) return "Day";
    if (ticks >= 12000 && ticks < 18000) return "Afternoon";
    if (ticks >= 18000 && ticks < 23000) return "Evening";
    return "Unknown";
}

function getMoonPhaseName(phase) {
    const phases = [
        "Full Moon", "Waning Gibbous", "Third Quarter", "Waning Crescent",
        "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous"
    ];
    return phases[phase] || "Unknown";
}

function getMoonPhaseDescription(phase) {
    const descriptions = [
        "Brightest night, highest mob spawn rate",
        "Bright night, high mob spawn rate",
        "Moderate lighting, normal spawn rate",
        "Dim night, reduced spawn rate",
        "Darkest night, lowest mob spawn rate",
        "Dim night, reduced spawn rate",
        "Moderate lighting, normal spawn rate",
        "Bright night, high mob spawn rate"
    ];
    return descriptions[phase] || "Unknown effect";
}

function getMoonPhaseSpawnRate(phase) {
    // Moon phase affects spawn rates (0 = full moon = highest)
    const rates = ["Maximum", "High", "Normal", "Reduced", "Minimum", "Reduced", "Normal", "High"];
    return rates[phase] || "Unknown";
}

function getDimensionName(dimensionId) {
    switch (dimensionId) {
        case "minecraft:overworld": return "Overworld";
        case "minecraft:nether": return "Nether";
        case "minecraft:the_end": return "End";
        default: return dimensionId;
    }
}

function getPlayerGamemode(player) {
    // This would require access to player gamemode, which might not be directly available
    return "Unknown"; // Placeholder
}

function calculateRealTimeElapsed(absoluteTime) {
    // 20 ticks per second in Minecraft
    const seconds = Math.floor(absoluteTime / 20);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    } else {
        return `${remainingSeconds}s`;
    }
}


// Global storage for vein tool states
const VEIN_TOOL_STATES = new Map(); // playerId -> { corners: [], breakCount: 0 }

// Main get vein tool function
function getVeinToolFunction(origin) {
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

// Event handler for vein tool right-click (mark exits)
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

function clearVeinToolFunction(origin) {
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

function veinToolInfoFunction(origin) {
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
function generateVeinsFunction(origin) {
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


function hiddenBlocksFunction(origin) {
    system.run(() => {
        const player = origin.sourceEntity;
        
        const hiddenBlocks = [
            {
                id: "minecraft:command_block",
                name: "Command Block",
                texture: "textures/blocks/command_block"
            },
            {
                id: "minecraft:chain_command_block",
                name: "Chain Command Block",
                texture: "textures/blocks/chain_command_block_front_mipmap"
            },
            {
                id: "minecraft:repeating_command_block",
                name: "Repeating Command Block",
                texture: "textures/blocks/repeating_command_block_front_mipmap"
            },
            {
                id: "minecraft:barrier",
                name: "Barrier",
                texture: "textures/blocks/barrier"
            },
            {
                id: "minecraft:structure_block",
                name: "Structure Block",
                texture: "textures/blocks/structure_block"
            },
            {
                id: "minecraft:jigsaw",
                name: "Jigsaw Block",
                texture: "textures/blocks/jigsaw_front"
            },
            {
                id: "minecraft:structure_void",
                name: "Structure Void",
                texture: "textures/blocks/structure_void"
            },
            {
                id: "minecraft:allow",
                name: "Allow",
                texture: "textures/blocks/build_allow"
            },
            {
                id: "minecraft:deny",
                name: "Deny",
                texture: "textures/blocks/build_deny"
            },
            {
                id: "minecraft:border_block",
                name: "Border Block",
                texture: "textures/blocks/border"
            },
            {
                id: "minecraft:light_block",
                name: "Light Block",
                texture: "textures/items/light_block_15" // 0-15 variants
            }
        ];
        
        const form = new ActionFormData()
            .title("§5HIDDEN BLOCKS");
        
        for (const block of hiddenBlocks) {
            form.button(block.name, block.texture);
        }
        
        form.show(player).then((r) => {
            if (!r.canceled) {
                player.runCommand(`give @s ${hiddenBlocks[r.selection].id} 1 0`);
                player.sendMessage(`You can get this block by using\n§e/give @s ${hiddenBlocks[r.selection].id}`);
            }
        });
    });
    
    return { status: CustomCommandStatus.Success };
}


// Complete copy entity tool function
function copyEntityToolFunction(origin) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") {
                console.log("Get copy entity tool requires a player");
                return;
            }
            
            createCopyEntityTool(player);
            
        } catch (e) {
            console.log("Failed to create copy entity tool: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to create copy entity tool: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Create copy entity tool
function createCopyEntityTool(player) {
    try {
        const equippable = player.getComponent("minecraft:equippable");
        
        // Create copy entity tool (lead with special lore)
        const copyTool = new ItemStack("minecraft:golden_sword", 1);
        copyTool.nameTag = "§aCopy Entity Tool";
        
        const loreLines = [
            "§7Right-click entities to copy them",
            "§7Right-click blocks to spawn copied entity",
            "§8§l--- COPIED ENTITIES ---",
            "§7No entities copied yet"
        ];
        
        copyTool.setLore(loreLines);
        
        equippable.setEquipment(EquipmentSlot.Mainhand, copyTool);
        
        player.sendMessage("§aCopy Entity Tool created!");
        player.sendMessage("§7Right-click entities to copy, right-click blocks to spawn");
        
    } catch (e) {
        player.sendMessage(`§cFailed to create copy entity tool: ${e}`);
        console.log("Failed to create copy entity tool: " + e);
    }
}

// Generate random 5-character base64 string for entity code
function generateEntityCode(length = 5) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Extract entity data for copying
function extractEntityData(entity) {
    const data = {
        typeId: entity.typeId,
        nameTag: entity.nameTag || "",
        health: null,
        maxHealth: null,
        tags: [],
        effects: []
    };
    
    try {
        // Get health info
        const health = entity.getComponent("minecraft:health");
        if (health) {
            data.health = health.currentValue;
            data.maxHealth = health.effectiveMax;
        }
    } catch (e) {
        // Health component not available
    }
    
    try {
        // Get tags
        data.tags = entity.getTags();
    } catch (e) {
        // Tags not available
    }
    
    try {
        // Get effects
        const effects = entity.getEffects();
        for (const effect of effects) {
            data.effects.push({
                type: effect.typeId,
                duration: effect.duration,
                amplifier: effect.amplifier
            });
        }
    } catch (e) {
        // Effects not available
    }
    
    return data;
}

// Create lore from entity data
function createEntityLore(entityData, entityCode) {
    const lore = [];
    
    // Basic info
    lore.push(`§6Code: §f${entityCode}`);
    lore.push(`§7Type: §f${entityData.typeId.replace("minecraft:", "")}`);
    
    if (entityData.nameTag) {
        lore.push(`§7Name: §f${entityData.nameTag}`);
    }
    
    // Health info
    if (entityData.health !== null) {
        lore.push(`§7Health: §f${Math.round(entityData.health)}/${Math.round(entityData.maxHealth)}`);
    }
    
    // Tags
    if (entityData.tags.length > 0) {
        lore.push(`§7Tags: §f${entityData.tags.slice(0, 5).join(", ")}${entityData.tags.length > 5 ? "..." : ""}`);
    }
    
    // Effects
    if (entityData.effects.length > 0) {
        const effectNames = entityData.effects.slice(0, 5).map(effect => 
            effect.type.replace("minecraft:", "") + (effect.amplifier > 0 ? ` ${effect.amplifier + 1}` : "")
        );
        lore.push(`§7Effects: §f${effectNames.join(", ")}${entityData.effects.length > 2 ? "..." : ""}`);
    }
    
    return lore;
}

// Save entity data as structure
function saveEntityStructure(player, entityData, entityCode, entity) {
    try {
        ///structure save zombie ~~~~~~ true disk false
        player.runCommand(`structure save ${entityCode} ${entity.location.x} ${entity.location.y} ${entity.location.z} ${entity.location.x} ${entity.location.y} ${entity.location.z} true disk false`);
        player.sendMessage(`§aEntity saved with code: §e${entityCode}`);
            
        return true;
        
    } catch (e) {
        console.log(`Failed to save entity structure: ${e}`);
        return false;
    }
}

// Load entity from structure/code
function loadEntityFunction(origin, location, amount = 1, code = undefined) {
    system.run(() => {
        try {
            let entityCode = code;
            const player = origin.sourceEntity;
            if (!player) return;
            
            if (!entityCode) {
                entityCode = player.getComponent("minecraft:equippable").getEquipment(EquipmentSlot.Mainhand).getLore().find(l => l.startsWith("§6Code: §f")).slice(10);
            }
            
            // Spawn entities
            let spawned = 0;
            let failed = 0;
            
            for (let i = 0; i < amount; i++) {
                try {
                    player.runCommand(`structure load ${entityCode} ${location.x} ${location.y} ${location.z}`);
                    spawned++;
                } catch (e) {
                    failed++;
                    console.log(`Failed to spawn entity: ${e}`);
                }
            }
            
            system.runTimeout(() => {
                player.runCommand(`execute as @s positioned ${location.x} ${location.y} ${location.z} run heal @e[r=64,type=!player,tag=setMaxHealth] health`);
                player.runCommand(`execute as @s positioned ${location.x} ${location.y} ${location.z} run tag @e[r=64,type=!player,tag=setMaxHealth] remove setMaxHealth`);
            }, 10);
            player.sendMessage(`§aSpawned: ${spawned}, Failed: ${failed}`);
            
        } catch (e) {
            console.log("Failed to load entity: " + e);
            if (player) {
                player.sendMessage(`§cFailed to load entity: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Event handler for copy entity tool usage
world.afterEvents.itemUse.subscribe((ev) => {
    const player = ev.source;
    const itemStack = ev.itemStack;
    const entities = player.getEntitiesFromViewDirection({maxDistance: 15});
    
    let entity;
    
    if (entities && entities[0] && entities[0].entity) {
        entity = entities[0].entity;
        let distance = entities[0].distance;
        for (const e of entities) {
            if (e.distance < distance) {
                entity = e.entity;
                distance = e.distance;
            }
        }
    }
    
    if (entity && itemStack && itemStack.nameTag.includes("§aCopy Entity Tool") && itemStack.getLore().length >= 1 && itemStack.getLore().includes("§7No entities copied yet")) {
        try {
            // Copy the entity
            const entityData = extractEntityData(entity);
            const entityCode = generateEntityCode();
            
            // Save entity data
            const saved = saveEntityStructure(player, entityData, entityCode, entity);
                
            if (saved) {
                // Update tool lore
                const equippable = player.getComponent("minecraft:equippable");
                const currentTool = equippable.getEquipment(EquipmentSlot.Mainhand);
                    
                if (currentTool) {
                    const newTool = currentTool.clone();
                    const currentLore = newTool.getLore();
                        
                    // Remove "No entities copied yet" if present
                    const filteredLore = currentLore.filter(line => !line.includes("No entities copied yet"));
                        
                    // Add new entity info
                    const entityLore = createEntityLore(entityData, entityCode);
                    const newLore = [
                        ...filteredLore.slice(0, 3), // Keep header
                        `§8--- Entity ---`,
                        ...entityLore,
                        ""
                    ];
                        
                    newTool.setLore(newLore);
                    equippable.setEquipment(EquipmentSlot.Mainhand, newTool);
                }
                    
                player.sendMessage(`§aEntity copied! Code: §e${entityCode}`);
                player.sendMessage(`§7Entity type: ${entityData.typeId.replace("minecraft:", "")}`);
            }
            
        } catch (e) {
            console.log("Error using copy entity tool: " + e);
            player.sendMessage("§cFailed to use copy entity tool!");
        }
    } else if (itemStack?.nameTag?.includes("§aCopy Entity Tool")) {
        spawnEntityFromTool(player, itemStack);
    }
});

// Spawn entity from copy tool
function spawnEntityFromTool(player, copyTool) {
    system.run(() => {
        try {
            let location = player.location;
            
            const block = player.getBlockFromViewDirection({ maxDistance: 50});
            if (block && block.block && block.block.location) {
                location = block.block.location;
            }
            
            const amount = 1;
            const loreArray = copyTool.getLore();
            let entityCode = "";
            
            for (const lore of loreArray) {
                if (lore.startsWith("§6Code: §f")) {
                    entityCode = lore.slice(10);
                    break;
                }
            }
            if (entityCode == "") {
                player.sendMessage("No copied entities found in tool");
                return;
            }
            // Spawn entities
            let spawned = 0;
            let failed = 0;
            
            for (let i = 0; i < amount; i++) {
                try {
                    player.runCommand(`structure load ${entityCode} ${location.x} ${location.y + 1} ${location.z}`);
                    spawned++;
                } catch (e) {
                    failed++;
                    console.log(`Failed to spawn entity: ${e}`);
                }
            }
            system.runTimeout(() => {
                player.runCommand(`execute as @s positioned ${location.x} ${location.y} ${location.z} run heal @e[r=64,type=!player,tag=setMaxHealth] health`);
                player.runCommand(`execute as @s positioned ${location.x} ${location.y} ${location.z} run tag @e[r=64,type=!player,tag=setMaxHealth] remove setMaxHealth`);
            }, 10);
            player.sendMessage(`§aSpawned: ${spawned}, Failed: ${failed}`);
            
        } catch (e) {
            console.log("Failed to load entity: " + e);
            if (player) {
                player.sendMessage(`§cFailed to load entity: ${e.message || e}`);
            }
        }
    });
}


// Main max enchant function
function maxEnchantFunction(origin, variant = "all", targets = [origin.sourceEntity]) {
    system.run(() => {
        try {
            for (const target of targets) {
                applyMaxEnchantments(target, variant);
            }
        } catch (e) {
            console.log("Failed to execute max enchant command: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to apply enchantments: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Apply max enchantments to player's held item
function applyMaxEnchantments(player, variant) {
    try {
        const enchants = ENCHANT_DATA.filter(ed => ed.slot == variant);
        for (const enchant of enchants) {
            player.runCommand("enchant @s " + enchant.id + " " + enchant.level);
        }
    } catch (e) {
        console.log(`Error applying enchantments: ${e}`);
        return { success: false, reason: `Error applying enchantments: ${e.message || e}` };
    }
}

const ENCHANT_DATA = [
    // Universal enchants
    { id: "unbreaking", slot: "all", level: 3 },
    { id: "mending", slot: "all", level: 1 },

    // Sword - default (Sharpness build)
    { id: "sharpness", slot: "sword", level: 5 },
    { id: "fire_aspect", slot: "sword", level: 2 },
    { id: "looting", slot: "sword", level: 3 },
    { id: "unbreaking", slot: "sword", level: 3 },
    { id: "mending", slot: "sword", level: 1 },

    // Sword - undead (Smite build)
    { id: "smite", slot: "swordZombie", level: 5 },
    { id: "fire_aspect", slot: "swordZombie", level: 2 },
    { id: "looting", slot: "swordZombie", level: 3 },
    { id: "unbreaking", slot: "swordZombie", level: 3 },
    { id: "mending", slot: "swordZombie", level: 1 },

    // Axe
    { id: "sharpness", slot: "axe", level: 5 },
    { id: "efficiency", slot: "axe", level: 5 },
    { id: "unbreaking", slot: "axe", level: 3 },
    { id: "mending", slot: "axe", level: 1 },

    // Pickaxe
    { id: "efficiency", slot: "pickaxe", level: 5 },
    { id: "fortune", slot: "pickaxe", level: 3 },
    { id: "unbreaking", slot: "pickaxe", level: 3 },
    { id: "mending", slot: "pickaxe", level: 1 },

    // Shovel
    { id: "efficiency", slot: "shovel", level: 5 },
    { id: "fortune", slot: "shovel", level: 3 },
    { id: "unbreaking", slot: "shovel", level: 3 },
    { id: "mending", slot: "shovel", level: 1 },

    // Bow (Infinity build)
    { id: "power", slot: "bowInfinity", level: 5 },
    { id: "infinity", slot: "bowInfinity", level: 1 },
    { id: "punch", slot: "bowInfinity", level: 2 },
    { id: "flame", slot: "bowInfinity", level: 1 },
    { id: "unbreaking", slot: "bowInfinity", level: 3 },

    // Bow (Mending build)
    { id: "power", slot: "bowMending", level: 5 },
    { id: "mending", slot: "bowMending", level: 1 },
    { id: "punch", slot: "bowMending", level: 2 },
    { id: "flame", slot: "bowMending", level: 1 },
    { id: "unbreaking", slot: "bowMending", level: 3 },

    // Crossbow
    { id: "quick_charge", slot: "crossbow", level: 3 },
    { id: "multishot", slot: "crossbow", level: 1 },
    { id: "unbreaking", slot: "crossbow", level: 3 },
    { id: "mending", slot: "crossbow", level: 1 },

    // Helmet
    { id: "protection", slot: "helmet", level: 4 },
    { id: "respiration", slot: "helmet", level: 3 },
    { id: "aqua_affinity", slot: "helmet", level: 1 },
    { id: "unbreaking", slot: "helmet", level: 3 },
    { id: "mending", slot: "helmet", level: 1 },

    // Chestplate
    { id: "protection", slot: "chestplate", level: 4 },
    { id: "thorns", slot: "chestplate", level: 3 },
    { id: "unbreaking", slot: "chestplate", level: 3 },
    { id: "mending", slot: "chestplate", level: 1 },

    // Leggings
    { id: "protection", slot: "leggings", level: 4 },
    { id: "unbreaking", slot: "leggings", level: 3 },
    { id: "mending", slot: "leggings", level: 1 },

    // Boots
    { id: "protection", slot: "boots", level: 4 },
    { id: "feather_falling", slot: "boots", level: 4 },
    { id: "depth_strider", slot: "boots", level: 3 },
    { id: "unbreaking", slot: "boots", level: 3 },
    { id: "mending", slot: "boots", level: 1 },

    // Trident (Loyalty build)
    { id: "impaling", slot: "tridentLoyalty", level: 5 },
    { id: "loyalty", slot: "tridentLoyalty", level: 3 },
    { id: "channeling", slot: "tridentLoyalty", level: 1 },
    { id: "unbreaking", slot: "tridentLoyalty", level: 3 },
    { id: "mending", slot: "tridentLoyalty", level: 1 },

    // Trident (Riptide build)
    { id: "impaling", slot: "tridentRiptide", level: 5 },
    { id: "riptide", slot: "tridentRiptide", level: 3 },
    { id: "unbreaking", slot: "tridentRiptide", level: 3 },
    { id: "mending", slot: "tridentRiptide", level: 1 },

    // Fishing Rod
    { id: "luck_of_the_sea", slot: "fishing_rod", level: 3 },
    { id: "lure", slot: "fishing_rod", level: 3 },
    { id: "unbreaking", slot: "fishing_rod", level: 3 },
    { id: "mending", slot: "fishing_rod", level: 1 }
];


function mobFightFunction(origin, e1, e2) {
    system.run(() => {
        const entity1 = e1[0];
        const entity2 = e2[0];
        
        const code = generateEntityCode();
        
        entity1.addTag("entity1"+code);
        entity2.addTag("entity2"+code);
        
        entity1.runCommand(`damage @e[tag=entity2${code}] 0 entity_attack entity @s`);
        entity2.runCommand(`damage @e[tag=entity1${code}] 0 entity_attack entity @s`);
        
        entity1.removeTag("entity1"+code);
        entity2.removeTag("entity2"+code);
    });

    return { status: CustomCommandStatus.Success };
}


// Save position function
function savePositionFunction(origin, locationName) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") {
                console.log("Save position requires a player");
                return;
            }
            
            // Validate location name (alphanumeric and underscores only)
            const cleanName = locationName.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
            if (cleanName.length === 0) {
                player.sendMessage("§cInvalid location name! Use only letters, numbers, and underscores.");
                return;
            }
            
            if (cleanName.length > 20) {
                player.sendMessage("§cLocation name too long! Maximum 20 characters.");
                return;
            }
            
            // Get current position and dimension
            const location = player.location;
            const dimension = getDimensionShortName(player.dimension.id);
            
            // Create position tag
            const positionTag = `tps_${dimension}_${Math.floor(location.x)}_${Math.floor(location.y)}_${Math.floor(location.z)}_${cleanName}`;
            
            // Check if location name already exists
            const existingTags = player.getTags().filter(tag => tag.startsWith("tps_") && tag.endsWith(`_${cleanName}`));
            if (existingTags.length > 0) {
                // Remove old tag with same name
                for (const oldTag of existingTags) {
                    player.removeTag(oldTag);
                }
                player.sendMessage(`§eUpdated existing location: ${cleanName}`);
            }
            
            // Add new position tag
            player.addTag(positionTag);
            
            player.sendMessage(`§aPosition saved as: §f${cleanName}`);
            player.sendMessage(`§7Location: ${Math.floor(location.x)}, ${Math.floor(location.y)}, ${Math.floor(location.z)} (${dimension})`);
            
        } catch (e) {
            console.log("Failed to save position: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to save position: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Teleport to saved position function (text command)
function tpsFunction(origin, locationName = null) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") {
                console.log("TPS requires a player");
                return;
            }
            
            if (!locationName) {
                // Open GUI if no location specified
                showTeleportGUI(player);
                return;
            }
            
            // Find and teleport to named location
            const cleanName = locationName.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
            teleportToSavedLocation(player, cleanName);
            
        } catch (e) {
            console.log("Failed to teleport: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to teleport: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Teleport to saved position GUI function
function tpsgFunction(origin) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") {
                console.log("TPSG requires a player");
                return;
            }
            
            showTeleportGUI(player);
            
        } catch (e) {
            console.log("Failed to open teleport GUI: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to open teleport GUI: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Show teleport GUI
function showTeleportGUI(player) {
    try {
        // Get all saved positions
        const savedPositions = getSavedPositions(player);
        
        if (savedPositions.length === 0) {
            player.sendMessage("§cNo saved positions found! Use /saveposition <name> to save locations.");
            return;
        }
        
        // Create action form with buttons for each position
        const form = new ActionFormData()
            .title("§6Teleport to Saved Position")
            .body(`§8Select a location to teleport to:\n§2You have ${savedPositions.length} saved position${savedPositions.length > 1 ? 's' : ''}`);
        
        // Add button for each saved position
        for (const pos of savedPositions) {
            const buttonText = `§2${pos.name}\n§8${pos.x}, ${pos.y}, ${pos.z} (${pos.dimension})`;
            form.button(buttonText);
        }
        
        // Add management buttons
        form.button("§4Delete Position\n§4Remove a saved location");
        form.button("§eList All Positions\n§eShow all saved locations in chat");
        
        form.show(player).then((response) => {
            if (response.canceled) return;
            
            const selection = response.selection;
            
            if (selection < savedPositions.length) {
                // Teleport to selected position
                const selectedPos = savedPositions[selection];
                teleportToPosition(player, selectedPos);
            } else if (selection === savedPositions.length) {
                // Delete position
                showDeletePositionGUI(player, savedPositions);
            } else if (selection === savedPositions.length + 1) {
                // List all positions
                listAllPositions(player, savedPositions);
            }
        });
        
    } catch (e) {
        player.sendMessage("§cFailed to open teleport GUI!");
        console.log("Failed to show teleport GUI: " + e);
    }
}

// Show delete position GUI
function showDeletePositionGUI(player, savedPositions) {
    const form = new ActionFormData()
        .title("§4Delete Saved Position")
        .body("§4Select a position to delete:");
    
    for (const pos of savedPositions) {
        const buttonText = `§2${pos.name}\n§8${pos.x}, ${pos.y}, ${pos.z} (${pos.dimension})`;
        form.button(buttonText);
    }
    
    form.show(player).then((response) => {
        if (response.canceled) return;
        
        const selectedPos = savedPositions[response.selection];
        
        // Remove the tag
        player.removeTag(selectedPos.fullTag);
        player.sendMessage(`§aDeleted saved position: §f${selectedPos.name}`);
    });
}

// Get all saved positions from player tags
function getSavedPositions(player) {
    const positions = [];
    const tags = player.getTags();
    
    for (const tag of tags) {
        if (tag.startsWith("tps_")) {
            const parsed = parsePositionTag(tag);
            if (parsed) {
                positions.push(parsed);
            }
        }
    }
    
    // Sort by name
    positions.sort((a, b) => a.name.localeCompare(b.name));
    
    return positions;
}

// Parse position tag into readable format
function parsePositionTag(tag) {
    try {
        // Format: tps_dim_x_y_z_name
        const parts = tag.split('_');
        if (parts.length < 6) return null;
        
        const dimension = parts[1];
        const x = parseInt(parts[2]);
        const y = parseInt(parts[3]);
        const z = parseInt(parts[4]);
        const name = parts.slice(5).join('_'); // Handle names with underscores
        
        return {
            fullTag: tag,
            dimension: dimension,
            x: x,
            y: y,
            z: z,
            name: name,
            dimensionFull: getDimensionFullName(dimension)
        };
    } catch (e) {
        console.log(`Failed to parse position tag: ${tag}`);
        return null;
    }
}

// Teleport to saved location by name
function teleportToSavedLocation(player, locationName) {
    const savedPositions = getSavedPositions(player);
    const targetPosition = savedPositions.find(pos => pos.name === locationName);
    
    if (!targetPosition) {
        player.sendMessage(`§cSaved location '${locationName}' not found!`);
        
        if (savedPositions.length > 0) {
            const suggestions = savedPositions.slice(0, 5).map(pos => pos.name);
            player.sendMessage(`§7Available locations: ${suggestions.join(", ")}`);
        } else {
            player.sendMessage("§7Use /saveposition <name> to save locations.");
        }
        return;
    }
    
    teleportToPosition(player, targetPosition);
}

// Teleport player to position
function teleportToPosition(player, position) {
    try {
        const targetDimension = world.getDimension(getDimensionFullName(position.dimension));
        const teleportLocation = { x: position.x, y: position.y, z: position.z };
        
        // Teleport to the dimension and position
        player.teleport(teleportLocation, { dimension: targetDimension });
        
        player.sendMessage(`§aTeleported to: §f${position.name}`);
        player.sendMessage(`§7Location: ${position.x}, ${position.y}, ${position.z} (${position.dimensionFull})`);
        
    } catch (e) {
        player.sendMessage(`§cFailed to teleport to ${position.name}: ${e.message || e}`);
        console.log(`Teleport error: ${e}`);
    }
}

// List all positions in chat
function listAllPositions(player, savedPositions) {
    player.sendMessage("§a--- Your Saved Positions ---");
    player.sendMessage(`§7Total: ${savedPositions.length} location${savedPositions.length > 1 ? 's' : ''}`);
    
    if (savedPositions.length === 0) {
        player.sendMessage("§7No saved positions. Use /saveposition <name> to save locations.");
        return;
    }
    
    for (let i = 0; i < savedPositions.length; i++) {
        const pos = savedPositions[i];
        player.sendMessage(`§f${i + 1}. ${pos.name} §7- ${pos.x}, ${pos.y}, ${pos.z} (${pos.dimensionFull})`);
    }
    
    player.sendMessage("§7Use /tps <name> or /tpsg to teleport");
}

// Helper functions
function getDimensionShortName(dimensionId) {
    switch (dimensionId) {
        case "minecraft:overworld": return "ow";
        case "minecraft:nether": return "nether";
        case "minecraft:the_end": return "end";
        default: return dimensionId.replace("minecraft:", "");
    }
}

function getDimensionFullName(shortName) {
    switch (shortName) {
        case "ow": return "minecraft:overworld";
        case "nether": return "minecraft:nether";
        case "end": return "minecraft:the_end";
        default: return `minecraft:${shortName}`;
    }
}

function clearPositionsFunction(origin) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            const savedPositions = getSavedPositions(player);
            
            if (savedPositions.length === 0) {
                player.sendMessage("§7No saved positions to clear.");
                return;
            }
            
            // Remove all position tags
            for (const pos of savedPositions) {
                player.removeTag(pos.fullTag);
            }
            
            player.sendMessage(`§aCleared ${savedPositions.length} saved position${savedPositions.length > 1 ? 's' : ''}!`);
            
        } catch (e) {
            console.log("Failed to clear positions: " + e);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function rtpFunction(origin, minDistance = 100, maxDistance = 2000) {
    system.run(() => {
        try {
            const player = origin?.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") {
                console.warn("RTP requires a player");
                return;
            }

            if (minDistance < 0 || maxDistance < minDistance) {
                player.sendMessage("§cInvalid distance values!");
                return;
            }
            if (maxDistance > 100000) {
                player.sendMessage("§cMax distance too large! Max is 100,000 blocks.");
                return;
            }

            const angle = Math.random() * 2 * Math.PI;
            const distance = minDistance + Math.random() * (maxDistance - minDistance);
            const targetX = Math.floor(player.location.x + Math.cos(angle) * distance);
            const targetZ = Math.floor(player.location.z + Math.sin(angle) * distance);
            const highY = 250; // Drop from top of world

            player.sendMessage("§7Teleporting to random location...");

            // Give temporary immunity
            player.addEffect("resistance", 5 * 20, { amplifier: 255 });

            // Initial teleport (will load chunk)
            player.teleport(
                { x: targetX + 0.5, y: highY, z: targetZ + 0.5 },
                { dimension: player.dimension }
            );

            // Wait ~3 second for chunk to load, then adjust Y
            system.runTimeout(() => {
                const safeY = findGroundBelow(player);
                if (safeY !== null) {
                    player.teleport(
                        { x: targetX + 0.5, y: safeY, z: targetZ + 0.5 },
                        { dimension: player.dimension }
                    );
                    player.sendMessage(`§aRandom teleport successful! (${targetX}, ${safeY}, ${targetZ})`);
                } else {
                    player.sendMessage("§cCouldn't find safe ground here, staying at high Y.");
                    player.runCommand("rtp 100 500");
                }
            }, 60); // 20 ticks = 1s
        } catch (e) {
            console.error("RTP error: " + e);
            origin?.sourceEntity?.sendMessage(`§cRTP failed: ${e.message || e}`);
        }
    });

    return { status: CustomCommandStatus.Success };
}

// Scan down from current location until we hit solid ground
function findGroundBelow(player) {
    try {
        const { x, y, z } = player.location;
        const dim = player.dimension;
        for (let yy = Math.floor(y); yy >= -60; yy--) {
            const block = dim.getBlock({ x: Math.floor(x), y: yy, z: Math.floor(z) });
            const above = dim.getBlock({ x: Math.floor(x), y: yy + 1, z: Math.floor(z) });
            if (block && above &&
                block.typeId !== "minecraft:air" &&
                block.typeId !== "minecraft:water" &&
                block.typeId !== "minecraft:lava" &&
                above.typeId === "minecraft:air") {
                return yy + 1;
            }
        }
        return null;
    } catch (e) {
        console.error(`findGroundBelow error: ${e}`);
        return null;
    }
}

function helpFunction(origin) {
    system.run(() => {
        for (const cmd of COMMANDS) {
            origin.sourceEntity.sendMessage(`§2${cmd.command} - §e${cmd.description}`);
        }
    });
    
    return { status: CustomCommandStatus.Success};
}


// Main search function
function searchFunction(origin, searchQuery = "") {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") {
                console.log("Search requires a player");
                return;
            }
            
            // Get search results
            const results = searchCommands(searchQuery);
            
            if (results.length === 0) {
                if (searchQuery) {
                    player.sendMessage(`§cNo commands found matching: "${searchQuery}"`);
                    player.sendMessage("§7Try different keywords like: lore, block, teleport, heal");
                } else {
                    player.sendMessage("§cNo commands available in search database.");
                }
                return;
            }
            
            // Show search GUI
            showSearchGUI(player, results, searchQuery);
            
        } catch (e) {
            console.log("Failed to execute search: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to search commands: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Search through commands array
function searchCommands(query) {
    if (!query || query.trim() === "") {
        // Return all commands if no query (limited to top 10)
        return COMMANDS.slice(0, 30);
    }
    
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    const results = [];
    
    // Score each command based on matches
    for (const cmd of COMMANDS) {
        let score = 0;
        const commandText = cmd.command.toLowerCase();
        const descriptionText = cmd.description.toLowerCase();
        const keywords = cmd.keyWords.map(kw => kw.toLowerCase());
        
        for (const term of searchTerms) {
            // Exact command match (highest priority)
            if (commandText.includes(term)) {
                score += 10;
            }
            
            // Description match (medium priority)
            if (descriptionText.includes(term)) {
                score += 5;
            }
            
            // Keyword match (high priority)
            for (const keyword of keywords) {
                if (keyword.includes(term) || term.includes(keyword)) {
                    score += 7;
                }
                if (keyword === term) {
                    score += 10; // Exact keyword match
                }
            }
        }
        
        if (score > 0) {
            results.push({
                ...cmd,
                score: score,
                matchedTerms: searchTerms.filter(term => 
                    commandText.includes(term) || 
                    descriptionText.includes(term) ||
                    keywords.some(kw => kw.includes(term) || term.includes(kw))
                )
            });
        }
    }
    
    // Sort by score (descending) and return top 10
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 10);
}

// Show search results GUI
function showSearchGUI(player, results, searchQuery) {
    try {
        const queryText = searchQuery ? `"${searchQuery}"` : "all commands";
        
        const form = new ActionFormData()
            .title("§6Command Search")
            .body(`§7Search results for: §f${queryText}\n§2Found ${results.length} command${results.length > 1 ? 's' : ''}`);
        
        // Add button for each command result
        for (let i = 0; i < results.length; i++) {
            const cmd = results[i];
            
            // Create button text with command and preview
            let buttonText = `§f${cmd.command}\n§8${cmd.description}`;
            
            // Add matched terms indicator if search was performed
            if (searchQuery && cmd.matchedTerms && cmd.matchedTerms.length > 0) {
                buttonText += `\n§8Matched: ${cmd.matchedTerms.join(", ")}`;
            }
            
            form.button(buttonText);
        }
        
        // Add utility buttons
        if (searchQuery) {
            form.button("§eNew Search\n§8Search with different keywords");
        }
        form.button("§2Browse All\n§8Show all available commands");
        form.button("§4Close\n§8Exit search");
        
        form.show(player).then((response) => {
            if (response.canceled) return;
            
            const selection = response.selection;
            
            if (selection < results.length) {
                // Show detailed command info
                showCommandDetails(player, results[selection], results, searchQuery);
            } else {
                const utilityIndex = selection - results.length;
                
                if (searchQuery && utilityIndex === 0) {
                    // New search
                    showSearchInputGUI(player);
                } else if ((searchQuery && utilityIndex === 1) || (!searchQuery && utilityIndex === 0)) {
                    // Browse all
                    const allResults = COMMANDS.slice(0, 10);
                    showSearchGUI(player, allResults, "");
                }
                // Close option does nothing (form closes automatically)
            }
        });
        
    } catch (e) {
        player.sendMessage("§cFailed to show search GUI!");
        console.log("Search GUI error: " + e);
    }
}

// Show detailed command information
function showCommandDetails(player, command, allResults, originalQuery) {
    try {
        // Create detailed description
        let detailText = `§f${command.command}\n\n`;
        detailText += `§7Description:\n§f${command.description}\n\n`;
        
        if (command.keyWords && command.keyWords.length > 0) {
            detailText += `§7Keywords:\n§f${command.keyWords.join(", ")}\n\n`;
        }
        
        if (command.matchedTerms && command.matchedTerms.length > 0) {
            detailText += `§7Matched Terms:\n§e${command.matchedTerms.join(", ")}\n\n`;
        }
        
        // Add usage examples if available
        if (command.examples) {
            detailText += `§7Examples:\n`;
            for (const example of command.examples) {
                detailText += `§f${example}\n`;
            }
        }
        
        const form = new ActionFormData()
            .title(`§6${command.command}`)
            .body(detailText)
            .button("§aBack to Results\n§8Return to search results")
            .button("§eCopy Command\n§8Copy command to chat")
            .button("§7Close\n§8Exit command info");
        
        form.show(player).then((response) => {
            if (response.canceled) return;
            
            switch (response.selection) {
                case 0: // Back to results
                    showSearchGUI(player, allResults, originalQuery);
                    break;
                case 1: // Copy command (simulate by showing in chat)
                    player.sendMessage(`§7Command: §f${command.command}`);
                    player.sendMessage("§7Command copied to chat!");
                    break;
                case 2: // Close
                default:
                    // Do nothing, form closes
                    break;
            }
        });
        
    } catch (e) {
        player.sendMessage("§cFailed to show command details!");
        console.log("Command details error: " + e);
    }
}

// Show search input GUI (for new searches)
function showSearchInputGUI(player) {
    try {
        const form = new ModalFormData()
            .title("§6New Command Search")
            .textField("Search Query:", "Enter keywords or command name")
            .dropdown("Search Mode", ["Keyword Search", "Command Name", "Description Only"])
            .toggle("Show Advanced Info");
        
        form.show(player).then((response) => {
            if (response.canceled) return;
            
            const [searchQuery, searchMode, showAdvanced] = response.formValues;
            
            if (!searchQuery || searchQuery.trim() === "") {
                player.sendMessage("§cPlease enter a search query!");
                return;
            }
            
            // Perform search with mode-specific filtering
            let results = [];
            
            switch (searchMode) {
                case 0: // Keyword search (default)
                    results = searchCommands(searchQuery);
                    break;
                case 1: // Command name only
                    results = searchCommandsByName(searchQuery);
                    break;
                case 2: // Description only
                    results = searchCommandsByDescription(searchQuery);
                    break;
            }
            
            if (results.length === 0) {
                player.sendMessage(`§cNo commands found for: "${searchQuery}"`);
                return;
            }
            
            showSearchGUI(player, results, searchQuery);
        });
        
    } catch (e) {
        player.sendMessage("§cFailed to show search input!");
        console.log("Search input error: " + e);
    }
}

// Search commands by name only
function searchCommandsByName(query) {
    const searchTerm = query.toLowerCase();
    const results = [];
    
    for (const cmd of COMMANDS) {
        if (cmd.command.toLowerCase().includes(searchTerm)) {
            results.push({
                ...cmd,
                score: cmd.command.toLowerCase().indexOf(searchTerm) === 0 ? 10 : 5, // Prefer commands starting with term
                matchedTerms: [searchTerm]
            });
        }
    }
    
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 10);
}

// Search commands by description only
function searchCommandsByDescription(query) {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    const results = [];
    
    for (const cmd of COMMANDS) {
        const description = cmd.description.toLowerCase();
        let score = 0;
        const matched = [];
        
        for (const term of searchTerms) {
            if (description.includes(term)) {
                score += 5;
                matched.push(term);
            }
        }
        
        if (score > 0) {
            results.push({
                ...cmd,
                score: score,
                matchedTerms: matched
            });
        }
    }
    
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 10);
}

// Main throw tag tool function
function throwTagToolFunction(origin) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") {
                console.log("Throw tag tool requires a player");
                return;
            }
            
            createThrowTagTool(player);
            
        } catch (e) {
            console.log("Failed to create throw tag tool: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to create throw tag tool: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Create throw tag tool
function createThrowTagTool(player) {
    try {
        const equippable = player.getComponent("minecraft:equippable");
        
        // Create throw tag tool
        const tagTool = new ItemStack("minecraft:lime_dye", 1);
        tagTool.nameTag = "§2Throw Tag Tool";
        
        const loreLines = [
            "§7Right-click to apply tags to target entity",
            "§7Range: 30 blocks",
            "§8§l--- TAGS TO APPLY ---",
            "§7No tags configured",
            "§7Use /tagtooladd <tag> to add tags"
        ];
        
        tagTool.setLore(loreLines);
        
        equippable.setEquipment(EquipmentSlot.Mainhand, tagTool);
        
        player.sendMessage("§aThrow Tag Tool created!");
        player.sendMessage("§7Right-click entities to apply tags");
        player.sendMessage("§7Use /tagtooladd <tag> to add tags to the tool");
        
    } catch (e) {
        player.sendMessage(`§cFailed to create throw tag tool: ${e}`);
        console.log("Failed to create throw tag tool: " + e);
    }
}

// Create remove tag tool
function removeTagToolFunction(origin) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") {
                console.log("Remove tag tool requires a player");
                return;
            }
            
            createRemoveTagTool(player);
            
        } catch (e) {
            console.log("Failed to create remove tag tool: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to create remove tag tool: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Create remove tag tool
function createRemoveTagTool(player) {
    try {
        const equippable = player.getComponent("minecraft:equippable");
        
        // Create remove tag tool
        const removeTool = new ItemStack("minecraft:red_dye", 1);
        removeTool.nameTag = "§cRemove Tag Tool";
        
        const loreLines = [
            "§7Right-click to remove all tags from target entity",
            "§7Range: 30 blocks",
            "§7This will remove ALL tags from the entity"
        ];
        
        removeTool.setLore(loreLines);
        
        equippable.setEquipment(EquipmentSlot.Mainhand, removeTool);
        
        player.sendMessage("§cRemove Tag Tool created!");
        player.sendMessage("§7Right-click entities to remove all their tags");
        
    } catch (e) {
        player.sendMessage(`§cFailed to create remove tag tool: ${e}`);
        console.log("Failed to create remove tag tool: " + e);
    }
}

// Add tag to tool function
function tagToolAddFunction(origin, tagToAdd) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            const equippable = player.getComponent("minecraft:equippable");
            const heldItem = equippable?.getEquipment(EquipmentSlot.Mainhand);
            
            if (!heldItem || !heldItem.nameTag || !heldItem.nameTag.includes("Throw Tag Tool")) {
                player.sendMessage("§cYou must be holding a Throw Tag Tool!");
                return;
            }
            
            // Validate tag name
            const cleanTag = tagToAdd.replace(/[^a-zA-Z0-9_.-]/g, "");
            if (cleanTag.length === 0) {
                player.sendMessage("§cInvalid tag name! Use only letters, numbers, dots, dashes, and underscores.");
                return;
            }
            
            if (cleanTag.length > 50) {
                player.sendMessage("§cTag name too long! Maximum 50 characters.");
                return;
            }
            
            // Get current tags from lore
            const currentTags = getTagsFromTool(heldItem);
            
            // Check if tag already exists
            if (currentTags.includes(cleanTag)) {
                player.sendMessage(`§eTag "${cleanTag}" already exists in tool!`);
                return;
            }
            
            // Check tag limit
            if (currentTags.length >= 20) {
                player.sendMessage("§cTag limit reached! Maximum 20 tags per tool.");
                return;
            }
            
            // Add tag to tool
            currentTags.push(cleanTag);
            updateToolLore(player, heldItem, currentTags, "add");
            
            player.sendMessage(`§aAdded tag: §f${cleanTag}`);
            player.sendMessage(`§7Tool now has ${currentTags.length} tag${currentTags.length > 1 ? 's' : ''}`);
            
        } catch (e) {
            console.log("Failed to add tag to tool: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to add tag: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Remove tag from tool function
function tagToolRemoveFunction(origin, tagToRemove) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            const equippable = player.getComponent("minecraft:equippable");
            const heldItem = equippable?.getEquipment(EquipmentSlot.Mainhand);
            
            if (!heldItem || !heldItem.nameTag || !heldItem.nameTag.includes("Throw Tag Tool")) {
                player.sendMessage("§cYou must be holding a Throw Tag Tool!");
                return;
            }
            
            // Get current tags from lore
            const currentTags = getTagsFromTool(heldItem);
            
            // Find and remove tag
            const tagIndex = currentTags.indexOf(tagToRemove);
            if (tagIndex === -1) {
                player.sendMessage(`§cTag "${tagToRemove}" not found in tool!`);
                
                if (currentTags.length > 0) {
                    player.sendMessage(`§7Available tags: ${currentTags.slice(0, 5).join(", ")}${currentTags.length > 5 ? "..." : ""}`);
                }
                return;
            }
            
            currentTags.splice(tagIndex, 1);
            updateToolLore(player, heldItem, currentTags, "remove");
            
            player.sendMessage(`§aRemoved tag: §f${tagToRemove}`);
            player.sendMessage(`§7Tool now has ${currentTags.length} tag${currentTags.length > 1 ? 's' : ''}`);
            
        } catch (e) {
            console.log("Failed to remove tag from tool: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to remove tag: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Clear all tags from tool function
function tagToolClearFunction(origin) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            const equippable = player.getComponent("minecraft:equippable");
            const heldItem = equippable?.getEquipment(EquipmentSlot.Mainhand);
            
            if (!heldItem || !heldItem.nameTag || !heldItem.nameTag.includes("Throw Tag Tool")) {
                player.sendMessage("§cYou must be holding a Throw Tag Tool!");
                return;
            }
            
            // Get current tag count
            const currentTags = getTagsFromTool(heldItem);
            const tagCount = currentTags.length;
            
            if (tagCount === 0) {
                player.sendMessage("§7Tool has no tags to clear.");
                return;
            }
            
            // Clear all tags
            updateToolLore(player, heldItem, [], "clear");
            
            player.sendMessage(`§aCleared ${tagCount} tag${tagCount > 1 ? 's' : ''} from tool!`);
            
        } catch (e) {
            console.log("Failed to clear tags from tool: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to clear tags: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Get tags from tool lore
function getTagsFromTool(item) {
    const tags = [];
    const loreArray = item.getLore();
    let foundTagSection = false;
    
    for (const line of loreArray) {
        if (line === "§8§l--- TAGS TO APPLY ---") {
            foundTagSection = true;
            continue;
        }
        
        if (foundTagSection) {
            // Skip info lines
            if (line.includes("No tags configured") || line.includes("Use /tagtooladd")) {
                continue;
            }
            
            // Extract tag from format "§a• tagname"
            if (line.startsWith("§a• ")) {
                const tag = line.replace("§a• ", "");
                tags.push(tag);
            }
        }
    }
    
    return tags;
}

// Update tool lore with new tags
function updateToolLore(player, item, tags, action) {
    try {
        const equippable = player.getComponent("minecraft:equippable");
        const newTool = item.clone();
        
        const loreLines = [
            "§7Right-click to apply tags to target entity",
            "§7Range: 30 blocks",
            "§8§l--- TAGS TO APPLY ---"
        ];
        
        if (tags.length === 0) {
            loreLines.push("§7No tags configured");
            loreLines.push("§7Use /tagtooladd <tag> to add tags");
        } else {
            loreLines.push(`§7${tags.length} tag${tags.length > 1 ? 's' : ''} configured:`);
            
            // Add each tag
            for (const tag of tags) {
                loreLines.push(`§a• ${tag}`);
            }
            
            // Add help text
            loreLines.push("");
            loreLines.push("§7Use /tagtoolremove <tag> to remove");
        }
        
        newTool.setLore(loreLines);
        equippable.setEquipment(EquipmentSlot.Mainhand, newTool);
        
    } catch (e) {
        console.log(`Failed to update tool lore: ${e}`);
    }
}

// Event handler for tag tool usage
world.afterEvents.itemUse.subscribe((ev) => {
    if (ev.source.typeId !== "minecraft:player" || !ev.itemStack) return;
    
    const player = ev.source;
    const itemStack = ev.itemStack;
    
    // Check if it's a tag tool
    if (!itemStack.nameTag) return;
    
    try {
        if (itemStack.nameTag.includes("Throw Tag Tool")) {
            handleThrowTagTool(player, itemStack);
        } else if (itemStack.nameTag.includes("Remove Tag Tool")) {
            handleRemoveTagTool(player, itemStack);
        }
    } catch (e) {
        console.log("Error using tag tool: " + e);
        player.sendMessage("§cFailed to use tag tool!");
    }
});

// Handle throw tag tool usage
function handleThrowTagTool(player, tagTool) {
    try {
        // Get entities from view direction
        const entitiesFromView = player.getEntitiesFromViewDirection({ maxDistance: 30 });
        
        if (!entitiesFromView || entitiesFromView.length === 0) {
            player.sendMessage("§cNo entity found in view direction within 30 blocks!");
            return;
        }
        
        const targetEntity = entitiesFromView[0].entity;
        
        if (!targetEntity || targetEntity === player) {
            player.sendMessage("§cInvalid target entity!");
            return;
        }
        
        // Get tags from tool
        const tagsToApply = getTagsFromTool(tagTool);
        
        if (tagsToApply.length === 0) {
            player.sendMessage("§cNo tags configured in tool! Use /tagtooladd <tag> to add tags.");
            return;
        }
        
        // Apply tags to entity
        let appliedCount = 0;
        let alreadyHadCount = 0;
        
        for (const tag of tagsToApply) {
            try {
                if (targetEntity.hasTag(tag)) {
                    alreadyHadCount++;
                } else {
                    targetEntity.addTag(tag);
                    appliedCount++;
                }
            } catch (e) {
                console.log(`Failed to apply tag ${tag}: ${e}`);
            }
        }
        
        // Show results
        const distance = Math.floor(entitiesFromView[0].distance);
        const entityType = targetEntity.typeId.replace("minecraft:", "");
        
        player.sendMessage(`§aTarget: §f${entityType} §7(${distance} blocks)`);
        
        if (appliedCount > 0) {
            player.sendMessage(`§aApplied ${appliedCount} new tag${appliedCount > 1 ? 's' : ''}`);
        }
        
        if (alreadyHadCount > 0) {
            player.sendMessage(`§e${alreadyHadCount} tag${alreadyHadCount > 1 ? 's' : ''} already existed`);
        }
        
        // Show applied tags
        if (appliedCount > 0) {
            const appliedTags = tagsToApply.filter(tag => !targetEntity.hasTag(tag) || appliedCount > 0);
            player.sendMessage(`§7Tags: ${tagsToApply.join(", ")}`);
        }
        
    } catch (e) {
        player.sendMessage(`§cFailed to apply tags: ${e}`);
        console.log("Failed to handle throw tag tool: " + e);
    }
}

// Handle remove tag tool usage
function handleRemoveTagTool(player, removeTool) {
    try {
        // Get entities from view direction
        const entitiesFromView = player.getEntitiesFromViewDirection({ maxDistance: 30 });
        
        if (!entitiesFromView || entitiesFromView.length === 0) {
            player.sendMessage("§cNo entity found in view direction within 30 blocks!");
            return;
        }
        
        const targetEntity = entitiesFromView[0].entity;
        
        if (!targetEntity || targetEntity === player) {
            player.sendMessage("§cInvalid target entity!");
            return;
        }
        
        // Get all tags from entity
        const entityTags = targetEntity.getTags();
        
        if (entityTags.length === 0) {
            player.sendMessage("§eTarget entity has no tags to remove.");
            return;
        }
        
        // Remove all tags
        let removedCount = 0;
        for (const tag of entityTags) {
            try {
                targetEntity.removeTag(tag);
                removedCount++;
            } catch (e) {
                console.log(`Failed to remove tag ${tag}: ${e}`);
            }
        }
        
        // Show results
        const distance = Math.floor(entitiesFromView[0].distance);
        const entityType = targetEntity.typeId.replace("minecraft:", "");
        
        player.sendMessage(`§aTarget: §f${entityType} §7(${distance} blocks)`);
        player.sendMessage(`§cRemoved ${removedCount} tag${removedCount > 1 ? 's' : ''}`);
        
        if (removedCount > 0) {
            player.sendMessage(`§7Removed: ${entityTags.slice(0, 5).join(", ")}${entityTags.length > 5 ? "..." : ""}`);
        }
        
    } catch (e) {
        player.sendMessage(`§cFailed to remove tags: ${e}`);
        console.log("Failed to handle remove tag tool: " + e);
    }
}



// Global storage for copy paste tool states
const COPY_PASTE_STATES = new Map(); // playerId -> { pos1, pos2, copiedStructureId }
// Generate random 7-character code for structures
function generateStructureCode(length = 7) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'mystructure:';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Main copy paste tool function
function copyPasteToolFunction(origin) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") {
                console.log("Copy paste tool requires a player");
                return;
            }
            
            createCopyPasteTool(player);
            
        } catch (e) {
            console.log("Failed to create copy paste tool: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to create copy paste tool: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Create copy paste tool
function createCopyPasteTool(player) {
    try {
        const equippable = player.getComponent("minecraft:equippable");
        
        // Create copy paste tool (blaze rod with special lore)
        const copyTool = new ItemStack("minecraft:blaze_rod", 1);
        copyTool.nameTag = "§6Copy Paste Tool";
        
        // Initialize player state
        COPY_PASTE_STATES.set(player.id, { pos1: null, pos2: null, copiedStructureId: null });
        
        // Create initial lore
        const loreLines = [
            "§7Left-click: Set position 1",
            "§7Right-click: Paste at location", 
            "§7Shift+Right-click: Set position 2",
            "§8§l--- POSITIONS ---",
            "§7Position 1: §cNot set",
            "§7Position 2: §cNot set",
            "§8§l--- CLIPBOARD ---",
            "§7No structure copied"
        ];
        
        copyTool.setLore(loreLines);
        
        equippable.setEquipment(EquipmentSlot.Mainhand, copyTool);
        
        player.sendMessage("§aCopy Paste Tool created!");
        player.sendMessage("§7Left-click blocks to set positions");
        player.sendMessage("§7Right-click to paste, Shift+Right-click to set pos2");
        
    } catch (e) {
        player.sendMessage(`§cFailed to create copy paste tool: ${e}`);
        console.log("Failed to create copy paste tool: " + e);
    }
}

// Update tool lore with current state
function updateToolLoreCopyTool(player, tool, toolState) {
    const loreLines = [
        "§7Left-click: Set position 1",
        "§7Right-click: Paste at location",
        "§7Shift+Right-click: Set position 2", 
        "§8§l--- POSITIONS ---"
    ];
    
    // Add position information
    if (toolState.pos1) {
        loreLines.push(`§7Position 1: §a${toolState.pos1.x}, ${toolState.pos1.y}, ${toolState.pos1.z}`);
    } else {
        loreLines.push("§7Position 1: §cNot set");
    }
    
    if (toolState.pos2) {
        loreLines.push(`§7Position 2: §a${toolState.pos2.x}, ${toolState.pos2.y}, ${toolState.pos2.z}`);
        
        // Calculate area size if both positions set
        if (toolState.pos1) {
            const dx = Math.abs(toolState.pos2.x - toolState.pos1.x) + 1;
            const dy = Math.abs(toolState.pos2.y - toolState.pos1.y) + 1;
            const dz = Math.abs(toolState.pos2.z - toolState.pos1.z) + 1;
            const volume = dx * dy * dz;
            
            loreLines.push(`§7Area: §f${dx}×${dy}×${dz} §7(${volume.toLocaleString()} blocks)`);
        }
    } else {
        loreLines.push("§7Position 2: §cNot set");
    }
    
    loreLines.push("§8§l--- CLIPBOARD ---");
    
    // Add clipboard information
    if (toolState.copiedStructureId) {
        loreLines.push(`§7Structure: §f${toolState.copiedStructureId}`);
        loreLines.push("§7Ready to paste");
    } else {
        loreLines.push("§7No structure copied");
        loreLines.push("§7Use /copy to copy selection");
    }
    
    return loreLines;
}

// Set position function
function setposFunction(origin, location1 = null, location2 = null, posNumber = null) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            
            let toolState = COPY_PASTE_STATES.get(player.id);
            if (!toolState) {
                toolState = { pos1: null, pos2: null, copiedStructureId: null };
                COPY_PASTE_STATES.set(player.id, toolState);
            }
            
            // Set position
            if (posNumber == null) {
                const pos1 = { x: Math.floor(location1.x), y: Math.floor(location1.y), z: Math.floor(location1.z) };
                const pos2 = { x: Math.floor(location2.x), y: Math.floor(location2.y), z: Math.floor(location2.z) };
                
                toolState.pos1 = pos1;
                player.sendMessage(`§aPosition 1 set to: §f${pos1.x}, ${pos1.y}, ${pos1.z}`);
            
                toolState.pos2 = pos2;
                player.sendMessage(`§aPosition 2 set to: §f${pos2.x}, ${pos2.y}, ${pos2.z}`);
            } else if (posNumber == 1) {
                const pos1 = { x: Math.floor(location1.x), y: Math.floor(location1.y), z: Math.floor(location1.z) };
                toolState.pos1 = pos1;
                player.sendMessage(`§aPosition 1 set to: §f${pos1.x}, ${pos1.y}, ${pos1.z}`);
            } else if (posNumber == 2) {
                const pos2 = { x: Math.floor(location2.x), y: Math.floor(location2.y), z: Math.floor(location2.z) };
                toolState.pos2 = pos2;
                player.sendMessage(`§aPosition 2 set to: §f${pos2.x}, ${pos2.y}, ${pos2.z}`);
            }
           
            
            // Update tool if player has it
            updatePlayerTool(player, toolState);
            
        } catch (e) {
            console.log("Failed to set position: " + e);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Position 1 function
function pos1Function(origin, location = null) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            const pos = location || player.location;
            setposFunction(origin, pos, null, 1);
            
        } catch (e) {
            console.log("Failed to set pos1: " + e);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Position 2 function  
function pos2Function(origin, location = null) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            const pos = location || player.location;
            setposFunction(origin, null, pos, 2);
            
        } catch (e) {
            console.log("Failed to set pos2: " + e);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Clear positions function
function clearposFunction(origin) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            let toolState = COPY_PASTE_STATES.get(player.id);
            if (!toolState) {
                player.sendMessage("§7No positions to clear.");
                return;
            }
            
            toolState.pos1 = null;
            toolState.pos2 = null;
            
            player.sendMessage("§aPositions cleared!");
            
            // Update tool if player has it
            updatePlayerTool(player, toolState);
            
        } catch (e) {
            console.log("Failed to clear positions: " + e);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Copy function
function copyFunction(origin, includeEntities = false) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            const toolState = COPY_PASTE_STATES.get(player.id);
            if (!toolState || !toolState.pos1 || !toolState.pos2) {
                player.sendMessage("§cBoth positions must be set! Use /pos1 and /pos2 or the copy paste tool.");
                return;
            }
            
            // Calculate area
            const volume = calculateVolume(toolState.pos1, toolState.pos2);
            if (volume > 1000000) {
                player.sendMessage(`§cArea too large! ${volume.toLocaleString()} blocks. Maximum is 1000,000.`);
                return;
            }
            
            // Generate structure ID
            const structureId = generateStructureCode();
            
            player.sendMessage("§7Copying structure...");
            
            // Copy structure
            const success = copyStructure(player, toolState.pos1, toolState.pos2, structureId, includeEntities);
            
            if (success) {
                toolState.copiedStructureId = structureId;
                player.sendMessage(`§aStructure copied! ID: §f${structureId}`);
                player.sendMessage(`§7Size: ${volume.toLocaleString()} blocks${includeEntities ? " (with entities)" : ""}`);
                
                // Update tool
                updatePlayerTool(player, toolState);
            } else {
                player.sendMessage("§cFailed to copy structure!");
            }
            
        } catch (e) {
            console.log("Failed to copy: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to copy: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Paste function
function pasteFunction(origin, location = null) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            const toolState = COPY_PASTE_STATES.get(player.id);
            if (!toolState || !toolState.copiedStructureId) {
                player.sendMessage("§cNo structure in clipboard! Use /copy first.");
                return;
            }
            
            const pasteLocation = location || {
                x: Math.floor(player.location.x),
                y: Math.floor(player.location.y), 
                z: Math.floor(player.location.z)
            };
            
            player.sendMessage("§7Pasting structure...");
            
            // Paste structure
            const success = pasteStructure(player, toolState.copiedStructureId, pasteLocation);
            
            if (success) {
                player.sendMessage(`§aStructure pasted at: §f${pasteLocation.x}, ${pasteLocation.y}, ${pasteLocation.z}`);
            } else {
                player.sendMessage("§cFailed to paste structure!");
            }
            
        } catch (e) {
            console.log("Failed to paste: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to paste: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Cut function
function cutFunction(origin, includeEntities = false) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            const toolState = COPY_PASTE_STATES.get(player.id);
            if (!toolState || !toolState.pos1 || !toolState.pos2) {
                player.sendMessage("§cBoth positions must be set! Use /pos1 and /pos2 or the copy paste tool.");
                return;
            }
            
            // First copy the structure
            copyFunction(origin, includeEntities);
            
            // Then clear the original area
            player.sendMessage("§7Clearing original area...");
            system.runTimeout(() => clearArea(player, toolState.pos1, toolState.pos2, includeEntities), 20);
            
            player.sendMessage("§aStructure cut (copied and cleared original area)!");
            
        } catch (e) {
            console.log("Failed to cut: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to cut: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Move function
function moveFunction(origin, newLocation, includeEntities = false) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player || player.typeId !== "minecraft:player") return;
            
            const toolState = COPY_PASTE_STATES.get(player.id);
            if (!toolState || !toolState.pos1 || !toolState.pos2) {
                player.sendMessage("§cBoth positions must be set! Use /pos1 and /pos2 or the copy paste tool.");
                return;
            }
            
            // Copy, paste, then clear original
            const volume = calculateVolume(toolState.pos1, toolState.pos2);
            player.sendMessage(`§7Moving structure (${volume.toLocaleString()} blocks)...`);
            
            // Generate structure ID for temporary storage
            const structureId = generateStructureCode();
            
            // Copy structure
            const copySuccess = copyStructure(player, toolState.pos1, toolState.pos2, structureId, includeEntities);
            
            if (copySuccess) {
                // Paste at new location
                const pasteSuccess = pasteStructure(player, structureId, newLocation);
                
                if (pasteSuccess) {
                    // Clear original area
                    clearArea(player, toolState.pos1, toolState.pos2, includeEntities);
                    
                    player.sendMessage(`§aStructure moved to: §f${newLocation.x}, ${newLocation.y}, ${newLocation.z}`);
                    
                    // Update positions to new location
                    const offset = {
                        x: newLocation.x - toolState.pos1.x,
                        y: newLocation.y - toolState.pos1.y,
                        z: newLocation.z - toolState.pos1.z
                    };
                    
                    toolState.pos1 = newLocation;
                    toolState.pos2 = {
                        x: toolState.pos2.x + offset.x,
                        y: toolState.pos2.y + offset.y,
                        z: toolState.pos2.z + offset.z
                    };
                    
                    updatePlayerTool(player, toolState);
                } else {
                    player.sendMessage("§cFailed to paste structure at new location!");
                }
                
                // Clean up temporary structure
                try {
                    world.structureManager.delete(structureId);
                } catch (e) {
                    console.log(`Failed to delete temporary structure: ${e}`);
                }
            } else {
                player.sendMessage("§cFailed to copy structure for moving!");
            }
            
        } catch (e) {
            console.log("Failed to move: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to move: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Update player tool lore if they have the tool
function updatePlayerTool(player, toolState) {
    try {
        const equippable = player.getComponent("minecraft:equippable");
        const heldItem = equippable?.getEquipment(EquipmentSlot.Mainhand);
        
        if (heldItem && heldItem.nameTag && heldItem.nameTag.includes("Copy Paste Tool")) {
            const newTool = heldItem.clone();
            const updatedLore = updateToolLoreCopyTool(player, newTool, toolState);
            newTool.setLore(updatedLore);
            equippable.setEquipment(EquipmentSlot.Mainhand, newTool);
        }
    } catch (e) {
        console.log(`Failed to update tool: ${e}`);
    }
}

// Helper functions
function calculateVolume(pos1, pos2) {
    const dx = Math.abs(pos2.x - pos1.x) + 1;
    const dy = Math.abs(pos2.y - pos1.y) + 1;
    const dz = Math.abs(pos2.z - pos1.z) + 1;
    return dx * dy * dz;
}

function copyStructure(player, pos1, pos2, structureId, includeEntities) {
    try {
        const structureManager = world.structureManager;
        
        // Calculate bounds
        const from = {
            x: Math.min(pos1.x, pos2.x),
            y: Math.min(pos1.y, pos2.y),
            z: Math.min(pos1.z, pos2.z)
        };
        
        const to = {
            x: Math.max(pos1.x, pos2.x),
            y: Math.max(pos1.y, pos2.y),
            z: Math.max(pos1.z, pos2.z)
        };
        
        // Save structure
        structureManager.createFromWorld(structureId, player.dimension, from, to, {
            includeEntities: includeEntities,
            includeBlocks: true
        });
        
        return true;
    } catch (e) {
        console.log(`Failed to copy structure: ${e}`);
        return false;
    }
}

function pasteStructure(player, structureId, location) {
    try {
        const structureManager = world.structureManager;
        
        structureManager.place(structureId, player.dimension, location);
        
        return true;
    } catch (e) {
        console.log(`Failed to paste structure: ${e}`);
        return false;
    }
}

function clearArea(player, pos1, pos2, includeEntities) {
    try {
        // Fill area with air blocks
        const from = {
            x: Math.min(pos1.x, pos2.x),
            y: Math.min(pos1.y, pos2.y),
            z: Math.min(pos1.z, pos2.z)
        };
        
        const to = {
            x: Math.max(pos1.x, pos2.x),
            y: Math.max(pos1.y, pos2.y),
            z: Math.max(pos1.z, pos2.z)
        };
        
        // Use fill command to clear area
        player.runCommand(`largefill ${from.x} ${from.y} ${from.z} ${to.x} ${to.y} ${to.z} air replace`);
        
        // Clear entities if requested
        if (includeEntities) {
            const centerX = (from.x + to.x) / 2;
            const centerY = (from.y + to.y) / 2;
            const centerZ = (from.z + to.z) / 2;
            const radius = Math.max(to.x - from.x, to.y - from.y, to.z - from.z) / 2 + 2;
            
            const entities = player.dimension.getEntities({
                location: { x: centerX, y: centerY, z: centerZ },
                maxDistance: radius
            });
            
            for (const entity of entities) {
                if (entity.typeId !== "minecraft:player" && 
                    entity.location.x >= from.x && entity.location.x <= to.x &&
                    entity.location.y >= from.y && entity.location.y <= to.y &&
                    entity.location.z >= from.z && entity.location.z <= to.z) {
                    try {
                        entity.remove();
                    } catch (e) {
                        console.log(`Failed to remove entity: ${e}`);
                    }
                }
            }
        }
        
    } catch (e) {
        console.log(`Failed to clear area: ${e}`);
    }
}

// Event handlers
world.beforeEvents.playerBreakBlock.subscribe((ev) => {
    const player = ev.player;
    const equippable = player.getComponent("minecraft:equippable");
    const heldItem = equippable?.getEquipment(EquipmentSlot.Mainhand);
    
    // Check if holding copy paste tool
    if (!heldItem || !heldItem.nameTag || !heldItem.nameTag.includes("Copy Paste Tool")) return;
    
    // Cancel the break event
    ev.cancel = true;
    
    // Set position 1
    const location = ev.block.location;
    pos1Function({ sourceEntity: player }, location);
});

world.afterEvents.itemUse.subscribe((ev) => {
    if (ev.source.typeId !== "minecraft:player" || !ev.itemStack) return;
    
    const player = ev.source;
    const itemStack = ev.itemStack;
    
    // Check if it's the copy paste tool
    if (!itemStack.nameTag || !itemStack.nameTag.includes("Copy Paste Tool")) return;
    
    try {
        // Check if player is sneaking (shift+right-click)
        if (player.isSneaking) {
            // Set position 2 at block player is looking at
            const blockFromView = player.getBlockFromViewDirection({ maxDistance: 100 });
            if (blockFromView && blockFromView.block) {
                pos2Function({ sourceEntity: player }, blockFromView.block.location);
            } else {
                pos2Function({ sourceEntity: player }, null);
            }
        } else {
            // Paste at block player is looking at (or current location)
            const blockFromView = player.getBlockFromViewDirection({ maxDistance: 100 });
            if (blockFromView && blockFromView.block) {
                pasteFunction({ sourceEntity: player }, blockFromView.block.location);
            } else {
                pasteFunction({ sourceEntity: player }, null);
            }
        }
    } catch (e) {
        console.log("Error using copy paste tool: " + e);
        player.sendMessage("§cFailed to use copy paste tool!");
    }
});



// Main math function (unrestricted)
function mathFunction(origin, expression) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player) {
                console.log("Math command requires a player source");
                return;
            }
            
            // Check if player is in creative mode (additional safety)
            try {
                const gamemode = player.runCommand("testfor @s[m=c]");
                // If this doesn't throw an error, player is in creative mode
            } catch (e) {
                player.sendMessage("§cMath command requires creative mode!");
                return;
            }
            
            evaluateMathExpression(player, expression, false);
            
        } catch (e) {
            console.log("Failed to execute math command: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to evaluate expression: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Safe math function (restricted)
function mathSafeFunction(origin, expression) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player) {
                console.log("Math safe command requires a player source");
                return;
            }
            
            evaluateMathExpression(player, expression, true);
            
        } catch (e) {
            console.log("Failed to execute math safe command: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to evaluate expression: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Evaluate mathematical expression
function evaluateMathExpression(player, expression, safeMode) {
    try {
        // Clean the expression
        const cleanExpression = expression.trim();
        
        if (!cleanExpression) {
            player.sendMessage("§cEmpty expression provided!");
            return;
        }
        
        // Show what we're evaluating
        player.sendMessage(`§7Evaluating${safeMode ? " (safe mode)" : ""}: §f${cleanExpression}`);
        
        let result;
        
        if (safeMode) {
            result = evaluateSafeExpression(cleanExpression);
        } else {
            result = evaluateUnrestrictedExpression(cleanExpression);
        }
        
        // Format and display result
        displayMathResult(player, cleanExpression, result, safeMode);
        
    } catch (e) {
        player.sendMessage(`§cError evaluating expression: ${e.message || e}`);
        
        if (safeMode) {
            player.sendMessage("§7Safe mode allows: +, -, *, /, ^, sqrt(), sin(), cos(), tan(), log(), abs(), ceil(), floor(), round()");
        }
    }
}

// Evaluate safe mathematical expression (restricted functions)
function evaluateSafeExpression(expression) {
    // Whitelist of allowed characters and functions for safe mode
    const allowedPattern = /^[0-9+\-*/.()^, \s]*$/;
    const allowedFunctions = ['sqrt', 'sin', 'cos', 'tan', 'log', 'abs', 'ceil', 'floor', 'round', 'max', 'min', 'pi', 'e'];
    
    // Check for basic safety
    if (!allowedPattern.test(expression.replace(/sqrt|sin|cos|tan|log|abs|ceil|floor|round|max|min|pi|e/g, ''))) {
        throw new Error("Expression contains unsafe characters");
    }
    
    // Replace some common mathematical constants and functions for JavaScript
    let jsExpression = expression
        .replace(/\^/g, '**')  // Power operator
        .replace(/pi/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log')
        .replace(/abs/g, 'Math.abs')
        .replace(/ceil/g, 'Math.ceil')
        .replace(/floor/g, 'Math.floor')
        .replace(/round/g, 'Math.round')
        .replace(/max/g, 'Math.max')
        .replace(/min/g, 'Math.min');
    
    // Evaluate using Function constructor (safer than eval)
    try {
        const result = new Function('Math', `"use strict"; return (${jsExpression})`)(Math);
        
        if (typeof result !== 'number' || !isFinite(result)) {
            throw new Error("Result is not a valid number");
        }
        
        return result;
    } catch (e) {
        throw new Error(`Invalid mathematical expression: ${e.message}`);
    }
}

// Evaluate unrestricted mathematical expression (creative mode only)
function evaluateUnrestrictedExpression(expression) {
    try {
        // More advanced mathematical operations allowed in creative mode
        let jsExpression = expression
            .replace(/\^/g, '**')  // Power operator
            .replace(/pi/g, 'Math.PI')
            .replace(/e/g, 'Math.E')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/asin/g, 'Math.asin')
            .replace(/acos/g, 'Math.acos')
            .replace(/atan/g, 'Math.atan')
            .replace(/log/g, 'Math.log')
            .replace(/log10/g, 'Math.log10')
            .replace(/log2/g, 'Math.log2')
            .replace(/abs/g, 'Math.abs')
            .replace(/ceil/g, 'Math.ceil')
            .replace(/floor/g, 'Math.floor')
            .replace(/round/g, 'Math.round')
            .replace(/max/g, 'Math.max')
            .replace(/min/g, 'Math.min')
            .replace(/random/g, 'Math.random')
            .replace(/pow/g, 'Math.pow');
        
        // Still use Function constructor for safety
        const result = new Function('Math', `"use strict"; return (${jsExpression})`)(Math);
        
        if (typeof result !== 'number') {
            throw new Error("Result is not a number");
        }
        
        return result;
    } catch (e) {
        throw new Error(`Invalid mathematical expression: ${e.message}`);
    }
}

// Display mathematical result with formatting
function displayMathResult(player, expression, result, safeMode) {
    try {
        // Format the result based on its value
        let formattedResult;
        
        if (Math.abs(result) < 0.0001 && result !== 0) {
            // Scientific notation for very small numbers
            formattedResult = result.toExponential(6);
        } else if (Math.abs(result) > 999999999) {
            // Scientific notation for very large numbers
            formattedResult = result.toExponential(6);
        } else if (result % 1 === 0) {
            // Integer result
            formattedResult = result.toString();
        } else {
            // Decimal result - limit to 8 decimal places
            formattedResult = parseFloat(result.toFixed(8)).toString();
        }
        
        // Main result
        player.sendMessage(`§a= §f${formattedResult}`);
        
        // Additional information for certain results
        if (result === Math.PI) {
            player.sendMessage("§7(π - Pi)");
        } else if (result === Math.E) {
            player.sendMessage("§7(e - Euler's number)");
        } else if (Math.abs(result - Math.PI) < 0.0001) {
            player.sendMessage("§7(≈ π)");
        } else if (Math.abs(result - Math.E) < 0.0001) {
            player.sendMessage("§7(≈ e)");
        }
        
        // Show binary/hex for integers in unrestricted mode
        if (!safeMode && result % 1 === 0 && Math.abs(result) < 2147483648) {
            const intResult = Math.floor(result);
            if (intResult !== 0) {
                player.sendMessage(`§7Binary: ${intResult.toString(2)}`);
                player.sendMessage(`§7Hex: 0x${intResult.toString(16).toUpperCase()}`);
            }
        }
        
        // Show calculation time for complex expressions
        if (expression.length > 20 || expression.includes('sin') || expression.includes('cos') || expression.includes('log')) {
            player.sendMessage("§7Calculation completed");
        }
        
    } catch (e) {
        player.sendMessage(`§aResult: ${result}`);
        console.log("Failed to format math result: " + e);
    }
}


function mathHelpFunction(origin) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player) return;
            
            player.sendMessage("§a--- Mathematical Functions ---");
            player.sendMessage("§7Available in /mathsafe:");
            player.sendMessage("§f• Basic: §7+, -, *, /, ^ (power)");
            player.sendMessage("§f• Functions: §7sqrt(), sin(), cos(), tan()");
            player.sendMessage("§f• Logarithms: §7log() (natural log)");
            player.sendMessage("§f• Rounding: §7abs(), ceil(), floor(), round()");
            player.sendMessage("§f• Comparison: §7max(), min()");
            player.sendMessage("§f• Constants: §7pi, e");
            
            player.sendMessage("");
            player.sendMessage("§7Additional in /math (creative only):");
            player.sendMessage("§f• Inverse trig: §7asin(), acos(), atan()");
            player.sendMessage("§f• More logs: §7log10(), log2()");
            player.sendMessage("§f• Advanced: §7pow(), random()");
            player.sendMessage("§f• Number formats: §7binary, hex display");
            
            player.sendMessage("");
            player.sendMessage("§7Examples:");
            player.sendMessage("§f/mathsafe 2^3 + sqrt(16)");
            player.sendMessage("§f/mathsafe sin(pi/4) * cos(pi/4)");
            player.sendMessage("§f/math log10(1000) + random()");
            
        } catch (e) {
            console.log("Failed to show math help: " + e);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function convertFunction(origin, value, fromUnit, toUnit) {
    system.run(() => {
        try {
            const player = origin.sourceEntity;
            if (!player) return;
            
            const result = performUnitConversion(value, fromUnit.toLowerCase(), toUnit.toLowerCase());
            
            if (result !== null) {
                player.sendMessage(`§7Converting: §f${value} ${fromUnit}`);
                player.sendMessage(`§a= §f${result} ${toUnit}`);
            } else {
                player.sendMessage("§cUnsupported unit conversion!");
                player.sendMessage("§7Supported: meters/feet, celsius/fahrenheit, kg/lbs");
            }
            
        } catch (e) {
            console.log("Failed to convert units: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cConversion failed: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Perform unit conversion
function performUnitConversion(value, fromUnit, toUnit) {
    const conversions = {
        // Length
        'm_to_ft': value => value * 3.28084,
        'ft_to_m': value => value / 3.28084,
        'm_to_in': value => value * 39.3701,
        'in_to_m': value => value / 39.3701,
        
        // Temperature
        'c_to_f': value => (value * 9/5) + 32,
        'f_to_c': value => (value - 32) * 5/9,
        'c_to_k': value => value + 273.15,
        'k_to_c': value => value - 273.15,
        
        // Weight
        'kg_to_lbs': value => value * 2.20462,
        'lbs_to_kg': value => value / 2.20462,
        'g_to_oz': value => value * 0.035274,
        'oz_to_g': value => value / 0.035274
    };
    
    const conversionKey = `${fromUnit}_to_${toUnit}`;
    
    if (conversions[conversionKey]) {
        const result = conversions[conversionKey](value);
        return Math.round(result * 100000) / 100000; // Round to 5 decimal places
    }
    
    return null;
}




// Initialize scoreboard on startup
system.runTimeout(() => {
    try {
        // Create scoreboard for freeze tracking
        world.scoreboard.addObjective("vertxfreezejail", "Freeze Jail Timer");
        console.log("Freeze jail scoreboard initialized");
    } catch (e) {
        // Scoreboard might already exist
        console.log("Freeze jail scoreboard already exists or failed to create: " + e);
    }
    
    // Start freeze timer system
    startFreezeTimerSystem();
}, 20); // Wait 1 second after startup

// Main freeze function
function freezeFunction(origin, targets, showMessage = true, customMessage = "", freezeTime = 60) {
    system.run(() => {
        try {
            const executor = origin.sourceEntity;
            let frozenCount = 0;
            
            for (const target of targets) {
                if (!target || target.typeId !== "minecraft:player") {
                    if (executor) {
                        executor.sendMessage(`§cTarget must be a player! Skipped ${target?.typeId || "invalid target"}`);
                    }
                    continue;
                }
                
                // Apply freeze
                const success = applyFreeze(target, freezeTime, executor);
                
                if (success) {
                    frozenCount++;
                    
                    // Send message to frozen player
                    if (showMessage) {
                        const message = customMessage || getDefaultFreezeMessage(freezeTime);
                        target.sendMessage(message);
                    }
                    
                    // Log action
                    const executorName = executor?.name || "Console";
                    const timeText = freezeTime === -1 ? "indefinitely" : `for ${freezeTime} seconds`;
                    console.log(`Player ${target.name} frozen by ${executorName} ${timeText}`);
                }
            }
            
            // Confirmation message to executor
            if (executor && frozenCount > 0) {
                const timeText = freezeTime === -1 ? "indefinitely" : `for ${freezeTime} seconds`;
                executor.sendMessage(`§aFroze ${frozenCount} player(s) ${timeText}`);
            }
            
        } catch (e) {
            console.log("Failed to freeze players: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to freeze: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Main unfreeze function
function unfreezeFunction(origin, targets, showMessage = true, customMessage = "") {
    system.run(() => {
        try {
            const executor = origin.sourceEntity;
            let unFrozenCount = 0;
            
            for (const target of targets) {
                if (!target || target.typeId !== "minecraft:player") {
                    if (executor) {
                        executor.sendMessage(`§cTarget must be a player! Skipped ${target?.typeId || "invalid target"}`);
                    }
                    continue;
                }
                
                // Check if player is frozen
                if (!isPlayerFrozen(target)) {
                    if (executor) {
                        executor.sendMessage(`§e${target.name} is not frozen`);
                    }
                    continue;
                }
                
                // Remove freeze
                const success = removeFreeze(target, executor);
                
                if (success) {
                    unFrozenCount++;
                    
                    // Send message to unfrozen player
                    if (showMessage) {
                        const message = customMessage || "§aYou have been unfrozen! You can now move and use commands.";
                        target.sendMessage(message);
                    }
                    
                    // Log action
                    const executorName = executor?.name || "Console";
                    console.log(`Player ${target.name} unfrozen by ${executorName}`);
                }
            }
            
            // Confirmation message to executor
            if (executor && unFrozenCount > 0) {
                executor.sendMessage(`§aUnfroze ${unFrozenCount} player(s)`);
            }
            
        } catch (e) {
            console.log("Failed to unfreeze players: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to unfreeze: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Apply freeze to a player
function applyFreeze(player, freezeTime, executor) {
    try {
        // Store freeze time in scoreboard (-10 for infinite, positive for timed)
        const scoreboardTime = freezeTime === -1 ? -10 : freezeTime;
        
        const objective = world.scoreboard.getObjective("vertxfreezejail");
        if (!objective) {
            console.log("Freeze jail scoreboard not found!");
            return false;
        }
        
        // Set score for player
        objective.setScore(player, scoreboardTime);
        
        // Disable player permissions
        player.runCommand("inputpermission set @s movement disabled");
        player.runCommand("inputpermission set @s camera disabled");
        
        // Add freeze tag for easy identification
        player.addTag("vertx_frozen");
        
        return true;
        
    } catch (e) {
        console.log(`Failed to apply freeze to ${player.name}: ${e}`);
        return false;
    }
}

// Remove freeze from a player
function removeFreeze(player, executor) {
    try {
        const objective = world.scoreboard.getObjective("vertxfreezejail");
        if (!objective) {
            console.log("Freeze jail scoreboard not found!");
            return false;
        }
        
        // Remove from scoreboard
        objective.setScore(player, 0);
        
        // Restore player permissions
        player.runCommand("inputpermission set @s movement enabled");
        player.runCommand("inputpermission set @s camera enabled");
        
        // Remove effects
        player.removeEffect("slowness");
        player.removeEffect("mining_fatigue");
        player.removeEffect("weakness");
        
        // Remove freeze tag
        player.removeTag("vertx_frozen");
        
        return true;
        
    } catch (e) {
        console.log(`Failed to remove freeze from ${player.name}: ${e}`);
        return false;
    }
}

// Check if player is frozen
function isPlayerFrozen(player) {
    try {
        const objective = world.scoreboard.getObjective("vertxfreezejail");
        if (!objective) return false;
        
        const score = objective.getScore(player);
        return score !== undefined && score !== 0;
        
    } catch (e) {
        return false;
    }
}

// Get default freeze message
function getDefaultFreezeMessage(freezeTime) {
    if (freezeTime === -1) {
        return "§c§lYou have been FROZEN indefinitely!\n§7You cannot move or use commands until unfrozen by staff.";
    } else {
        const minutes = Math.floor(freezeTime / 60);
        const seconds = freezeTime % 60;
        const timeText = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
        return `§c§lYou have been FROZEN for ${timeText}!\n§7You cannot move or use commands during this time.`;
    }
}

// Freeze timer system - runs every second
function startFreezeTimerSystem() {
    system.runInterval(() => {
        try {
            const objective = world.scoreboard.getObjective("vertxfreezejail");
            if (!objective) return;
            
            // Get all players
            const players = world.getAllPlayers();
            
            for (const player of players) {
                try {
                    const score = objective.getScore(player);
                    
                    if (score !== undefined && score > 0) {
                        // Player has active freeze timer
                        const newScore = score - 1;
                        
                        if (newScore <= 0) {
                            // Timer expired, unfreeze player
                            removeFreeze(player, null);
                            player.sendMessage("§aYour freeze time has expired! You can now move freely.");
                            console.log(`Player ${player.name} automatically unfrozen (timer expired)`);
                        } else {
                            // Update timer
                            objective.setScore(player, newScore);
                            
                            // Send periodic reminders
                            if (newScore % 30 === 0 && newScore <= 120) { // Every 30s for last 2 minutes
                                const minutes = Math.floor(newScore / 60);
                                const seconds = newScore % 60;
                                const timeText = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
                                player.sendMessage(`§e§lFreeze time remaining: ${timeText}`);
                            }
                        }
                    }
                } catch (e) {
                    console.log(`Error processing freeze timer for ${player.name}: ${e}`);
                }
            }
            
        } catch (e) {
            console.log("Error in freeze timer system: " + e);
        }
    }, 20); // Run every second (20 ticks)
}


function freezeStatusFunction(origin, targets = null) {
    system.run(() => {
        try {
            const executor = origin.sourceEntity;
            if (!executor) return;
            
            const objective = world.scoreboard.getObjective("vertxfreezejail");
            if (!objective) {
                executor.sendMessage("§cFreeze system not initialized!");
                return;
            }
            
            let playersToCheck = targets;
            if (!playersToCheck) {
                // Check all players if no target specified
                playersToCheck = world.getAllPlayers();
            }
            
            const frozenPlayers = [];
            
            for (const player of playersToCheck) {
                if (player.typeId !== "minecraft:player") continue;
                
                try {
                    const score = objective.getScore(player);
                    
                    if (score !== undefined && score !== 0) {
                        let timeText;
                        if (score === -10) {
                            timeText = "Infinite";
                        } else {
                            const minutes = Math.floor(score / 60);
                            const seconds = score % 60;
                            timeText = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
                        }
                        
                        frozenPlayers.push({
                            name: player.name,
                            timeRemaining: timeText,
                            score: score
                        });
                    }
                } catch (e) {
                    console.log(`Error checking freeze status for ${player.name}: ${e}`);
                }
            }
            
            if (frozenPlayers.length === 0) {
                executor.sendMessage("§aNo players are currently frozen");
            } else {
                executor.sendMessage("§c--- Frozen Players ---");
                for (const frozen of frozenPlayers) {
                    executor.sendMessage(`§7${frozen.name}: §f${frozen.timeRemaining}`);
                }
                executor.sendMessage(`§7Total: ${frozenPlayers.length} frozen players`);
            }
            
        } catch (e) {
            console.log("Failed to check freeze status: " + e);
            if (origin.sourceEntity) {
                origin.sourceEntity.sendMessage(`§cFailed to check freeze status: ${e.message || e}`);
            }
        }
    });
    
    return { status: CustomCommandStatus.Success };
}