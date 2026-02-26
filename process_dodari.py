import os
import glob
from PIL import Image

def process_dodari():
    brain_dir = r"C:\Users\QuIC\.gemini\antigravity\brain\36e99f12-93c5-4c82-bd07-9e86705f927e"
    assets_dir = r"c:\AI\my DeepL 2\game-for-son-3\assets\images"
    
    pattern = os.path.join(brain_dir, "fish_flounder_*.png")
    files = glob.glob(pattern)
    if not files:
        print("No dodari file found")
        return
    
    latest_file = max(files, key=os.path.getctime)
    target_name = "fish_flounder.png"
    print(f"Processing {latest_file} to {target_name}")
    
    try:
        img = Image.open(latest_file).convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            # removing whiteish background
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

process_dodari()
