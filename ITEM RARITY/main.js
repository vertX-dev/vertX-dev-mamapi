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

const COOLDOWN_PREDEFINED_SCOREBOARDS = [
    { name: "smashleap", displayName: "Smash Leap" },
    { name: "flameslash", displayName: "Flame Slash" }
    
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

function testCooldown(player, name, object = skills) {
    const Obj = Object.values(object).find(s => s.name == name);
    
    const scoreboardObj = world.scoreboard.getObjective(Obj.scoreboard);
    const scoreboardValue = scoreboardObj.getScore(player);
    
    return {
        obj: scoreboardObj,
        time: scoreboardValue
    };
}

function updateCooldown() {
    const players = world.getPlayers();

    for (const obj of COOLDOWN_PREDEFINED_SCOREBOARDS) {
        const scoreboard = world.scoreboard.getObjective(obj.name);
        if (!scoreboard) continue;

        for (const player of players) {
            const cd = scoreboard.getScore(player);
            if (cd >= 0) {
                scoreboard.addScore(player, -1);
            }
            if (cd === 0) {
                player.runCommand(`title @s actionbar §aSkill §l${obj.displayName}§r§a is off cooldown and ready!`);
            }
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
    
    for (const scoreboard of COOLDOWN_PREDEFINED_SCOREBOARDS) {
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
                description: description,
                cooldown: "§eCooldown: " + Math.floor(newSkill.cooldown / 10) + "s"
            };
        }
    }

    // Push skill section and data if we have valid skill data
    if (skillData) {
        result.push("§8Skill");
        result.push(skillData.name);
        result.push(skillData.description);
        result.push(skillData.cooldown);
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
                description: description,
                cooldown: "§eCooldown: " + Math.floor(newPassive.cooldown / 10) + "s"
            };
        }
    }

    // Push passive section and data if we have valid passive data
    if (passiveData) {
        result.push("§8Passive ability");
        result.push(passiveData.name);
        result.push(passiveData.description);
        result.push(passiveData.cooldown);
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
    
    const string = attributes.join(" ");
    const stringVal = string.match(/§w(.*?)§w/);
    const stringCd = string.match(/§eCooldown: (.*?)s/);
    
    const Skill = {
        name: attributes[0],
        value: stringVal ? Number(stringVal[1]) : 0,
        cooldown: stringCd ? Number(stringCd[1]) : 0
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
    
    const string = attributes.join(" ");
    const stringVal = string.match(/§w(.*?)§w/);
    const stringCd = string.match(/§eCooldown: (.*?)s/);
    
    const Passive = {
        name: attributes[0],
        value: stringVal ? Number(stringVal[1]) : 0,
        cooldown: stringCd ? Number(stringCd[1]) : 0
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

system.runInterval(() => {
    updateCooldown();
}, 2);

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
    
    const equipment = player.getComponent("minecraft:equippable");
    const skill = parseLoreToSkills(equipment, EquipmentSlot.Mainhand);
    if (skill && skill.name) {
        switch (skill.name.slice(2)) {
            case "Smash Leap":
                skillSmashLeap(player, skill);
                break;
            default:
                console.log("Skill error, item use error");
        }
    }
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

//=====================================SKILLS FUNCTIONALITY===========================================
/**
 * const ccd = testCooldown(player, skill.name);
    if (!ccd || ccd.time > 0) return;
    ccd.obj.setScore(player, skill.cooldown);
 */



function skillSmashLeap(player, skill) {
    const ccd = testCooldown(player, skill.name);
    if (ccd.time > 0) return;
    ccd.obj.setScore(player, skill.cooldown * 10);
    
    // Stun enemies
    player.runCommand(`effect @e[r=${skill.value}] slowness 2 4 true`);
    player.runCommand(`effect @s slowness 0`);
    // Ground impact
    player.runCommand(`particle minecraft:block_dust_stone ~ ~1 ~`);
    player.runCommand(`particle minecraft:smash_ground_particle ~ ~1 ~`);
    player.runCommand(`playsound mace.heavy_smash_ground @s`);
    // Wind leap (only if player has wind charge)
    player.runCommand(`effect @s[hasitem={item=wind_charge}] levitation 1 7 true`);
    player.runCommand(`playsound wind_charge.burst @s[hasitem={item=wind_charge}]`);
    player.runCommand(`execute at @s[hasitem={item=wind_charge}] run particle minecraft:wind_explosion_emitter ~ ~ ~`);
    player.runCommand(`clear @s[hasitem={item=wind_charge}] wind_charge 0 1`);
}

function skillSpinStrike(player, skill) {
    const ccd = testCooldown(player, skill.name);
    if (ccd.time > 0) return;
    ccd.obj.setScore(player, skill.cooldown * 10);
    
    const damage = calculateDamage(player, skill.value);
    
    // Spin attack effects
    player.runCommand(`particle minecraft:sweep_attack ~ ~1 ~`);
    player.runCommand(`particle minecraft:crit ~ ~1 ~`);
    player.runCommand(`playsound entity.player.attack.sweep @s`);
    player.runCommand(`playsound entity.player.attack.strong @s`);
    
    // Damage all enemies in 3 block radius
    player.runCommand(`damage @e[r=3,rm=1] ${damage} generic`);
    
    // Visual spin effect
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * 360;
        const x = Math.cos(angle * Math.PI / 180) * 2;
        const z = Math.sin(angle * Math.PI / 180) * 2;
        player.runCommand(`particle minecraft:sweep_attack ~${x} ~1 ~${z}`);
    }
}

function skillExplosiveMining(player, skill) {
    const ccd = testCooldown(player, skill.name);
    if (ccd.time > 0) return;
    ccd.obj.setScore(player, skill.cooldown * 10);
    
    // Custom explosion size
    const size = skill.value;
    player.dimension.createExplosion(player.location, size * 3);
    player.runCommand(`particle minecraft:explosion_emitter ~ ~ ~`);
    player.runCommand(`particle minecraft:large_explosion ~ ~ ~`);
    player.runCommand(`playsound entity.generic.explode @s`);
    
    // Damage nearby entities
    const explosionDamage = size * 3;
    player.runCommand(`damage @e[r=${Math.floor(size * 1.4)},rm=1] ${explosionDamage} explosion`);
}

function skillRayMiner(player, skill) {
    const ccd = testCooldown(player, skill.name);
    if (ccd.time > 0) return;
    ccd.obj.setScore(player, skill.cooldown * 10);
    
    const distance = skill.value;
    let blocksDestroyed = 0;
    
    // Ray mining effect
    player.runCommand(`particle minecraft:electric_spark_particle ~ ~1 ~`);
    player.runCommand(`playsound block.beacon.activate @s`);
    player.runCommand(`playsound block.end_portal.spawn @s ~ ~ ~`);
    
    // Break blocks in straight line
    for (let i = 1; i <= distance; i++) {
        player.runCommand(`execute at @s positioned ^^^${i} run particle minecraft:electric_spark_particle ~ ~ ~`);
        player.runCommand(`execute at @s positioned ^^^${i} run particle minecraft:scrape ~ ~ ~`);
        
        // Check if block exists and destroy it
        const result = player.runCommand(`execute at @s positioned^^^${i} run testforblock ~ ~ ~ air`);
        if (result.successCount === 0) { // Block is not air
            player.runCommand(`execute at @s positioned^^^${i} run setblock ~ ~ ~ air destroy`);
            blocksDestroyed++;
        }
    }
    
    // Remove durability based on blocks destroyed
    if (blocksDestroyed > 0) {
        const equipment = player.getComponent("minecraft:equippable");
        const item = getEquipment(EquipmentSlot.Mainhand).clone();
        let dur = item.getComponent("minecraft:durability");
        dur.damage = dur.MaxDurability - blocksDestroyed;
        
        equipment.setEquipment(EquipmentSlot.Mainhand, item);
    }
}

function skillExcavator(player, skill) {
    const ccd = testCooldown(player, skill.name);
    if (ccd.time > 0) return;
    ccd.obj.setScore(player, skill.cooldown * 10);
    
    const depth = skill.value;
    let blocksDestroyed = 0;
    
    // Excavation effects
    player.runCommand(`particle minecraft:block_dust_sand ~ ~1 ~`);
    player.runCommand(`particle minecraft:falling_dust_sand ~ ~1 ~`);
    player.runCommand(`playsound block.gravel.break @s`);
    player.runCommand(`playsound block.sand.break @s`);
    
    // Define sand-type blocks
    const sandBlocks = ["sand", "gravel", "dirt", "clay", "coarse_dirt", "podzol", "mycelium", "grass_block"];
    
    // Break blocks in 3x3x depth area
    for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
            for (let y = 0; y < depth; y++) {
                // Check each sand-type block
                for (const block of sandBlocks) {
                    const result = player.runCommand(`execute at @s positioned~${x} ~${-y} ~${z} run testforblock ~ ~ ~ ${block}`);
                    if (result.successCount > 0) {
                        player.runCommand(`execute at @s positioned~${x} ~${-y} ~${z} run setblock ~ ~ ~ air destroy`);
                        player.runCommand(`execute at @s positioned~${x} ~${-y} ~${z} run particle minecraft:block_dust_sand ~ ~ ~`);
                        blocksDestroyed++;
                        break; // Found a sand block, no need to check others
                    }
                }
            }
        }
    }
    
    // Remove durability based on blocks destroyed
    if (blocksDestroyed > 0) {
        const equipment = player.getComponent("minecraft:equippable");
        const item = getEquipment(EquipmentSlot.Mainhand).clone();
        let dur = item.getComponent("minecraft:durability");
        dur.damage = dur.MaxDurability - blocksDestroyed;
        
        equipment.setEquipment(EquipmentSlot.Mainhand, item);
    }
}

function skillFlameArc(player, skill) {
    const ccd = testCooldown(player, skill.name);
    if (ccd.time > 0) return;
    ccd.obj.setScore(player, skill.cooldown * 10);
    
    const damage = calculateDamage(player, skill.value);
    
    // Fire arc effects
    player.runCommand(`particle minecraft:flame ~ ~1 ~`);
    player.runCommand(`particle minecraft:lava ~ ~1 ~`);
    player.runCommand(`playsound item.firecharge.use @s`);
    player.runCommand(`playsound block.fire.ambient @s`);
    
    // Create arc of fire - simulate arc shape with multiple fill commands
    const arcPositions = [
        "^^^2", "^^^3", "^^^4", "^^^5", "^^^6",
        "^^1^2", "^^1^3", "^^1^4", "^^1^5",
        "^^-1^2", "^^-1^3", "^^-1^4", "^^-1^5",
        "^1^^2", "^1^^3", "^1^^4",
        "^-1^^2", "^-1^^3", "^-1^^4"
    ];
    
    // Set fire blocks in arc pattern
    for (const pos of arcPositions) {
        player.runCommand(`execute at @s positioned${pos} run fill ~ ~ ~ ~ ~ ~ fire replace air`);
        player.runCommand(`execute at @s positioned${pos} run particle minecraft:flame ~ ~ ~`);
    }
    
    // Damage enemies in arc area
    for (const pos of arcPositions) {
        player.runCommand(`execute at @s positioned${pos} run damage @e[r=1,type=!player] ${damage} fire`);
    }
}

function skillShadowDash(player, skill) {
    const ccd = testCooldown(player, skill.name);
    if (ccd.time > 0) return;
    ccd.obj.setScore(player, skill.cooldown * 10);
    
    let dashDistance = skill.value;
    
    // Check if player is high in air (more than 10 blocks)
    const groundCheck = player.runCommand(`execute at @s positioned~ ~-11 ~ run testforblock ~ ~ ~ air`);
    if (groundCheck.successCount > 0) {
        dashDistance = Math.floor(dashDistance / 2); // Reduce distance by half
    }
    
    // Shadow dash effects
    player.runCommand(`particle minecraft:portal ~ ~1 ~`);
    player.runCommand(`particle minecraft:smoke ~ ~1 ~`);
    player.runCommand(`playsound entity.enderman.teleport @s`);
    player.runCommand(`playsound entity.phantom.swoop @s`);
    
    // Create dash trail
    for (let i = 1; i <= dashDistance; i++) {
        player.runCommand(`execute at @s positioned^^^${i} run particle minecraft:portal ~ ~1 ~`);
        player.runCommand(`execute at @s positioned^^^${i} run particle minecraft:smoke ~ ~1 ~`);
    }
    
    // Teleport player
    player.runCommand(`tp @s ^^^${dashDistance}`);
    
    // Final dash effect
    player.runCommand(`particle minecraft:portal ~ ~1 ~`);
    player.runCommand(`playsound entity.enderman.teleport @s`);
}

function skillVoidPierce(player, skill) {
    const ccd = testCooldown(player, skill.name);
    if (ccd.time > 0) return;
    ccd.obj.setScore(player, skill.cooldown * 10);
    
    const damage = calculateDamage(player, skill.value);
    
    // Void projectile effects
    player.runCommand(`particle minecraft:portal ~ ~1.5 ~`);
    player.runCommand(`particle minecraft:reverse_portal ~ ~1.5 ~`);
    player.runCommand(`playsound entity.wither.shoot @s`);
    player.runCommand(`playsound block.portal.ambient @s`);
    
    // Create piercing projectile path (max 9 blocks)
    for (let i = 1; i <= 9; i++) {
        // Projectile trail
        player.runCommand(`execute at @s positioned^^^${i} run particle minecraft:portal ~ ~ ~`);
        player.runCommand(`execute at @s positioned^^^${i} run particle minecraft:reverse_portal ~ ~ ~`);
        player.runCommand(`execute at @s positioned^^^${i} run particle minecraft:end_rod ~ ~ ~`);
        
        // Damage enemies at each position (piercing effect)
        player.runCommand(`execute at @s positioned^^^${i} run damage @e[r=1,type=!player] ${damage} magic`);
        player.runCommand(`execute at @s positioned^^^${i} run particle minecraft:damage_indicator ~ ~1 ~`);
        
        // Impact sound for each hit
        player.runCommand(`execute at @s positioned^^^${i} if entity @e[r=1,type=!player] run playsound entity.arrow.hit @s`);
    }
    
    // Final projectile impact
    player.runCommand(`execute at @s positioned^^^9 run particle minecraft:portal ~ ~ ~`);
    player.runCommand(`execute at @s positioned^^^9 run particle minecraft:explosion ~ ~ ~`);
    player.runCommand(`execute at @s positioned^^^9 run playsound entity.generic.explode @s`);
}







//=====================================PASSIVES FUNCTIONALITY===========================================













