import os
from PIL import Image
from rembg import remove

DEST_DIR = 'assets/images'

def fix_background(fish_id):
    path = os.path.join(DEST_DIR, f"{fish_id}.png")
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return

    try:
        img = Image.open(path).convert("RGBA")
        
        # 1. Remove background
        img_no_bg = remove(img)
        
        # 2. Resize and Pixelate
        img_no_bg.thumbnail((128, 128), Image.Resampling.LANCZOS)
        
        canvas = Image.new('RGBA', (128, 128), (0, 0, 0, 0))
        x_offset = (128 - img_no_bg.width) // 2
        y_offset = (128 - img_no_bg.height) // 2
        canvas.paste(img_no_bg, (x_offset, y_offset))
        
        # Pixelate
        small = canvas.resize((32, 32), Image.Resampling.NEAREST)
        pixelated = small.resize((128, 128), Image.Resampling.NEAREST)
        
        pixelated.save(path)
        print(f"Successfully fixed background for {fish_id}")
    except Exception as e:
        print(f"Error fixing {fish_id}: {e}")

if __name__ == "__main__":
    fix_background('fish_golden_koi')
    fix_background('fish_crucian')
