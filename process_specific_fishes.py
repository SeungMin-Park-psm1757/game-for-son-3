import os
import glob
from PIL import Image

def process_specific_fishes():
    brain_dir = r"C:\Users\QuIC\.gemini\antigravity\brain\36e99f12-93c5-4c82-bd07-9e86705f927e"
    assets_dir = r"c:\AI\my DeepL 2\game-for-son-3\assets\images"
    
    mapping = {
        "fish_crucian": "fish_crucian.png",
        "fish_mangdoong": "fish_mangdoong.png",
        "fish_cod": "fish_cod.png",
        "fish_cheongsaechi": "fish_cheongsaechi.png",
        "fish_chamdom": "fish_chamdom.png",
        "fish_boonguh": "fish_boonguh.png"
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
            # Resize to exactly 128x128 (Since these are Region 1-3 fishes)
            img_resized = img.resize((128, 128), Image.Resampling.LANCZOS)
            output_path = os.path.join(assets_dir, target_name)
            img_resized.save(output_path, "PNG")
            print(f"Saved {output_path}")
        except Exception as e:
            print(f"Error processing {prefix}: {e}")

if __name__ == "__main__":
    process_specific_fishes()
