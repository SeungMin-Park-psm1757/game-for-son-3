import os
import glob
from PIL import Image

def process_images():
    brain_dir = r"C:\Users\QuIC\.gemini\antigravity\brain\36e99f12-93c5-4c82-bd07-9e86705f927e"
    assets_dir = r"c:\AI\my DeepL 2\game-for-son-3\assets\images"
    
    mapping = {
        "fish_golden_koi": "fish_golden_koi.png",
        "fish_monkfish": "fish_monkfish.png",
        "fish_urock": "fish_urock.png",
        "fish_whale_shark": "fish_whale_shark.png",
        "item_shoe": "item_shoe.png",
        "item_trash": "item_trash.png",
        "item_treasure": "item_treasure.png",
        "lure": "lure.png",
        "fish_bangeo": "fish_bangeo.png",
        "fish_godeungeo": "fish_godeungeo.png"
    }
    
    for prefix, target_name in mapping.items():
        pattern = os.path.join(brain_dir, f"{prefix}_*.png")
        files = glob.glob(pattern)
        if not files:
            print(f"No generated file found for {prefix}")
            continue
        
        latest_file = max(files, key=os.path.getctime)
        print(f"Processing {latest_file} to {target_name}")
        
        try:
            img = Image.open(latest_file).convert("RGBA")
            datas = img.getdata()
            
            newData = []
            for item in datas:
                if item[0] > 230 and item[1] > 230 and item[2] > 230:
                    newData.append((255, 255, 255, 0))
                else:
                    newData.append(item)
                    
            img.putdata(newData)
            img_resized = img.resize((128, 128), Image.Resampling.LANCZOS)
            output_path = os.path.join(assets_dir, target_name)
            img_resized.save(output_path, "PNG")
            print(f"Saved {output_path}")
        except Exception as e:
            print(f"Error: {e}")

process_images()
