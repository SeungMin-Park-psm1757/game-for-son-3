import os
from PIL import Image
import colorsys

DEST_DIR = r'c:\AI\my DeepL 2\game-for-son-3\assets\images'
BASE_CHAR_PATH = os.path.join(DEST_DIR, 'character.png')

def hue_shift_image(image, shift_amount):
    """Shifts the hue of an image by a given amount (0.0 to 1.0)"""
    img_hsv = image.convert('HSV')
    pixels = img_hsv.load()
    width, height = img_hsv.size
    
    for y in range(height):
        for x in range(width):
            h, s, v = pixels[x, y]
            new_h = int((h + (shift_amount * 255)) % 256)
            pixels[x, y] = (new_h, s, v)
            
    img_rgb = img_hsv.convert('RGB')
    r, g, b = img_rgb.split()
    _, _, _, a = image.split()
    return Image.merge('RGBA', (r, g, b, a))

def create_level_variants():
    if not os.path.exists(BASE_CHAR_PATH):
        print(f"Base character image not found at {BASE_CHAR_PATH}")
        return

    try:
        base_img = Image.open(BASE_CHAR_PATH).convert("RGBA")
        print(f"Base image size: {base_img.size}")
        
        # We need levels 1 through 19
        levels = list(range(1, 20))
        
        for i, lvl in enumerate(levels):
            # Calculate hue shift amount (0.0 to ~0.9)
            shift = (i * (1.0 / len(levels)))
            
            if shift == 0.0:
                variant_img = base_img.copy()
            else:
                variant_img = hue_shift_image(base_img, shift)
                
            out_path = os.path.join(DEST_DIR, f'char_lv{lvl}.png')
            variant_img.save(out_path)
            print(f"Created variant for Level {lvl}: {out_path} (Size: {variant_img.size})")
            
    except Exception as e:
        print(f"Error creating level variants: {e}")

if __name__ == "__main__":
    create_level_variants()
