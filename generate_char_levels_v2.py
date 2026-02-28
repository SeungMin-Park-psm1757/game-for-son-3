import os
import math
from PIL import Image

def lerp_color(c1, c2, t):
    """Linearly interpolate between two RGBA colors."""
    return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))

def create_gradient_rod(lv):
    # Determine start and end colors based on level (1 to 20)
    # 1-3: Wood (brown to dark brown)
    # 4-7: Steel (grey to silver)
    # 8-11: Gold (yellow to gold)
    # 12-15: Crystal (cyan to blue)
    # 16-19: Energy (magenta to purple)
    # 20: Plasma/Legendary (rainbow or bright cyan/pink)
    
    if lv <= 3:
        c1 = (139, 69, 19, 255) # SaddleBrown
        c2 = (160, 82, 45, 255) # Sienna
    elif lv <= 7:
        c1 = (169, 169, 169, 255) # DarkGray
        c2 = (211, 211, 211, 255) # LightGray
    elif lv <= 11:
        c1 = (218, 165, 32, 255) # GoldenRod
        c2 = (255, 215, 0, 255)  # Gold
    elif lv <= 15:
        c1 = (0, 206, 209, 255) # DarkTurquoise
        c2 = (0, 255, 255, 255) # Cyan
    elif lv <= 19:
        c1 = (148, 0, 211, 255) # DarkViolet
        c2 = (255, 20, 147, 255) # DeepPink
    else:
        # Level 20: Legendary glowing
        c1 = (0, 255, 255, 255) # Cyan
        c2 = (255, 20, 147, 255) # Pink
        
    return c1, c2

def is_rod_pixel(r, g, b, a, x, y):
    # Only target the brown pixels of the rod based on our analysis
    if a == 0:
        return False
        
    if x > 50 and 80 < r < 190 and 40 < g < 130 and b < 90 and r > g:
        # Extra check: ensure it's not the skin color (skin R is usually > 200)
        if r < 200:
            return True
            
    return False

def generate_characters():
    base_img_path = r"c:\AI\my DeepL 2\game-for-son-3\assets\images\character.png"
    out_dir = r"c:\AI\my DeepL 2\game-for-son-3\assets\images"
    
    base_img = Image.open(base_img_path).convert("RGBA")
    width, height = base_img.size
    pixels = base_img.load()
    
    rod_pixels = set()
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if is_rod_pixel(r, g, b, a, x, y):
                rod_pixels.add((x, y))
                
    if not rod_pixels:
        print("Failed to detect brown rod pixels.")
        return
        
    print(f"Detected {len(rod_pixels)} brown rod pixels.")
    
    # Bounding box of rod
    min_x = min(p[0] for p in rod_pixels)
    max_x = max(p[0] for p in rod_pixels)
    min_y = min(p[1] for p in rod_pixels)
    max_y = max(p[1] for p in rod_pixels)
    
    max_dist = math.hypot(max_x - min_x, max_y - min_y)
    if max_dist == 0:
        max_dist = 1
        
    for lv in range(1, 21):
        img_copy = base_img.copy()
        new_pixels = img_copy.load()
        
        c1, c2 = create_gradient_rod(lv)
        
        for x, y in rod_pixels:
            # Gradient goes from bottom-left (hand) to top-right
            dist = math.hypot(x - min_x, y - max_y)
            t = dist / max_dist
            t = max(0, min(1, t))
            
            glow_factor = 1.0
            if lv >= 16:
                # Magic/Energy visual bands
                glow_factor = 1.0 + 0.3 * math.sin((x + y) * 0.5)
            
            base_r, base_g, base_b, base_a = pixels[x, y]
            
            # Use Original brown lightness to keep pixel art shading and wood grain
            lightness = sum([base_r, base_g, base_b]) / (3 * 255.0)
            # The brown rod lightness is around 0.3-0.5, so normalize around that
            shade_multiplier = (lightness / 0.4) 
            shade_multiplier = max(0.4, min(1.5, shade_multiplier))
            
            grad_color = lerp_color(c1, c2, t)
            
            final_r = min(255, int(grad_color[0] * shade_multiplier * glow_factor))
            final_g = min(255, int(grad_color[1] * shade_multiplier * glow_factor))
            final_b = min(255, int(grad_color[2] * shade_multiplier * glow_factor))
            
            new_pixels[x, y] = (final_r, final_g, final_b, base_a)
            
        out_path = os.path.join(out_dir, f"char_lv{lv}.png")
        img_copy.save(out_path, "PNG")
        print(f"Generated {out_path} (Level {lv})")

if __name__ == "__main__":
    generate_characters()
