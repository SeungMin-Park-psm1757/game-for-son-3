from PIL import Image, ImageDraw
import os

assets_dir = r"c:\AI\my DeepL 2\game-for-son-3\assets\images"
lv19_path = os.path.join(assets_dir, "char_lv19.png")
lv20_path = os.path.join(assets_dir, "char_lv20.png")

if not os.path.exists(lv19_path):
    print("Error: char_lv19.png not found")
else:
    # 1. Open char_lv19.png
    base_img = Image.open(lv19_path).convert("RGBA")
    
    # 2. Setup drawing context
    draw = ImageDraw.Draw(base_img)
    
    # 3. Draw a small crown on the top-left corner
    # The image is 128x128
    # Let's draw it around (10, 10)
    # A simple 3-point crown shape
    # Base: (10, 30) to (30, 30)
    # Left point: (10, 10)
    # Middle point: (20, 15)
    # Right point: (30, 10)
    
    crown_color = (255, 215, 0, 255) # Gold
    outline_color = (0, 0, 0, 255)   # Black outline
    
    # Coordinates of the crown polygon
    pts = [
        (10, 30), # bottom left
        (30, 30), # bottom right
        (30, 15), # right top
        (25, 23), # middle right dip
        (20, 12), # center top
        (15, 23), # middle left dip
        (10, 15), # left top
    ]
    
    draw.polygon(pts, fill=crown_color, outline=outline_color)
    
    # 4. Save as char_lv20.png
    base_img.save(lv20_path, "PNG")
    print(f"Successfully generated new char_lv20.png based on char_lv19.png with a top-left crown.")
