import { world, system } from "@minecraft:server";

const mobList = {
    "the end": "Enderman",
    "nether": "Warden"
};

function cancelTeleport(player, toLoc, toDim) {
    const loc = {
        x: toLoc.x +3;
        y: toLoc.y +2;
        z: toLoc.z -3
    }
    player.teleport(loc, {dimension: world.getDimension(toDim)});
    player.sendMessage("You are not ready for" + toDim.id + ". Kill " + mobList.toDim.id);
}

 world.afterEvents.playerDimensionChange.subscribe((ev) => {
    const player = ev.player;
    const toDim = ev.toDimension.id;
     
     
    if ((!player.hasTag("killMobWarden") || !player.hasTag("killMobEnderman")) && toDim != "overworld") {
        const fromDim = ev.fromDimension;
        let fromLoc = ev.fromLocation;
        //check for end
        if (!player.hasTag("killMobEnderman") && toDim == "the end") {
            cancelTeleport(player, fromLoc, fromDim);
        }
        //check for nether
        if (!player.hasTag("killMobWarden") && toDim == "nether") {
            cancelTeleport(player, fromLoc, fromDim);
        }
    }
 });
 
 world.afterEvents.entityDie.subscribe((ev) => {
     if (ev.damageSource?.damagingEntity?.typeId != "minecraft:player") return;
     if (ev.deadEntity.typeId == "minecraft:warden") {
        ev.damageSource?.damagingEntity.addTag("killMobWarden");
     }
     
     if (ev.deadEntity.typeId == "minecraft:enderman") {
        ev.damageSource?.damagingEntity.addTag("killMobEnderman");
     }
 });