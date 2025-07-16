import { world, system, MoonPhase, EquipmentSlot } from "@minecraft/server";


system.runInterval(() => {
    if (world.getMoonPhase() == MoonPhase.FullMoon && world.getTimeOfDay >= 13500 && world.getTimeOfDay <= 23000) {
        const players = world.getPlayers();
        for (const player of players) {
            player.runCommand("function fullmoon_effects");
        }
    }
}, 20);