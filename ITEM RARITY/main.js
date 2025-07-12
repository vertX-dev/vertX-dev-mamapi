import { world, system, EquipmentSlot } from "@minecraft/server";
import { stats, TagMapping, RARITY, blackList } from './dataLib.js';

// Static predefined scoreboards - load early to prevent timing issues
const PREDEFINED_SCOREBOARDS = [
    { name: "damage", displayName: "Damage" },
    { name: "defense", displayName: "Defense" },
    { name: "health", displayName: "Health" },
    { name: "speed", displayName: "Speed" },
    { name: "critchance", displayName: "Crit Chance" },
    { name: "critdamage", displayName: "Crit Damage" },
    { name: "attackspeed", displayName: "Attack Speed" },
    { name: "miningspeed", displayName: "Mining Speed" },
    { name: "luck", displayName: "Luck" },
    { name: "regen", displayName: "Regeneration" },
    { name: "magicfind", displayName: "Magic Find" },
    { name: "knockbackres", displayName: "Knockback Resistance" },
    { name: "fireres", displayName: "Fire Resistance" },
    { name: "flightspeed", displayName: "Flight Speed" },
    { name: "lifesteal", displayName: "Lifesteal" }
];

// Optimized mappings for efficient lookup
let STAT_NAME_LOOKUP = {};
let SCOREBOARD_TRACKER_MAP = {};
let PLAYER_SCOREBOARD_CACHE = new Map();

// Initialize optimized mappings after stats are loaded
function initializeOptimizedMappings() {
    console.log("Initializing optimized stat mappings...");
    
    // Create reverse lookup for stat names to stat objects
    STAT_NAME_LOOKUP = {};
    for (const [key, stat] of Object.entries(stats)) {
        STAT_NAME_LOOKUP[stat.name] = stat;
    }
    
    // Create mapping from scoreboardTracker to sanitized scoreboard name
    SCOREBOARD_TRACKER_MAP = {
        "damage": "damage",
        "defense": "defense", 
        "health": "health",
        "speed": "speed",
        "critChance": "critchance",
        "critDamage": "critdamage",
        "attackSpeed": "attackspeed",
        "miningSpeed": "miningspeed",
        "luck": "luck",
        "regen": "regen",
        "magicFind": "magicfind",
        "knockbackRes": "knockbackres",
        "fireRes": "fireres",
        "flightSpeed": "flightspeed",
        "lifesteal": "lifesteal"
    };
    
    console.log("Optimized mappings initialized.");
}

// Initialize all scoreboards after world is ready
function initializeScoreboards() {
    console.log("Initializing static scoreboards...");
    for (const scoreboard of PREDEFINED_SCOREBOARDS) {
        try {
            const existing = world.scoreboard.getObjective(scoreboard.name);
            if (!existing) {
                world.scoreboard.addObjective(scoreboard.name, scoreboard.displayName);
                console.log(`Scoreboard '${scoreboard.name}' (${scoreboard.displayName}) added.`);
            }
        } catch (e) {
            console.warn(`Failed to add scoreboard '${scoreboard.name}':`, e.message);
        }
    }
    console.log("Static scoreboards initialization complete.");
}

// Subscribe to world initialization event to ensure world is ready
world.afterEvents.worldInitialize.subscribe(() => {
    initializeScoreboards();
    initializeOptimizedMappings();
});

// Clean up cache when players leave to prevent memory leaks
world.afterEvents.playerLeave.subscribe((event) => {
    PLAYER_SCOREBOARD_CACHE.delete(event.playerId);
});

function rarityItemTest(itemStack, player) {
    if (!itemStack || !player) return;

    const lore = itemStack.getLore() ?? [];

    if (lore.length === 0) {
        const Tags = parseTags(itemStack.typeId);

        if (Tags && Tags.rarity) {
            const rarity = randomRarity();
            const stats = randomStats(rarity.sid, Tags.data);
            
            
            
            
            
            const newLore = [rarity.dName, ...stats];
          
            try {
                let newItem = itemStack.clone();
                newItem.setLore(newLore);
                const equippable = player.getComponent("minecraft:equippable");
                if (equippable) {
                    equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
                }
            } catch (error) {
                console.warn("Error applying rarity:", error);
            }
        }
    }
}


function randomStats(rarity, type) {
    // Filter available stats that match the item type
    const availableStats = Object.values(stats).filter(stat => stat.type.includes(type));
    let srr = Object.values(RARITY).find(r => r.sid === rarity);
    
    if (!availableStats.length) {
        return [];
    }
    // Calculate number of stats to add
    let StatsCounter = Math.floor(Math.random() * (srr.maxStats - srr.minStats + 1) + srr.minStats);
    
    let result = [];
    
    if (StatsCounter > 0) {
        result.push("§8Attributes");
        
        let addedStats = 0;
        let attempts = 0;
        const maxAttempts = 20; // Prevent infinite loops
        
        while (addedStats < StatsCounter && attempts < maxAttempts) {
            // Calculate rarity level for this stat
            let statRarityLevel = Math.min(6, Math.max(1, srr.id - Math.floor(Math.random() * 2)));
            let RR = Object.values(RARITY).find(r => r.id === statRarityLevel);
            
            if (!RR) continue;
            
            // Filter stats by rarity
            const validStats = availableStats.filter(s => s.rarity == RR.sid);
            
            if (validStats.length > 0) {
                const newStat = validStats[Math.floor(Math.random() * validStats.length)];

                const newStatValue = Math.floor(Math.random() * (newStat.max - newStat.min + 1) + newStat.min);
                const measure = newStat.measure ?? "";
                const sign = newStatValue >= 0 ? "+" : "";
                
                result.push(`${newStat.name} ${sign}§w${newStatValue}§w${measure}`);
                addedStats++;
            }
            
            attempts++;
        }
        result.push("§a§t§b§e§n§d§r");
    }
    return result;
}


function randomRarity() {
    let rarity = RARITY.COMMON;
    let currentId = rarity.id;

    while (true) {
        const nextRarity = Object.values(RARITY).find(r => r.id === currentId + 1);
        if (!nextRarity) break; // no higher rarity exists

        if (Math.random() <= nextRarity.chance) {
            rarity = nextRarity;
            currentId++;
        } else {
            break;
        }
    }
    return rarity;
}


function parseTags(itemId) {
    for (const blItem of blackList) {
        if (itemId == blItem) {
            return {
                rarity: false
            }
        }
    }
    for (const key of TagMapping) {
        if (itemId.includes(key)) {
            return {
                rarity: true,
                data: key
            };
        }
    }
}



system.runInterval(() => {
    const players = world.getPlayers();
    for (const player of players) {
        rarityItemTest(player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand), player);
        compileBuffs(player);
    }
}, 20)

function compileBuffs(player) {
    const equipment = player.getComponent("minecraft:equippable");
    const slots = [
        EquipmentSlot.Mainhand, EquipmentSlot.Offhand,
        EquipmentSlot.Head, EquipmentSlot.Chest,
        EquipmentSlot.Legs, EquipmentSlot.Feet
    ];
    
    // Initialize stats accumulator with all scoreboards set to 0
    const currentStats = {};
    for (const scoreboardDef of PREDEFINED_SCOREBOARDS) {
        currentStats[scoreboardDef.name] = 0;
    }
    
    // Parse and accumulate stats from all equipment slots
    for (const slot of slots) {
        const attributes = parseLoreToStats(equipment, slot);
        for (let attribute of attributes) {
            const values = attribute.split("§w");
            const statName = values[0];
            const statValue = Number(values[1]);
            
            // Use optimized lookup instead of Object.values().find()
            const StatObj = STAT_NAME_LOOKUP[statName];
            if (!StatObj) continue;
            
            // Use direct mapping instead of sanitizeScoreboardName()
            const scoreboardName = SCOREBOARD_TRACKER_MAP[StatObj.scoreboardTracker];
            if (scoreboardName && currentStats.hasOwnProperty(scoreboardName)) {
                currentStats[scoreboardName] += statValue;
            }
        }
    }

    // Get cached values for this player
    const playerId = player.id;
    const cachedStats = PLAYER_SCOREBOARD_CACHE.get(playerId) || {};
    
    // Only update scoreboards that have changed values
    let hasChanges = false;
    for (const scoreboardName in currentStats) {
        const newValue = Math.floor(currentStats[scoreboardName]);
        const oldValue = cachedStats[scoreboardName] || 0;
        
        if (newValue !== oldValue) {
            hasChanges = true;
            const objective = world.scoreboard.getObjective(scoreboardName);
            if (objective) {
                objective.setScore(player, newValue);
            }
        }
    }
    
    // Update cache only if there were changes
    if (hasChanges) {
        PLAYER_SCOREBOARD_CACHE.set(playerId, { ...currentStats });
    }
}



function parseLoreToStats(equipment, slot) {
    const loreArray = equipment.getEquipment(slot)?.getLore() ?? [];
    const arraySize = loreArray.length;
    if (!arraySize || arraySize === 0 || !loreArray) return [];
    
    let attributes = [];
    let ix = 0;
    let addATB = false;
    while (ix < arraySize && !addATB) {
        if (loreArray[ix] == "§8Attributes") {
            addATB = true;
            ix++;
            while (ix < arraySize && addATB && loreArray[ix] != "§a§t§b§e§n§d§r") {
                attributes.push(loreArray[ix]);
                ix++;
            }
            addATB = false;
        }
        ix++;
    }
    return attributes;
}

