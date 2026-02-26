import os
from PIL import Image, ImageDraw

def generate_6stage_char():
    dest_dir = r"c:\AI\my DeepL 2\game-for-son-3\assets\images"
    base_char_path = os.path.join(dest_dir, "character.png")
    
    if not os.path.exists(base_char_path):
        print(f"Error: Base image not found at {base_char_path}")
        return
        
    base_img = Image.open(base_char_path).convert("RGBA")
    w, h = base_img.size
    
    # Define the 6 stages explicitly
    # Format: (Lv Start, Lv End, Rod Color, Rod Thickness, Deco Color, Glow Color)
    stages = [
        (1, 3, (139, 69, 19, 255), 4, None, None),                         # Stage 1: Basic Wooden Rod
        (4, 6, (101, 67, 33, 255), 6, None, None),                         # Stage 2: Reinforced Rod (Dark Brown)
        (7, 10, (192, 192, 192, 255), 6, (169, 169, 169, 255), None),      # Stage 3: Silver Rod
        (11, 14, (255, 215, 0, 255), 6, (218, 165, 32, 255), None),        # Stage 4: Golden Rod
        (15, 17, (64, 224, 208, 255), 8, (0, 255, 255, 255), (0, 206, 209, 100)), # Stage 5: Crystal Rod (Cyan)
        (18, 20, (255, 20, 147, 255), 10, (255, 0, 255, 255), (218, 112, 214, 200)) # Stage 6: Legendary Rod (Pink/Purple)
    ]
    
    # Map levels to stage configurations
    levels_dict = {}
    for start, end, rod_col, rod_thick, deco_col, glow_col in stages:
        for lv in range(start, end + 1):
            levels_dict[lv] = (rod_col, rod_thick, deco_col, glow_col)
            
    for lv in range(1, 21):
        rod_col, rod_thick, deco_col, glow_col = levels_dict[lv]
        
        img_copy = base_img.copy()
        draw = ImageDraw.Draw(img_copy)
        
        # Position the rod: Assume hands are around (w*0.45, h*0.55)
        start_x = int(w * 0.45)
        start_y = int(h * 0.55)
        
        end_x = int(w * 0.85)
        end_y = int(h * 0.15)
        
        # Extend length slightly by level to show progression
        end_x += int(lv * 1.5)
        end_y -= int(lv * 1.5)

        # Drawing glow
        if glow_col:
            draw.line([start_x, start_y, end_x, end_y], fill=glow_col, width=rod_thick+12)
            if lv >= 15: # Add extra glow effect at the top of the rod for Stage 5 & 6
                glow_radius = 15 if lv < 18 else 25 # Bigger radius for stage 6
                draw.ellipse([end_x-glow_radius, end_y-glow_radius, end_x+glow_radius, end_y+glow_radius], fill=glow_col)

        # Draw main rod
        draw.line([start_x, start_y, end_x, end_y], fill=rod_col, width=rod_thick)

        # Draw decorations
        if deco_col:
            r = int(rod_thick * 1.5)
            if lv >= 18: 
                # Legendary rod gets a fancier diamond decoration at the tip
                draw.polygon([(end_x-r, end_y), (end_x, end_y-r-12), (end_x+r, end_y), (end_x, end_y+r+10)], fill=deco_col)
                # Plus a small inner gem
                draw.ellipse([end_x-2, end_y-2, end_x+2, end_y+2], fill=(255, 255, 255, 255))
            elif lv >= 15:
                # Crystal rod gets a diamond decoration
                draw.polygon([(end_x-r, end_y), (end_x, end_y-r-8), (end_x+r, end_y), (end_x, end_y+r+8)], fill=deco_col)
            else:
                # Silver and gold rods get spherical decorations
                draw.ellipse([end_x-r, end_y-r, end_x+r, end_y+r], fill=deco_col)
                
        # Optional: Add a simple aesthetic Crown to the character head for Level 20 max level
        if lv == 20:
             # Assuming head is around top-center (w*0.5, h*0.2)
             crown_color = (255, 215, 0, 255) # Gold
             crown_x = int(w * 0.45)
             crown_y = int(h * 0.25)
             
             draw.polygon([
                 (crown_x - 10, crown_y),
                 (crown_x - 15, crown_y - 15),
                 (crown_x -  5, crown_y -  5),
                 (crown_x     , crown_y - 18),
                 (crown_x +  5, crown_y -  5),
                 (crown_x + 15, crown_y - 15),
                 (crown_x + 10, crown_y)
             ], fill=crown_color)

        out_name = f"char_lv{lv}.png"
        out_path = os.path.join(dest_dir, out_name)
        img_copy.save(out_path)
        print(f"Created {out_name} (Level {lv}, Size: {img_copy.size})")

if __name__ == "__main__":
    generate_6stage_char()
