import os
import re

file_path = r"c:\AI\my DeepL 2\game-for-son-3\src\models\FishData.js"

# We double the previous scales because resolution changed from 128x128 to 64x64
scale_updates_r4 = {
    # Fishes
    "fish_flying_fish": "1.6",     # 0.8 * 2
    "fish_parrotfish": "1.8",      # 0.9 * 2
    "fish_lionfish": "1.6",        # 0.8 * 2
    "fish_moray_eel": "2.2",       # 1.1 * 2
    "fish_barracuda": "2.6",       # 1.3 * 2
    "fish_mahi_mahi": "2.4",       # 1.2 * 2
    "fish_giant_trevally": "3.0",  # 1.5 * 2
    "fish_sailfish": "3.2",        # 1.6 * 2
    "fish_hammerhead": "3.6",      # 1.8 * 2
    "fish_manta_ray": "4.0",       # 2.0 * 2
    "fish_giant_squid": "4.4",     # 2.2 * 2
    "fish_oarfish": "5.0",         # 2.5 * 2
    "fish_coelacanth": "4.0",      # 2.0 * 2
    "fish_golden_fish": "3.6",     # 1.8 * 2
    
    # Items
    "item_treasure_map": "2.0",    # 1.0 * 2
    "item_pirates_sword": "2.0",   # 1.0 * 2
    "item_pearl": "1.6",           # 0.8 * 2
    "item_crown": "2.4"            # 1.2 * 2
}

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

def replacer(match):
    fish_id = match.group(1)
    if fish_id in scale_updates_r4:
        new_scale = scale_updates_r4[fish_id]
        return match.group(0).replace(f"scale: {match.group(2)}", f"scale: {new_scale}")
    return match.group(0)

new_content = re.sub(r"id:\s*'([a-zA-Z0-9_]+)'.*?scale:\s*([0-9.]+)", replacer, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Region 4 fish scales updated for 64x64 resolution.")
