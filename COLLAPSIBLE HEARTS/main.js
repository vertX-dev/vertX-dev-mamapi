import { world, system, HudElement, HudVisibility } from "@minecraft:server";


const healthBars = [
  ["","","","","","","","","","", "","","","","","","","","",""],
  ["","","","","","","","","","", "","","","","","","","","",""],
  ["","","","","","","","","","", "","","","","","","","","",""],
  ["","","","","","","","","","", "","","","","","","","","",""],
  ["","","","","","","","","","", "","","","","","","","","",""],
  ["","","","","","","","","","", "","","","","","","","","",""],
  ["","","","","","","","","","", "","","","","","","","","",""],
  ["","","","","","","","","","", "","","","","","","","","",""]
];


world.afterEvents.healthChanged.subscribe((ev) => {
    if (ev.entity.typeId == "minecraft:player") displayHp(ev.entity);
});

world.afterEvents.playerSpawn((ev) =>{
    displayHp(ev.player);
});

function displayHp(player) {
    const hpcomponent = player.getComponent("minecraft:health");
    const maxHp = hpcomponent.effectiveValue;
    const currentHp = hpcomponent.currentValue;
    
    const col = currentHp % 20;
    const rowAbs = Math.floor(currentHp / 20);
    let row;

    if (rowAbs <= 12) {
        row = rowAbs;
    } else {
        row = ((rowAbs - 13) % 12) + 1;
    }
    
    const healthBarString = `${healthBars[row][col]} x${rowAbs.toString()}`;
    player.onScreenDisplay.setTitle(`hpc:${healthBarString}`, {stayDuration: 1, fadeInDuration: 0, fadeOutDuration: 0});
}