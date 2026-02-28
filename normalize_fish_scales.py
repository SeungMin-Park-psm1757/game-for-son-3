import os
import re
from PIL import Image

# Path to FishData.js
FISH_DATA_PATH = r"c:\AI\my DeepL 2\game-for-son-3\src\models\FishData.js"
IMAGE_DIR = r"c:\AI\my DeepL 2\game-for-son-3\assets\images"

# Final Target Pixel Sizes (User's specific rules)
# XS: 70px, M: 180px, ML: 220px, L: 260px, XL: 300px
# Interpolated S and MS: XS(70) -> S(105) -> MS(145) -> M(180)
TARGET_SIZES = {
    "XS": 70,
    "S": 105,
    "MS": 145,
    "M": 180,
    "ML": 220,
    "L": 260,
    "XL": 300,
    "SPECIAL": 400 # Whale Shark, etc. (scaled down slightly to match XL=300)
}

# Mapping of fish IDs to categories
CATEGORY_MAPPING = {
    "fish_pirami": "XS",
    "fish_loach": "XS",
    "fish_smelt": "XS",
    "fish_boonguh": "S",
    "fish_catfish": "MS",
    "fish_ssogari": "MS",
    "fish_carp": "M",
    "fish_gamulchi": "ML",
    "fish_anchovy": "XS",
    "fish_mangdoong": "XS",
    "fish_gizzard_shad": "S",
    "fish_webfoot_octopus": "S",
    "fish_urock": "MS",
    "fish_flounder": "MS",
    "fish_black_porgy": "MS",
    "fish_gwangeo": "ML",
    "fish_sea_bass": "ML",
    "fish_chamdom": "M",
    "fish_saury": "S",
    "fish_godeungeo": "MS",
    "fish_squid": "MS",
    "fish_spanish_mackerel": "M",
    "fish_pollack": "M",
    "fish_salmon": "M",
    "fish_galchi": "M",
    "fish_cod": "M",
    "fish_monkfish": "M",
    "fish_bangeo": "ML",
    "fish_tuna": "L",
    "fish_sunfish": "L",
    "fish_striped_jewfish": "ML",
    "fish_cheongsaechi": "L",
    "fish_whale_shark": "SPECIAL",
    "fish_flying_fish": "S",
    "fish_lionfish": "S",
    "fish_parrotfish": "MS",
    "fish_moray_eel": "ML",
    "fish_barracuda": "ML",
    "fish_mahi_mahi": "ML",
    "fish_giant_trevally": "ML",
    "fish_sailfish": "L",
    "fish_hammerhead": "L",
    "fish_manta_ray": "XL",
    "fish_giant_squid": "XL",
    "fish_golden_fish": "MS",
    "fish_coelacanth": "L",
    "fish_oarfish": "XL",
    # Items
    "item_shoe": "S",
    "item_trash": "XS",
    "item_treasure": "M",
    "item_treasure_map": "M",
    "item_pirates_sword": "M",
    "item_pearl": "S",
    "item_crown": "M"
}

def get_image_width(fish_id):
    img_path = os.path.join(IMAGE_DIR, f"{fish_id}.png")
    if not os.path.exists(img_path):
        return 512
    try:
        with Image.open(img_path) as img:
            return img.width
    except:
        return 512

def process():
    with open(FISH_DATA_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    def replacer(match):
        full_line = match.group(0)
        fish_id = match.group(1)
        old_scale = match.group(2)
        
        if fish_id in CATEGORY_MAPPING:
            category = CATEGORY_MAPPING[fish_id]
            target_px = TARGET_SIZES[category]
            actual_px = get_image_width(fish_id)
            new_scale = round(target_px / actual_px, 4)
            return full_line.replace(f"scale: {old_scale}", f"scale: {new_scale}")
        
        return full_line

    new_content = re.sub(r"id:\s*'([a-zA-Z0-9_]+)'.*?scale:\s*([0-9.]+)", replacer, content, flags=re.DOTALL)

    with open(FISH_DATA_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print("FishData.js normalization with XS=70px FINAL targets complete.")

if __name__ == "__main__":
    process()
