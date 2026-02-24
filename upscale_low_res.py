import os
from PIL import Image

DEST_DIR = r'c:\AI\my DeepL 2\game-for-son-3\assets\images'

def upscale_image(filename, target_size=128):
    path = os.path.join(DEST_DIR, filename)
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return
        
    try:
        img = Image.open(path).convert("RGBA")
        if img.width >= target_size and img.height >= target_size:
            print(f"Skipping {filename}: already at or above {target_size}x{target_size} ({img.size})")
            return
            
        # Upscale using Nearest Neighbor to preserve crisp pixel edges
        new_img = img.resize((target_size, target_size), Image.Resampling.NEAREST)
        new_img.save(path)
        print(f"Upscaled {filename} from {img.size} to {new_img.size}")
        
    except Exception as e:
        print(f"Failed to upscale {filename}: {e}")

if __name__ == "__main__":
    upscale_image('item_trash.png')
    upscale_image('item_treasure.png')
    upscale_image('lure.png')
