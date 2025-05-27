/*======================
 * Global Imports
 *======================*/
import { world, system, EquipmentSlot, EntityComponentTypes } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { enchantments, itemTagMapping, structureData, varCfg } from './cEnchantmentsConfig.js';



/*======================
  Utility Functions
 ======================*/
// Roman numeral conversion functions
function intToRoman(num) {
    const valueSymbols = [
      { value: 1000, symbol: "M" },
      { value: 900,  symbol: "CM" },
      { value: 500,  symbol: "D" },
      { value: 400,  symbol: "CD" },
      { value: 100,  symbol: "C" },
      { value: 90,   symbol: "XC" },
      { value: 50,   symbol: "L" },
      { value: 40,   symbol: "XL" },
      { value: 10,   symbol: "X" },
      { value: 9,    symbol: "IX" },
      { value: 5,    symbol: "V" },
      { value: 4,    symbol: "IV" },
      { value: 1,    symbol: "I" }
    ];

    let roman = "";
    for (const {
            value,
            symbol
        }
        of valueSymbols) {
        while (num >= value) {
            roman += symbol;
            num -= value;
        }
    }
    return roman;
}

function romanToInt(roman) {
    const romanMap = {
        I: 1,
        V: 5,
        X: 10,
        L: 50,
        C: 100,
        D: 500,
        M: 1000
    };

    let num = 0;
    let prevValue = 0;

    // Process the numeral from right to left
    for (let i = roman.length - 1; i >= 0; i--) {
        const currentValue = romanMap[roman[i]];
        if (currentValue === undefined) {
            throw new Error("Invalid Roman numeral character encountered: " + roman[i]);
        }

        if (currentValue < prevValue) {
            num -= currentValue;
        } else {
            num += currentValue;
            prevValue = currentValue;
        }
    }

    return num;
}


// Item classification system
function getItemTags(itemId) {
    // Loop through mapping and see if itemId contains one of the keys.
    for (const key in itemTagMapping) {
        if (itemId.includes(key)) {
            // Always include the "all" tag.
            return ["all", ...itemTagMapping[key]];
        }
    }
    player.sendMessage("§c[MINECRAFT] This item is not recognized as a known item.");
    return [];
}


// Structure classification system
function getStructureTags(structureId) {
    // Loop through mapping and see if structureId contains one of the keys.
    for (const key in structureData) {
        if (structureId.includes(key)) {
            // Always include the "all" tag.
            return ["all", ...structureGroups[key].tags];
        }
    }
    player.sendMessage("§c[MINECRAFT] This structure is not recognized as a known structure.");
    return [];
}


// Enchantment parsing
function parseEnchantments(loreArray) {
    let enchants = {};
    let otherLore = [];
    for (let line of loreArray) {
        // Split the line into words; assume the last word is a potential Roman numeral.
        let words = line.trim().split(" ");
        if (words.length >= 2) {
            let possibleRoman = words[words.length - 1];
            let level = romanToInt(possibleRoman);
            // If the numeral converts to a valid level (> 0), treat this line as an enchantment.
            if (level && level > 0) {
                // The enchantment name is the remainder of the line.
                let name = words.slice(0, words.length - 1).join(" ");
                enchants[name] = level;
                continue;
            }
        }
        // If the line does not match the expected pattern, treat it as general lore.
        otherLore.push(line);
    }
    return {
        enchants,
        otherLore
    };
}


//Get value of scoreboard
function getScoreboardValue(scoreboard, player) {
    const scoreboardObj = world.scoreboard.getObjective(scoreboard);
    const scoreboardValue = scoreboardObj.getScore(player);
    return scoreboardValue;
}

// convert xp to lvl
function rdxplvl(num) {
    let level;

    if (num <= 352) {
        // Levels 0–16
        level = Math.sqrt(num + 9) - 3;
    } else if (num <= 1507) {
        // Levels 17–31
        level = (81 / 10) + Math.sqrt((2 / 5) * (num - (7839 / 40)));
    } else {
        // Levels 32+
        level = (325 / 18) + Math.sqrt((2 / 9) * (num - (54215 / 72)));
    }

    return Math.floor(level); // Minecraft levels are whole numbers
}


// Combine the enchantments
function combineEnchants(itemEnchants, bookEnchants, player) {
    const combinedEnchants = {
        ...itemEnchants
    };
    // Merge enchantments from book
    for (let enchant in bookEnchants) {
        if (combinedEnchants.hasOwnProperty(enchant)) {
            // Find the matching enchantment data from the enchants object
            const enchantData = Object.values(enchantments).find(e => e.name === enchant);
            const maxLevel = enchantData ? enchantData.maxLvl : Infinity

            if (combinedEnchants[enchant] === bookEnchants[enchant]) {
                // If levels are the same, increment by 1 but don't exceed max level
                combinedEnchants[enchant] = Math.min(combinedEnchants[enchant] + 1, maxLevel);
            } else {
                // If levels are different, take the highest level
                combinedEnchants[enchant] = Math.max(combinedEnchants[enchant], bookEnchants[enchant]);
            }

        } else {
            combinedEnchants[enchant] = bookEnchants[enchant];
        }
    }
    return combinedEnchants;
}


//Function to validate enchantment conflicts
function validateEnchantmentConflicts(combinedEnchants) {
    // Create a map to track enchantment groups
    const groupCounts = {};

    // Check each enchantment
    for (const enchantName in combinedEnchants) {
        // Find the enchantment data
        const enchantData = Object.values(enchantments).find(e => e.name === enchantName);
        if (enchantData && enchantData.enchantmentGroup) {
            // Initialize group counter if it doesn't exist
            if (!groupCounts[enchantData.enchantmentGroup]) {
                groupCounts[enchantData.enchantmentGroup] = [];
            }
            // Add enchantment to its group
            groupCounts[enchantData.enchantmentGroup].push(enchantName);

            // Check if group has more than one enchantment
            if (groupCounts[enchantData.enchantmentGroup].length > 1) {
                return false; //conflict between enchantments
                console.warn(`Incompatible enchantments: ${groupCounts[enchantData.group].join(", ")} cannot be combined because they belong to the same group: ${enchantData.group}`);
            }
        }
    }
    return true; //all enchantments are valid
}

//============================================================================================



/*======================
  Command Handlers
 ======================*/

//=========================NORMAL ENCHANTING===========================================
function handleEnchant(player, itemId, itemStack) {
    if (!itemId || !itemStack) {
        player.sendMessage("§cYou must hold an item to enchant!");
        return;
    }

    // Get item tags to determine valid enchantments
    const itemTags = getItemTags(itemId);
    if (itemTags.length === 0) return; // getWeaponTags already sends an error message

    // Get current enchantments on the item
    const itemLore = itemStack.getLore ? itemStack.getLore() : [];
    let {
        enchants: currentEnchants,
        otherLore: itemOtherLore
    } = parseEnchantments(itemLore);
    const points = player.getTotalXp();
    //------------------UI-----------------------------------------------------------

    // Create the form
    const form = new ModalFormData()
        .title(`Enchant Item      XP: §a${points}`);

    // Keep track of available enchants for processing response
    const availableEnchants = [];

    // Add sliders for each valid enchant
    for (const [enchantId, enchantData] of Object.entries(enchantments)) {
        // Check if the enchant can be applied to this item type
        const canApply = enchantData.enchantOn.some(tag => itemTags.includes(tag));
        if (canApply) {
            availableEnchants.push(enchantData);
            const currentLevel = currentEnchants[enchantData.name] || 0;

            // Create slider label with name and cost
            const costText = enchantData.cost > 0 ?
                `§c${enchantData.xpCost}` :
                `§a${enchantData.xpCost}`;
            const label = `${enchantData.name} (${costText})`;

            // Add slider
            form.slider(
                label,
                0, // min level (0 = not applied)
                enchantData.maxLvl, // max level from enchant data
                1, // step size
                currentLevel // current level (if exists)
            );
        }
    }
    form.submitButton("§dENCHANT");

    // Show the form to the player
    form.show(player).then((response) => {
        //-----------------UI RESPONSE----------------------------------------------------

        if (response.canceled) return;

        try {
            // Calculate total cost and build new enchantments
            let totalCost = 0;
            let newEnchants = {};

            response.formValues.forEach((level, index) => {
                if (level > 0) { // Only process enchants that were selected
                    const enchant = availableEnchants[index];
                    newEnchants[enchant.name] = level;

                    // Calculate cost based on level selected
                    const enchantCost = enchant.xpCost * (level - (currentEnchants[enchant.name] || 0));
                    totalCost += enchantCost;
                }
            });

            // Check if player can afford the enchantment
            if (points < totalCost) {
                player.sendMessage(`§cYou need ${totalCost} xp to apply these enchantments!`);
                return;
            }

            // Create new item with enchantments
            const newItem = itemStack.clone();
            let newLore = [...itemOtherLore];

            // Add each enchantment to lore
            for (const [enchantName, level] of Object.entries(newEnchants)) {
                newLore.push(`${enchantName} ${intToRoman(level)}`);
            }

            // Set the new lore
            if (newItem.setLore && validateEnchantmentConflicts(newEnchants)) {
                newItem.setLore(newLore);
            } else {
                player.sendMessage("§c[MINECRAFT] Unsupported combination of enchantments!");
                return;
            }

            // Update the item in player's hand
            try {
                const equipment = player.getComponent("minecraft:equippable");
                if (equipment) {
                    equipment.setEquipment(EquipmentSlot.Mainhand, newItem);

                    // Deduct points
                    player.runCommand(`xp -99999L @s`);
                    player.runCommand(`xp ${points - totalCost} @s`);

                    player.sendMessage(`§aSuccessfully applied enchantments for ${totalCost} xp!`);
                }
            } catch (error) {
                console.error("Failed to update item:", error);
                player.sendMessage("§cFailed to apply enchantments!");
            }

        } catch (error) {
            console.error("Error in enchant handling:", error);
            player.sendMessage("§cAn error occurred while enchanting!");
        }
    });
}
//========================================================================================



//===========TRANSFER ENCHANTMENTS FROM BOOK TO ITEM==============================================
function handleEnchantWithBook(player, itemId, itemStack) {
    try {
        // Get the equipment component
        const equipment = player.getComponent("minecraft:equippable");
        if (!equipment) {
            player.sendMessage("§cError: Could not access equipment!");
            return;
        }

        // Get the book from offhand
        const bookStack = equipment.getEquipment(EquipmentSlot.Offhand);
        if (!bookStack || bookStack.typeId !== "veapi:book") { //custom book id
            player.sendMessage("§eYou must hold a book in your offhand!");
            return;
        }

        // Get item tags to determine valid enchantments
        const itemTags = getItemTags(itemId);
        if (itemTags.length === 0) return;

        // Get the item's current lore
        const itemLore = itemStack.getLore ? itemStack.getLore() : [];
        const bookLore = bookStack.getLore ? bookStack.getLore() : [];

        // Parse enchantments
        let {
            enchants: itemEnchants,
            otherLore: itemOtherLore
        } = parseEnchantments(itemLore);
        let {
            enchants: bookEnchants
        } = parseEnchantments(bookLore);

        // Filter book enchants to only include valid ones for this item type
        const validBookEnchants = {};
        for (const [enchantName, level] of Object.entries(bookEnchants)) {
            // Find the enchantment data
            const enchantData = Object.values(enchantments).find(e => e.name === enchantName);
            if (enchantData) {
                // Check if any of the item's tags match the enchantment's valid targets
                const canApply = enchantData.enchantOn.some(tag => itemTags.includes(tag));
                if (canApply) {
                    validBookEnchants[enchantName] = level;
                }
            }
        }

        // Combine enchantments using the filtered book enchants
        const combinedEnchants = combineEnchants(itemEnchants, validBookEnchants, player);

        if (!validateEnchantmentConflicts(combinedEnchants)) {
            player.sendMessage("§c[MINECRAFT] Unsupported combination of enchantments!");
            return;
        }

        // Build new lore
        let newLore = [...itemOtherLore];
        for (let enchantName in combinedEnchants) {
            let romanLevel = intToRoman(combinedEnchants[enchantName]);
            newLore.push(enchantName + " " + romanLevel);
        }

        // Create new ItemStack for the enchanted item
        const newItem = itemStack.clone();
        if (newItem.setLore) {
            newItem.setLore(newLore);
            console.log(newItem.getLore());
        }

        // Update both hands
        try {
            let equipmen = player.getComponent("minecraft:equippable");
            equipmen.setEquipment(EquipmentSlot.Mainhand, newItem);
            player.runCommand("replaceitem entity @s slot.weapon.offhand 0 air");

            // If some enchants were filtered out, notify the player
            if (Object.keys(bookEnchants).length !== Object.keys(validBookEnchants).length) {
                player.sendMessage("§eNot all enchantments could be applied because they were not compatible with this item.");
            }

            player.sendMessage("§aItem enchanted successfully!");
        } catch (equipError) {
            console.log('[ERROR] Equipment update failed:', equipError);

            // Try alternative inventory approach
            try {
                const inventory = player.getComponent("minecraft:inventory");
                if (inventory && inventory.container) {
                    // Update main hand item
                    inventory.container.setItem(player.selectedSlot, newItem);
                    player.sendMessage("§aItem enchanted successfully! (alt method)");
                }
            } catch (invError) {
                console.log('[ERROR] Inventory update failed:', invError);
                player.sendMessage("§cFailed to update items!");
            }
        }

    } catch (error) {
        console.log('[ERROR] Enchanting process failed:', error);
        player.sendMessage("§cAn error occurred while enchanting!");
    }
}
//=====================================================================================================



//==========================LIBRARY===================================
function handleLibrary(player) {
    const mainMenu = new ActionFormData().title("Enchantments Library");
    const allEnchants = [];

    for (const [key, enchant] of Object.entries(enchantments)) {
        allEnchants.push(enchant);
        mainMenu.button(enchant.name);
    }

    mainMenu.show(player).then(response => {
        if (response.canceled) return;

        const selectedEnchant = allEnchants[response.selection];

        const detailMenu = new ActionFormData()
            .title(selectedEnchant.name)
            .body(
                `§lMax Level:§r ${selectedEnchant.maxLvl}\n` +
                `§lXP Cost per Level:§r ${selectedEnchant.xpCost}\n` +
                `§lApplies To:§r ${selectedEnchant.enchantOn.join(", ")}\n` +
                `§lSpawns In:§r ${selectedEnchant.structureGroup.join(", ")}\n` +
                `§lChest Chance:§r ${selectedEnchant.spawnChanceChest * 100}%\n` +
                `§lGroup:§r ${selectedEnchant.enchantmentGroup.join(", ")}\n\n` +
                `§lDescription:§r\n${selectedEnchant.description}`
            )
            .button("Back to Library");

        detailMenu.show(player).then(detailResponse => {
            if (detailResponse.canceled || detailResponse.selection === 0) {
                handleLibrary(player);
            }
        });
    });
}
//====================================================================



/*======================
  Event Listeners
 ======================*/
world.beforeEvents.playerInteractWithBlock.subscribe((eventData) => {
    // Check if the interacted block is the enchanter block
    if (eventData.block.typeId === "veapi:enchanter") { // custom enchanting table
        // Get the player who interacted with the block
        const player = eventData.player;

        // Get the item in the player's main hand
        const itemStack = player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
        const itemId = itemStack?.typeId;

        // Optional: Log the interaction for debugging
        console.warn(`Player ${player.name} interacted with enchanter block`);

        // Create the main enchanting UI with button icons
        const enchantingMainUI = new ActionFormData()
            .title("Enchanting Menu")
            .body("Select an option:")
            .button("Enchant", "textures/blocks/enchanting_table_top.png")
            .button("Enchant with Book", "textures/items/book_enchanted.png")
            .button("Library", "textures/blocks/bookshelf.png");

        // Show the form to the player and handle the response.
        // Small delay to ensure proper UI display after interaction
        system.runTimeout(() => {
            enchantingMainUI.show(player).then((response) => {
                if (!response.canceled) {
                    if (response.selection === 0) handleEnchant(player, itemId, itemStack);
                    if (response.selection === 1) handleEnchantWithBook(player, itemId, itemStack);
                    if (response.selection === 2) handleLibrary(player);
                }
            });
        }, 10);
    }
});

//================================================================================================

/*======================
   Loot Table System
======================*/
system.runInterval(() => {
    // Get all players
    const players = world.getAllPlayers();

    for (const player of players) {
        // Get player's main hand item
        const equipment = player.getComponent("minecraft:equippable");
        if (!equipment) continue;

        const itemStack = equipment.getEquipment(EquipmentSlot.Mainhand);
        if (!itemStack) continue;

        // Get item lore
        const lore = itemStack.getLore();
        if (!lore || lore.length === 0) continue;

        // Check each line of lore for the special tag
        for (const line of lore) {
            if (line.startsWith('§klt{')) {
                // Extract the tag between curly braces
                const match = line.match(/§klt\{([^}]+)\}/);
                if (match && match[1]) {
                    const specialTag = match[1];
                    // Call the processing function with the extracted tag
                    Enchants(player, specialTag, itemStack);
                }
            }
        }
    }
}, 20); // Run every 20 ticks (1 second)


/**NEED REWORK ASAP*/

//§klt{Structure}
function Enchants(player, specialTag, itemStack) {
    try {
        // 1. Clone itemStack
        const newItem = itemStack.clone();

        // 2. Identify structure
        const structureTags = getStructureTags(specialTag);
        if (!structureTags) {
            return;
        }

        // Get item tags for filtering enchantments
        const itemTags = getItemTags(itemStack.typeId);
        if (itemTags.length === 0) {
            return;
        }

        // 3. Process enchantments
        let appliedEnchants = [];
        let newLore = [];

        // Perform rolls based on maxEnchants
        for (let i = 0; i < structureData.maxEnchants; i++) {
            if (Math.random() < varCfg.enchantRollChance) {
                for (const [key, enchant] of Object.entries(enchantments)) {
                    //TODO: add logic to retriwing random id of enchantments based on structure groups comatibility
                }
            }
        }

        // Create lore with enchants
        appliedEnchants.forEach(enchant => {
            newLore.push(`${enchant.name} ${intToRoman(enchant.level)}`);
        });

        // 4. Set new lore
        newItem.setLore(newLore);

        // 5. Give item to player
        try {
            const equipment = player.getComponent("minecraft:equippable");
            if (equipment) {
                equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
            }
        } catch (equipError) {
            console.error('Equipment update failed:', equipError);

            // Fallback to inventory approach
            try {
                const inventory = player.getComponent("minecraft:inventory");
                if (inventory && inventory.container) {
                    inventory.container.setItem(player.selectedSlot, newItem);
                    debug('Item given to player (fallback method)');
                    player.sendMessage("§aItem successfully enchanted! (alt method)");
                }
            } catch (invError) {
                debug('Inventory update failed:', invError);
                player.sendMessage("§cFailed to enchant item!");
                throw invError;
            }
        }

    } catch (error) {
        console.error('LootEnchant Error:', error);
    }
}

//================================================================================================












//================================TRIGGERS============================