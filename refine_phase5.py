import os
from PIL import Image, ImageOps
from rembg import remove

DEST_DIR = r'c:\AI\my DeepL 2\game-for-son-3\assets\images'

def process_dad():
    src = r'C:\Users\QuIC\.gemini\antigravity\brain\b77eeac2-62c5-4cf8-98b9-64f43448a353\char_dad_1771967809276.png'
    dest = os.path.join(DEST_DIR, 'char_dad.png')
    size = 256
    px_size = 128
    
    if not os.path.exists(src):
        print(f"Dad source not found: {src}")
        return
        
    print("Processing char_dad.png with background removal...")
    img = Image.open(src).convert("RGBA")
    img_no_bg = remove(img)
    
    bbox = img_no_bg.getbbox()
    if bbox:
        img_no_bg = img_no_bg.crop(bbox)
    
    img_no_bg.thumbnail((size, size), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    x_offset = (size - img_no_bg.width) // 2
    y_offset = size - img_no_bg.height # Align bottom
    canvas.paste(img_no_bg, (x_offset, y_offset))
    
    small = canvas.resize((px_size, px_size), Image.Resampling.NEAREST)
    pixelated = small.resize((size, size), Image.Resampling.NEAREST)
    
    pixelated.save(dest)
    print("Dad portrait generated and saved.")

def fix_fisherman():
    print("Fixing Fisherman (Flip Vertical based on char_lv1)")
    base_src = os.path.join(DEST_DIR, 'char_lv1.png')
    if not os.path.exists(base_src):
        print(f"char_lv1.png not found at {base_src}")
        return
        
    base_img = Image.open(base_src).convert("RGBA")
    # "상하반전" -> vertical flip
    flipped_img = ImageOps.flip(base_img)
    
    # Overwrite character.png (140x140 was the base, lv1 was 140x140 too from Phase 4)
    flipped_img.save(os.path.join(DEST_DIR, 'character.png'))
    print("Saved flipped character.png")
    
    # Overwrite lv1 ~ lv19 with the EXACT same flipped image to maintain absolute consistency
    for i in range(1, 20):
        dest = os.path.join(DEST_DIR, f'char_lv{i}.png')
        flipped_img.save(dest)
        
    print("Saved all flipped char_lv1 through char_lv19 variants.")

if __name__ == "__main__":
    process_dad()
    fix_fisherman()
