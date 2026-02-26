import os
import glob
from PIL import Image
from rembg import remove

ARTIFACT_DIR = r"C:\Users\QuIC\.gemini\antigravity\brain\b77eeac2-62c5-4cf8-98b9-64f43448a353"
DEST_DIR = r"c:\AI\my DeepL 2\game-for-son-3\assets\images"

# The 10 fishes requested for higher resolution
FISHES_TO_PROCESS = [
    "fish_pirami",
    "fish_pollack",
    "fish_salmon",
    "fish_saury",
    "fish_spanish_mackerel",
    "fish_squid",
    "fish_ssogari",
    "fish_striped_jewfish",
    "fish_sunfish",
    "fish_tuna"
]

def find_latest_artifact(prefix):
    # Find the most recently generated file for this fish
    pattern = os.path.join(ARTIFACT_DIR, f"{prefix}*.png")
    matches = glob.glob(pattern)
    if not matches:
        return None
    # Sort by modification time to get the newest
    matches.sort(key=os.path.getmtime, reverse=True)
    return matches[0]

def process_high_res():
    for f in FISHES_TO_PROCESS:
        src = find_latest_artifact(f)
        if not src:
            print(f"Source not found for {f}!")
            continue
            
        print(f"Processing high-res for {f} using {os.path.basename(src)}...")
        try:
            img = Image.open(src).convert("RGBA")
            img_no_bg = remove(img)
            
            bbox = img_no_bg.getbbox()
            if bbox:
                img_no_bg = img_no_bg.crop(bbox)
            
            # We skip the 32x32 downsampling completely!
            # We directly resize the cropped fish to 256x256 using LANCZOS for maximum sharpness and detail.
            # Then we can paste it on a 256x256 canvas.
            
            size = 256
            img_no_bg.thumbnail((size, size), Image.Resampling.LANCZOS)
            
            canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
            x_offset = (size - img_no_bg.width) // 2
            y_offset = (size - img_no_bg.height) // 2
            
            canvas.paste(img_no_bg, (x_offset, y_offset))
            
            dest = os.path.join(DEST_DIR, f"{f}.png")
            canvas.save(dest)
            print(f"Saved high-res {f}.png")
            
        except Exception as e:
            print(f"Failed to process {f}: {e}")

if __name__ == "__main__":
    process_high_res()
