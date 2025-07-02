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
        player.runCommand(`scoreboard players set @s ${scoreboard} ${value}`);
        return true;
    } catch {
        return false;
    }
}

function parseMSIFTags(tags) {
    return tags
        .filter(tag => tag.startsWith("MSIF:"))
        .map(tag => {
            const parts = tag.slice(5).split(":");
            return {
                functionName: parts[0],
                skillName: parts[1].replace("_", " ")
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
        const message = `§aChanged to ${skill.skillName}`;
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
}

world.afterEvents.itemUse.subscribe((ev) => {
    useSkill(ev.source);
});


