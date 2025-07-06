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
        .button('', 'textures/ui/sidebar_icons/dr_body');
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
            case 6:
                useSkill(player, EquipmentSlot.Mainhand);
                break;
        }
        msifMenu(player);
    }
}

system.runTimeout(() => {
    const players = world.getPlayers();
    for (const player of players) {
        uiManager.closeAllForms();
        await msifMenu(player);
    }
}, 70)

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
            let aSetNameG = [];
            let aSetFunctionG = [];
            let aSetMainG = "none";
            let aSetStrictG = true; // Default to true
            
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
                    case "armorSet":
                        let CIX = currentIndex + 1;
                        let END = false;
                        while (!END) {
                            switch (parts[CIX]) {
                                case "END":
                                    END = true;
                                    currentIndex = CIX + 1;
                                    break;
                                case "parts":
                                    aSetFunctionG[parts[CIX + 1]] = parts[CIX + 2];
                                    aSetNameG[parts[CIX + 1]] = parts[CIX + 3];
                                    CIX = CIX + 4;
                                    break;
                                case "setMain":
                                    aSetMainG = parts[CIX + 1];
                                    CIX = CIX + 2;
                                    break;
                                case "strict":
                                    aSetStrictG = parts[CIX + 1] === "true";
                                    CIX = CIX + 2;
                                    break;
                            }
                        }
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
                aSetFunctions: aSetFunctionG,
                aSetNames: aSetNameG,
                aSetMain: aSetMainG,
                aSetStrict: aSetStrictG
            };
        });
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
    if (time > 0) {
        return {
            value: time,
            state: false
        };
    } else if (time <= 0) {
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

function getArmorSetParts(player) {
    const equippable = player.getComponent("minecraft:equippable");
    const armorSlots = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet];
    const armorSets = new Map();
    
    for (const slot of armorSlots) {
        const itemStack = equippable?.getEquipment(slot);
        if (itemStack?.typeId) {
            const tags = itemStack.getTags();
            const skills = parseMSIFTags(tags);
            
            for (const skill of skills) {
                if (skill.aSetMain && skill.aSetMain !== "none") {
                    if (!armorSets.has(skill.aSetMain)) {
                        armorSets.set(skill.aSetMain, {
                            parts: [],
                            functions: {},
                            names: {},
                            strict: skill.aSetStrict
                        });
                    }
                    
                    const setData = armorSets.get(skill.aSetMain);
                    setData.parts.push(slot);
                    Object.assign(setData.functions, skill.aSetFunctions);
                    Object.assign(setData.names, skill.aSetNames);
                }
            }
        }
    }
    
    return armorSets;
}

function executeArmorSetFunctions(player, armorSets) {
    for (const [setName, setData] of armorSets) {
        const partsCount = setData.parts.length;
        const functionsToRun = [];
        
        if (setData.strict) {
            // Strict mode: only run function for exact parts count
            if (setData.functions[partsCount]) {
                functionsToRun.push(setData.functions[partsCount]);
            }
        } else {
            // Non-strict mode: run all functions from 1 to current parts count
            for (let i = 1; i <= partsCount; i++) {
                if (setData.functions[i]) {
                    functionsToRun.push(setData.functions[i]);
                }
            }
        }
        
        // Execute functions
        for (const functionName of functionsToRun) {
            try {
                player.runCommand(`function ${functionName}`);
            } catch (error) {
                console.warn(`Error running armor set function ${functionName}:`, error);
                player.runCommand("tell @s §cError: Armor set function failed or missing.");
            }
        }
    }
}

function useSkillArmor(player, eSlot) {
    const itemStack = player.getComponent("minecraft:equippable")?.getEquipment(eSlot);
    const itemId = itemStack?.typeId;
    if (!itemStack || !itemId) return;
    const armorSets = getArmorSetParts(player);
    executeArmorSetFunctions(player, armorSets);
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
        
        // Check for armor set functions if using mainhand or offhand
        if (eSlot === EquipmentSlot.Mainhand || eSlot === EquipmentSlot.Offhand) {
            // Check if the item has armor set definitions
            for (const skillData of skills) {
                if (skillData.aSetMain && skillData.aSetMain !== "none") {
                    const armorSets = getArmorSetParts(player);
                    
                    // Only execute if this set is actually present
                    if (armorSets.has(skillData.aSetMain)) {
                        const setFunctions = new Map();
                        setFunctions.set(skillData.aSetMain, armorSets.get(skillData.aSetMain));
                        executeArmorSetFunctions(player, setFunctions);
                    }
                    break; // Only process first armor set found
                }
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