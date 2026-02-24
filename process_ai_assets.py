import os
import sys
from PIL import Image, ImageDraw

def process_portrait(input_path, output_name):
    # output_name like 'char_dad.png'
    output_path = os.path.join('assets', 'images', output_name)
    print(f"Processing {input_path} -> {output_path}")
    
    img = Image.open(input_path).convert("RGBA")
    
    # Remove magenta background
    data = img.getdata()
    new_data = []
    # threshold for magenta (255, 0, 255)
    for item in data:
        dist = abs(item[0] - 255) + item[1] + abs(item[2] - 255)
        if dist < 120:  # Allow some variance
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    
    img.putdata(new_data)
    
    # Resize to 160x160 using Lanczos for downsampling high-res AI image
    img = img.resize((160, 160), Image.LANCZOS)
    img.save(output_path)
    print(f"Saved {output_path}")

def process_character_sprite(input_path):
    print(f"Processing character base: {input_path}")
    img_base = Image.open(input_path).convert("RGBA")
    
    data = img_base.getdata()
    new_data = []
    for item in data:
        dist = abs(item[0] - 255) + item[1] + abs(item[2] - 255)
        if dist < 120:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    
    img_base.putdata(new_data)
    img_base = img_base.resize((64, 64), Image.LANCZOS)

    def get_rod_config(lv):
        if lv >= 19: return (255, 20, 147, 255), 4, (255, 0, 255, 255), (218, 112, 214, 200) # 핑크/보라 궁극
        if lv >= 16: return (30, 144, 255, 255), 4, (0, 191, 255, 255), (135, 206, 250, 150)# 크리스탈 블루
        if lv >= 13: return (64, 224, 208, 255), 3, (0, 255, 255, 255), (0, 206, 209, 100) # 터콰이즈
        if lv >= 10: return (255, 215, 0, 255), 3, (218, 165, 32, 255), None   # 황금
        if lv >= 7: return (192, 192, 192, 255), 3, (169, 169, 169, 255), None # 은빛 (철)
        if lv >= 4: return (101, 67, 33, 255), 3, None, None           # 단단한 나무
        return (139, 69, 19, 255), 2, None, None           # 기본 나무

    for lv in range(1, 21):
        rod_col, rod_thick, deco_col, glow_col = get_rod_config(lv)
        
        # Create a new image by copying the base
        char_img = img_base.copy()
        draw = ImageDraw.Draw(char_img)

        # Draw the fishing rod ON TOP of the character image
        # Making the rod much larger and more prominent so the user can easily see it changes!
        rod_length = min(40 + lv, 60)
        start_x, start_y = 52, 42  # Pushed to the right and lower so the rod extends upwards
        end_x = start_x - 30       # Angle it diagonally leftwards, across the body
        end_y = start_y - rod_length
        
        # Glow
        if glow_col:
            draw.line([start_x, start_y, end_x, end_y], fill=glow_col, width=rod_thick+6)
            if lv >= 19:
                 draw.ellipse([end_x-12, end_y-12, end_x+12, end_y+12], fill=glow_col)

        # Rod Body
        # Make base rod thicker to be visible on 64x64
        draw.line([start_x, start_y, end_x, end_y], fill=rod_col, width=rod_thick+2)

        # Deco
        if deco_col:
            draw.ellipse([start_x-5, start_y-15, start_x+1, start_y-9], fill=deco_col)
            if lv >= 16:
                draw.polygon([(end_x-6, end_y), (end_x, end_y-8), (end_x+6, end_y), (end_x, end_y+6)], fill=deco_col)
            else:
                draw.ellipse([end_x-4, end_y-4, end_x+4, end_y+4], fill=deco_col)

        out_path = os.path.join('assets', 'images', f'char_lv{lv}.png')
        char_img.save(out_path)
        print(f"Saved {out_path}")

if __name__ == '__main__':
    dad_path = r'C:\Users\QuIC\.gemini\antigravity\brain\50fe2dff-bdda-46a4-b0da-423aef079172\portrait_dad_1771967403307.png'
    mom_path = r'C:\Users\QuIC\.gemini\antigravity\brain\50fe2dff-bdda-46a4-b0da-423aef079172\portrait_mom_black_1771969233618.png'
    jeongwoo_path = r'C:\Users\QuIC\.gemini\antigravity\brain\50fe2dff-bdda-46a4-b0da-423aef079172\portrait_jeongwoo_1771967438083.png'
    seyeon_path = r'C:\Users\QuIC\.gemini\antigravity\brain\50fe2dff-bdda-46a4-b0da-423aef079172\portrait_seyeon_1771967458136.png'
    char_base_path = r'C:\Users\QuIC\.gemini\antigravity\brain\50fe2dff-bdda-46a4-b0da-423aef079172\char_base_jeongwoo_1771967474428.png'

    os.makedirs(os.path.join('assets', 'images'), exist_ok=True)

    process_portrait(dad_path, 'char_dad.png')
    process_portrait(mom_path, 'char_mom.png')
    process_portrait(jeongwoo_path, 'char_jeongwoo.png')
    process_portrait(seyeon_path, 'char_seyeon.png')

    process_character_sprite(char_base_path)
    print("Done processing AI images!")
