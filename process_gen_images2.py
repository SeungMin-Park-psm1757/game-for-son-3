import os
import glob
import time
from PIL import Image

def process_images():
    brain_dir = r"C:\Users\QuIC\.gemini\antigravity\brain\36e99f12-93c5-4c82-bd07-9e86705f927e"
    assets_dir = r"c:\AI\my DeepL 2\game-for-son-3\assets\images"
    
    mapping = {
        "item_shoe": "item_shoe.png"
    }
    
    for prefix, target_name in mapping.items():
        pattern = os.path.join(brain_dir, f"{prefix}_*.png")
        files = glob.glob(pattern)
        if not files:
            continue
        
        latest_file = max(files, key=os.path.getctime)
        print(f"Processing {latest_file} to {target_name}")
        
        try:
            img = Image.open(latest_file).convert("RGBA")
            datas = img.getdata()
            
            newData = []
            for item in datas:
                if item[0] > 240 and item[1] > 240 and item[2] > 240:
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

print("Processing second batch of images...")
process_images()
print("Waiting for quota to reset (60s)...")
time.sleep(60)
print("Done waiting.")
