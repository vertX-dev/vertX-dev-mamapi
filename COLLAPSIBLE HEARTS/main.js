import { world, system, HudElement, HudVisibility } from "@minecraft/server";


const healthBars = [
  ["","","","","","","","","","","","","","","","","","","",""],
  ["","","","","","","","","","","","","","","","","","","",""],
  ["","","","","","","","","","","","","","","","","","","",""],
  ["","","","","","","","","","","","","","","","","","","",""],
  ["","","","","","","","","","","","","","","","","","","",""],
  ["","","","","","","","","","","","","","","","","","","",""],
  ["","","","","","","","","","","","","","","","","","","",""],
  ["","","","","","","","","","","","","","","","","","","",""],
  
  ["","","","","","","","","","","","","","","","","","","",""],
  ["","","","","","","","","","","","","","","","","","","",""],
  ["","","","","","","","","","","","","","","","","","","",""],
  ["","","","","","","","","","","","","","","","","","","",""],
  ["","","","","","","","","","","","","","","","","","","",""],
  ["","","","","","","","","","","","","","","","","","","",""],
  ["","","","","","","","","","","","","","","","","","","",""],
  ["","","","","","","","","","","","","","","","","","","",""]
];

system.runInterval(() => {
    const players = world.getPlayers();
    for (const player of players) {
        displayHp(player);
        if (!player.hasTag("chbvertx")) player.addTag("chbvertx");
    }
}, 5);

function displayHp(player) {
    const hpcomponent = player.getComponent("minecraft:health");
    const maxHp = hpcomponent.effectiveValue;
    const currentHp = hpcomponent.currentValue;
    
    const col = currentHp % 20;
    const rowAbs = Math.floor((currentHp / 20) - 0.001);
    let row;

    if (rowAbs <= 12) {
        row = rowAbs;
    } else {
        row = ((rowAbs - 13) % 12) + 1;
    }

    // Reverse the column
    const totalCols = 20; // Assuming healthBars has 20 columns
    let reversedCol = totalCols - 1 - col; // Reverse calculation
    if (col == 0) reversedCol = col;

    const healthBarString = `${healthBars[row][reversedCol]} x${rowAbs + 1}  ${currentHp}`;
    
    player.runCommand("title @s times 0 0 0");
    player.runCommand("title @s title hpc:" + healthBarString);
}

world.beforeEvents.chatSend.subscibe((ev) =>{
    const player = ev.sender;
    const message = ev.message;
    
    if (message.startsWith(".")) {
        if (message == ".chb") {
            ev.cancel = true;
            system.runTimeout(() => settings(player), 60);
        }
    }
});


//TODO ui for settings
function settings(player) {
    
}



const PREDEFINED_SCOREBOARDS = [
    {
        name: "health",
        displayName: "Health"
    },
    {
        name: "hpforrrs",
        displayName: "Health"
    }
];
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
}
system.runTimeout(() => {initializeScoreboards()}, 50);

const HPBOOST_ITEMS = [
    {
        id: "chb:heart",
        boost: 1,
        maxBoost: 20,
        scoreboardTracker: "heartsTrack"
    }
];

world.afterEvents.itemUse.subscibe((ev) => {
    const player = ev.source;
    if (!ev.itemStack) return;
    const item = ev.itemStack?.typeId;
    
    for (const bitem of HPBOOST_ITEMS) {
        if (bitem.id != item) continue;
        
        if (bitem.maxBoost >= getScoreboardValue(bitem.scoreboardTracker, player)) continue;
        
        if (!player.hasTag("rrsvertx")) {
            world.scoreboard.getObjective("health").addScore(player, bitem.boost);
        } else {
            world.scoreboard.getObjective("hpforrrs").addScore(player, bitem.boost);
        }
        world.scoreboard.getObjective(bitem.scoreboardTracker).addScore(player, 1);
    }
});



function getScoreboardValue(scoreboard, player) {
    const scoreboardObj = world.scoreboard.getObjective(scoreboard);
    const scoreboardValue = scoreboardObj.getScore(player);
    return scoreboardValue;
}