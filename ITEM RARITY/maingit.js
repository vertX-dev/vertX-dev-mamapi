import {
    world,
    system,
    EquipmentSlot,
    GameMode,
    ItemStack,
    MoonPhase
} from "@minecraft/server";
import {
    ActionFormData,
    ModalFormData,
    FormCancelationReason,
    uiManager
} from "@minecraft/server-ui";
import { 
    allWeapons, 
    allArmor, 
    meleeWeapons,
    rangedWeapons,
    tools,
    allItems,
    RARITY,
    blackList,
    TagMapping
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

let BOOST_COEF = 10;
let RR_BASE = RARITY.COMMON; // default common

const HEALTH_BAR_FONT = "";//32 values
const RARITY_UPGRADES_GLYPS = "";//6 values

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
    }
];

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
    },
    {
        name: "frosttouch",
        displayName: "Frost Touch"
    },
    {
        name: "lightningstrike",
        displayName: "lightning Strike"
    },
    {
        name: "enderarrow",
        displayName: "Ender Arrow"
    },
    {
        name: "vampiric",
        displayName: "Vampiric"
    },
    {
        name: "berserker",
        displayName: "Berserker"
    },
    {
        name: "poisonblade",
        displayName: "Poison Blade"
    },
    {
        name: "explosivearrows",
        displayName: "Explosive Arrows"
    },
    {
        name: "dragonarmor",
        displayName: "Dragon Armor"
    }
    
];


//=====================================UTILITY FUNCTIONS===========================================

function getScoreboardValue(scoreboard, player) {
    const scoreboardObj = world.scoreboard.getObjective(scoreboard);
    const scoreboardValue = scoreboardObj.getScore(player);
    return scoreboardValue;
}

function getUpgradeRarityIcon(rarity) {
    const raritya = Object.values(RARITY).find(r => r.sid === rarity).id;
    return RARITY_UPGRADES_GLYPS.charAt(raritya - 1);
}

function getUpgradeTemplates(player) {
    return `${countItemInInventory(player, "rrs:common_upgrade")}   ${countItemInInventory(player, "rrs:uncommon_upgrade")}   ${countItemInInventory(player, "rrs:rare_upgrade")}   ${countItemInInventory(player, "rrs:epic_upgrade")}   ${countItemInInventory(player, "rrs:legendary_upgrade")}   ${countItemInInventory(player, "rrs:mythic_upgrade")}`;
}

function countItemInInventory(player, itemId) {
    const inventory = player.getComponent("minecraft:inventory")?.container;
    if (!inventory) return 0;

    let total = 0;

    for (let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);
        if (item && item.typeId === itemId) {
            total += item.amount;
        }
    }

    return total;
}

function parseTags(itemId = "minecraft:apple") {
    // Check blacklist first
    for (const blItem of blackList) {
        if (itemId == blItem) {
            return {
                rarity: false
            };
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


function statsMainMenu(player) {
    const menu = new ActionFormData()
        .title('SELECT OPTION')
        .button('STATS', 'textures/ui/gamerpic')
        .button('FORGE', 'textures/ui/smithing_icon');

    menu.show(player).then((r) => {
        if (!r.canceled) {
            switch (r.selection) {
                case 0:
                    showStatsForm(player, true);
                    break;
                case 1:
                    upgradeMenu(player);
                    break;
            }
        }
    });
}

function showStatsForm(player) {
    const stats = {
        damage: getScoreboardValue("damage", player),
        damagepercent: getScoreboardValue("damagepercent", player),
        defense: getScoreboardValue("defense", player),
        health: getScoreboardValue("health", player) + 20,
        speed: getScoreboardValue("speed", player),
        regeneration: getScoreboardValue("regeneration", player),
        critchance: getScoreboardValue("critchance", player) + 5,
        critdamage: getScoreboardValue("critdamage", player) + 50,
        lifesteal: getScoreboardValue("lifesteal", player),
        healthpercent: getScoreboardValue("healthpercent", player)
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

    form.show(player);
}


function upgradeMenu(player) {
    // Check if there's an anvil nearby
    const playerLocation = player.location;
    const dimension = player.dimension;
    
    // Search for anvil in a 3x3x3 area around the player
    let anvilFound = false;
    for (let x = -2; x <= 2; x++) {
        for (let y = -2; y <= 2; y++) {
            for (let z = -2; z <= 2; z++) {
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
        return;
    }
    
    // Check if player has an item in main hand
    const equipment = player.getComponent("minecraft:equippable");
    const itemStack = equipment.getEquipment(EquipmentSlot.Mainhand);
    
    if (!itemStack) {
        player.sendMessage("§cYou need to hold an item to upgrade it!");
        return;
    }
    
    // Display upgrade menu
    displayUpgradeOptions(equipment, player, itemStack);
}

function toTitleCase(str) {
    return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

// Helper function to display upgrade options
function displayUpgradeOptions(equipment, player, itemStack) {
    const form = new ActionFormData();
    form.title("§6Item Upgrade Menu");
    form.body(`§7Item: §e${itemStack.nameTag ?? toTitleCase(itemStack.typeId.split(":").pop().replace(/_/g, " "))}\n§7Select an upgrade option:`);
    
    form.button(`§a[Rarity Upgrade]`, "textures/ui/smithing_icon");
    form.button("§cCancel", "textures/ui/cancel");
    
    form.show(player).then((response) => {
        if (response.canceled) return;
        
        switch (response.selection) {
            case 0:
                rarityUpgrade(equipment, player, itemStack);
                break;
            case 1:
                player.sendMessage("§7Upgrade canceled.");
                break;
        }
    });
}

function rarityUpgrade(equipment, player, itemStack) {
    const upgradesTemplates = getUpgradeTemplates(player);

    let rarity = [
        "§7Common ",
        "§aUncommon ",
        "§1Rare ",
        "§5Epic ",
        "§6Legendary ",
        "§cMythic "
    ];
    
    const form = new ModalFormData()
        .title("§aRARITY UPGRADE")
        .label(`${upgradesTemplates}`) // Double-check if this displays correctly.
        .dropdown("Rarity upgrades", rarity)
        .submitButton("UPGRADE");

    form.show(player).then((r) => {
        if (r.canceled) return;
        
        const raritySelectedIndex = r.formValues[1]; // dropdown selection index
        const item = player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
        
        const rarityMap = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"];
        console.log(raritySelectedIndex);
        
        const upgradeCommands = [
            "rrs:common_upgrade",
            "rrs:uncommon_upgrade",
            "rrs:rare_upgrade",
            "rrs:epic_upgrade",
            "rrs:legendary_upgrade",
            "rrs:mythic_upgrade"
        ];

        // Ensure item is valid and player has enough upgrade items in inventory
        if (item && item.typeId && countItemInInventory(player, upgradeCommands[raritySelectedIndex]) >= 1) {
            player.runCommand(`clear @s ${upgradeCommands[raritySelectedIndex]} 0 1`);
            rarityItemTest(item, player, rarityMap[raritySelectedIndex], true);
            
            // Inform the player of the successful upgrade
            player.sendMessage(`§aSuccess! Your item has been upgraded to ${rarityMap[raritySelectedIndex]}!`);
        } else {
            // Inform the player they lack the required item
            player.sendMessage("§cError: You do not have the required upgrade item in your inventory.");
        }
    });
}

// Chat commands
world.beforeEvents.chatSend.subscribe((eventData) => {
    const { sender, message } = eventData;

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
            case '.help':
                system.runTimeout(() => sender.sendMessage("§7Available commands: §a .stats, .menu, .upgrade, .displayCooldownPassive"), 0);
                break;
            case '.upgrade':
                system.runTimeout(() => upgradeMenu(sender), 60);
                break;
            case '.displayCooldownPassive':
                if (!args[1] || args[1] == 'true') system.runTimeout(() => sender.addTag("displayCooldownPassive"), 2);
                if (args[1] == 'false') system.runTimeout(() => sender.removeTag("displayCooldownPassive"), 2);
                break;
            default:
                system.runTimeout(() => sender.sendMessage('§cUnknown command. Use .help'), 0);
        }
    }
});
//TODO: fix infinite loops
world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const block = ev.block;
    const player = ev.player;
    const itemStack = ev.itemStack;
    if (!itemStack || !block || !player || block.typeId != "rrs:heavy_anvil") return;
    
    // Use system.runTimeout to add tag
    system.runTimeout(() => {
        player.addTag("reforge_ui");
    }, 1);
});

// System interval to handle UI for tagged players
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (player.hasTag("reforge_ui")) {
            player.removeTag("reforge_ui");
            blockUiAnvil(player);
        }
    }
}, 10);

function blockUiAnvil(player) {
    const itemStack = player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
    if (!itemStack) {
        player.sendMessage("§cYou must hold an item to reforge.");
        return;
    }

    const loreArray = itemStack.getLore();
    if (!loreArray || loreArray.length === 0) {
        player.sendMessage("§cThis item cannot be reforged.");
        return;
    }

    const rarity = Object.values(RARITY).find(r => r.dName === loreArray[0]);
    if (!rarity) {
        player.sendMessage("§cUnknown rarity. Cannot reforge this item.");
        return;
    }

    const lore = loreArray.join("\n");
    const upgradeResource = countItemInInventory(player, "minecraft:amethyst_shard");
    const resourceMap = [1, 1, 3, 5, 8, 12];
    const resourceAmount = resourceMap[rarity.id];
    const amountStatusColor = upgradeResource < resourceAmount ? "§c" : "§a";

    const reforgeMenu = new ActionFormData()
        .title("§c§b§t§6§lREFORGE MENU")
        .body(`§7Cost: ${amountStatusColor}${resourceAmount} (You have: ${upgradeResource})\n\n§f${lore}`)
        .button(`§a§lUPGRADE§r ${amountStatusColor}${resourceAmount}`)
        .button("§c§lCLOSE", "textures/ui/cancel");

    reforgeMenu.show(player).then((r) => {
        if (r.canceled) return;

        switch (r.selection) {
            case 0:
                if (upgradeResource >= resourceAmount) {
                    player.runCommand(`clear @s minecraft:amethyst_shard 0 ${resourceAmount}`);
                    rarityItemTest(itemStack, player, rarity.sid, false);
                    blockUiAnvil(player); // refresh the UI
                } else {
                    system.runTimeout(() => {
                        player.sendMessage("§cNot enough amethyst shards to reforge.");
                    }, 5);
                }
                break;
            case 1:
                uiManager.closeAllForms(player);
                break;
        }
    });
}
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

function rarityItemTest(itemStack, player, rarityUp = "None", upGuarant = false) {
    if (!itemStack || !player) return;

    const lore = itemStack.getLore() ?? [];

    if (lore.length === 0 || rarityUp != "None") {
        const Tags = parseTags(itemStack.typeId);

        if (Tags && Tags.rarity) {
            if (rarityUp === "None") {
                // New item gets random rarity
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
            } else {
                // Upgrade to specific rarity
                let rarity = Object.values(RARITY).find(r => r.sid === rarityUp);
                if (!upGuarant) {
                    const id = Math.min(6, Math.max(1, Math.floor((Math.random() * 6) + rarity.id / 2)));
                    rarity = Object.values(RARITY).find(r => r.id == id);
                }
                
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

    if (meleeWeapons.includes(parseTags(player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand)?.typeId).data)) {

        mob.applyDamage(damage);

        healEntity(player, (getScoreboardValue("lifesteal", player) / 100) * damage);

        const passive = parseLoreToPassive(player.getComponent("minecraft:equippable"), EquipmentSlot.Mainhand);
        if (passive && passive.name) {
            switch (passive.name.slice(2)) {
                case 'Frost Touch':
                    passiveFrostTouch(player, passive, mob);
                    break;
                case 'Lightning Strike':
                    passiveLightningStrike(player, passive, mob);
                    break;
                case 'Vampiric':
                    passiveVampiric(player, passive, damage);
                    break;
                case 'Poison Blade':
                    passivePoisonBlade(player, passive, mob);
                    break;
            }
        }
    }
});

world.afterEvents.projectileHitEntity.subscribe((ev) => {
    if (!ev.source || ev.source.typeId !== "minecraft:player") return;

    const player = ev.source;
    const entityHit = ev.getEntityHit();

    if (!entityHit || !entityHit.entity) return;

    const mob = entityHit.entity;

    let damage = calculateDamage(player, 6);
    if (mob.typeId !== "minecraft:enderman") {
        mob.applyDamage(damage);

        healEntity(player, ((getScoreboardValue("lifesteal", player) / 100) * damage) / 2);
    }
    
    const passive = parseLoreToPassive(player.getComponent("minecraft:equippable"), EquipmentSlot.Mainhand);
    if (passive && passive.name) {
        switch (passive.name.slice(2)) {
            case 'Ender Arrow':
                passiveEnderArrow(player, passive, mob, damage);
                break;
            case 'Lightning Strike':
                passiveLightningStrike(player, passive, mob);
                break;
            case 'Explosive Arrows':
                passiveExplosiveArrows(player, passive, ev);
                break;
        }
    }
});

world.afterEvents.projectileHitBlock.subscribe((ev) => {
    if (!ev.source || ev.source.typeId !== "minecraft:player") return;
    const player = ev.source;
    
    
    
    const passive = parseLoreToPassive(player.getComponent("minecraft:equippable"), EquipmentSlot.Mainhand);
    if (passive && passive.name) {
        switch (passive.name.slice(2)) {
            case 'Explosive Arrows':
                passiveExplosiveArrows(player, passive, ev);
                break;
        }
    }
});
// Skill activation event handler
world.afterEvents.itemUse.subscribe((ev) => {
    const player = ev.source;
    if (!player.hasTag("safeSkills") && player.isSneaking) return;
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
system.runTimeout(() => {initializeScoreboards()}, 50);


//=====================================SKILLS FUNCTIONALITY===========================================
/**
 * const ccd = testCooldown(player, skill.name);
    if (!ccd || ccd.time > 0) return;
    ccd.obj.setScore(player, skill.cooldown);
 */



function skillSmashLeap(player, skill) {
    const ccd = testCooldown(player, skill.name);
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
    const sandBlocks = ["sand", "gravel", "dirt", "clay", "coarse_dirt", "podzol", "mycelium", "grass_block"];
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
        "^^^2", "^^^3", "^^^4", "^^^5",
        "^1^^2", "^1^^3", "^1^^4",
        "^-1^^2", "^-1^^3", "^-1^^4"
    ];

    for (const pos of arcPositions) {
        player.runCommand(`execute at @s positioned${pos} run fill ~ ~ ~ ~ ~ ~ fire replace air`);
        player.runCommand(`execute at @s positioned${pos} run particle minecraft:mobflame_single ~ ~ ~`);
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

function passiveFrostTouch(player, passive, entity) {
    const ccd = testCooldown(player, passive.name, passives);
    if (ccd.time > 0) {
        if (player.hasTag("showCooldownPassives")) player.runCommand(`title @s actionbar ${passive.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    ccd.obj.setScore(player, passive.cooldown * 10);
    
    entity.addEffect("slowness", passive.value * 20, {amplifier: 2})
    if (Math.random() > 0.95) {
        const posX = entity.position.x;
        const posY = entity.position.y;
        const posZ = entity.position.z;
        entity.runCommand(`setblock ${posX} ${posY - 1} ${posZ} powder_snow`);
    }
}

function passiveLightningStrike(player, passive, entity) {
    const ccd = testCooldown(player, passive.name, passives);
    if (ccd.time > 0) {
        if (player.hasTag("showCooldownPassives")) player.runCommand(`title @s actionbar ${passive.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    if (Math.random() <= (passive.value / 100)) {
        ccd.obj.setScore(player, passive.cooldown * 10);
        entity.dimension.spawnEntity("lightning_bolt", entity.location);
    }
}

function passiveEnderArrow(player, passive, entity, damage) {
    const ccd = testCooldown(player, passive.name, passives);
    if (ccd.time > 0) {
        if (player.hasTag("showCooldownPassives")) player.runCommand(`title @s actionbar ${passive.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    
    if (entity.typeId == "minecraft:enderman" && Math.random() <= passive.value) {
        entity.applyDamage(damage);
        ccd.obj.setScore(player, passive.cooldown * 10);
    }
}

function passiveVampiric(player, passive, damage) {
    const ccd = testCooldown(player, passive.name, passives);
    if (ccd.time > 0) {
        if (player.hasTag("showCooldownPassives")) player.runCommand(`title @s actionbar ${passive.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    ccd.obj.setScore(player, passive.cooldown * 10);
    if (world.getMoonPhase() == MoonPhase.FullMoon && world.getTimeOfDay() >= 13500) {
        healEntity(player, damage * passive.value / 100);
    }
}

function passivePoisonBlade(player, passive, entity) {
    const ccd = testCooldown(player, passive.name, passives);
    if (ccd.time > 0) {
        if (player.hasTag("showCooldownPassives")) player.runCommand(`title @s actionbar ${passive.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    ccd.obj.setScore(player, passive.cooldown * 10);
    
    entity.addEffect("poison", passive.value * 20, {amplifier: passive.value});
}

function passiveExplosiveArrows(player, passive, event) {
    const ccd = testCooldown(player, passive.name, passives);
    if (ccd.time > 0) {
        if (player.hasTag("showCooldownPassives")) player.runCommand(`title @s actionbar ${passive.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    ccd.obj.setScore(player, passive.cooldown * 10);
    
    event.dimension.createExplosion(event.location, passive.value);
}