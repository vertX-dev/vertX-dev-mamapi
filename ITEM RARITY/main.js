import { world, system, EquipmentSlot, GameMode } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { stats, TagMapping, RARITY, blackList, skills, passives } from './dataLib.js';

//=====================================CONFIGURATION & CONSTANTS===========================================

let BOOST_COEF = 10;

// Static predefined scoreboards - load early to prevent timing issues
const PREDEFINED_SCOREBOARDS = [
    { name: "damage", displayName: "Damage" },
    { name: "damagepercent", displayName: "Damage percent bonus" },
    { name: "defense", displayName: "Defense" },
    { name: "health", displayName: "Health" },
    { name: "speed", displayName: "Speed" },
    { name: "regeneration", displayName: "Regeneration" },
    { name: "critchance", displayName: "Crit Chance" },
    { name: "critdamage", displayName: "Crit Damage" },
    { name: "lifesteal", displayName: "Life steal" }
];

//=====================================UTILITY FUNCTIONS===========================================

function getScoreboardValue(scoreboard, player) {
    const scoreboardObj = world.scoreboard.getObjective(scoreboard);
    const scoreboardValue = scoreboardObj.getScore(player);
    return scoreboardValue;
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

//=====================================CORE GAME LOGIC===========================================

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

                const newStatValue = Math.floor((Math.random() * (newStat.max - newStat.min + 1) + newStat.min) * BOOST_COEF / 10);
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

function randomSkill(rarity, type) {
    // Filter available skills that match the item type
    const availableSkills = Object.values(skills).filter(skill => skill.type.includes(type));
    let srr = Object.values(RARITY).find(r => r.sid === rarity);
    
    if (!availableSkills.length || srr.skillChances.skill < Math.random()) {
        return [];
    }
    
    let result = [];
    let skillData = null;
    
    // Generate skill data first
    const statRarityLevel = Math.min(6, Math.max(1, srr.id - Math.floor(Math.random() * 2)));
    const RR = Object.values(RARITY).find(r => r.id === statRarityLevel);
        
    if (RR) {
        const validSkills = availableSkills.filter(s => s.rarity == RR.sid);
        
        if (validSkills.length > 0) {
            const newSkill = validSkills[Math.floor(Math.random() * validSkills.length)];

            const newSkillValue = Math.floor((Math.random() * (newSkill.max - newSkill.min + 1) + newSkill.min) * BOOST_COEF / 10);
            const newSkillValueST = ("§w" + newSkillValue + "§w");
            const description = newSkill.description.replace("{x}", newSkillValueST).replace("§x", RR.color);
            
            skillData = {
                name: newSkill.name,
                description: description
            };
        }
    }
    
    // Push skill section and data if we have valid skill data
    if (skillData) {
        result.push("§8Skill");
        result.push(skillData.name);
        result.push(skillData.description);
        result.push("§s§k§l§e§n§d§r");
    }
    
    return result;
}

function randomPassiveAbility(rarity, type) {
    // Filter available passives that match the item type
    const availablePassives = Object.values(passives).filter(passive => passive.type.includes(type));
    let srr = Object.values(RARITY).find(r => r.sid === rarity);
    
    if (!availablePassives.length || srr.skillChances.passive < Math.random()) {
        return [];
    }
    
    let result = [];
    let passiveData = null;
    
    // Generate passive data first
    const statRarityLevel = Math.min(6, Math.max(1, srr.id - Math.floor(Math.random() * 2)));
    const RR = Object.values(RARITY).find(r => r.id === statRarityLevel);
        
    if (RR) {
        const validPassives = availablePassives.filter(s => s.rarity == RR.sid);
        
        if (validPassives.length > 0) {
            const newPassive = validPassives[Math.floor(Math.random() * validPassives.length)];

            const newPassiveValue = Math.floor((Math.random() * (newPassive.max - newPassive.min + 1) + newPassive.min) * BOOST_COEF / 10);
            const newPassiveValueST = ("§w" + newPassiveValue + "§w");
            const description = newPassive.description.replace("{x}", newPassiveValueST).replace("§x", RR.color);
            
            passiveData = {
                name: newPassive.name,
                description: description
            };
        }
    }
    
    // Push passive section and data if we have valid passive data
    if (passiveData) {
        result.push("§8Passive ability");
        result.push(passiveData.name);
        result.push(passiveData.description);
        result.push("§p§v§a§e§n§d§r");
    }
    
    return result;
}

function rarityItemTest(itemStack, player) {
    if (!itemStack || !player) return;

    const lore = itemStack.getLore() ?? [];

    if (lore.length === 0) {
        const Tags = parseTags(itemStack.typeId);

        if (Tags && Tags.rarity) {
            const rarity = randomRarity();
            
            const stats = randomStats(rarity.sid, Tags.data);
            
            const skill = randomSkill(rarity.sid, Tags.data);
            
            const passive = randomPassiveAbility(rarity.sid, Tags.data);
            
            const newLore = [rarity.dName, ...stats, ...skill, ...passive];
          
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

function calculateDamage(player, damage = 0) {
    damage = (damage + getScoreboardValue("damage", player)) * (1 + (getScoreboardValue("damagepercent", player) / 100));

    const critChance = getScoreboardValue("critchance", player);
    if ((Math.random() * 100) <= critChance + 5) {
        damage = damage * (1 + (getScoreboardValue("critdamage", player) / 100));
        player.runCommand("title @s actionbar §cCRIT " + damage.toFixed(1));
    }
    
    return Math.floor(damage);
}

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

//=====================================LORE PARSING FUNCTIONS===========================================

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

function parseLoreToSkills(equipment, slot) {
    const itemStack = equipment.getEquipment(slot);
    if (!itemStack) return [];
    
    const loreArray = itemStack.getLore();
    if (!loreArray || loreArray.length === 0) return [];
    
    let attributes = [];
    let ix = 0;
    let addATB = false;
    
    while (ix < loreArray.length) {
        if (loreArray[ix] === "§8Skill") {
            addATB = true;
            ix++;
            while (ix < loreArray.length && loreArray[ix] !== "§s§k§l§e§n§d§r") {
                attributes.push(loreArray[ix]);
                ix++;
            }
            break;
        }
        ix++;
    }
    let string = attributes.join(" ");
    string = string.match(/§w(.*?)§w/);
    
    const Skill = {
        name: attributes[0],
        value: Number(string[1])
    }
    
    return Skill;
}

function parseLoreToPassive(equipment, slot) {
    const itemStack = equipment.getEquipment(slot);
    if (!itemStack) return [];
    
    const loreArray = itemStack.getLore();
    if (!loreArray || loreArray.length === 0) return [];
    
    let attributes = [];
    let ix = 0;
    let addATB = false;
    
    while (ix < loreArray.length) {
        if (loreArray[ix] === "§8Passive ability") {
            addATB = true;
            ix++;
            while (ix < loreArray.length && loreArray[ix] !== "§p§v§a§e§n§d§r") {
                attributes.push(loreArray[ix]);
                ix++;
            }
            break;
        }
        ix++;
    }
    let string = attributes.join(" ");
    string = string.match(/§w(.*?)§w/);
    
    const Passive = {
        name: attributes[0],
        value: Number(string[1])
    }
    
    return Passive;
}

//=====================================EVENT LISTENERS & HANDLERS===========================================

// Core game loops
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

// Passive ability triggers - every second for buff-type passives
system.runInterval(() => {
    const players = world.getPlayers();
    for (const player of players) {
        // DO: Implement passive abilities that trigger every second (buffs, regeneration, etc.)
        // Example: Check for passive abilities that provide continuous effects
        // const equipment = player.getComponent("minecraft:equippable");
        // const slots = [EquipmentSlot.Mainhand, EquipmentSlot.Offhand, EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet];
        // for (const slot of slots) {
        //     const passive = parseLoreToPassive(equipment, slot);
        //     if (passive.name) {
        //         // Apply passive effects based on passive.name and passive.value
        //     }
        // }
    }
}, 20);

// Combat event handlers
world.afterEvents.entityHurt.subscribe((ev) => {
    if (!ev.damageSource.damagingEntity || ev.damageSource.damagingEntity?.typeId != "minecraft:player") return;
    const player = ev.damageSource.damagingEntity;
    const mob = ev.hurtEntity;
    let damage = calculateDamage(player, ev.damage);
    
    let range = ["sword", "axe", "pickaxe", "trident", "mace"];
    if (range.includes(parseTags(player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand)?.typeId).data)) {
        
        mob.applyDamage(damage);
        
        healEntity(player, (getScoreboardValue("lifesteal", player) / 100) * damage);
        
        // DO: Trigger passive abilities on hitting entity
        // const equipment = player.getComponent("minecraft:equippable");
        // const slots = [EquipmentSlot.Mainhand, EquipmentSlot.Offhand, EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet];
        // for (const slot of slots) {
        //     const passive = parseLoreToPassive(equipment, slot);
        //     if (passive.name) {
        //         // Apply passive effects that trigger on hitting entities
        //     }
        // }
    }
});

world.afterEvents.projectileHitEntity.subscribe((ev) => {
    if (!ev.source || ev.source.typeId !== "minecraft:player") return;

    const player = ev.source;
    const entityHit = ev.getEntityHit();

    if (!entityHit || !entityHit.entity) return;

    const mob = entityHit.entity;

    if (mob.typeId !== "minecraft:enderman") {
        let damage = calculateDamage(player, 8);

        mob.applyDamage(damage);

        healEntity(player, ((getScoreboardValue("lifesteal", player) / 100) * damage) / 2);
        
        // DO: Trigger passive abilities on shooting projectile
        // const equipment = player.getComponent("minecraft:equippable");
        // const slots = [EquipmentSlot.Mainhand, EquipmentSlot.Offhand, EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet];
        // for (const slot of slots) {
        //     const passive = parseLoreToPassive(equipment, slot);
        //     if (passive.name) {
        //         // Apply passive effects that trigger on shooting projectiles
        //     }
        // }
    }
});

// Skill activation event handler
world.afterEvents.itemUse.subscribe((ev) => {
    const player = ev.source;
    const item = ev.itemStack;
    
    // DO: Trigger skills on item use
    // const equipment = player.getComponent("minecraft:equippable");
    // const skill = parseLoreToSkills(equipment, EquipmentSlot.Mainhand);
    // if (skill.name) {
    //     // Execute skill based on skill.name and skill.value
    //     // Examples: fireball, lightning strike, teleport, etc.
    // }
});

// Passive ability event handlers
world.afterEvents.entityHurt.subscribe((ev) => {
    // Check if player is receiving damage
    if (ev.hurtEntity.typeId === "minecraft:player") {
        const player = ev.hurtEntity;
        
        // DO: Trigger passive abilities on receiving damage
        // const equipment = player.getComponent("minecraft:equippable");
        // const slots = [EquipmentSlot.Mainhand, EquipmentSlot.Offhand, EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet];
        // for (const slot of slots) {
        //     const passive = parseLoreToPassive(equipment, slot);
        //     if (passive.name) {
        //         // Apply passive effects that trigger on receiving damage
        //         // Examples: thorns, damage reflection, temporary buffs, etc.
        //     }
        // }
    }
});

world.afterEvents.playerBreakBlock.subscribe((ev) => {
    const player = ev.player;
    
    // DO: Trigger passive abilities on breaking blocks
    // const equipment = player.getComponent("minecraft:equippable");
    // const slots = [EquipmentSlot.Mainhand, EquipmentSlot.Offhand, EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet];
    // for (const slot of slots) {
    //     const passive = parseLoreToPassive(equipment, slot);
    //     if (passive.name) {
    //         // Apply passive effects that trigger on breaking blocks
    //         // Examples: bonus drops, experience gain, chance for special effects, etc.
    //     }
    // }
});

//=====================================INITIALIZATION===========================================

// Initialize scoreboards immediately when the script loads
initializeScoreboards();
