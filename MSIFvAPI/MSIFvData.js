export const holdSens = 15 //time it ticks, in future updates you can change it directly in game

/**
 * @typedef {Object} ItemFunctionData
 * @property {string[]} functions - Array of function names (strings) associated with the item.
 * @property {string[]} skillNames - Array of skill names (strings) for display.
 * @property {string} scoreboardObj - Scoreboard objective name (max 16 characters).
 * @property {string[]} fontIcons - Array of icons or characters for UI display.
 */

/** 
 * @type {Object.<string, ItemFunctionData>}
 * Maps item typeId strings to their function/skill configuration.
 */

/*to use MSIF you need to add use modifiers to json of item (it will add one more event that we use to detect holding button):

            "minecraft:use_modifiers":  {
                "movement_modifier":  1,
                "use_duration":  9999
            },
*/
export const IFD = {
    "vemp:sword": {
        functions: ["function1", "function2"]
    },
    "vemp:bow": {
        functions: ["archery_skill", "precision_shot"],
        skillNames: ["§6Archery Master", "§ePrecision Shot"],
        scoreboardObj: "archeryObj",
        fontIcons: ["→", "🏹"]
    },
    "vemp:staff": {
        functions: ["magic_bolt", "heal", "teleport"],
        skillNames: ["§5Magic Bolt", "§bHeal", "§dTeleport"],
        scoreboardObj: "magicObj",
        fontIcons: ["✦", "✚", "◈"]
    },
    "vemp:pickaxe": {
        functions: ["mine_boost", "ore_finder"],
        skillNames: ["§7Mining Boost", "§6Ore Finder"],
        scoreboardObj: "miningObj",
        fontIcons: ["⛏", "◆"]
    },
    "vemp:shield": {
        functions: ["block_counter", "reflect_damage"],
        skillNames: ["§9Block Counter", "§cReflect Damage"],
        scoreboardObj: "defenseObj",
        fontIcons: ["🛡", "↩"]
    },
    "vemp:dagger": {
        functions: ["backstab", "poison_blade", "stealth"],
        skillNames: ["§4Backstab", "§2Poison Blade", "§8Stealth"],
        scoreboardObj: "rogueObj",
        fontIcons: ["†", "☠", "●"]
    },
    "vemp:hammer": {
        functions: ["ground_slam", "armor_break"],
        skillNames: ["§cGround Slam", "§7Armor Break"],
        scoreboardObj: "warriorObj",
        fontIcons: ["🔨", "💥"]
    },
    "vemp:wand": {
        functions: ["fireball", "ice_shard", "lightning"],
        skillNames: ["§cFireball", "§bIce Shard", "§eLightning"],
        scoreboardObj: "wandObj",
        fontIcons: ["🔥", "❄", "⚡"]
    },
    "vemp:crossbow": {
        functions: ["explosive_bolt", "piercing_shot"],
        skillNames: ["§4Explosive Bolt", "§fPiercing Shot"],
        scoreboardObj: "crossbowObj",
        fontIcons: ["💣", "↗"]
    },
    "vemp:gauntlets": {
        functions: ["power_punch", "grip_crush"],
        skillNames: ["§6Power Punch", "§cGrip Crush"],
        scoreboardObj: "brawlerObj",
        fontIcons: ["👊", "✊"]
    },
    "vemp:ring": {
        functions: ["mana_regen", "speed_boost"],
        skillNames: ["§9Mana Regen", "§aSpeed Boost"],
        scoreboardObj: "accessoryObj",
        fontIcons: ["○", "»"]
    },
    "vemp:boots": {
        functions: ["dash", "wall_climb"],
        skillNames: ["§aDash", "§7Wall Climb"],
        scoreboardObj: "mobilityObj",
        fontIcons: ["↦", "⬆"]
    },
    "vemp:cloak": {
        functions: ["invisibility", "shadow_step"],
        skillNames: ["§8Invisibility", "§0Shadow Step"],
        scoreboardObj: "stealthObj",
        fontIcons: ["◯", "▲"]
    },
    "vemp:tome": {
        functions: ["knowledge_boost", "spell_store"],
        skillNames: ["§eKnowledge Boost", "§5Spell Store"],
        scoreboardObj: "scholarObj",
        fontIcons: ["📖", "✧"]
    },
    "vemp:crystal": {
        functions: ["energy_charge", "power_amplify"],
        skillNames: ["§bEnergy Charge", "§dPower Amplify"],
        scoreboardObj: "crystalObj",
        fontIcons: ["◊", "✦"]
    }
};