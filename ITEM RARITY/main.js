import { world, system, EquipmentSlot } from "@minecraft/server";
import { stats, TagMapping, RARITY, blackList } from './dataLib.js';

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
        const maxAttempts = 30; // Prevent infinite loops
        
        while (addedStats < StatsCounter && attempts < maxAttempts) {
            // Calculate rarity level for this stat
            let statRarityLevel = Math.min(6, Math.max(1, srr.id - Math.floor(Math.random() * 3)));
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
    
    let scoreboardObjs = [];
    let scoreboardStats = [];
    
    for (const slot of slots) {
        const attributes = parseLoreToStats(equipment, slot);
        for (let attribute of attributes) {
            const values = attribute.split("§w");
            const StatObj = Object.values(stats).find(d => d.name === values[0]);
            if (!StatObj) continue;

            if (!scoreboardObjs.includes(StatObj.scoreboardTracker)) {
                scoreboardObjs.push(StatObj.scoreboardTracker);
            }
            
            scoreboardStats.push({
                sbObj: StatObj.scoreboardTracker,
                valueToAdd: Number(values[1])
            });
        }
    }

    loadScoreboards(scoreboardObjs);

    // Summing values by scoreboardTracker
    const summedStats = {};
    for (const entry of scoreboardStats) {
        if (!summedStats[entry.sbObj]) {
            summedStats[entry.sbObj] = 0;
        }
        summedStats[entry.sbObj] += entry.valueToAdd;
    }

    // Set score to player
    for (const sbObj in summedStats) {
        const objective = world.scoreboard.getObjective(sbObj);
        if (objective) {
            objective.setScore(player, Math.floor(summedStats[sbObj]));
        }
    }
}

function loadScoreboards(Objs) {
    for (const Obj of Objs) {
        try {
            // Check if the objective already exists
            const existing = world.scoreboard.getObjective(9bj);
            if (!existing) {
                world.scoreboard.addObjective(Obj, Obj);
                console.log(`Scoreboard '${Obj}' added.`);
            }
        } catch (e) {
            console.warn(`Failed to add scoreboard '${Obj}':`, e);
        }
    }
}

function parseLoreToStats(equipment, slot) {
    const loreArray = equipment.getEquipment(slot)?.getLore();
    const arraySize = loreArray.length;
    if (!arraySize || arraySize != 0 || !loreArray) return [];
    
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
    }
    return attributes;
}

