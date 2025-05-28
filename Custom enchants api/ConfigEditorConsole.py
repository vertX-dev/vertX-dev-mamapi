import re 
import json

JS_FILE = "cEnchantmentsData.js"

# Prompt user for enchantment details
def prompt_enchantment():
    key = input("Enchantment key (e.g., testEnchant): ").strip()
    eid = int(input("  id: ").strip())
    name = input("  name (use § color codes): ").strip()
    max_lvl = int(input("  maxLvl: ").strip())
    desc = input("  description: ").strip()
    xp = int(input("  xpCost: ").strip())

    def read_list(label):
        vals = input(f"  {label} (comma-separated): ").strip()
        return [v.strip() for v in vals.split(",") if v.strip()]

    enchant_on = read_list("enchantOn tags")
    struct_grp = read_list("structureGroup tags")
    ench_grp = read_list("enchantmentGroup tags")

    print("Triggers:")
    evt = input("  event: ").strip()
    tgt = input("  target: ").strip()
    func = input("  function: ").strip()

    return key, {
        "id": eid,
        "name": name,
        "maxLvl": max_lvl,
        "description": desc,
        "xpCost": xp,
        "enchantOn": enchant_on,
        "structureGroup": struct_grp,
        "enchantmentGroup": ench_grp,
        "triggers": {
            "event": evt,
            "target": tgt,
            "function": func
        }
    }

# Serialize Python dict to properly indented JS object
def dict_to_js(obj, indent_level=1):
    indent = "    " * indent_level
    if isinstance(obj, dict):
        lines = []
        for k, v in obj.items():
            lines.append(f"{indent}{k}: {dict_to_js(v, indent_level + 1)}")
        open_brace = "{"
        close_indent = "    " * (indent_level - 1)
        return open_brace + "\n" + ",\n".join(lines) + f"\n{close_indent}}}"
    elif isinstance(obj, list):
        return "[" + ", ".join(json.dumps(i) for i in obj) + "]"
    elif isinstance(obj, str):
        return json.dumps(obj)
    else:
        return str(obj)

# Add new enchantment and remove 'exampleEnchant' if present
def add_enchantment(key, data):
    with open(JS_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove placeholder 'exampleEnchant' block entirely
    content = re.sub(r"^\s*exampleEnchant\s*:\s*\{[\s\S]*?\},?\n", "", content, flags=re.MULTILINE)

    # Find export block
    pattern = r"(export const enchantments\s*=\s*\{)([\s\S]*?)(\};)"
    match = re.search(pattern, content)
    if not match:
        print("❌ Could not find 'export const enchantments = {' block.")
        return

    prefix, body, suffix = match.groups()

    # Prevent duplicates
    if re.search(rf"^\s*{re.escape(key)}\s*:", body, flags=re.MULTILINE):
        print(f"⚠️ Enchantment '{key}' already exists.")
        return

    # Insert new enchantment - handle empty vs non-empty body
    if body.strip():
        new_entry = f"{body.rstrip()},\n    {key}: {dict_to_js(data, 1)}"
    else:
        new_entry = f"\n    {key}: {dict_to_js(data, 1)}\n"
    
    updated = prefix + new_entry + "\n" + suffix

    with open(JS_FILE, "w", encoding="utf-8") as f:
        f.write(updated)
    print(f"✅ Added enchantment '{key}'.")

if __name__ == "__main__":
    enchant_key, enchant_data = prompt_enchantment()
    add_enchantment(enchant_key, enchant_data)