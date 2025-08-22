export const COMMANDS = [{
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
    },
    {
        command: "/help",
        description: "Show all available commands",
        keyWords: ["help", "?", "how", "commands", "all"]
    },
    {
        command: "/search",
        description: "Open gui based on search",
        keyWords: ["help", "?", "how", "commands", "all", "search"]
    },
    {
        command: "/throwtagtool",
        description: "Get throw tag tool for applying tags to entities",
        keyWords: ["tag", "tool", "throw", "entity", "apply"]
    },
    {
        command: "/tagtooladd",
        description: "Add tag to throw tag tool",
        keyWords: ["tag", "tool", "add", "entity"]
    },
    {
        command: "/tagtoolremove",
        description: "Remove tag from throw tag tool",
        keyWords: ["tag", "tool", "remove", "entity"]
    },
    {
        command: "/tagtoolclear",
        description: "Remove all tags from throw tag tool",
        keyWords: ["tag", "tool", "clear", "entity"]
    },
    {
        command: "/removetagtool",
        description: "Get remove tag tool for removing tags from entities",
        keyWords: ["tag", "tool", "remove", "entity", "get"]
    },
    {
        command: "/copypastetool",
        description: "Get copy paste tool for structure operations",
        keyWords: ["copy", "paste", "tool", "structure", "building"]
    },
    {
        command: "/setpos",
        description: "Set position for copy paste tool",
        keyWords: ["setpos", "position", "tool", "copy", "paste"]
    },
    {
        command: "/pos1",
        description: "Set position 1 for copy paste tool",
        keyWords: ["pos1", "position", "tool", "copy", "paste"]
    },
    {
        command: "/pos2",
        description: "Set position 2 for copy paste tool",
        keyWords: ["pos2", "position", "tool", "copy", "paste"]
    },
    {
        command: "/clearpos",
        description: "Clear saved positions for copy paste tool",
        keyWords: ["clearpos", "position", "tool", "copy", "paste"]
    },
    {
        command: "/copy",
        description: "Copy selected area as structure",
        keyWords: ["copy", "structure", "area", "building"]
    },
    {
        command: "/paste",
        description: "Paste copied structure at location",
        keyWords: ["paste", "structure", "area", "building"]
    },
    {
        command: "/cut",
        description: "Cut selected area (copy + clear original)",
        keyWords: ["cut", "structure", "area", "building"]
    },
    {
        command: "/move",
        description: "Move selected area to new location",
        keyWords: ["move", "structure", "area", "building"]
    },
    {
        command: "/math",
        description: "Evaluate mathematical expressions (unrestricted - creative mode only)",
        keyWords: ["math", "calculate", "expression", "creative"]
    },
    {
        command: "/mathsafe",
        description: "Evaluate safe mathematical expressions",
        keyWords: ["math", "calculate", "expression", "safe"]
    },
    {
        command: "/mathhelp",
        description: "Show available mathematical functions",
        keyWords: ["math", "help", "functions", "list"]
    },
    {
        command: "/convert",
        description: "Convert between common units",
        keyWords: ["convert", "unit", "value", "measurement"]
    },
    {
        command: "/calc",
        description: "Quick calculator (alias for mathsafe)",
        keyWords: ["calc", "calculate", "math", "expression"]
    }
];