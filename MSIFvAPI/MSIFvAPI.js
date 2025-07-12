import { world, system, EquipmentSlot, EntityComponentTypes } from "@minecraft/server";
import { ActionFormData, FormCancelationReason, uiManager } from "@minecraft/server-ui";

export async function forceShow(player, form, timeout = Infinity) {
    const startTick = system.currentTick;
    while ((system.currentTick - startTick) < timeout) {
        const response = await form.show(player);
        if (response.cancelationReason !== FormCancelationReason.UserBusy) return response;
    };
    throw new Error(`Timed out after ${timeout} ticks`);
}

async function msifMenu(player) {
    const menu = new ActionFormData()
        .title('msif_buttons')
        .button('', 'textures/ui/refresh_hover')
        .button('', 'textures/items/iron_helmet')
        .button('', 'textures/items/iron_chestplate')
        .button('', 'textures/items/iron_leggings')
        .button('', 'textures/items/iron_boots')
        .button('')
    const response = await forceShow(player, menu, 200);
    if (response.selection >= 0) {
        switch (response.selection) {
            case 0:
                changeSkill(player);
                break;
            case 1:
                useSkillArmor(player, EquipmentSlot.Head);
                break;
            case 2:
                useSkillArmor(player, EquipmentSlot.Chest);
                break;
            case 3:
                useSkillArmor(player, EquipmentSlot.Legs);
                break;
            case 4:
                useSkillArmor(player, EquipmentSlot.Feet);
                break;
            case 5:
                useSkill(player, EquipmentSlot.Offhand);
                break;
        }
        msifMenu(player);
    }
}

world.afterEvents.playerSpawn.subscribe((ev) => {
    const player = ev.player;
    uiManager.closeAllForms(player);
    msifMenu(player);
});

system.runTimeout(() => {
    const players = world.getPlayers();
    for (const player of players) {
        uiManager.closeAllForms(player);
        msifMenu(player);
    }
}, 20)

//Functions
function parseItemIdToScoreboardObj(itemId) {
    return itemId.replace(/^.*?:/, "").replace(/[^a-zA-Z0-9]/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "").substring(0, 16);
}

function getScoreboardValue(scoreboard, player) {
    try {
        const sbObj = world.scoreboard.getObjective(scoreboard);
        return sbObj ? sbObj.getScore(player) : 0;
    } catch {
        return 0;
    }
}

function setscoreb(player, scoreboard, value) {
    try {
        world.scoreboard.getObjective(scoreboard).setScore(player, value);
        return true;
    } catch {
        return false;
    }
}

function glyphCoordToChar(data) {
    const [x, y, page] = data.split("-").map(Number);
    if (x < 0 || x > 15 || y < 0 || y > 15) {
        throw new RangeError("Coordinates x and y must be in range 0-15.");
    }
    if (page < 0 || page > 15) {
        throw new RangeError("Page must be in range 0-15 (E0 to EF).");
    }

    const baseCode = 0xE000 + (page << 8); // 0xE000, 0xE100, 0xE200, etc.
    const index = y * 16 + x;
    return String.fromCharCode(baseCode + index);
}

function parseMSIFTags(tags) {
    return tags
        .filter(tag => tag.startsWith("MSIF:"))
        .map(tag => {
            const parts = tag.slice(5).split(":");
            
            let functionNameG = "";
            let skillNameG = "Skill";
            let cooldownG = 0;
            let cooldownGroupG = "none";
            let cooldownGroupNameG = "none";
            let iconG = "";
            let aSetNameG = "";
            let aSetFunctionG = "";
            let aSetPartsG = 4;
            
            const plength = parts.length;
            let currentIndex = 0;
            
            while (currentIndex < plength) {
                switch (parts[currentIndex]) {
                    case "function":
                        functionNameG = parts[currentIndex + 1];
                        currentIndex = currentIndex + 2;
                        break;
                    case "skillName":
                        skillNameG = parts[currentIndex + 1].replace("_p", "§").replace("_", " ");
                        currentIndex = currentIndex + 2;
                        break;
                    case "icon":
                        iconG = glyphCoordToChar(parts[currentIndex + 1]);
                        currentIndex = currentIndex + 2;
                        break;
                    case "cooldown":
                        cooldownGroupG = parts[currentIndex + 1];
                        if (parts[currentIndex + 2] != "dName") {
                            cooldownG = Number(parts[currentIndex + 2]);
                            cooldownGroupNameG = cooldownGroupG;
                            currentIndex = currentIndex + 3;
                        } else {
                            cooldownG = Number(parts[currentIndex + 4]);
                            cooldownGroupNameG = parts[currentIndex + 3].replace("_p", "§").replace("_", " ");
                            currentIndex = currentIndex + 5;
                        }
                        break;
                    case "armorSet"://armorSet:<setName|string>:<functionName|string>:<parts|num>
                        aSetNameG = parts[currentIndex + 1];
                        aSetPartsG = parts[currentIndex + 3];
                        aSetFunctionG = parts[currentIndex + 2];
                        currentIndex = currentIndex + 4;
                        break;
                }
            }
            
            return {
                functionName: functionNameG,
                skillName: skillNameG,
                cooldown: cooldownG,
                cooldownGroup: cooldownGroupG,
                cooldownGroupName: cooldownGroupNameG,
                icon: iconG,
                aSetFunction: aSetFunctionG,
                aSetName: aSetNameG,
                aSetParts: aSetPartsG
            };
        });
}

function parseArmorSetsTags(player) {
    try {
        const equippable = player.getComponent("minecraft:equippable");
        if (!equippable) {
            throw new Error("Player does not have the 'minecraft:equippable' component.");
        }

        const getTagsFromSlot = (slotName) => {
            try {
                const item = equippable.getEquipment(slotName);
                const tags = item?.getTags?.();
                if (!Array.isArray(tags)) return [];
                return tags
                    .filter(tag => tag.startsWith("ArmorSet:"))
                    .map(tag => tag.slice(9));
            } catch (err) {
                console.warn(`Failed to get tags from slot ${slotName}:`, err);
                return [];
            }
        };

        return {
            Head: getTagsFromSlot(EquipmentSlot.Head),
            Chest: getTagsFromSlot(EquipmentSlot.Chest),
            Legs: getTagsFromSlot(EquipmentSlot.Legs),
            Feet: getTagsFromSlot(EquipmentSlot.Feet)
        };
    } catch (err) {
        console.error("Error in parseArmorSetsTags:", err);
        return {
            Head: [],
            Chest: [],
            Legs: [],
            Feet: []
        };
    }
}

function taddsb(objectiveName, player) {
    try {
        if (!world.scoreboard.getObjective(objectiveName)) {
            world.scoreboard.addObjective(objectiveName, objectiveName);
            player.runCommand(`scoreboard players add @s ${objectiveName} 0`);
        }
    } catch (error) {
        console.warn(`Error creating objective ${objectiveName}:`, error);
    }
}

function taddsbc(value, objectiveNameA, player, groupName) {
    const objectiveName = "cd" + objectiveNameA;
    try {
        if (!world.scoreboard.getObjective(objectiveName)) {
            world.scoreboard.addObjective(objectiveName, groupName);
            player.runCommand(`scoreboard players add @s ${objectiveName} 0`);
        }
    } catch (error) {
        console.warn(`Error creating objective ${objectiveName}:`, error);
    }
    let time = getScoreboardValue(objectiveName, player);
    
    // Ensure time is a valid number
    if (typeof time !== 'number' || isNaN(time)) {
        time = 0;
    }
    
    if (time > 0) {
        return {
            value: time,
            state: false
        };
    } else {
        // time <= 0 or any other case
        setscoreb(player, objectiveName, value);
        return {
            value: value,
            state: true
        };
    }
}

function updateCooldown() {
    const COBJS = world.scoreboard.getObjectives().filter(cobj => cobj.id.startsWith("cd"));
    for (const obj of COBJS) {
        const players = world.getPlayers();
        const SBOBJ = world.scoreboard.getObjective(obj.id);
        for (const player of players) {
            const cd = SBOBJ.getScore(player);
            if (cd >= 0) {
                SBOBJ.addScore(player, -1);
            } 
            if (cd == 0) {
                player.runCommand(`title @s actionbar §b➤ §aSkill group §l${obj.displayName}§r§a is off cooldown and ready!`)
            }
        }
    }
}

function changeSkill(player) {
    const equippable = player.getComponent("minecraft:equippable");
    
    // Try mainhand first
    let itemStack = equippable?.getEquipment(EquipmentSlot.Mainhand);
    let itemId = itemStack?.typeId;
    
    // If no item or no tags in mainhand, try offhand
    if (!itemStack || !itemId || parseMSIFTags(itemStack.getTags()).length === 0) {
        itemStack = equippable?.getEquipment(EquipmentSlot.Offhand);
        itemId = itemStack?.typeId;
        
        // If still no item or no tags, return
        if (!itemStack || !itemId) return;
    }

    const tags = itemStack.getTags();
    const skills = parseMSIFTags(tags);
    if (skills.length === 0) return;

    const scoreboardObj = parseItemIdToScoreboardObj(itemId);
    taddsb(scoreboardObj, player);
    const currentIndex = getScoreboardValue(scoreboardObj, player);
    const newIndex = (currentIndex + 1) % skills.length;

    if (setscoreb(player, scoreboardObj, newIndex)) {
        const skill = skills[newIndex];
        const message = `§aChanged to ${skill.skillName} ${skill.icon}`;
        player.runCommand(`title @s actionbar ${message}`);
    }
}

function useSkillArmor(player, eSlot) {
    const itemStack = player.getComponent("minecraft:equippable")?.getEquipment(eSlot);
    const itemId = itemStack?.typeId;
    if (!itemStack || !itemId) return;
    
    const tags = itemStack.getTags();
    const skills = parseMSIFTags(tags);
    if (skills.length === 0) return;
    const armorData = skills[0];
    const CDTEST = taddsbc(armorData.cooldown, armorData.cooldownGroup, player, armorData.cooldownGroupName);
    if (CDTEST.state) {
        try {
            player.runCommand(`function ${armorData.functionName}`);
        } catch (error) {
            console.warn(`Error running function ${armorData.functionName}:`, error);
            player.runCommand("tell @s §cError: Function failed or missing.");
        }
        const tagsData = parseArmorSetsTags(player);
        let lookForTag = armorData.aSetName;
        let counter = 0;
        if (tagsData.Head.includes(lookForTag)) counter++;
        if (tagsData.Chest.includes(lookForTag)) counter++;
        if (tagsData.Legs.includes(lookForTag)) counter++;
        if (tagsData.Feet.includes(lookForTag)) counter++;
        
        if (counter >= armorData.aSetParts) {
            try {
                player.runCommand(`function ${armorData.aSetFunction}`);
            } catch (error) {
                console.warn(`Error running function ${armorData.aSetFunction}:`, error);
                player.runCommand("tell @s §cError: Function failed or missing.");
            }
        }
    } else {
        let timeLeft = (CDTEST.value * 0.1).toFixed(1);
        player.runCommand(`title @s actionbar §6[${armorData.cooldownGroupName}] will be ready in ${timeLeft}s`);
    }    
    
    
}

function useSkill(player, eSlot) {
    const itemStack = player.getComponent("minecraft:equippable")?.getEquipment(eSlot);
    const itemId = itemStack?.typeId;
    if (!itemStack || !itemId) return;

    const tags = itemStack.getTags();
    const skills = parseMSIFTags(tags);
    if (skills.length === 0) return;

    const scoreboardObj = parseItemIdToScoreboardObj(itemId);
    
    taddsb(scoreboardObj, player);
    
    const currentIndex = getScoreboardValue(scoreboardObj, player);
    const skill = skills[currentIndex];
    
    if (!skill || !skill.functionName) return;
    const CDTEST = taddsbc(skill.cooldown, skill.cooldownGroup, player, skill.cooldownGroupName);
    if (CDTEST.state) {
        try {
            player.runCommand(`function ${skill.functionName}`);
        } catch (error) {
            console.warn(`Error running function ${skill.functionName}:`, error);
            player.runCommand("tell @s §cError: Function failed or missing.");
        }
        const tagsData = parseArmorSetsTags(player);
        let lookForTag = skill.aSetName;
        let counter = 0;
        if (tagsData.Head.includes(lookForTag)) counter++;
        if (tagsData.Chest.includes(lookForTag)) counter++;
        if (tagsData.Legs.includes(lookForTag)) counter++;
        if (tagsData.Feet.includes(lookForTag)) counter++;
        
        if (counter >= skill.aSetParts) {
            try {
                player.runCommand(`function ${skill.aSetFunction}`);
            } catch (error) {
                console.warn(`Error running function ${skill.aSetFunction}:`, error);
                player.runCommand("tell @s §cError: Function failed or missing.");
            }
        }
    } else {
        let timeLeft = (CDTEST.value * 0.1).toFixed(1);
        player.runCommand(`title @s actionbar §6[${skill.cooldownGroupName}] will be ready in ${timeLeft}s`);
    }
}

world.afterEvents.itemUse.subscribe((ev) => {
    useSkill(ev.source, EquipmentSlot.Mainhand);
});

system.runInterval(() => {
    updateCooldown();
}, 2); //redstone ticks