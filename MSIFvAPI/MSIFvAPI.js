import { world, system, EquipmentSlot, EntityComponentTypes, CommandPermissionLevel, CustomCommandStatus, CustomCommandParamType } from "@minecraft/server";
import { ActionFormData, FormCancelationReason, uiManager } from "@minecraft/server-ui";

// Constants for lore markers
const COMMAND_MARKER = '§c§b§i§n§d§t';
const FUNCTION_MARKER = '§a§b§i§n§d§f';

export async function forceShow(player, form, timeout = Infinity) {
    const startTick = system.currentTick;
    while ((system.currentTick - startTick) < timeout) {
        const response = await form.show(player);
        if (response.cancelationReason !== FormCancelationReason.UserBusy) return response;
    }
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
        .button('');
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
}, 20);

//Helper Functions for Lore
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

function executeLoreCommands(player, itemStack) {
    if (!itemStack) return false;
    
    const loreArray = itemStack.getLore();
    if (!loreArray || loreArray.length === 0) return false;

    let commandsExecuted = false;
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
            commandsExecuted = true;
        } catch (e) {
            console.log("command error: " + e);
            console.log(command + " §c[FAILED]");
        }
    }
    
    // Execute functions
    for (const functionName of functions) {
        try {
            player.runCommand("function " + functionName);
            commandsExecuted = true;
        } catch (e) {
            console.log("function error: " + e);
            console.log("function " + functionName + " §c[FAILED]");
        }
    }
    
    return commandsExecuted;
}

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
    const msifTags = tags.filter(tag => tag.startsWith("MSIF:"));
    const lmsifTags = tags.filter(tag => tag.startsWith("LMSIF:"));
    
    const results = [];
    
    // Parse MSIF tags (existing logic)
    for (const tag of msifTags) {
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
                case "armorSet":
                    aSetNameG = parts[currentIndex + 1];
                    aSetPartsG = Number(parts[currentIndex + 3]);
                    aSetFunctionG = parts[currentIndex + 2];
                    currentIndex = currentIndex + 4;
                    break;
                default: 
                    currentIndex++;
            }
        }
        
        results.push({
            functionName: functionNameG,
            skillName: skillNameG,
            cooldown: cooldownG,
            cooldownGroup: cooldownGroupG,
            cooldownGroupName: cooldownGroupNameG,
            icon: iconG,
            aSetFunction: aSetFunctionG,
            aSetName: aSetNameG,
            aSetParts: aSetPartsG
        });
    }
    
    // Parse LMSIF tags (new logic)
    for (const tag of lmsifTags) {
        const parts = tag.slice(6).split(":"); // Remove "LMSIF:" prefix
        
        // Default values
        let functionNameG = "";
        let skillNameG = "Skill";
        let cooldownG = 0;
        let cooldownGroupG = "none";
        let cooldownGroupNameG = "none";
        let iconG = ""; // No icon support for LMSIF
        let aSetNameG = "";
        let aSetFunctionG = "";
        let aSetPartsG = 4;
        
        // Parse parameters in strict order
        if (parts.length > 0 && parts[0]) {
            functionNameG = parts[0];
        }
        
        if (parts.length > 1 && parts[1]) {
            skillNameG = parts[1].replace(/_p/g, "§").replace(/_/g, " ");
        }
        
        if (parts.length > 2 && parts[2]) {
            cooldownGroupG = parts[2];
        }
        
        if (parts.length > 3 && parts[3]) {
            cooldownGroupNameG = parts[3].replace(/_p/g, "§").replace(/_/g, " ");
        } else {
            cooldownGroupNameG = cooldownGroupG;
        }
        
        if (parts.length > 4 && parts[4]) {
            cooldownG = Number(parts[4]) || 0;
        }
        
        if (parts.length > 5 && parts[5]) {
            aSetNameG = parts[5];
        }
        
        if (parts.length > 6 && parts[6]) {
            aSetFunctionG = parts[6];
        }
        
        if (parts.length > 7 && parts[7]) {
            aSetPartsG = Number(parts[7]) || 4;
        }
        
        results.push({
            functionName: functionNameG,
            skillName: skillNameG,
            cooldown: cooldownG,
            cooldownGroup: cooldownGroupG,
            cooldownGroupName: cooldownGroupNameG,
            icon: iconG,
            aSetFunction: aSetFunctionG,
            aSetName: aSetNameG,
            aSetParts: aSetPartsG
        });
    }
    
    return results;
}

function parseUMSIFTags(tags) {
    const umsifTags = tags.filter(tag => tag.startsWith("UMSIF:"));
    const results = [];
    
    for (const tag of umsifTags) {
        // Remove "UMSIF:" prefix and split by ":"
        const parts = tag.slice(6).split(":");
        
        // Expected format: UMSIF:function:function_name:event:cooldown_group:cooldown_group_name:cooldownTime
        if (parts.length >= 6) {
            let functionName = "";
            let eventType = "";
            let cooldownGroup = "none";
            let cooldownGroupName = "none";
            let cooldownTime = 0;
            
            // Parse in order according to the specified format
            if (parts[0] === "function" && parts[1]) {
                functionName = parts[1];
            }
            
            if (parts[2] === "event" && parts[3]) {
                eventType = parts[3];
            }
            
            if (parts[4] === "cooldown_group" && parts[5]) {
                cooldownGroup = parts[5];
            }
            
            if (parts.length > 6 && parts[6]) {
                cooldownGroupName = parts[6].replace(/_p/g, "§").replace(/_/g, " ");
            } else {
                cooldownGroupName = cooldownGroup;
            }
            
            if (parts.length > 7 && parts[7]) {
                cooldownTime = Number(parts[7]) || 0;
            }
            
            results.push({
                functionName: functionName,
                eventType: eventType,
                cooldownGroup: cooldownGroup,
                cooldownGroupName: cooldownGroupName,
                cooldownTime: cooldownTime
            });
        }
    }
    
    return results;
}

// Helper function to check if an item has UMSIF tags for a specific event
function hasUMSIFEventTags(itemStack, eventType) {
    if (!itemStack) return false;
    
    const tags = itemStack.getTags();
    const umsifSkills = parseUMSIFTags(tags);
    
    return umsifSkills.some(skill => skill.eventType === eventType);
}

// Enhanced function to handle both MSIF and UMSIF tags
function executeItemSkills(player, itemStack, eventType = null) {
    if (!itemStack || !player) return false;
    
    let skillExecuted = false;
    
    // First try UMSIF tags if event type is specified
    if (eventType) {
        skillExecuted = useItemOnSpecialEvent(player, itemStack, eventType);
    }
    
    // If no UMSIF skills were executed, try regular MSIF tags
    if (!skillExecuted) {
        const tags = itemStack.getTags();
        const msifSkills = parseMSIFTags(tags);
        
        if (msifSkills.length > 0) {
            // Handle regular MSIF skill activation logic here if needed
            skillExecuted = true;
        } else {
            // Fallback to lore commands
            skillExecuted = executeLoreCommands(player, itemStack);
        }
    }
    
    return skillExecuted;
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
        
        // If still no item or no tags, try lore backup
        if (!itemStack || !itemId) {
            // Try lore backup for mainhand
            const mainhandItem = equippable?.getEquipment(EquipmentSlot.Mainhand);
            if (mainhandItem && executeLoreCommands(player, mainhandItem)) {
                return;
            }
            // Try lore backup for offhand
            const offhandItem = equippable?.getEquipment(EquipmentSlot.Offhand);
            if (offhandItem && executeLoreCommands(player, offhandItem)) {
                return;
            }
            return;
        }
    }

    const tags = itemStack.getTags();
    const skills = parseMSIFTags(tags);
    if (skills.length === 0) {
        // Try lore backup if no MSIF tags found
        if (executeLoreCommands(player, itemStack)) {
            return;
        }
        return;
    }

    const scoreboardObj = parseItemIdToScoreboardObj(itemId);
    taddsb(scoreboardObj, player);
    const currentIndex = getScoreboardValue(scoreboardObj, player);
    const newIndex = (currentIndex + 1) % skills.length;

    if (setscoreb(player, scoreboardObj, newIndex)) {
        const skill = skills[newIndex];
        const message = `§aChanged to ${skill.skillName} ${skill.icon}`;
        player.runCommand(`title @s actionbar ${message}`);
    } else {
        // If scoreboard failed, try lore backup
        executeLoreCommands(player, itemStack);
    }
}

function useSkillArmor(player, eSlot) {
    const itemStack = player.getComponent("minecraft:equippable")?.getEquipment(eSlot);
    const itemId = itemStack?.typeId;
    if (!itemStack || !itemId) return;
    
    const tags = itemStack.getTags();
    const skills = parseMSIFTags(tags);
    if (skills.length === 0) {
        // Try lore backup if no MSIF tags found
        executeLoreCommands(player, itemStack);
        return;
    }
    
    const armorData = skills[0];
    const CDTEST = taddsbc(armorData.cooldown, armorData.cooldownGroup, player, armorData.cooldownGroupName);
    if (CDTEST.state) {
        let functionExecuted = false;
        try {
            player.runCommand(`function ${armorData.functionName}`);
            functionExecuted = true;
        } catch (error) {
            console.warn(`Error running function ${armorData.functionName}:`, error);
            // Try lore backup if function failed
            if (executeLoreCommands(player, itemStack)) {
                functionExecuted = true;
            } else {
                player.runCommand("tell @s §cError: Function failed or missing.");
            }
        }
        
        if (functionExecuted) {
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
    if (skills.length === 0) {
        // Try lore backup if no MSIF tags found
        executeLoreCommands(player, itemStack);
        return;
    }

    const scoreboardObj = parseItemIdToScoreboardObj(itemId);
    
    taddsb(scoreboardObj, player);
    
    const currentIndex = getScoreboardValue(scoreboardObj, player);
    const skill = skills[currentIndex];
    
    if (!skill || !skill.functionName) {
        // Try lore backup if no valid skill
        executeLoreCommands(player, itemStack);
        return;
    }
    
    const CDTEST = taddsbc(skill.cooldown, skill.cooldownGroup, player, skill.cooldownGroupName);
    if (CDTEST.state) {
        let functionExecuted = false;
        try {
            player.runCommand(`function ${skill.functionName}`);
            functionExecuted = true;
        } catch (error) {
            console.warn(`Error running function ${skill.functionName}:`, error);
            // Try lore backup if function failed
            if (executeLoreCommands(player, itemStack)) {
                functionExecuted = true;
            } else {
                player.runCommand("tell @s §cError: Function failed or missing.");
            }
        }
        
        if (functionExecuted) {
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
        }
    } else {
        let timeLeft = (CDTEST.value * 0.1).toFixed(1);
        player.runCommand(`title @s actionbar §6[${skill.cooldownGroupName}] will be ready in ${timeLeft}s`);
    }
}

function useItemOnSpecialEvent(player, itemStack, eventType) {
    if (!itemStack || !player) return false;
    
    const tags = itemStack.getTags();
    const umsifSkills = parseUMSIFTags(tags);
    
    // Filter skills that match the current event type
    const matchingSkills = umsifSkills.filter(skill => skill.eventType === eventType);
    
    if (matchingSkills.length === 0) {
        // Try lore backup if no UMSIF tags found for this event
        return executeLoreCommands(player, itemStack);
    }
    
    let skillExecuted = false;
    
    for (const skill of matchingSkills) {
        if (!skill.functionName) continue;
        
        // Check cooldown for this skill
        const CDTEST = taddsbc(skill.cooldownTime, skill.cooldownGroup, player, skill.cooldownGroupName);
        
        if (CDTEST.state) {
            try {
                player.runCommand(`function ${skill.functionName}`);
                skillExecuted = true;
                
                // Optional: Show skill activation message
                player.runCommand(`title @s actionbar §a${eventType} skill activated!`);
                
            } catch (error) {
                console.warn(`Error running UMSIF function ${skill.functionName}:`, error);
                // Try lore backup if function failed
                if (executeLoreCommands(player, itemStack)) {
                    skillExecuted = true;
                } else {
                    player.runCommand("tell @s §cError: UMSIF function failed or missing.");
                }
            }
        } else {
            let timeLeft = (CDTEST.value * 0.1).toFixed(1);
            player.runCommand(`title @s actionbar §6[${skill.cooldownGroupName}] will be ready in ${timeLeft}s`);
        }
    }
    
    return skillExecuted;
}

// Original itemUse event listener
world.afterEvents.itemUse.subscribe((ev) => {
    useSkill(ev.source, EquipmentSlot.Mainhand);
});

// Backup event listener for lore-based commands
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

// UMSIF Event Listeners - These will automatically trigger functions based on events
// Player damage event listener
world.afterEvents.entityHurt.subscribe((ev) => {
    if (ev.entity.typeId !== "minecraft:player") return;
    
    const player = ev.entity;
    const equippable = player.getComponent("minecraft:equippable");
    if (!equippable) return;
    
    // Check all equipped items for UMSIF tags with "onHurt" event
    const slots = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet, EquipmentSlot.Mainhand, EquipmentSlot.Offhand];
    
    for (const slot of slots) {
        const itemStack = equippable.getEquipment(slot);
        if (itemStack) {
            executeItemSkills(player, itemStack, "onHurt");
        }
    }
});

// Player attack event listener
world.afterEvents.entityHitEntity.subscribe((ev) => {
    if (ev.entity.typeId !== "minecraft:player") return;
    
    const player = ev.entity;
    const equippable = player.getComponent("minecraft:equippable");
    if (!equippable) return;
    
    // Check equipped weapons for UMSIF tags with "onAttack" event
    const weaponSlots = [EquipmentSlot.Mainhand, EquipmentSlot.Offhand];
    
    for (const slot of weaponSlots) {
        const itemStack = equippable.getEquipment(slot);
        if (itemStack) {
            executeItemSkills(player, itemStack, "onAttack");
        }
    }
});

// Entity killed event listener
world.afterEvents.entityDie.subscribe((ev) => {
    // Check if killed by a player
    if (ev.damageSource.damagingEntity?.typeId !== "minecraft:player") return;
    
    const player = ev.damageSource.damagingEntity;
    const equippable = player.getComponent("minecraft:equippable");
    if (!equippable) return;
    
    // Check all equipped items for UMSIF tags with "onKill" event
    const slots = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet, EquipmentSlot.Mainhand, EquipmentSlot.Offhand];
    
    for (const slot of slots) {
        const itemStack = equippable.getEquipment(slot);
        if (itemStack) {
            executeItemSkills(player, itemStack, "onKill");
        }
    }
});

// Player jump event listener
world.afterEvents.playerJump.subscribe((ev) => {
    const player = ev.player;
    const equippable = player.getComponent("minecraft:equippable");
    if (!equippable) return;
    
    // Check all equipped items for UMSIF tags with "onJump" event
    const slots = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet, EquipmentSlot.Mainhand, EquipmentSlot.Offhand];
    
    for (const slot of slots) {
        const itemStack = equippable.getEquipment(slot);
        if (itemStack) {
            executeItemSkills(player, itemStack, "onJump");
        }
    }
});

// Block break event listener
world.afterEvents.playerBreakBlock.subscribe((ev) => {
    const player = ev.player;
    const equippable = player.getComponent("minecraft:equippable");
    if (!equippable) return;
    
    // Check equipped tools for UMSIF tags with "onBlockBreak" event
    const toolSlots = [EquipmentSlot.Mainhand, EquipmentSlot.Offhand];
    
    for (const slot of toolSlots) {
        const itemStack = equippable.getEquipment(slot);
        if (itemStack) {
            executeItemSkills(player, itemStack, "onBlockBreak");
        }
    }
});

// Block place event listener
world.afterEvents.playerPlaceBlock.subscribe((ev) => {
    const player = ev.player;
    const equippable = player.getComponent("minecraft:equippable");
    if (!equippable) return;
    
    // Check equipped items for UMSIF tags with "onBlockPlace" event
    const slots = [EquipmentSlot.Mainhand, EquipmentSlot.Offhand];
    
    for (const slot of slots) {
        const itemStack = equippable.getEquipment(slot);
        if (itemStack) {
            executeItemSkills(player, itemStack, "onBlockPlace");
        }
    }
});

// Player spawn event listener for "onSpawn" events
world.afterEvents.playerSpawn.subscribe((ev) => {
    const player = ev.player;
    const equippable = player.getComponent("minecraft:equippable");
    if (!equippable) return;
    
    // Check all equipped items for UMSIF tags with "onSpawn" event
    const slots = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet, EquipmentSlot.Mainhand, EquipmentSlot.Offhand];
    
    for (const slot of slots) {
        const itemStack = equippable.getEquipment(slot);
        if (itemStack) {
            executeItemSkills(player, itemStack, "onSpawn");
        }
    }
});

// Interval-based event listener for "onTick" events (runs every second)
system.runInterval(() => {
    const players = world.getPlayers();
    
    for (const player of players) {
        const equippable = player.getComponent("minecraft:equippable");
        if (!equippable) continue;
        
        // Check all equipped items for UMSIF tags with "onTick" event
        const slots = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet, EquipmentSlot.Mainhand, EquipmentSlot.Offhand];
        
        for (const slot of slots) {
            const itemStack = equippable.getEquipment(slot);
            if (itemStack) {
                executeItemSkills(player, itemStack, "onTick");
            }
        }
    }
}, 20); // Run every 20 ticks (1 second)

system.runInterval(() => {
    updateCooldown();
}, 2); //redstone ticks

system.beforeEvents.startup.subscribe((init) => {
    const msifOpenCommand = {
        name: "msif:msifopen",
        description: "Open the MSIF UI",
        permissionLevel: CommandPermissionLevel.Any
    };

    const msifCloseCommand = {
        name: "msif:msifclose",
        description: "Close the MSIF UI",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    
    init.customCommandRegistry.registerCommand(msifOpenCommand, msifOpenFunction);
    init.customCommandRegistry.registerCommand(msifCloseCommand, msifCloseFunction);
});

function msifOpenFunction(origin) {
    const player = origin.sourceEntity;
    if (!player || player.typeId !== "minecraft:player") return { status: CustomCommandStatus.Fail };

    system.runTimeout(() => uiManager.closeAllForms(player), 10);
    system.runTimeout(() => msifMenu(player), 10);

    return { status: CustomCommandStatus.Success };
}

function msifCloseFunction(origin) {
    const player = origin.sourceEntity;
    if (!player || player.typeId !== "minecraft:player") return { status: CustomCommandStatus.Fail };

    system.runTimeout(() => uiManager.closeAllForms(player), 10);

    return { status: CustomCommandStatus.Success };
}