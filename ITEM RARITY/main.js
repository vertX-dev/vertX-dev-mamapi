import { world, system, EquipmentSlot } from "@minecraft/server";
import { stats, TagMapping, RARITY, blackList } from './dataLib.js';

function rarityItemTest(itemStack, player) {
    if (!itemStack) return;

    const lore = itemStack.getLore() ?? [];

    if (lore.length === 0) {
        const Tags = parseTags(itemStack.typeId);

        if (Tags && Tags.rarity) {
            const rarity = randomRarity();
            
            const stats = randomStats(rarity.sid, Tags.data);
            
            
            
            
            
            const newLore = [rarity.dName, ...stats];
          
            let newItem = itemStack.clone();
            newItem.setLore(newLore);
            const equippable = player.getComponent("minecraft:equippable");
            if (equippable) {
                equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
            }
        }
    }
}


function randomStats(rarity, type) {
    // Type filtered
    const availableStats = Object.values(stats).filter(r => r.type.includes(type));
    let srr = Object.values(RARITY).find(r => r.sid === rarity);
    
    let StatsCounter = Math.floor(Math.random() * (srr.maxStats - srr.minStats + 1) + srr.minStats);
    
    let result = [];
    
    if (StatsCounter > 0) {
        result.push("Attributes");
        
        let addedStats = 0;
        let totalAttempts = 0;
        const maxTotalAttempts = 50; // Prevent infinite loops
        
        while (addedStats < StatsCounter && totalAttempts < maxTotalAttempts) {
            let attempts = 0;
            let foundStat = false;
            
            while (!foundStat && attempts < 10) {
                let RR = randomRarity(Math.min(6, Math.max(1, (srr.id - Math.floor((Math.random() * 3) - 1)))));
                const RarityStats = availableStats.filter(s => s.rarity.includes(RR.sid));
                
                if (RarityStats.length > 0) {
                    const newStat = RarityStats[Math.floor((Math.random()) * RarityStats.length)];
                    const newStatValue = +(Math.random() * (newStat.values[RR.sid].max - newStat.values[RR.sid].min) + newStat.values[RR.sid].min).toFixed(1);
                    const measure = newStat.measure ?? "";
                    const sign = newStatValue >= 0 ? "+" : "";
                    result.push(`${newStat.name} ${sign}${newStatValue}${measure}`);
                    foundStat = true;
                    addedStats++;
                } else {
                    attempts++;
                }
            }
            
            totalAttempts++;
            
            // If we couldn't find a stat after 10 attempts, break to avoid infinite loop
            if (!foundStat) {
                break;
            }
        }
    }
    return result;
}


function randomRarity(SRR = 1) {
    let rarity = Object.values(RARITY).find(r => r.id === SRR);
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
    }
}, 20)


//Events





