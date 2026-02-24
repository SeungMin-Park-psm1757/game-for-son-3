import os
from PIL import Image
from rembg import remove

DEST_DIR = r'c:\AI\my DeepL 2\game-for-son-3\assets\images'

IMAGES_TO_PROCESS = [
    {
        'src': r'C:\Users\QuIC\.gemini\antigravity\brain\b77eeac2-62c5-4cf8-98b9-64f43448a353\fish_sunfish_1771966250970.png',
        'dest': 'fish_sunfish.png',
        'size': 128,
        'pixelate_size': 32
    },
    {
        'src': r'C:\Users\QuIC\.gemini\antigravity\brain\b77eeac2-62c5-4cf8-98b9-64f43448a353\fish_monkfish_1771966273840.png',
        'dest': 'fish_monkfish.png',
        'size': 128,
        'pixelate_size': 32
    },
    {
        'src': r'C:\Users\QuIC\.gemini\antigravity\brain\b77eeac2-62c5-4cf8-98b9-64f43448a353\fish_gwangeo_1771966295619.png',
        'dest': 'fish_gwangeo.png',
        'size': 128,
        'pixelate_size': 32
    },
    {
        'src': r'C:\Users\QuIC\.gemini\antigravity\brain\b77eeac2-62c5-4cf8-98b9-64f43448a353\fish_galchi_1771966312055.png',
        'dest': 'fish_galchi.png',
        'size': 128,
        'pixelate_size': 32
    },
    {
        'src': r'C:\Users\QuIC\.gemini\antigravity\brain\b77eeac2-62c5-4cf8-98b9-64f43448a353\fish_gamulchi_1771966330811.png',
        'dest': 'fish_gamulchi.png',
        'size': 128,
        'pixelate_size': 32
    }
]

def process_img():
    for item in IMAGES_TO_PROCESS:
        src = item['src']
        dest = item['dest']
        size = item['size']
        px_size = item['pixelate_size']
        
        if not os.path.exists(src):
            print(f"Skipping {src} - not found.")
            continue
            
        print(f"Processing {dest}...")
        try:
            img = Image.open(src).convert("RGBA")
            img_no_bg = remove(img)
            
            bbox = img_no_bg.getbbox()
            if bbox:
                img_no_bg = img_no_bg.crop(bbox)
            
            img_no_bg.thumbnail((size, size), Image.Resampling.LANCZOS)
            
            canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
            x_offset = (size - img_no_bg.width) // 2
            y_offset = (size - img_no_bg.height) // 2 # Center
                
            canvas.paste(img_no_bg, (x_offset, y_offset))
            
            small = canvas.resize((px_size, px_size), Image.Resampling.NEAREST)
            pixelated = small.resize((size, size), Image.Resampling.NEAREST)
            
            out_path = os.path.join(DEST_DIR, dest)
            pixelated.save(out_path)
            print(f"Saved to {out_path}")
            
        except Exception as e:
            print(f"Failed to process {dest}: {e}")

if __name__ == "__main__":
    process_img()
