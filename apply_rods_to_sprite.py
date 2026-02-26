import os
import glob
from PIL import Image, ImageDraw

def process_base_sprite():
    brain_dir = r"C:\Users\QuIC\.gemini\antigravity\brain\50fe2dff-bdda-46a4-b0da-423aef079172"
    dest_dir = r"c:\AI\my DeepL 2\game-for-son-3\assets\images"
    
    pattern = os.path.join(brain_dir, "base_char_sprite_*.png")
    files = glob.glob(pattern)
    if not files:
        print("Base sprite not found.")
        return
    
    latest_img_path = max(files, key=os.path.getmtime)
    base_img = Image.open(latest_img_path).convert("RGBA")
    
    # 1. Resize to 128x128 for consistency game scale
    base_img = base_img.resize((128, 128), Image.NEAREST)
    
    # 2. Remove white background (and soft anti-aliased edges to transparent)
    w, h = base_img.size
    data = base_img.getdata()
    new_data = []
    # simple white threshold removal
    for item in data:
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    base_img.putdata(new_data)
    
    # Levels logic
    levels = [
        (1, 3, (139, 69, 19, 255), 4, None, None),           # 기본 나무
        (4, 6, (101, 67, 33, 255), 6, None, None),          # 단단한 나무
        (7, 9, (192, 192, 192, 255), 6, (169, 169, 169, 255), None), # 은빛 (철)
        (10, 12, (255, 215, 0, 255), 6, (218, 165, 32, 255), None),   # 황금
        (13, 15, (64, 224, 208, 255), 8, (0, 255, 255, 255), (0, 206, 209, 100)), # 터콰이즈
        (16, 18, (30, 144, 255, 255), 8, (0, 191, 255, 255), (135, 206, 250, 150)),# 크리스탈 블루
        (19, 20, (255, 20, 147, 255), 10, (255, 0, 255, 255), (218, 112, 214, 200)) # 핑크/보라
    ]
    
    levels_dict = {}
    for start, end, rod_col, rod_thick, deco_col, glow_col in levels:
        for lv in range(start, end + 1):
            levels_dict[lv] = (rod_col, rod_thick, deco_col, glow_col)
            
    for lv in range(1, 21):
        rod_col, rod_thick, deco_col, glow_col = levels_dict[lv]
        
        img_copy = base_img.copy()
        draw = ImageDraw.Draw(img_copy)
        
        # Position the rod: Assume hands are around (w*0.6, h*0.5)
        # Rod goes from hands to top right or extending further
        start_x = int(w * 0.45)
        start_y = int(h * 0.55)
        
        end_x = int(w * 0.85)
        end_y = int(h * 0.15)
        
        # Extend length slightly by level
        end_x += int(lv * 1.5)
        end_y -= int(lv * 1.5)

        # Drawing glow
        if glow_col:
            draw.line([start_x, start_y, end_x, end_y], fill=glow_col, width=rod_thick+12)
            if lv >= 19:
                draw.ellipse([end_x-15, end_y-15, end_x+15, end_y+15], fill=glow_col)

        # Draw main rod
        draw.line([start_x, start_y, end_x, end_y], fill=rod_col, width=rod_thick)

        # Draw decorations
        if deco_col:
            r = int(rod_thick * 1.5)
            if lv >= 16:
                draw.polygon([(end_x-r, end_y), (end_x, end_y-r-8), (end_x+r, end_y), (end_x, end_y+r+8)], fill=deco_col)
            else:
                draw.ellipse([end_x-r, end_y-r, end_x+r, end_y+r], fill=deco_col)

        
        out_name = f"char_lv{lv}.png"
        out_path = os.path.join(dest_dir, out_name)
        img_copy.save(out_path)
        print(f"Created {out_name}")
        
        if lv == 1:
            img_copy.save(os.path.join(dest_dir, "character.png"))
            
if __name__ == "__main__":
    process_base_sprite()
