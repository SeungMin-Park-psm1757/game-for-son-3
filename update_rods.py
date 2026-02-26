import os
from PIL import Image, ImageDraw

def create_character():
    levels = [
        (1, (139, 69, 19, 255), 8, None, None),           # 기본 나무
        (4, (101, 67, 33, 255), 10, None, None),          # 단단한 나무
        (7, (192, 192, 192, 255), 10, (169, 169, 169, 255), None), # 은빛 (철)
        (10, (255, 215, 0, 255), 12, (218, 165, 32, 255), None),   # 황금
        (13, (64, 224, 208, 255), 12, (0, 255, 255, 255), (0, 206, 209, 100)), # 터콰이즈
        (16, (30, 144, 255, 255), 14, (0, 191, 255, 255), (135, 206, 250, 150)),# 크리스탈 블루
        (19, (255, 20, 147, 255), 16, (255, 0, 255, 255), (218, 112, 214, 200)) # 핑크/보라
    ]

    base_path = os.path.join("assets", "images", "char_jeongwoo.png")
    if not os.path.exists(base_path):
        print(f"{base_path} not found.")
        return

    base_img = Image.open(base_path).convert("RGBA")
    w, h = base_img.size
    
    for lv, rod_col, rod_thick, deco_col, glow_col in levels:
        img = base_img.copy()
        draw = ImageDraw.Draw(img)

        # Draw rod on the right side
        start_x = int(w * 0.8)
        start_y = int(h * 0.95)
        end_x = int(w * 0.85)
        end_y = int(h * 0.1)

        if glow_col:
            draw.line([start_x, start_y, end_x, end_y], fill=glow_col, width=rod_thick+12)
            if lv >= 19:
                draw.ellipse([end_x-20, end_y-20, end_x+20, end_y+20], fill=glow_col)

        draw.line([start_x, start_y, end_x, end_y], fill=rod_col, width=rod_thick)

        if deco_col:
            r = int(rod_thick * 1.5)
            if lv >= 16:
                draw.polygon([(end_x-r, end_y), (end_x, end_y-r-10), (end_x+r, end_y), (end_x, end_y+r+10)], fill=deco_col)
            else:
                draw.ellipse([end_x-r, end_y-r, end_x+r, end_y+r], fill=deco_col)

        out_name = f"char_lv{lv}.png"
        out_path = os.path.join("assets", "images", out_name)
        img.save(out_path)
        print(f"Created {out_path} (Level {lv})")

if __name__ == "__main__":
    create_character()
