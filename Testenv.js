const original = [
  "§7Item info",
  "§8Attributes",
  "§cOld line 1",
  "§cOld line 2",
  "§a§t§b§e§n§d§r",
  "§7Other info"
];

const insertContent = [
  "§aNew stat 1",
  "§aNew stat 2"
];

// Find the range
const startIndex = original.indexOf("§8Attributes") + 1;
const endIndex = original.indexOf("§a§t§b§e§n§d§r");

// Replace the content in between
const updated = [
  ...original.slice(0, startIndex),
  ...insertContent,
  ...original.slice(endIndex)
];

for (const a of updated) {
    console.log(a);
}