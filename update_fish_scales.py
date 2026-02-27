import os
import re

file_path = r"c:\AI\my DeepL 2\game-for-son-3\src\models\FishData.js"

scales = {
    # XS: 0.35
    "fish_smelt": "0.35",
    "fish_anchovy": "0.35",
    "fish_pirami": "0.35",
    "fish_loach": "0.35",
    "fish_mangdoong": "0.35",
    
    # S: 0.55
    "fish_boonguh": "0.55",
    "fish_gizzard_shad": "0.55",
    "fish_webfoot_octopus": "0.55",
    "fish_saury": "0.55",
    
    # M: 0.8
    "fish_catfish": "0.8",
    "fish_ssogari": "0.8",
    "fish_urock": "0.8",
    "fish_flounder": "0.8",
    "fish_black_porgy": "0.8",
    "fish_godeungeo": "0.8",
    "fish_squid": "0.8",
    "fish_pollack": "0.8",
    
    # L: 1.2
    "fish_carp": "1.2",
    "fish_gwangeo": "1.2",
    "fish_sea_bass": "1.2",
    "fish_chamdom": "1.2",
    "fish_spanish_mackerel": "1.2",
    "fish_salmon": "1.2",
    "fish_galchi": "1.2",
    "fish_cod": "1.2",
    "fish_monkfish": "1.2",
    
    # XL: 1.8
    "fish_gamulchi": "1.8",
    "fish_bangeo": "1.8",
    "fish_tuna": "1.8",
    "fish_sunfish": "1.8",
    "fish_striped_jewfish": "1.8",
    "fish_cheongsaechi": "1.8",
    
    # Exceptions
    "fish_whale_shark": "2.5",
    
    # Items
    "item_shoe": "0.6",
    "item_trash": "0.5",
    "item_treasure": "0.8",
}

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# For lines like: { id: 'fish_pirami', name: '피라미', grade: 'N', baseReward: 30, baseWeight: 40, region: 1, color: 0xcccccc, scale: 0.5, catchMax: 14, difficulty: 1.0 },
def replacer(match):
    fish_id = match.group(1)
    if fish_id in scales:
        new_scale = scales[fish_id]
        return match.group(0).replace(f"scale: {match.group(2)}", f"scale: {new_scale}")
    return match.group(0)

new_content = re.sub(r"id:\s*'([a-zA-Z0-9_]+)'.*?scale:\s*([0-9.]+)", replacer, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("FishData.js scales updated successfully.")
