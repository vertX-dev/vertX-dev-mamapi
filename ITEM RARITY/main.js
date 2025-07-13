import { world, system, EquipmentSlot, GameMode } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { stats, TagMapping, RARITY, blackList } from './dataLib.js';

let BOOST_KOEF = 10;

// Static predefined scoreboards - load early to prevent timing issues
const PREDEFINED_SCOREBOARDS = [
    { name: "damage", displayName: "Damage" },//+
    { name: "damagepercent", displayName: "Damage percent bonus" },//+
    { name: "defense", displayName: "Defense" },//+
    { name: "health", displayName: "Health" },//+
    { name: "speed", displayName: "Speed" },//+
    { name: "regeneration", displayName: "Regeneration" },//+
    { name: "critchance", displayName: "Crit Chance" },//+
    { name: "critdamage", displayName: "Crit Damage" },//+
    { name: "lifesteal", displayName: "Life steal" }//+
];

// Initialize all scoreboards early
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

// Initialize scoreboards immediately when the script loads
initializeScoreboards();

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

function getScoreboardValue(scoreboard, player) {
    const scoreboardObj = world.scoreboard.getObjective(scoreboard);
    const scoreboardValue = scoreboardObj.getScore(player);
    return scoreboardValue;
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

                const newStatValue = Math.floor((Math.random() * (newStat.max - newStat.min + 1) + newStat.min) * BOOST_KOEF / 10);
                const measure = newStat.measure ?? "";
                const sign = newStatValue >= 0 ? "+" : "";
                
                result.push(`${newStat.name}§w ${sign}§w${newStatValue}§w${measure}`);
                addedStats++;
            }
            
            attempts++;
        }
        result.push("§a§t§b§e§n§d§r");
    }
    return result;
}


function randomRarity(RR = RARITY.COMMON) {
    let rarity = RR;
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


function parseTags(itemId = "minecraft:apple") {
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
        setMainStats(player);
    }
}, 20);

system.runInterval(() => {
    const players = world.getPlayers();
    for (const player of players) {
        healEntity(player);
    }
}, 200);

function compileBuffs(player) {
    const equipment = player.getComponent("minecraft:equippable");
    const slots = [
        EquipmentSlot.Mainhand, EquipmentSlot.Offhand,
        EquipmentSlot.Head, EquipmentSlot.Chest,
        EquipmentSlot.Legs, EquipmentSlot.Feet
    ];
    
    let scoreboardStats = [];
    
    for (const slot of slots) {
        const attributes = parseLoreToStats(equipment, slot);
        for (let attribute of attributes) {
            const values = attribute.split("§w");
            const StatObj = Object.values(stats).find(d => d.name === values[0]);
            if (!StatObj) continue;
            
            scoreboardStats.push({
                sbObj: StatObj.scoreboardTracker,
                valueToAdd: Number(values[2])
            });
        }
    }

    // Summing values by scoreboardTracker
    const summedStats = {};
    for (const entry of scoreboardStats) {
        // Use the scoreboard name directly since we have predefined static scoreboards
        const scoreboardName = entry.sbObj;
            
        if (!summedStats[scoreboardName]) {
            summedStats[scoreboardName] = 0;
        }
        summedStats[scoreboardName] += entry.valueToAdd;
    }

    // Set score to player for each predefined scoreboard
    for (const scoreboardDef of PREDEFINED_SCOREBOARDS) {
        const scoreValue = summedStats[scoreboardDef.name] || 0;
        const objective = world.scoreboard.getObjective(scoreboardDef.name);
        if (objective) {
            objective.setScore(player, Math.floor(scoreValue));
        }
    }
}



function parseLoreToStats(equipment, slot) {
    const itemStack = equipment.getEquipment(slot);
    if (!itemStack) return [];
    
    const loreArray = itemStack.getLore();
    if (!loreArray || loreArray.length === 0) return [];
    
    let attributes = [];
    let ix = 0;
    let addATB = false;
    
    while (ix < loreArray.length) {
        if (loreArray[ix] === "§8Attributes") {
            addATB = true;
            ix++;
            while (ix < loreArray.length && loreArray[ix] !== "§a§t§b§e§n§d§r") {
                attributes.push(loreArray[ix]);
                ix++;
            }
            break;
        }
        ix++;
    }
    
    return attributes;
}
function healEntity(entity, value = getScoreboardValue("regeneration", entity)) {
    let cHealth = entity.getComponent("minecraft:health");
    cHealth.setCurrentValue(Math.min((cHealth.currentValue + Math.floor(value)), cHealth.effectiveMax));
}

function setMainStats(player) {
    //get all stats
    let health = Math.floor(getScoreboardValue("health", player) / 4) - 1;
    let defense = Math.floor(Math.min(getScoreboardValue("defense", player), 80) / 20) - 1;
    let speed = Math.floor(Math.min(getScoreboardValue("speed", player), 200) / 20) - 1;
    
    if (health >= 0) {
        player.addEffect("health_boost", 50, {amplifier: health, showParticles: false});
    }
    if (defense >= 0) {
        player.addEffect("resistance", 50, {amplifier: defense, showParticles: false});
    }
    if (speed >= 0) {
        player.addEffect("speed", 50, {amplifier: speed, showParticles: false});
    }
}

function calculateDamage(player, damage = 0) {
    damage = (damage + getScoreboardValue("damage", player)) * (1 + (getScoreboardValue("damagepercent", player) / 100));

    const critChance = getScoreboardValue("critchance", player);
    if ((Math.random() * 100) <= critChance + 5) {
        damage = damage * (1 + (getScoreboardValue("critdamage", player) / 100));
        player.runCommand("title @s actionbar §cCRIT " + damage);
    }
    
    return Math.floor(damage);
}

world.afterEvents.entityHurt.subscribe((ev) => {
    if (!ev.damageSource.damagingEntity || ev.damageSource.damagingEntity?.typeId != "minecraft:player") return;
    const player = ev.damageSource.damagingEntity;
    const mob = ev.hurtEntity;
    let damage = calculateDamage(player, ev.damage);
    
    let range = ["bow", "crossbow"];
    if (!range.includes(parseTags(player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand)?.typeId).data)) {
        
        mob.applyDamage(damage);
        
        healEntity(player, (getScoreboardValue("lifesteal", player) / 100) * damage);
    }
    
});
/*
world.beforeEvents.chatSend.subscribe((eventData) => {
    const player = eventData.sender;
    const message = eventData.message;
    if (message.startsWith(".settings")) {
        eventData.cancel = true;
        system.runTimeout(() => {
            settings(player);
        },50);
    }
    if (message.startsWith(".setrarity")) {
        eventData.cancel = true;
        system.runTimeout(() => {
            let params = message.split(" ");
            giveItem(player, player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand), params[1]);
        },50);
    }
});

function settings(player) {
    const form = new ModalFormData()
    form.title("§aSTATS SETTINGS");
    form.slider("§6ATTRIBUTE MULTIPLIER (default 10)", 1, 30, 1, BOOST_KOEF);
    form.show(player).then((response) => {
        if (response.canceled) return;
        BOOST_KOEF = response.formValues[0];
    });
}

function giveItem(player, itemStack, rarity) {
    if (!itemStack || !player) return;
    
    const Tags = parseTags(itemStack.typeId);

    if (Tags && Tags.rarity) {
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
*/

world.afterEvents.projectileHitEntity.subscribe((ev) => {
    if (!ev.source || ev.source.typeId != "minecraft:player") return;
    const player = ev.source;
    const mob = ev.getEntityHit();
    if (mob.typeId != "minecraft:enderman") {
        let damage = calculateDamage(player, 6);
        
        mob.applyDamage(damage);
        
        healEntity(player, ((getScoreboardValue("lifesteal", player) / 100) * damage) / 2);
    }
});