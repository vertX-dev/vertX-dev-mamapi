import { world, system, EquipmentSlot, EntityComponentTypes } from "@minecraft/server";
import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";

export async function forceShow(player, form, timeout = Infinity) {
    const startTick = system.currentTick;
    while ((system.currentTick - startTick) < timeout) {
        const response = await form.show(player);
        if (response.cancelationReason !== FormCancelationReason.UserBusy) return response;
    };
    throw new Error(`Timed out after ${timeout} ticks`);
}

async function mostrarMenu(player) {
    const menu = new ActionFormData()
        .title('custom_buttons')
        .button('', 'textures/ui/refresh_hover')
    const response = await forceShow(player, menu, 200);
    if (response.selection >= 0) {
        switch (response.selection) {
            case 0:
                changeSkill(player);
                break;
        }
        mostrarMenu(player);
    }
}

world.afterEvents.playerSpawn.subscribe(ev => {
    const player = ev.player;
    if (ev.initialSpawn) {
        mostrarMenu(player);
    }
});

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
            
            let functionNameG = " ";
            let skillNameG = "Skill";
            let cooldownG = 0;
            let cooldownGroupG = "none";
            let iconG = "";
            
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
                            cooldownG = parts[currentIndex + 2];
                            cooldownGroupNameG = cooldownGroupG;
                            currentIndex = currentIndex + 3;
                        } else {
                            cooldownG = parts[currentIndex + 4];
                            cooldownGroupNameG = parts[currentIndex + 3].replacr("_p", "§").replace("_", " ");
                            currentIndex = currentIndex + 5;
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
                icon: iconG
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

function taddsbc(value, objectiveNameA, player) {
    const objectiveName = "cd" + objectiveNameA;
    try {
        if (!world.scoreboard.getObjective(objectiveName)) {
            world.scoreboard.addObjective(objectiveName, objectiveName);
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
        for (const player of players) {
            const cd = getScoreboardValue(obj.id, player);
            if (cd >= 0) {
                world.scoreboard.getObjective(obj.id).addScore(player, -1);
            } 
            if (cd == 0) {
                player.runCommand(`title @s actionbar §b➤ §aSkill group §l${obj.displayName}§r§a is off cooldown and ready!`)
            }
        }
    }
}

function changeSkill(player) {
    const itemStack = player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
    const itemId = itemStack?.typeId;
    if (!itemStack || !itemId) return;

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

function useSkill(player) {
    const itemStack = player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
    const itemId = itemStack?.typeId;
    if (!itemStack || !itemId) return;

    const tags = itemStack.getTags();
    const skills = parseMSIFTags(tags);
    if (skills.length === 0) return;

    const scoreboardObj = parseItemIdToScoreboardObj(itemId);
    const CDTEST = taddsbc(skills.cooldown, skills.cooldownGroup, player);
    if (CDTEST.state) {
        taddsb(scoreboardObj, player);
        const currentIndex = getScoreboardValue(scoreboardObj, player);
        const skill = skills[currentIndex];
    
        if (!skill || !skill.functionName) return;
    
        try {
            player.runCommand(`function ${skill.functionName}`);
        } catch (error) {
            console.warn(`Error running function ${skill.functionName}:`, error);
            player.runCommand("tell @s §cError: Function failed or missing.");
        }
    } else {
        let timeLeft = CDTEST.value * 0.1;
        player.runCommand(`title @s actionbar §6[${skill.cooldownGroupName}] will be ready in ${timeLeft}s`);
    }
}

world.afterEvents.itemUse.subscribe((ev) => {
    useSkill(ev.source);
});

system.runInterval(() => {
    updateCooldown();
}, 10); //redstone ticks
