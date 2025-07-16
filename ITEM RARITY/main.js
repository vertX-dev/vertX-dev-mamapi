import {
    world,
    system,
    EquipmentSlot,
    GameMode,
    ItemStack
} from "@minecraft/server";
import {
    ActionFormData,
    ModalFormData,
    FormCancelationReason,
    uiManager
} from "@minecraft/server-ui";
import {
    RARITY,
    blackList,
    TagMapping,
    UPGRADE_COSTS
} from './mainLib.js';
import {
    stats
} from './statsLib.js';
import {
    skills
} from './skillsLib.js';
import {
    passives
} from './passivesLib.js';

//=====================================CONFIGURATION & CONSTANTS===========================================

let BOOST_COEF; //default 10
let RR_BASE; // default common

const HEALTH_BAR_FONT = ""; //32 values
const RARITY_UPGRADES_GLYPS = ""; //6 values

// Settings auto-load flag
let settingsLoaded = false;

// Static predefined scoreboards - load early to prevent timing issues
const PREDEFINED_SCOREBOARDS = [{
    name: "damage",
    displayName: "Damage"
},
    {
        name: "damagepercent",
        displayName: "Damage percent bonus"
    },
    {
        name: "defense",
        displayName: "Defense"
    },
    {
        name: "health",
        displayName: "Health"
    },
    {
        name: "speed",
        displayName: "Speed"
    },
    {
        name: "regeneration",
        displayName: "Regeneration"
    },
    {
        name: "critchance",
        displayName: "Crit Chance"
    },
    {
        name: "critdamage",
        displayName: "Crit Damage"
    },
    {
        name: "lifesteal",
        displayName: "Life steal"
    },
    {
        name: "healthpercent",
        displayName: "Health percent bonus"
    },
    {
        name: "hawkeyerange",
        displayName: "Hawk eye range"
    }];

const COOLDOWN_PREDEFINED_SCOREBOARDS = [{
    name: "smashleap",
    displayName: "Smash Leap"
},
    {
        name: "spinstrike",
        displayName: "Spin Strike"
    },
    {
        name: "explosivemining",
        displayName: "Explosive Mining"
    },
    {
        name: "rayminer",
        displayName: "Ray Miner"
    },
    {
        name: "excavator",
        displayName: "Excavator"
    },
    {
        name: "flamearc",
        displayName: "Flame Arc"
    },
    {
        name: "shadowdash",
        displayName: "Shadow Dash"
    },
    {
        name: "voidpierce",
        displayName: "Void Pierce"
    }];

const hpBar = {}

//=====================================UTILITY FUNCTIONS===========================================

function getScoreboardValue(scoreboard, player) {
    const scoreboardObj = world.scoreboard.getObjective(scoreboard);
    const scoreboardValue = scoreboardObj.getScore(player);
    return scoreboardValue;
}

function getUpgradeRarityIcon(rarity) {
    const rarityObj = Object.values(RARITY).find(r => r.sid === rarity);
    return RARITY_UPGRADES_GLYPS.charAt(rarityObj.id - 1);
}

function getUpgradeTemplates(player) {
    return `${countItemInInventory(player, "rrs:common_upgrade")}   ${countItemInInventory(player, "rrs:uncommon_upgrade")}   ${countItemInInventory(player, "rrs:rare_upgrade")}   ${countItemInInventory(player, "rrs:epic_upgrade")}   ${countItemInInventory(player, "rrs:legendary_upgrade")}   ${countItemInInventory(player, "rrs:mythic_upgrade")}`;
}



function parseTags(itemId = "minecraft:apple") {
    // Check blacklist first
    for (const blItem of blackList) {
        if (itemId == blItem) {
            return {
                rarity: false
            }
        }
    }

    // Split the itemId by underscores and colons to get individual words
    const itemWords = itemId.toLowerCase().split(/[_:]/);

    // Check each tag category
    for (const [tagKey, tagValues] of Object.entries(TagMapping)) {
        // Check if any word from itemId matches any value in the tag array
        for (const word of itemWords) {
            if (tagValues.includes(word)) {
                return {
                    rarity: true,
                    data: tagKey
                };
            }
        }
    }

    // No match found
    return {
        rarity: false
    };
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
//=======================================UI MENU=========================================================

// Helper function to normalize rarity names for consistent lookup
function normalizeRarityName(rarity) {
    if (!rarity) return "Common";

    // Handle different formats and convert to the sid format (e.g., "Common", "Uncommon")
    let normalized = rarity;

    // Remove color codes if present
    normalized = normalized.replace(/§./g, '');

    // Trim whitespace
    normalized = normalized.trim();

    // Convert to proper case (first letter uppercase, rest lowercase)
    normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();

    // Validate that it's a known rarity
    const validRarities = ["Common",
        "Uncommon",
        "Rare",
        "Epic",
        "Legendary",
        "Mythic"];
    if (!validRarities.includes(normalized)) {
        return "Common";
    }

    return normalized;
}

async function forceShow(player, form, timeout = Infinity) {
    const startTick = system.currentTick;
    while ((system.currentTick - startTick) < timeout) {
        const response = await form.show(player);
        if (response.cancelationReason !== FormCancelationReason.UserBusy) return response;
    };
    throw new Error(`Timed out after ${timeout} ticks`);
}

async function msifMenu(player) {
    const menu = new ActionFormData()
    .title('rssp_buttons')
    .button('', 'textures/ui/gamerpic');

    const response = await forceShow(player, menu, 200);

    if (response.selection >= 0) {
        switch (response.selection) {
            case 0:
                statsMainMenu(player);
                break;
        }
    } else {
        // Retry menu unless PC Mode is active
        if (!player.hasTag("pc_mode")) {
            msifMenu(player);
        }
    }
}

world.afterEvents.playerSpawn.subscribe((ev) => {
    const player = ev.player;
    uiManager.closeAllForms(player);
    if (!player.hasTag("pc_mode")) {
        msifMenu(player);
    }
});

system.runTimeout(() => {
    const players = world.getPlayers();
    for (const player of players) {
        uiManager.closeAllForms(player);

        try {
            const gameModeResult = player.runCommand("testfor @s[m=creative]");
            const isCreative = gameModeResult.successCount > 0;

            if (isCreative) {
                const adminCheckResult = player.runCommand("testfor @a[tag=admin]");
                const hasAdminPlayers = adminCheckResult.successCount > 0;

                if (!hasAdminPlayers) {
                    player.runCommand("tag @s add admin");
                    console.log(`Added admin tag to player: ${player.name}`);
                }
            }
    } catch (error) {
        console.warn("Error checking player gamemode or admin status:", error);
    }

    try {
        if (!BOOST_COEF || BOOST_COEF == 0) {
            BOOST_COEF = 10;
            console.log(`Initialized BOOST_COEF to 10`);
        }

        if (!RR_BASE || !RR_BASE.id) {
            RR_BASE = RARITY.COMMON;
            console.log(`Initialized RR_BASE to RARITY.COMMON`);
        }
    } catch (error) {
        console.warn("Error initializing variables:", error);
    }

    if (!player.hasTag("pc_mode")) {
        msifMenu(player);
    }
}
}, 20);

function statsMainMenu(player) {
const menu = new ActionFormData()
.title('SELECT OPTION')
.button('STATS',
'textures/ui/gamerpic')
.button('SETTINGS',
'textures/ui/automation_glyph_color')
.button('PC MODE',
'textures/ui/addServer')
.button('FORGE',
'textures/ui/smithing_icon');

menu.show(player).then((r) => {
if (!r.canceled) {
switch (r.selection) {
case 0:
showStatsForm(player, true);
break;
case 1:
showEnhancedSettingsForm(player);
break;
case 2:
uiManager.closeAllForms(player);
player.addTag("pc_mode");
player.sendMessage("PC MODE ENABLED\nUse .help for additional info\nYou need to enable beta API");
break;
case 3:
upgradeMenu(player);
break;
}
} else {
uiManager.closeAllForms(player);
if (!player.hasTag("pc_mode")) {
msifMenu(player);
}
}
});
}

function showStatsForm(player) {
const stats = {
damage: getScoreboardValue("damage",
player),
damagepercent: getScoreboardValue("damagepercent",
player),
defense: getScoreboardValue("defense",
player),
health: getScoreboardValue("health",
player) + 20,
speed: getScoreboardValue("speed",
player),
regeneration: getScoreboardValue("regeneration",
player),
critchance: getScoreboardValue("critchance",
player) + 5,
critdamage: getScoreboardValue("critdamage",
player) + 50,
lifesteal: getScoreboardValue("lifesteal",
player),
healthpercent: getScoreboardValue("healthpercent",
player)
};

const form = new ActionFormData()
.title("§l§aYour Stats")
.body(
`§7Damage: §f${stats.damage}\n` +
`§7Damage: §f${stats.damagepercent}%%\n` +
`§7Defense: §f${stats.defense}%%\n` +
`§7Health: §f${stats.health}\n` +
`§7Speed: §f${stats.speed}\n` +
`§7Regeneration: §f${stats.regeneration}\n` +
`§7Crit Chance: §f${stats.critchance}%%\n` +
`§7Crit Damage: §f${stats.critdamage}%%\n` +
`§7Lifesteal: §f${stats.lifesteal}%%\n` +
`§7Health: §f${stats.healthpercent}%%`
)
.button("§aOK");

form.show(player).then((r) => {
if (r.canceled) {
uiManager.closeAllForms(player);
if (!player.hasTag("pc_mode")) {
msifMenu(player);
}
} else if (r.selection == 0) {
uiManager.closeAllForms(player);
if (!player.hasTag("pc_mode")) {
msifMenu(player);
}
}
});
}

function showSettingsForm(player) {
if (!player.hasTag("admin")) {
uiManager.closeAllForms(player);
if (!player.hasTag("pc_mode")) {
msifMenu(player);
}
return;
}

const rarityOptions = [{
name: "§7Common",
value: RARITY.COMMON
},
{
name: "§aUncommon",
value: RARITY.UNCOMMON
},
{
name: "§9Rare",
value: RARITY.RARE
},
{
name: "§5Epic",
value: RARITY.EPIC
},
{
name: "§6Legendary",
value: RARITY.LEGENDARY
},
{
name: "§cMythic",
value: RARITY.MYTHIC
},
];

const sliderParam = {
defaultValue: BOOST_COEF ?? 10,
tooltip: "10 - default value",
valueStep: 1
};

const form = new ModalFormData()
.title("Settings")
.slider("Boost Coefficient", 1, 50, {
step: sliderParam.valueStep,
defaultValue: sliderParam.defaultValue
})
.dropdown("Minimum Rarity", rarityOptions.map(opt => opt.name));

form.show(player).then(response => {
if (!response.canceled) {
const [boostCoef,
rarityIndex] = response.formValues;
BOOST_COEF = boostCoef;
RR_BASE = rarityOptions[rarityIndex].value;
player.sendMessage(`§aSettings updated:\n§fBoost Coef: §e${BOOST_COEF}\n§fMin Rarity: ${rarityOptions[rarityIndex].name}`);
}

if (!player.hasTag("pc_mode")) {
uiManager.closeAllForms(player);
msifMenu(player);
}
});
}

function upgradeMenu(player) {
// Check if there's an anvil nearby
const playerLocation = player.location;
const dimension = player.dimension;

// Search for anvil in a 3x3x3 area around the player
let anvilFound = false;
for (let x = -1; x <= 1; x++) {
for (let y = -1; y <= 1; y++) {
for (let z = -1; z <= 1; z++) {
const checkLocation = {
x: playerLocation.x + x,
y: playerLocation.y + y,
z: playerLocation.z + z
};

try {
const block = dimension.getBlock(checkLocation);
if (block && block.typeId === "minecraft:anvil") {
anvilFound = true;
break;
}
} catch (error) {
// Block might be unloaded or out of bounds
continue;
}
}
if (anvilFound) break;
}
if (anvilFound) break;
}

// If no anvil found, notify player and return
if (!anvilFound) {
player.sendMessage("§cYou need to be near an anvil to upgrade items!");
if (!player.hasTag("pc_mode")) {
uiManager.closeAllForms(player);
msifMenu(player);
}
return;
}

// Check if player has an item in main hand
const equipment = player.getComponent("minecraft:equippable");
const itemStack = equipment.getEquipment(EquipmentSlot.Mainhand);

if (!itemStack) {
player.sendMessage("§cYou need to hold an item to upgrade it!");
if (!player.hasTag("pc_mode")) {
uiManager.closeAllForms(player);
msifMenu(player);
}
return;
}

// Display upgrade menu
displayUpgradeOptions(equipment, player, itemStack);
}

// Helper function to display upgrade options
function displayUpgradeOptions(equipment, player, itemStack) {
const form = new ActionFormData();
form.title("§6Item Upgrade Menu");

const upgradeTemplates = getUpgradeTemplates(player);
const currentRarity = getItemRarity(itemStack);
const itemName = itemStack.nameTag ?? itemStack.typeId.split("_").join(" ").split(":").pop();

form.body(`§7Item: §e${itemName}\n§7Current Rarity: §e${currentRarity}\n§7Your RRS Upgrades: §a${upgradeTemplates}\n\n§7Select an upgrade option:`);

// Add upgrade buttons with appropriate icons
form.button("§dRarity Upgrade", "textures/ui/smithing_icon");
form.button("§aStats Reroll", "textures/ui/icon_random");
form.button("§2Stats Upgrade", "textures/ui/hammer_l");
form.button("§bSkill Reroll", "textures/ui/icon_random");
form.button("§9Skill Upgrade", "textures/ui/hammer_l");
form.button("§ePassive Reroll", "textures/ui/icon_random");
form.button("§6Passive Upgrade", "textures/ui/hammer_l");

form.show(player).then((response) => {
if (response.canceled || response.selection === undefined) return;

switch (response.selection) {
case 0:
showEnhancedRarityUpgradeMenu(equipment, player, itemStack);
break;
case 1:
showEnhancedStatsRerollMenu(equipment, player, itemStack);
break;
case 2:
showEnhancedStatsUpgradeMenu(equipment, player, itemStack);
break;
case 3:
showEnhancedSkillRerollMenu(equipment, player, itemStack);
break;
case 4:
showEnhancedSkillUpgradeMenu(equipment, player, itemStack);
break;
case 5:
showEnhancedPassiveRerollMenu(equipment, player, itemStack);
break;
case 6:
showEnhancedPassiveUpgradeMenu(equipment, player, itemStack);
break;
default:
player.sendMessage("§7Upgrade cancelled.");
}
});
}

// Chat commands
world.beforeEvents.chatSend.subscribe((eventData) => {
const {
sender,
message
} = eventData;

if (message.startsWith('.')) {
eventData.cancel = true;

const args = message.split(' ');
const command = args[0].toLowerCase();

switch (command) {
case '.menu':
system.runTimeout(() => statsMainMenu(sender), 60);
break;
case '.stats':
system.runTimeout(() => showStatsForm(sender), 60);
break;
case '.settings':
system.runTimeout(() => showEnhancedSettingsForm(sender), 60);
break;
case '.disablepc':
system.runTimeout(() => {
sender.removeTag("pc_mode")}, 20);
sender.sendMessage("§cPC MODE disabled.");
system.runTimeout(() => msifMenu(sender), 60);
break;
case '.help':
system.runTimeout(() => sender.sendMessage("§7Available commands: §a.menu, .stats, .settings, .help, .disablepc"), 0);
break;
case '.upgrade':
system.runTimeout(() => upgradeMenu(sender), 60);
default:
system.runTimeout(() => sender.sendMessage('§cUnknown command. Use .stats, .menu, .settings, .help or .disablepc'), 0);
}
}
});


//=====================================CORE GAME LOGIC===========================================

function randomRarity(RR = RR_BASE) {
let rarity = RR ?? RARITY.COMMON;
let currentId = rarity.id ?? 1;

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
// Ensure BOOST_COEF is initialized
if (!BOOST_COEF || BOOST_COEF == 0) {
BOOST_COEF = 10;
console.log(`Initialized BOOST_COEF to 10 in randomStats`);
}

// Filter available stats that match the item type
const availableStats = Object.values(stats).filter(stat => stat.type.includes(type));

// Normalize rarity name for consistent lookup
const normalizedRarity = normalizeRarityName(rarity);
let srr = Object.values(RARITY).find(r => r.sid === normalizedRarity);

if (!availableStats.length || !srr) {
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
const sign = newStatValue >= 0 ? "+": "";

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
// Ensure BOOST_COEF is initialized
if (!BOOST_COEF || BOOST_COEF == 0) {
BOOST_COEF = 10;
console.log(`Initialized BOOST_COEF to 10 in randomSkill`);
}

// Filter available skills that match the item type
const availableSkills = Object.values(skills).filter(skill => skill.type.includes(type));

// Normalize rarity name for consistent lookup
const normalizedRarity = normalizeRarityName(rarity);
let srr = Object.values(RARITY).find(r => r.sid === normalizedRarity);

if (!availableSkills.length || !srr || srr.skillChances.skill < Math.random()) {
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
// Ensure BOOST_COEF is initialized
if (!BOOST_COEF || BOOST_COEF == 0) {
BOOST_COEF = 10;
console.log(`Initialized BOOST_COEF to 10 in randomPassiveAbility`);
}

// Filter available passives that match the item type
const availablePassives = Object.values(passives).filter(passive => passive.type.includes(type));

// Normalize rarity name for consistent lookup
const normalizedRarity = normalizeRarityName(rarity);
let srr = Object.values(RARITY).find(r => r.sid === normalizedRarity);

if (!availablePassives.length || !srr || srr.skillChances.passive < Math.random()) {
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

const newLore = [rarity.dName,
...stats,
...skill,
...passive];

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
EquipmentSlot.Mainhand,
EquipmentSlot.Offhand,
EquipmentSlot.Head,
EquipmentSlot.Chest,
EquipmentSlot.Legs,
EquipmentSlot.Feet
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
let health = Math.floor(getScoreboardValue("health", player) / 4);
let defense = Math.floor(Math.min(getScoreboardValue("defense", player), 80) / 20) - 1;
let speed = Math.floor(Math.min(getScoreboardValue("speed", player), 200) / 20) - 1;
let healthBoost = (getScoreboardValue("healthpercent", player) / 100) + 1;

health = Math.floor(((health + 5) * healthBoost) - 6);

if (health >= 0) {
player.addEffect("health_boost", 62, {
amplifier: health,
showParticles: false
});
}
if (defense >= 0) {
player.addEffect("resistance", 62, {
amplifier: defense,
showParticles: false
});
}
if (speed >= 0) {
player.addEffect("speed", 62, {
amplifier: speed,
showParticles: false
});
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
value: stringVal ? Number(stringVal[1]): 0,
cooldown: stringCd ? Number(stringCd[1]): 0
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
value: stringVal ? Number(stringVal[1]): 0,
cooldown: stringCd ? Number(stringCd[1]): 0
}

return Passive;
}

//=====================================UPGRADE FUNCTIONS===========================================

// Utility function to count items in inventory
function countItemInInventory(player, itemId) {
const inventory = player.getComponent("minecraft:inventory").container;
let count = 0;

for (let i = 0; i < inventory.size; i++) {
const item = inventory.getItem(i);
if (item && item.typeId === itemId) {
count += item.amount;
}
}
return count;
}

// Utility function to remove items from inventory
function removeItemsFromInventory(player, itemId, amount) {
const inventory = player.getComponent("minecraft:inventory").container;
let remaining = amount;

for (let i = 0; i < inventory.size && remaining > 0; i++) {
const item = inventory.getItem(i);
if (item && item.typeId === itemId) {
if (item.amount <= remaining) {
remaining -= item.amount;
inventory.setItem(i, undefined);
} else {
item.amount -= remaining;
inventory.setItem(i, item);
remaining = 0;
}
}
}
return remaining === 0;
}

// Helper function to convert normalized rarity name to uppercase format for UPGRADE_COSTS lookup
function rarityToUpgradeKey(rarity) {
const normalized = normalizeRarityName(rarity);
return normalized.toUpperCase();
}

// Helper functions for upgrade/reroll counter management
function getUpgradeCounter(itemStack, type) {
const lore = itemStack.getLore() ?? [];
const counterPattern = new RegExp(`§8${type} Count: (\\d+)`);

for (const line of lore) {
const match = line.match(counterPattern);
if (match) {
return parseInt(match[1]);
}
}
return 0;
}

function setUpgradeCounter(itemStack, type, count) {
const lore = itemStack.getLore() ?? [];
const counterPattern = new RegExp(`§8${type} Count: \\d+`);
const newCounterLine = `§8${type} Count: ${count}`;

let newLore = [];
let counterFound = false;

for (const line of lore) {
if (counterPattern.test(line)) {
newLore.push(newCounterLine);
counterFound = true;
} else {
newLore.push(line);
}
}

if (!counterFound) {
// Add counter after rarity line (index 0)
newLore.splice(1, 0, newCounterLine);
}

itemStack.setLore(newLore);
}

function calculateCostWithCounter(baseCost, counter, multiplier = 1.5) {
return baseCost.map(item => ({
...item,
count: Math.ceil(item.count * Math.pow(multiplier, counter))
}));
}

function getStatsFromLore(itemStack) {
const lore = itemStack.getLore() ?? [];
const stats = [];
let inStatsSection = false;

for (const line of lore) {
if (line === "§8Attributes") {
inStatsSection = true;
continue;
}
if (line === "§a§t§b§e§n§d§r") {
break;
}
if (inStatsSection && line.includes("§w")) {
stats.push(line);
}
}
return stats;
}

// Get current item rarity from lore
function getItemRarity(itemStack) {
if (!itemStack) return "COMMON";

const lore = itemStack.getLore() ?? [];
if (lore.length === 0) return "COMMON";

// Extract rarity from first line of lore
const rarityLine = lore[0];

// Handle different formats of rarity names
// Format 1: "§7Common" (with color codes)
// Format 2: "Common" (without color codes)
// Format 3: "COMMON" (already uppercase)

let rarityName = rarityLine;

// Remove color codes if present (§ followed by any character)
rarityName = rarityName.replace(/§./g, '');

// Convert to uppercase for consistent lookup
rarityName = rarityName.toUpperCase().trim();

// Validate that it's a known rarity, fallback to COMMON if not
const validRarities = ["COMMON",
"UNCOMMON",
"RARE",
"EPIC",
"LEGENDARY",
"MYTHIC"];
if (!validRarities.includes(rarityName)) {
return "COMMON";
}

return rarityName;
}

// Check if player has required items for upgrade
function hasRequiredItems(player, requiredItems) {
for (const requirement of requiredItems) {
const available = countItemInInventory(player, requirement.item);
if (available < requirement.count) {
return false;
}
}
return true;
}

// Consume required items for upgrade
function consumeRequiredItems(player, requiredItems) {
for (const requirement of requiredItems) {
if (!removeItemsFromInventory(player, requirement.item, requirement.count)) {
return false;
}
}
return true;
}

// Rarity Upgrade Function (Legacy - redirects to enhanced menu)
function rarityUpgrade(equipment, player, itemStack) {
const currentRarity = getItemRarity(itemStack);
const upgradeCost = UPGRADE_COSTS.RARITY_UPGRADE[currentRarity];
const upgradeCounter = getUpgradeCounter(itemStack, "Rarity Upgrade");
const adjustedCost = upgradeCost ? calculateCostWithCounter(upgradeCost.requiredItems, upgradeCounter): null;

if (!upgradeCost || !upgradeCost.targetRarity) {
player.sendMessage("§cThis item is already at maximum rarity!");
return;
}

if (!hasRequiredItems(player, adjustedCost)) {
const requirements = adjustedCost
.map(req => `${req.count}x ${req.item.replace("minecraft:", "").replace("rrs:", "")}`)
.join(", ");
player.sendMessage(`§cYou need: ${requirements}`);
return;
}

// Roll for success
if (Math.random() > upgradeCost.successChance) {
consumeRequiredItems(player, adjustedCost);
const newCounter = upgradeCounter + 1;
setUpgradeCounter(itemStack, "Rarity Upgrade", newCounter);
player.sendMessage("§cUpgrade failed! Items were consumed.");
return;
}

// Successful upgrade
consumeRequiredItems(player, adjustedCost);
const newCounter = upgradeCounter + 1;

const newRarity = RARITY[upgradeCost.targetRarity];
const currentLore = itemStack.getLore() ?? [];

// Replace the rarity line (first line)
const newLore = [newRarity.dName,
...currentLore.slice(1)];

let newItem = itemStack.clone();
newItem.setLore(newLore);
setUpgradeCounter(newItem, "Rarity Upgrade", newCounter);
equipment.setEquipment(EquipmentSlot.Mainhand, newItem);

player.sendMessage(`§aSuccessfully upgraded to ${newRarity.dName}§a!`);
}

// Stats Upgrade Function (Legacy - now with counter tracking)
function statsUpgrade(equipment, player, itemStack) {
const currentRarity = getItemRarity(itemStack);
const upgradeCost = UPGRADE_COSTS.STATS_UPGRADE[currentRarity];
const upgradeCounter = getUpgradeCounter(itemStack, "Stats Upgrade");
const adjustedCost = upgradeCost ? calculateCostWithCounter(upgradeCost.requiredItems, upgradeCounter): null;

if (!hasRequiredItems(player, adjustedCost)) {
const requirements = adjustedCost
.map(req => `${req.count}x ${req.item.replace("minecraft:", "").replace("rrs:", "")}`)
.join(", ");
player.sendMessage(`§cYou need: ${requirements}`);
return;
}

// Roll for success
if (Math.random() > upgradeCost.successChance) {
consumeRequiredItems(player, adjustedCost);
const newCounter = upgradeCounter + 1;
setUpgradeCounter(itemStack, "Stats Upgrade", newCounter);
player.sendMessage("§cUpgrade failed! Items were consumed.");
return;
}

// Successful upgrade - enhance existing stats
consumeRequiredItems(player, adjustedCost);
const newCounter = upgradeCounter + 1;

const currentLore = itemStack.getLore() ?? [];
let newLore = [...currentLore];
let statsFound = false;

// Find and upgrade stats section
for (let i = 0; i < newLore.length; i++) {
if (newLore[i] === "§8Attributes") {
statsFound = true;
i++; // Move to first stat
while (i < newLore.length && newLore[i] !== "§a§t§b§e§n§d§r") {
const statLine = newLore[i];
const valueMatch = statLine.match(/§w([+-]?\d+)§w/);
if (valueMatch) {
const currentValue = parseInt(valueMatch[1]);
const newValue = Math.floor(currentValue * upgradeCost.upgradeMultiplier);
const sign = newValue >= 0 ? '+': '';
newLore[i] = statLine.replace(/§w[+-]?\d+§w/, `§w${sign}${Math.abs(newValue)}§w`);
}
i++;
}
break;
}
}

if (!statsFound) {
player.sendMessage("§cThis item has no stats to upgrade!");
return;
}

let newItem = itemStack.clone();
newItem.setLore(newLore);
setUpgradeCounter(newItem, "Stats Upgrade", newCounter);
equipment.setEquipment(EquipmentSlot.Mainhand, newItem);

player.sendMessage("§aStats upgraded successfully!");
}

// Stats Reroll Function (Legacy - now with counter tracking)
function statsReroll(equipment, player, itemStack) {
const currentRarity = getItemRarity(itemStack);
const rerollCost = UPGRADE_COSTS.STATS_REROLL[currentRarity];
const rerollCounter = getUpgradeCounter(itemStack, "Stats Reroll");
const adjustedCost = rerollCost ? calculateCostWithCounter(rerollCost.requiredItems, rerollCounter): null;

if (!hasRequiredItems(player, adjustedCost)) {
const requirements = adjustedCost
.map(req => `${req.count}x ${req.item.replace("minecraft:", "").replace("rrs:", "")}`)
.join(", ");
player.sendMessage(`§cYou need: ${requirements}`);
return;
}

consumeRequiredItems(player, adjustedCost);
const newCounter = rerollCounter + 1;

// Get item type for rerolling
const Tags = parseTags(itemStack.typeId);
if (!Tags || !Tags.rarity) {
player.sendMessage("§cThis item cannot be rerolled!");
return;
}

// Generate new stats
const newStats = randomStats(currentRarity, Tags.data);
const currentLore = itemStack.getLore() ?? [];
let newLore = [];

// Keep rarity and non-stats sections
let i = 0;
while (i < currentLore.length) {
if (currentLore[i] === "§8Attributes") {
// Skip old stats section
while (i < currentLore.length && currentLore[i] !== "§a§t§b§e§n§d§r") {
i++;
}
if (i < currentLore.length) i++; // Skip end marker
// Add new stats
newLore.push(...newStats);
} else {
newLore.push(currentLore[i]);
i++;
}
}

let newItem = itemStack.clone();
newItem.setLore(newLore);
setUpgradeCounter(newItem, "Stats Reroll", newCounter);
equipment.setEquipment(EquipmentSlot.Mainhand, newItem);

player.sendMessage("§aStats rerolled successfully!");
}

// Skill Upgrade Function (Legacy - now with counter tracking)
function skillUpgrade(equipment, player, itemStack) {
const currentRarity = getItemRarity(itemStack);
const upgradeCost = UPGRADE_COSTS.SKILL_UPGRADE[currentRarity];
const upgradeCounter = getUpgradeCounter(itemStack, "Skill Upgrade");
const adjustedCost = upgradeCost ? calculateCostWithCounter(upgradeCost.requiredItems, upgradeCounter): null;

if (!hasRequiredItems(player, adjustedCost)) {
const requirements = adjustedCost
.map(req => `${req.count}x ${req.item.replace("minecraft:", "").replace("rrs:", "")}`)
.join(", ");
player.sendMessage(`§cYou need: ${requirements}`);
return;
}

// Roll for success
if (Math.random() > upgradeCost.successChance) {
consumeRequiredItems(player, adjustedCost);
const newCounter = upgradeCounter + 1;
setUpgradeCounter(itemStack, "Skill Upgrade", newCounter);
player.sendMessage("§cUpgrade failed! Items were consumed.");
return;
}

consumeRequiredItems(player, adjustedCost);
const newCounter = upgradeCounter + 1;

const currentLore = itemStack.getLore() ?? [];
let newLore = [...currentLore];
let skillFound = false;

// Find and upgrade skill section
for (let i = 0; i < newLore.length; i++) {
if (newLore[i] === "§8Skill") {
skillFound = true;
i++; // Move to skill content
while (i < newLore.length && newLore[i] !== "§s§k§l§e§n§d§r") {
const skillLine = newLore[i];
const valueMatch = skillLine.match(/§w(\d+)§w/);
if (valueMatch) {
const currentValue = parseInt(valueMatch[1]);
const newValue = Math.floor(currentValue * upgradeCost.upgradeMultiplier);
newLore[i] = skillLine.replace(/§w\d+§w/, `§w${newValue}§w`);
}
i++;
}
break;
}
}

if (!skillFound) {
player.sendMessage("§cThis item has no skill to upgrade!");
return;
}

let newItem = itemStack.clone();
newItem.setLore(newLore);
setUpgradeCounter(newItem, "Skill Upgrade", newCounter);
equipment.setEquipment(EquipmentSlot.Mainhand, newItem);

player.sendMessage("§aSkill upgraded successfully!");
}

// Skill Reroll Function (Legacy - now with counter tracking)
function skillReroll(equipment, player, itemStack) {
const currentRarity = getItemRarity(itemStack);
const rerollCost = UPGRADE_COSTS.SKILL_REROLL[currentRarity];
const rerollCounter = getUpgradeCounter(itemStack, "Skill Reroll");
const adjustedCost = rerollCost ? calculateCostWithCounter(rerollCost.requiredItems, rerollCounter): null;

if (!hasRequiredItems(player, adjustedCost)) {
const requirements = adjustedCost
.map(req => `${req.count}x ${req.item.replace("minecraft:", "").replace("rrs:", "")}`)
.join(", ");
player.sendMessage(`§cYou need: ${requirements}`);
return;
}

consumeRequiredItems(player, adjustedCost);
const newCounter = rerollCounter + 1;

// Get item type for rerolling
const Tags = parseTags(itemStack.typeId);
if (!Tags || !Tags.rarity) {
player.sendMessage("§cThis item cannot be rerolled!");
return;
}

// Generate new skill
const newSkill = randomSkill(currentRarity, Tags.data);
const currentLore = itemStack.getLore() ?? [];
let newLore = [];
let skillFound = false;

// Keep rarity and non-skill sections
let i = 0;
while (i < currentLore.length) {
if (currentLore[i] === "§8Skill") {
skillFound = true;
// Skip old skill section
while (i < currentLore.length && currentLore[i] !== "§s§k§l§e§n§d§r") {
i++;
}
if (i < currentLore.length) i++; // Skip end marker
// Add new skill
newLore.push(...newSkill);
} else {
newLore.push(currentLore[i]);
i++;
}
}

// If no skill section was found, add the new skill at the end
if (!skillFound && newSkill && newSkill.length > 0) {
newLore.push(...newSkill);
}

let newItem = itemStack.clone();
newItem.setLore(newLore);
setUpgradeCounter(newItem, "Skill Reroll", newCounter);
equipment.setEquipment(EquipmentSlot.Mainhand, newItem);

player.sendMessage("§aSkill rerolled successfully!");
}

// Passive Upgrade Function (Legacy - now with counter tracking)
function passiveUpgrade(equipment, player, itemStack) {
const currentRarity = getItemRarity(itemStack);
const upgradeCost = UPGRADE_COSTS.PASSIVE_UPGRADE[currentRarity];
const upgradeCounter = getUpgradeCounter(itemStack, "Passive Upgrade");
const adjustedCost = upgradeCost ? calculateCostWithCounter(upgradeCost.requiredItems, upgradeCounter): null;

if (!hasRequiredItems(player, adjustedCost)) {
const requirements = adjustedCost
.map(req => `${req.count}x ${req.item.replace("minecraft:", "").replace("rrs:", "")}`)
.join(", ");
player.sendMessage(`§cYou need: ${requirements}`);
return;
}

// Roll for success
if (Math.random() > upgradeCost.successChance) {
consumeRequiredItems(player, adjustedCost);
const newCounter = upgradeCounter + 1;
setUpgradeCounter(itemStack, "Passive Upgrade", newCounter);
player.sendMessage("§cUpgrade failed! Items were consumed.");
return;
}

consumeRequiredItems(player, adjustedCost);
const newCounter = upgradeCounter + 1;

const currentLore = itemStack.getLore() ?? [];
let newLore = [...currentLore];
let passiveFound = false;

// Find and upgrade passive section
for (let i = 0; i < newLore.length; i++) {
if (newLore[i] === "§8Passive ability") {
passiveFound = true;
i++; // Move to passive content
while (i < newLore.length && newLore[i] !== "§p§v§a§e§n§d§r") {
const passiveLine = newLore[i];
const valueMatch = passiveLine.match(/§w(\d+)§w/);
if (valueMatch) {
const currentValue = parseInt(valueMatch[1]);
const newValue = Math.floor(currentValue * upgradeCost.upgradeMultiplier);
newLore[i] = passiveLine.replace(/§w\d+§w/, `§w${newValue}§w`);
}
i++;
}
break;
}
}

if (!passiveFound) {
player.sendMessage("§cThis item has no passive to upgrade!");
return;
}

let newItem = itemStack.clone();
newItem.setLore(newLore);
setUpgradeCounter(newItem, "Passive Upgrade", newCounter);
equipment.setEquipment(EquipmentSlot.Mainhand, newItem);

player.sendMessage("§aPassive upgraded successfully!");
}

// Passive Reroll Function (Legacy - now with counter tracking)
function passiveReroll(equipment, player, itemStack) {
const currentRarity = getItemRarity(itemStack);
const rerollCost = UPGRADE_COSTS.PASSIVE_REROLL[currentRarity];
const rerollCounter = getUpgradeCounter(itemStack, "Passive Reroll");
const adjustedCost = rerollCost ? calculateCostWithCounter(rerollCost.requiredItems, rerollCounter): null;

if (!hasRequiredItems(player, adjustedCost)) {
const requirements = adjustedCost
.map(req => `${req.count}x ${req.item.replace("minecraft:", "").replace("rrs:", "")}`)
.join(", ");
player.sendMessage(`§cYou need: ${requirements}`);
return;
}

consumeRequiredItems(player, adjustedCost);
const newCounter = rerollCounter + 1;

// Get item type for rerolling
const Tags = parseTags(itemStack.typeId);
if (!Tags || !Tags.rarity) {
player.sendMessage("§cThis item cannot be rerolled!");
return;
}

// Generate new passive
const newPassive = randomPassiveAbility(currentRarity, Tags.data);
const currentLore = itemStack.getLore() ?? [];
let newLore = [];
let passiveFound = false;

// Keep rarity and non-passive sections
let i = 0;
while (i < currentLore.length) {
if (currentLore[i] === "§8Passive ability") {
passiveFound = true;
// Skip old passive section
while (i < currentLore.length && currentLore[i] !== "§p§v§a§e§n§d§r") {
i++;
}
if (i < currentLore.length) i++; // Skip end marker
// Add new passive
newLore.push(...newPassive);
} else {
newLore.push(currentLore[i]);
i++;
}
}

// If no passive section was found, add the new passive at the end
if (!passiveFound && newPassive && newPassive.length > 0) {
newLore.push(...newPassive);
}

let newItem = itemStack.clone();
newItem.setLore(newLore);
setUpgradeCounter(newItem, "Passive Reroll", newCounter);
equipment.setEquipment(EquipmentSlot.Mainhand, newItem);

player.sendMessage("§aPassive rerolled successfully!");
}

// Enhanced UI Menus with confirmation, bulk operations, and stat locking
function showEnhancedRarityUpgradeMenu(equipment, player, itemStack) {
const currentRarity = getItemRarity(itemStack);
const upgradeCost = UPGRADE_COSTS.RARITY_UPGRADE[currentRarity];
const upgradeCounter = getUpgradeCounter(itemStack, "Rarity Upgrade");
const adjustedCost = upgradeCost ? calculateCostWithCounter(upgradeCost.requiredItems, upgradeCounter): null;

const form = new ModalFormData();
form.title("§dRarity Upgrade Menu");

if (!upgradeCost || !upgradeCost.targetRarity) {
form.textField("OK", "", {
defaultValue: "§cThis item is already at maximum rarity!"
});
form.show(player);
return;
}

const upgradeTemplates = getUpgradeTemplates(player);
const requirements = adjustedCost.map(req => `${req.count}x ${req.item.replace("minecraft:", "").replace("rrs:", "")}`).join(", ");
const canAfford = hasRequiredItems(player, adjustedCost);

form.textField("Upgrade Details", "", {
defaultValue: `§7Current: §e${currentRarity}\n§7Target: §e${upgradeCost.targetRarity}\n§7Success Rate: §a${(upgradeCost.successChance * 100).toFixed(1)}%\n§7Upgrade Count: §c${upgradeCounter}\n§7Your RRS: §a${upgradeTemplates}\n§7Required: §e${requirements}\n§7Can Afford: ${canAfford ? '§aYes': '§cNo'}`
});

form.slider("§6Bulk Attempts", 1, Math.min(10, canAfford ? Math.floor(adjustedCost.reduce((max, req) => Math.min(max, countItemInInventory(player, req.item) / req.count), Infinity)): 1), {
step: 1,
defaultValue: 1
});
form.toggle("§aConfirm Upgrade", {
defaultValue: false
});

form.show(player).then((response) => {
if (response.canceled || !response.formValues[2]) {
player.sendMessage("§7Upgrade cancelled.");
return;
}

const attempts = response.formValues[1];
performBulkRarityUpgrade(equipment, player, itemStack, adjustedCost, upgradeCost, attempts, upgradeCounter);
});
}

function showEnhancedStatsRerollMenu(equipment, player, itemStack) {
const currentRarity = getItemRarity(itemStack);
const rerollCost = UPGRADE_COSTS.STATS_REROLL[currentRarity];
const rerollCounter = getUpgradeCounter(itemStack,
"Stats Reroll");
const adjustedCost = rerollCost ? calculateCostWithCounter(rerollCost.requiredItems,
rerollCounter): null;

const form = new ModalFormData();
form.title("§aStats Reroll Menu");

if (!rerollCost) {
form.textField("OK", "", {
defaultValue: "§cThis item cannot be rerolled!"
});
form.show(player);
return;
}

const upgradeTemplates = getUpgradeTemplates(player);
const requirements = adjustedCost.map(req => `${req.count}x ${req.item.replace("minecraft:", "").replace("rrs:", "")}`).join(", ");
const canAfford = hasRequiredItems(player, adjustedCost);
const currentStats = getStatsFromLore(itemStack);

let formText = `§7Current Rarity: §e${currentRarity}\n§7Reroll Count: §c${rerollCounter}\n§7Your RRS: §a${upgradeTemplates}\n§7Base Cost: §e${requirements}\n§7Can Afford: ${canAfford ? '§aYes': '§cNo'}\n\n§7Current Stats:`;
currentStats.forEach((stat, index) => {
formText += `\n§7${index + 1}. ${stat}`;
});

form.textField("Reroll Details", "", {
defaultValue: formText
});

// Add checkboxes for locking stats
currentStats.forEach((stat, index) => {
form.toggle(`§eLock Stat ${index + 1}: ${stat.replace(/§./g, '')}`, {
defaultValue: false
});
});

form.slider("§6Bulk Attempts", 1, Math.min(5, canAfford ? Math.floor(adjustedCost.reduce((max, req) => Math.min(max, countItemInInventory(player, req.item) / req.count), Infinity)): 1), {
step: 1,
defaultValue: 1
});
form.toggle("§aConfirm Reroll", {
defaultValue: false
});

form.show(player).then((response) => {
if (response.canceled || !response.formValues[response.formValues.length - 1]) {
player.sendMessage("§7Reroll cancelled.");
return;
}

const lockedStats = [];
for (let i = 1; i <= currentStats.length; i++) {
if (response.formValues[i]) {
lockedStats.push(i - 1);
}
}

const attempts = response.formValues[response.formValues.length - 2];
performBulkStatsReroll(equipment, player, itemStack, adjustedCost, attempts, rerollCounter, lockedStats);
});
}

function showEnhancedStatsUpgradeMenu(equipment, player, itemStack) {
const currentRarity = getItemRarity(itemStack);
const upgradeCost = UPGRADE_COSTS.STATS_UPGRADE[currentRarity];
const upgradeCounter = getUpgradeCounter(itemStack,
"Stats Upgrade");
const adjustedCost = upgradeCost ? calculateCostWithCounter(upgradeCost.requiredItems,
upgradeCounter): null;

const form = new ModalFormData();
form.title("§2Stats Upgrade Menu");

if (!upgradeCost) {
form.textField("OK", "", {
defaultValue: "§cThis item cannot be upgraded!"
});
form.show(player);
return;
}

const upgradeTemplates = getUpgradeTemplates(player);
const requirements = adjustedCost.map(req => `${req.count}x ${req.item.replace("minecraft:", "").replace("rrs:", "")}`).join(", ");
const canAfford = hasRequiredItems(player, adjustedCost);
const currentStats = getStatsFromLore(itemStack);

let formText = `§7Current Rarity: §e${currentRarity}\n§7Success Rate: §a${(upgradeCost.successChance * 100).toFixed(1)}%\n§7Upgrade Count: §c${upgradeCounter}\n§7Multiplier: §ax${upgradeCost.upgradeMultiplier}\n§7Your RRS: §a${upgradeTemplates}\n§7Required: §e${requirements}\n§7Can Afford: ${canAfford ? '§aYes': '§cNo'}\n\n§7Current Stats:`;
currentStats.forEach((stat, index) => {
formText += `\n§7${index + 1}. ${stat}`;
});

form.textField("Upgrade Details", "", {
defaultValue: formText
});
form.slider("§6Bulk Attempts", 1, Math.min(5, canAfford ? Math.floor(adjustedCost.reduce((max, req) => Math.min(max, countItemInInventory(player, req.item) / req.count), Infinity)): 1), {
step: 1,
defaultValue: 1
});
form.toggle("§aConfirm Upgrade", {
defaultValue: false
});

form.show(player).then((response) => {
if (response.canceled || !response.formValues[2]) {
player.sendMessage("§7Upgrade cancelled.");
return;
}

const attempts = response.formValues[1];
performBulkStatsUpgrade(equipment, player, itemStack, adjustedCost, upgradeCost, attempts, upgradeCounter);
});
}

function showEnhancedSkillUpgradeMenu(equipment, player, itemStack) {
const currentRarity = getItemRarity(itemStack);
const upgradeCost = UPGRADE_COSTS.SKILL_UPGRADE[currentRarity];
const upgradeCounter = getUpgradeCounter(itemStack,
"Skill Upgrade");
const adjustedCost = upgradeCost ? calculateCostWithCounter(upgradeCost.requiredItems,
upgradeCounter): null;

const form = new ModalFormData();
form.title("§9Skill Upgrade Menu");

if (!upgradeCost) {
form.textField("OK", "", {
defaultValue: "§cThis item cannot be upgraded!"
});
form.show(player);
return;
}

const upgradeTemplates = getUpgradeTemplates(player);
const requirements = adjustedCost.map(req => `${req.count}x ${req.item.replace("minecraft:", "").replace("rrs:", "")}`).join(", ");
const canAfford = hasRequiredItems(player, adjustedCost);

form.textField("Upgrade Details", "", {
defaultValue: `§7Current Rarity: §e${currentRarity}\n§7Success Rate: §a${(upgradeCost.successChance * 100).toFixed(1)}%\n§7Upgrade Count: §c${upgradeCounter}\n§7Multiplier: §ax${upgradeCost.upgradeMultiplier}\n§7Your RRS: §a${upgradeTemplates}\n§7Required: §e${requirements}\n§7Can Afford: ${canAfford ? '§aYes': '§cNo'}`
});

form.slider("§6Bulk Attempts", 1, Math.min(5, canAfford ? Math.floor(adjustedCost.reduce((max, req) => Math.min(max, countItemInInventory(player, req.item) / req.count), Infinity)): 1), {
step: 1,
defaultValue: 1
});
form.toggle("§aConfirm Upgrade", {
defaultValue: false
});

form.show(player).then((response) => {
if (response.canceled || !response.formValues[2]) {
player.sendMessage("§7Upgrade cancelled.");
return;
}

const attempts = response.formValues[1];
performBulkSkillUpgrade(equipment, player, itemStack, adjustedCost, upgradeCost, attempts, upgradeCounter);
});
}

function showEnhancedSkillRerollMenu(equipment, player, itemStack) {
const currentRarity = getItemRarity(itemStack);
const rerollCost = UPGRADE_COSTS.SKILL_REROLL[currentRarity];
const rerollCounter = getUpgradeCounter(itemStack,
"Skill Reroll");
const adjustedCost = rerollCost ? calculateCostWithCounter(rerollCost.requiredItems,
rerollCounter): null;

const form = new ModalFormData();
form.title("§bSkill Reroll Menu");

if (!rerollCost) {
form.textField("OK", "", {
defaultValue: "§cThis item cannot be rerolled!"
});
form.show(player);
return;
}

const upgradeTemplates = getUpgradeTemplates(player);
const requirements = adjustedCost.map(req => `${req.count}x ${req.item.replace("minecraft:", "").replace("rrs:", "")}`).join(", ");
const canAfford = hasRequiredItems(player, adjustedCost);

form.textField("Reroll Details", "", {
defaultValue: `§7Current Rarity: §e${currentRarity}\n§7Reroll Count: §c${rerollCounter}\n§7Your RRS: §a${upgradeTemplates}\n§7Required: §e${requirements}\n§7Can Afford: ${canAfford ? '§aYes': '§cNo'}`
});

form.slider("§6Bulk Attempts", 1, Math.min(5, canAfford ? Math.floor(adjustedCost.reduce((max, req) => Math.min(max, countItemInInventory(player, req.item) / req.count), Infinity)): 1), {
step: 1,
defaultValue: 1
});
form.toggle("§aConfirm Reroll", {
defaultValue: false
});

form.show(player).then((response) => {
if (response.canceled || !response.formValues[2]) {
player.sendMessage("§7Reroll cancelled.");
return;
}

const attempts = response.formValues[1];
performBulkSkillReroll(equipment, player, itemStack, adjustedCost, attempts, rerollCounter);
});
}

function showEnhancedPassiveUpgradeMenu(equipment, player, itemStack) {
const currentRarity = getItemRarity(itemStack);
const upgradeCost = UPGRADE_COSTS.PASSIVE_UPGRADE[currentRarity];
const upgradeCounter = getUpgradeCounter(itemStack,
"Passive Upgrade");
const adjustedCost = upgradeCost ? calculateCostWithCounter(upgradeCost.requiredItems,
upgradeCounter): null;

const form = new ModalFormData();
form.title("§6Passive Upgrade Menu");

if (!upgradeCost) {
form.textField("OK", "", {
defaultValue: "§cThis item cannot be upgraded!"
});
form.show(player);
return;
}

const upgradeTemplates = getUpgradeTemplates(player);
const requirements = adjustedCost.map(req => `${req.count}x ${req.item.replace("minecraft:", "").replace("rrs:", "")}`).join(", ");
const canAfford = hasRequiredItems(player, adjustedCost);

form.textField("Upgrade Details", "", {
defaultValue: `§7Current Rarity: §e${currentRarity}\n§7Success Rate: §a${(upgradeCost.successChance * 100).toFixed(1)}%\n§7Upgrade Count: §c${upgradeCounter}\n§7Multiplier: §ax${upgradeCost.upgradeMultiplier}\n§7Your RRS: §a${upgradeTemplates}\n§7Required: §e${requirements}\n§7Can Afford: ${canAfford ? '§aYes': '§cNo'}`
});

form.slider("§6Bulk Attempts", 1, Math.min(5, canAfford ? Math.floor(adjustedCost.reduce((max, req) => Math.min(max, countItemInInventory(player, req.item) / req.count), Infinity)): 1), {
step: 1,
defaultValue: 1
});
form.toggle("§aConfirm Upgrade", {
defaultValue: false
});

form.show(player).then((response) => {
if (response.canceled || !response.formValues[2]) {
player.sendMessage("§7Upgrade cancelled.");
return;
}

const attempts = response.formValues[1];
performBulkPassiveUpgrade(equipment, player, itemStack, adjustedCost, upgradeCost, attempts, upgradeCounter);
});
}

function showEnhancedPassiveRerollMenu(equipment, player, itemStack) {
const currentRarity = getItemRarity(itemStack);
const rerollCost = UPGRADE_COSTS.PASSIVE_REROLL[currentRarity];
const rerollCounter = getUpgradeCounter(itemStack,
"Passive Reroll");
const adjustedCost = rerollCost ? calculateCostWithCounter(rerollCost.requiredItems,
rerollCounter): null;

const form = new ModalFormData();
form.title("§ePassive Reroll Menu");

if (!rerollCost) {
form.textField("OK", "", {
defaultValue: "§cThis item cannot be rerolled!"
});
form.show(player);
return;
}

const upgradeTemplates = getUpgradeTemplates(player);
const requirements = adjustedCost.map(req => `${req.count}x ${req.item.replace("minecraft:", "").replace("rrs:", "")}`).join(", ");
const canAfford = hasRequiredItems(player, adjustedCost);

form.textField("Reroll Details", "", {
defaultValue: `§7Current Rarity: §e${currentRarity}\n§7Reroll Count: §c${rerollCounter}\n§7Your RRS: §a${upgradeTemplates}\n§7Required: §e${requirements}\n§7Can Afford: ${canAfford ? '§aYes': '§cNo'}`
});

form.slider("§6Bulk Attempts", 1, Math.min(5, canAfford ? Math.floor(adjustedCost.reduce((max, req) => Math.min(max, countItemInInventory(player, req.item) / req.count), Infinity)): 1), {
step: 1,
defaultValue: 1
});
form.toggle("§aConfirm Reroll", {
defaultValue: false
});

form.show(player).then((response) => {
if (response.canceled || !response.formValues[2]) {
player.sendMessage("§7Reroll cancelled.");
return;
}

const attempts = response.formValues[1];
performBulkPassiveReroll(equipment, player, itemStack, adjustedCost, attempts, rerollCounter);
});
}

//=====================================EVENT LISTENERS & HANDLERS===========================================

// Core game loops
system.runInterval(() => {
// Auto-load settings on first run
if (!settingsLoaded) {
system.runTimeout(() => {
autoLoadSettings();
settingsLoaded = true;
}, 60); // Delay to ensure world is fully loaded
}

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

let canMelee = ["sword",
"axe",
"pickaxe",
"trident",
"mace"];
if (canMelee.includes(parseTags(player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand)?.typeId).data)) {

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

const equipment = player.getComponent("minecraft:equippable");

const skill = parseLoreToSkills(equipment, EquipmentSlot.Mainhand);
if (skill && skill.name) {
switch (skill.name.slice(2)) {
case "Smash Leap":
skillSmashLeap(player, skill);
break;
case "Spin Strike":
skillSpinStrike(player, skill);
break;
case "Explosive Mining":
skillExplosiveMining(player, skill);
break;
case "Ray Miner":
skillRayMiner(player, skill);
break;
case "Excavator":
skillExcavator(player, skill);
break;
case "Flame Arc":
skillFlameArc(player, skill);
break;
case "Shadow Dash":
skillShadowDash(player, skill);
break;
case "Void Pierce":
skillVoidPierce(player, skill);
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
system.runTimeout(() => {
initializeScoreboards()}, 50);

//=====================================SKILLS FUNCTIONALITY===========================================
/**
* const ccd = testCooldown(player, skill.name);
if (!ccd || ccd.time > 0) return;
ccd.obj.setScore(player, skill.cooldown);
*/



function skillSmashLeap(player, skill) {
const ccd = testCooldown(player,
skill.name);
if (ccd.time > 0) {
player.runCommand(`title @s actionbar ${skill.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
return;
}
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
if (ccd.time > 0) {
player.runCommand(`title @s actionbar ${skill.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
return;
}
ccd.obj.setScore(player, skill.cooldown * 10);

const damage = calculateDamage(player, skill.value);

// Spin attack particles and sound
player.runCommand(`particle minecraft:critical_hit_emitter ~ ~1 ~`);
player.runCommand(`playsound entity.player.attack.sweep @s`);
player.runCommand(`playsound entity.player.attack.strong @s`);

// Hit and damage enemies
player.runCommand(`damage @e[r=3,rm=1,type=!player] ${damage}`);

// 360 spin visuals
for (let i = 0; i < 8; i++) {
const angle = (i / 8) * Math.PI * 2;
const x = Math.cos(angle) * 2;
const z = Math.sin(angle) * 2;
player.runCommand(`particle minecraft:critical_hit_emitter ~${x.toFixed(2)} ~1 ~${z.toFixed(2)}`);
}
}

function skillExplosiveMining(player, skill) {
const ccd = testCooldown(player, skill.name);
if (ccd.time > 0) {
player.runCommand(`title @s actionbar ${skill.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
return;
}
ccd.obj.setScore(player, skill.cooldown * 10);

const size = skill.value;
player.addEffect("resistance", 50, {
amplifier: 4
});
player.dimension.createExplosion(player.location, size * 2, {
breaksBlocks: true
});

// Explosion effects
player.runCommand(`particle minecraft:explosion_emitter ~ ~ ~`);
player.runCommand(`particle minecraft:large_explosion ~ ~ ~`);
player.runCommand(`playsound entity.generic.explode @s`);
}

function skillRayMiner(player, skill) {
const ccd = testCooldown(player, skill.name);
if (ccd.time > 0) {
player.runCommand(`title @s actionbar ${skill.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
return;
}
ccd.obj.setScore(player, skill.cooldown * 10);

const distance = skill.value;
let blocksDestroyed = 0;

player.runCommand(`playsound block.beacon.activate @s`);
player.runCommand(`particle minecraft:electric_spark_particle ~ ~1 ~`);

for (let i = 1; i <= distance; i++) {
player.runCommand(`execute at @s positioned ^^1^${i} run particle minecraft:electric_spark_particle ~ ~ ~`);
player.runCommand(`execute at @s positioned ^^1^${i} run particle minecraft:scrape ~ ~ ~`);

const result = player.runCommand(`execute at @s positioned^^1^${i} run testforblock ~ ~ ~ air`);
if (result.successCount === 0) {
player.runCommand(`execute at @s positioned^^1^${i} run setblock ~ ~ ~ air destroy`);
blocksDestroyed++;
}
}

if (blocksDestroyed > 0) {
const tooleq = player.getComponent("minecraft:equippable");
const tool = tooleq.getEquipment(EquipmentSlot.Mainhand);
if (tool?.typeId && tool.hasComponent("minecraft:durability")) {
const durability = tool.getComponent("minecraft:durability");
durability.damage += blocksDestroyed;
tooleq.setEquipment(EquipmentSlot.Mainhand, tool);
}
}
}

function skillExcavator(player, skill) {
const ccd = testCooldown(player, skill.name);
if (ccd.time > 0) {
player.runCommand(`title @s actionbar ${skill.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
return;
}
ccd.obj.setScore(player, skill.cooldown * 10);

const depth = skill.value;
const sandBlocks = ["sand",
"gravel",
"dirt",
"clay",
"coarse_dirt",
"podzol",
"mycelium",
"grass_block"];
let blocksDestroyed = 0;

player.runCommand(`particle minecraft:falling_dust_sand ~ ~1 ~`);
player.runCommand(`playsound block.gravel.break @s`);

for (let x = -1; x <= 1; x++) {
for (let z = -1; z <= 1; z++) {
for (let y = 0; y < depth; y++) {
for (const block of sandBlocks) {
const result = player.runCommand(`execute at @s positioned^${x} ^${z + 1} ^${y} run testforblock ~ ~ ~ ${block}`);
if (result.successCount > 0) {
player.runCommand(`execute at @s positioned^${x} ^${z + 1} ^${y} run setblock ~ ~ ~ air destroy`);
blocksDestroyed++;
break;
}
}
}
}
}

if (blocksDestroyed > 0) {
const tooleq = player.getComponent("minecraft:equippable");
const tool = tooleq.getEquipment(EquipmentSlot.Mainhand);
if (tool?.typeId && tool.hasComponent("minecraft:durability")) {
const durability = tool.getComponent("minecraft:durability");
durability.damage += blocksDestroyed;
tooleq.setEquipment(EquipmentSlot.Mainhand, tool);
}
}
}

function skillFlameArc(player, skill) {
const ccd = testCooldown(player, skill.name);
if (ccd.time > 0) {
player.runCommand(`title @s actionbar ${skill.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
return;
}
ccd.obj.setScore(player, skill.cooldown * 10);

const damage = calculateDamage(player, skill.value);
player.runCommand(`particle minecraft:flame ~ ~1 ~`);
player.runCommand(`playsound item.firecharge.use @s`);

const arcPositions = [
"^^^2",
"^^^3",
"^^^4",
"^^^5",
"^1^^2",
"^1^^3",
"^1^^4",
"^-1^^2",
"^-1^^3",
"^-1^^4"
];

for (const pos of arcPositions) {
player.runCommand(`execute at @s positioned${pos} run fill ~ ~ ~ ~ ~ ~ fire replace air`);
player.runCommand(`execute at @s positioned${pos} run particle minecraft:mobflame_emitter ~ ~ ~`);
player.runCommand(`execute at @s positioned${pos} run damage @e[r=1,type=!player] ${damage} fire`);
}
}

function skillShadowDash(player, skill) {
const ccd = testCooldown(player, skill.name);
if (ccd.time > 0) {
player.runCommand(`title @s actionbar ${skill.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
return;
}
ccd.obj.setScore(player, skill.cooldown * 10);

let dashDistance = skill.value;
const groundCheck = player.runCommand(`execute at @s positioned~ ~-11 ~ run testforblock ~ ~ ~ air`);
if (groundCheck.successCount > 0) dashDistance = Math.floor(dashDistance / 2);

player.runCommand(`particle minecraft:portal ~ ~1 ~`);
player.runCommand(`playsound entity.enderman.teleport @s`);

for (let i = 1; i <= dashDistance; i++) {
player.runCommand(`execute at @s positioned^^^${i} run particle minecraft:portal ~ ~ ~`);
}

player.runCommand(`tp @s ^^^${dashDistance}`);
}

function skillVoidPierce(player, skill) {
const ccd = testCooldown(player, skill.name);
if (ccd.time > 0) {
player.runCommand(`title @s actionbar ${skill.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
return;
}
ccd.obj.setScore(player, skill.cooldown * 10);

const damage = calculateDamage(player, skill.value);
player.runCommand(`particle minecraft:reverse_portal ~ ~1.5 ~`);
player.runCommand(`playsound entity.wither.shoot @s`);

for (let i = 1; i <= 9; i++) {
player.runCommand(`execute at @s positioned^^1^${i} run particle minecraft:endrod ~ ~ ~`);
player.runCommand(`execute at @s positioned^^1^${i} run damage @e[r=1,type=!player] ${damage} magic`);
player.runCommand(`execute at @s positioned^^1^${i} if entity @e[r=1,type=!player] run playsound entity.arrow.hit @s`);
}

player.runCommand(`execute at @s positioned^^1^9 run particle minecraft:dragon_breath_fire ~ ~ ~`);
}


//=====================================PASSIVES FUNCTIONALITY===========================================

/*function hawkEye(player) {
    const range = 6 + (getScoreboardValue("hawkeyerange", player) ?? 0);
    const hitData = getEntitiesFromViewDirection();
    const entity = hitData[0].entity;
    const distance = hitData[0].distance;

    if (!entity || !player) return;

    // Health
    const healthComp = entity.getComponent("minecraft:health");
    const currentHealth = healthComp?.currentValue ?? 0;
    const maxHealth = healthComp?.effectiveValue ?? 0;

    // Get nameTag or generate from typeId
    let name = entity.nameTag;
    if (!name || name.trim() === "") {
        // Parse typeId into readable name
        let rawType = entity.typeId.replace("minecraft:", "");
        name = rawType
            .split("_")
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");
    }

    let healthPercent = Math.floor((currentHealth / maxHealth) * 33);
    const healthBar = HEALTH_BAR_FONT.charAt(healthPercent);

}*/

// Bulk Operation Functions with Counter Tracking and Stat Locking
function performBulkRarityUpgrade(equipment, player, itemStack, adjustedCost, upgradeCost, attempts, startingCounter) {
let successCount = 0;
let failCount = 0;
let currentCounter = startingCounter;

for (let i = 0; i < attempts; i++) {
// Recalculate cost based on current counter
const currentCost = calculateCostWithCounter(upgradeCost.requiredItems, currentCounter);

if (!hasRequiredItems(player, currentCost)) {
player.sendMessage(`§cInsufficient materials for attempt ${i + 1}/${attempts}. Stopping bulk upgrade.`);
break;
}

consumeRequiredItems(player, currentCost);
currentCounter++;

// Roll for success
if (Math.random() <= upgradeCost.successChance) {
successCount++;
// Apply upgrade
const newRarity = RARITY[upgradeCost.targetRarity];
const currentLore = itemStack.getLore() ?? [];
const newLore = [newRarity.dName,
...currentLore.slice(1)];

let newItem = itemStack.clone();
newItem.setLore(newLore);
setUpgradeCounter(newItem, "Rarity Upgrade", currentCounter);
equipment.setEquipment(EquipmentSlot.Mainhand, newItem);

player.sendMessage(`§aRarity upgrade successful! (${successCount}/${i + 1})`);
break; // Only one rarity upgrade needed
} else {
failCount++;
}

// Update counter in lore for failed attempts too
setUpgradeCounter(itemStack, "Rarity Upgrade", currentCounter);
}

player.sendMessage(`§6Bulk Rarity Upgrade Complete: §a${successCount} success, §c${failCount} failed`);
}

function performBulkStatsReroll(equipment, player, itemStack, adjustedCost, attempts, startingCounter, lockedStats) {
let successCount = 0;
let currentCounter = startingCounter;
const lockCostMultiplier = 1.5; // Increase cost for each locked stat

for (let i = 0; i < attempts; i++) {
// Calculate cost with lock penalty
let currentCost = calculateCostWithCounter(adjustedCost, currentCounter);
if (lockedStats.length > 0) {
currentCost = currentCost.map(item => ({
...item,
count: Math.ceil(item.count * Math.pow(lockCostMultiplier, lockedStats.length))
}));
}

if (!hasRequiredItems(player, currentCost)) {
player.sendMessage(`§cInsufficient materials for attempt ${i + 1}/${attempts}. Stopping bulk reroll.`);
break;
}

consumeRequiredItems(player, currentCost);
currentCounter++;

// Perform stats reroll with locking
const currentRarity = getItemRarity(itemStack);
const Tags = parseTags(itemStack.typeId);

if (Tags && Tags.rarity) {
const currentLore = itemStack.getLore() ?? [];
const currentStats = getStatsFromLore(itemStack);

// Generate new stats
const newStats = randomStats(currentRarity, Tags.data);

// Apply locked stats
for (const lockedIndex of lockedStats) {
if (lockedIndex < currentStats.length && lockedIndex < newStats.length) {
newStats[lockedIndex] = currentStats[lockedIndex];
}
}

// Update lore with new stats
let newLore = [];
let statsFound = false;
let i = 0;
while (i < currentLore.length) {
if (currentLore[i] === "§8Attributes") {
statsFound = true;
// Skip old stats section
while (i < currentLore.length && currentLore[i] !== "§a§t§b§e§n§d§r") {
i++;
}
if (i < currentLore.length) i++; // Skip end marker
// Add new stats
newLore.push(...newStats);
} else {
newLore.push(currentLore[i]);
i++;
}
}

// If no stats section was found, add the new stats at the end
if (!statsFound && newStats && newStats.length > 0) {
newLore.push(...newStats);
}

let newItem = itemStack.clone();
newItem.setLore(newLore);
setUpgradeCounter(newItem, "Stats Reroll", currentCounter);
equipment.setEquipment(EquipmentSlot.Mainhand, newItem);

successCount++;
}
}

const lockInfo = lockedStats.length > 0 ? ` (${lockedStats.length} stats locked)`: "";
player.sendMessage(`§6Bulk Stats Reroll Complete: §a${successCount} rerolls${lockInfo}`);
}

function performBulkStatsUpgrade(equipment, player, itemStack, adjustedCost, upgradeCost, attempts, startingCounter) {
let successCount = 0;
let failCount = 0;
let currentCounter = startingCounter;

for (let i = 0; i < attempts; i++) {
// Recalculate cost based on current counter
const currentCost = calculateCostWithCounter(upgradeCost.requiredItems, currentCounter);

if (!hasRequiredItems(player, currentCost)) {
player.sendMessage(`§cInsufficient materials for attempt ${i + 1}/${attempts}. Stopping bulk upgrade.`);
break;
}

consumeRequiredItems(player, currentCost);
currentCounter++;

// Roll for success
if (Math.random() <= upgradeCost.successChance) {
successCount++;

// Enhance existing stats
const currentLore = itemStack.getLore() ?? [];
let newLore = [...currentLore];
let statsFound = false;

// Find and upgrade stats section
for (let j = 0; j < newLore.length; j++) {
if (newLore[j] === "§8Attributes") {
statsFound = true;
j++; // Move to first stat
while (j < newLore.length && newLore[j] !== "§a§t§b§e§n§d§r") {
const statLine = newLore[j];
const valueMatch = statLine.match(/§w([+-]?\d+)§w/);
if (valueMatch) {
const currentValue = parseInt(valueMatch[1]);
const newValue = Math.floor(currentValue * upgradeCost.upgradeMultiplier);
const sign = newValue >= 0 ? '+': '';
newLore[j] = statLine.replace(/§w[+-]?\d+§w/, `§w${sign}${Math.abs(newValue)}§w`);
}
j++;
}
break;
}
}

if (statsFound) {
let newItem = itemStack.clone();
newItem.setLore(newLore);
setUpgradeCounter(newItem, "Stats Upgrade", currentCounter);
equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
}
} else {
failCount++;
}

// Update counter in lore for failed attempts too
setUpgradeCounter(itemStack, "Stats Upgrade", currentCounter);
}

player.sendMessage(`§6Bulk Stats Upgrade Complete: §a${successCount} success, §c${failCount} failed`);
}

function performBulkSkillUpgrade(equipment, player, itemStack, adjustedCost, upgradeCost, attempts, startingCounter) {
let successCount = 0;
let failCount = 0;
let currentCounter = startingCounter;

for (let i = 0; i < attempts; i++) {
const currentCost = calculateCostWithCounter(upgradeCost.requiredItems, currentCounter);

if (!hasRequiredItems(player, currentCost)) {
player.sendMessage(`§cInsufficient materials for attempt ${i + 1}/${attempts}. Stopping bulk upgrade.`);
break;
}

consumeRequiredItems(player, currentCost);
currentCounter++;

if (Math.random() <= upgradeCost.successChance) {
successCount++;
// Call original skill upgrade logic here
skillUpgrade(equipment, player, itemStack);
} else {
failCount++;
}

setUpgradeCounter(itemStack, "Skill Upgrade", currentCounter);
}

player.sendMessage(`§6Bulk Skill Upgrade Complete: §a${successCount} success, §c${failCount} failed`);
}

function performBulkSkillReroll(equipment, player, itemStack, adjustedCost, attempts, startingCounter) {
let successCount = 0;
let currentCounter = startingCounter;

for (let i = 0; i < attempts; i++) {
const currentCost = calculateCostWithCounter(adjustedCost, currentCounter);

if (!hasRequiredItems(player, currentCost)) {
player.sendMessage(`§cInsufficient materials for attempt ${i + 1}/${attempts}. Stopping bulk reroll.`);
break;
}

consumeRequiredItems(player, currentCost);
currentCounter++;

// Call original skill reroll logic here
skillReroll(equipment, player, itemStack);
successCount++;

setUpgradeCounter(itemStack, "Skill Reroll", currentCounter);
}

player.sendMessage(`§6Bulk Skill Reroll Complete: §a${successCount} rerolls`);
}

function performBulkPassiveUpgrade(equipment, player, itemStack, adjustedCost, upgradeCost, attempts, startingCounter) {
let successCount = 0;
let failCount = 0;
let currentCounter = startingCounter;

for (let i = 0; i < attempts; i++) {
const currentCost = calculateCostWithCounter(upgradeCost.requiredItems, currentCounter);

if (!hasRequiredItems(player, currentCost)) {
player.sendMessage(`§cInsufficient materials for attempt ${i + 1}/${attempts}. Stopping bulk upgrade.`);
break;
}

consumeRequiredItems(player, currentCost);
currentCounter++;

if (Math.random() <= upgradeCost.successChance) {
successCount++;
// Call original passive upgrade logic here
passiveUpgrade(equipment, player, itemStack);
} else {
failCount++;
}

setUpgradeCounter(itemStack, "Passive Upgrade", currentCounter);
}

player.sendMessage(`§6Bulk Passive Upgrade Complete: §a${successCount} success, §c${failCount} failed`);
}

function performBulkPassiveReroll(equipment, player, itemStack, adjustedCost, attempts, startingCounter) {
let successCount = 0;
let currentCounter = startingCounter;

for (let i = 0; i < attempts; i++) {
const currentCost = calculateCostWithCounter(adjustedCost, currentCounter);

if (!hasRequiredItems(player, currentCost)) {
player.sendMessage(`§cInsufficient materials for attempt ${i + 1}/${attempts}. Stopping bulk reroll.`);
break;
}

consumeRequiredItems(player, currentCost);
currentCounter++;

// Call original passive reroll logic here
passiveReroll(equipment, player, itemStack);
successCount++;

setUpgradeCounter(itemStack, "Passive Reroll", currentCounter);
}

player.sendMessage(`§6Bulk Passive Reroll Complete: §a${successCount} rerolls`);
}

// Settings Save/Load System
function getAdminPlayer() {
const players = world.getAllPlayers();
// Try to find admin tagged player first
let adminPlayer = players.find(p => p.hasTag("admin"));

// If no admin, try to find host (first player or server operator)
if (!adminPlayer && players.length > 0) {
adminPlayer = players[0]; // Use first player as fallback
}

return adminPlayer;
}

function saveSettingsToScoreboard(player) {
try {
// Create or get scoreboards for settings
let boostScoreboard = world.scoreboard.getObjective("rrs_boost_coef");
if (!boostScoreboard) {
boostScoreboard = world.scoreboard.addObjective("rrs_boost_coef", "RRS Boost Coefficient");
}

let rarityScoreboard = world.scoreboard.getObjective("rrs_min_rarity");
if (!rarityScoreboard) {
rarityScoreboard = world.scoreboard.addObjective("rrs_min_rarity", "RRS Minimum Rarity");
}

// Save settings to scoreboards
boostScoreboard.setScore(player, BOOST_COEF);
rarityScoreboard.setScore(player, RR_BASE.id);

player.sendMessage("§aSettings saved to scoreboard!");
return true;
} catch (error) {
player.sendMessage("§cFailed to save settings to scoreboard: " + error);
console.error("Settings save error:", error);
return false;
}
}

function loadSettingsFromScoreboard(player) {
try {
const boostScoreboard = world.scoreboard.getObjective("rrs_boost_coef");
const rarityScoreboard = world.scoreboard.getObjective("rrs_min_rarity");

if (boostScoreboard && rarityScoreboard) {
const boostScore = boostScoreboard.getScore(player);
const rarityScore = rarityScoreboard.getScore(player);

if (boostScore !== undefined && rarityScore !== undefined) {
BOOST_COEF = boostScore;
RR_BASE = Object.values(RARITY).find(r => r.id === rarityScore) || RARITY.COMMON;

player.sendMessage(`§aSettings loaded from scoreboard!\n§fBoost Coef: §e${BOOST_COEF}\n§fMin Rarity: §e${RR_BASE.sid}`);
return true;
}
}

player.sendMessage("§cNo saved settings found in scoreboard!");
return false;
} catch (error) {
player.sendMessage("§cFailed to load settings from scoreboard: " + error);
console.error("Settings load error:", error);
return false;
}
}

function saveSettingsToTags(player) {
try {
// Remove old settings tags
const oldTags = player.getTags().filter(tag => tag.startsWith("rrs_setting_"));
oldTags.forEach(tag => player.removeTag(tag));

// Add new settings tags
player.addTag(`rrs_setting_boost_${BOOST_COEF}`);
player.addTag(`rrs_setting_rarity_${RR_BASE.id}`);

player.sendMessage("§aSettings saved to player tags!");
return true;
} catch (error) {
player.sendMessage("§cFailed to save settings to tags: " + error);
console.error("Settings save error:", error);
return false;
}
}

function loadSettingsFromTags(player) {
try {
const tags = player.getTags();
const boostTag = tags.find(tag => tag.startsWith("rrs_setting_boost_"));
const rarityTag = tags.find(tag => tag.startsWith("rrs_setting_rarity_"));

if (boostTag && rarityTag) {
const boostValue = parseInt(boostTag.replace("rrs_setting_boost_", ""));
const rarityValue = parseInt(rarityTag.replace("rrs_setting_rarity_", ""));

if (!isNaN(boostValue) && !isNaN(rarityValue)) {
BOOST_COEF = boostValue;
RR_BASE = Object.values(RARITY).find(r => r.id === rarityValue) || RARITY.COMMON;

player.sendMessage(`§aSettings loaded from tags!\n§fBoost Coef: §e${BOOST_COEF}\n§fMin Rarity: §e${RR_BASE.sid}`);
return true;
}
}

player.sendMessage("§cNo saved settings found in player tags!");
return false;
} catch (error) {
player.sendMessage("§cFailed to load settings from tags: " + error);
console.error("Settings load error:", error);
return false;
}
}

function autoLoadSettings() {
try {
const adminPlayer = getAdminPlayer();
if (!adminPlayer) return;

// Try to load from scoreboard first, then tags
if (!loadSettingsFromScoreboard(adminPlayer)) {
loadSettingsFromTags(adminPlayer);
}
} catch (error) {
console.error("Auto load settings error:", error);
}
}

function showEnhancedSettingsForm(player) {
if (!player.hasTag("admin")) {
player.sendMessage("§cYou must be an admin to access settings!");
if (!player.hasTag("pc_mode")) {
uiManager.closeAllForms(player);
msifMenu(player);
}
return;
}

const form = new ActionFormData();
form.title("§6Enhanced Settings Menu");

// Ensure RR_BASE is initialized before accessing its properties
if (!RR_BASE || !RR_BASE.sid) {
RR_BASE = RARITY.COMMON;
}

form.body(`§7Current Settings:\n§fBoost Coefficient: §e${BOOST_COEF}\n§fMinimum Rarity: §e${RR_BASE.sid}\n\n§7Choose an option:`);

form.button("§aModify Settings", "textures/ui/gear");
form.button("§2Save to Scoreboard", "textures/ui/book_writable");
form.button("§9Load from Scoreboard", "textures/ui/book_portfolio");
form.button("§6Save to Player Tags", "textures/ui/tags");
form.button("§eLoad from Player Tags", "textures/ui/magnifying_glass");
form.button("§cBack to Menu", "textures/ui/cancel");

form.show(player).then((response) => {
if (response.canceled || response.selection === undefined) return;

switch (response.selection) {
case 0:
showSettingsForm(player);
break;
case 1:
saveSettingsToScoreboard(player);
break;
case 2:
loadSettingsFromScoreboard(player);
break;
case 3:
saveSettingsToTags(player);
break;
case 4:
loadSettingsFromTags(player);
break;
case 5:
if (!player.hasTag("pc_mode")) {
uiManager.closeAllForms(player);
msifMenu(player);
}
return;
}

// Return to enhanced settings menu after action
system.runTimeout(() => showEnhancedSettingsForm(player), 40);
});
}