import { world, system } from "@minecraft:server";

 world.afterEvents.playerDimensionChange.subscribe((ev) => {
    const player = ev.player;
    const toDim = ev.toDimension.id;
     
     
    if (!player.hasTag("killMobWarden") && toDim != "overworld") {
        const fromDim = ev.fromDimension.id;
        let fromLoc = ev.fromLocation;
    }
 });