import os
import glob
from PIL import Image

def process_region4_final_batch():
    brain_dir = r"C:\Users\QuIC\.gemini\antigravity\brain\36e99f12-93c5-4c82-bd07-9e86705f927e"
    assets_dir = r"c:\AI\my DeepL 2\game-for-son-3\assets\images"
    
    mapping = {
        "fish_coelacanth": "fish_coelacanth.png",
        "fish_golden_fish": "fish_golden_fish.png",
        "item_treasure_map": "item_treasure_map.png",
        "item_pirates_sword": "item_pirates_sword.png",
        "item_pearl": "item_pearl.png",
        "item_crown": "item_crown.png"
    }
    
    for prefix, target_name in mapping.items():
        pattern = os.path.join(brain_dir, f"{prefix}_*.png")
        files = glob.glob(pattern)
        if not files:
            print(f"No file found for {prefix}")
            continue
        
        latest_file = max(files, key=os.path.getctime)
        print(f"Processing {latest_file} to {target_name}")
        
        try:
            img = Image.open(latest_file).convert("RGBA")
            datas = img.getdata()
            
            newData = []
            for item in datas:
                # removing white background (very lightly tolerant)
                if item[0] > 230 and item[1] > 230 and item[2] > 230:
                    newData.append((255, 255, 255, 0))
                else:
                    newData.append(item)
                    
            img.putdata(newData)
            # Resize to exactly 64x64
            img_resized = img.resize((64, 64), Image.Resampling.LANCZOS)
            output_path = os.path.join(assets_dir, target_name)
            img_resized.save(output_path, "PNG")
            print(f"Saved {output_path}")
        except Exception as e:
            print(f"Error processing {prefix}: {e}")

if __name__ == "__main__":
    process_region4_final_batch()
