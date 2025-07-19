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