import os
import glob
from PIL import Image
from rembg import remove

ARTIFACT_DIR = r"C:\Users\QuIC\.gemini\antigravity\brain\b77eeac2-62c5-4cf8-98b9-64f43448a353"
DEST_DIR = r"c:\AI\my DeepL 2\game-for-son-3\assets\images"

FISH_TO_UPSCALE = [
    'fish_boonguh',
    'fish_cheongsaechi',
    'fish_cod',
    'fish_galchi',
    'fish_gamulchi',
    'fish_godeungeo',
    'fish_golden_koi',
    'fish_gwangeo',
    'fish_bangeo'
]

def find_latest_artifact(prefix):
    pattern = os.path.join(ARTIFACT_DIR, f"{prefix}*.png")
    matches = glob.glob(pattern)
    if not matches:
        return None
    matches.sort(key=os.path.getmtime, reverse=True)
    return matches[0]

def upscale_fishes():
    for f in FISH_TO_UPSCALE:
        artifact_src = find_latest_artifact(f)
        dest_path = os.path.join(DEST_DIR, f"{f}.png")
        
        try:
            if artifact_src:
                print(f"Processing from artifact: {artifact_src}")
                img = Image.open(artifact_src).convert("RGBA")
                img_no_bg = remove(img)
                bbox = img_no_bg.getbbox()
                if bbox:
                    img_no_bg = img_no_bg.crop(bbox)
                
                size = 128
                img_no_bg.thumbnail((size, size), Image.Resampling.LANCZOS)
                canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
                x_offset = (size - img_no_bg.width) // 2
                y_offset = (size - img_no_bg.height) // 2
                canvas.paste(img_no_bg, (x_offset, y_offset))
                canvas.save(dest_path)
                print(f"Saved {f}.png from artifact to 128x128")
                
            elif os.path.exists(dest_path):
                print(f"No artifact found for {f}. Processing from DEST_DIR: {dest_path}")
                img = Image.open(dest_path).convert("RGBA")
                current_w, current_h = img.size
                if current_w != 128 or current_h != 128:
                    upscaled = img.resize((128, 128), Image.Resampling.NEAREST)
                    upscaled.save(dest_path)
                    print(f"Upscaled {f}.png from {current_w}x{current_h} to 128x128")
                else:
                    print(f"{f}.png is already 128x128")
            else:
                print(f"Image not found anywhere: {f}")
        except Exception as e:
            print(f"Failed to process {f}: {e}")

if __name__ == "__main__":
    upscale_fishes()
