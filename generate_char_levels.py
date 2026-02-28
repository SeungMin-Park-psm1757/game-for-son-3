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

def is_rod_pixel(r, g, b, a, x, y, width, height):
    # The rod in the new character image is composed of dark pixels (around 34, 33, 38)
    # It extends to the right side of the image.
    # Exclude transparent pixels
    if a == 0:
        return False
    
    # Rod color check (dark grey/blackish)
    if r < 80 and g < 80 and b < 80:
        # Spatial check: The rod is usually on the right side of the character
        # Let's assume right half (x > width * 0.4) and upper part (y < height * 0.7)
        if x > width * 0.4 and y < height * 0.8:
            return True
            
    return False

def generate_characters():
    base_img_path = r"c:\AI\my DeepL 2\game-for-son-3\assets\images\character.png"
    out_dir = r"c:\AI\my DeepL 2\game-for-son-3\assets\images"
    
    if not os.path.exists(base_img_path):
        print(f"File not found: {base_img_path}")
        return
        
    base_img = Image.open(base_img_path).convert("RGBA")
    width, height = base_img.size
    
    # 1. Find all rod pixels
    rod_pixels = set()
    pixels = base_img.load()
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if is_rod_pixel(r, g, b, a, x, y, width, height):
                rod_pixels.add((x, y))
                
    if not rod_pixels:
        print("Failed to detect rod pixels. Please check the color thresholds.")
        return
        
    print(f"Detected {len(rod_pixels)} rod pixels.")
    
    # Find bounding box of rod to calculate gradient (min_x to max_x)
    min_x = min(p[0] for p in rod_pixels)
    max_x = max(p[0] for p in rod_pixels)
    min_y = min(p[1] for p in rod_pixels)
    max_y = max(p[1] for p in rod_pixels)
    
    # Calculate distance for gradient
    max_dist = math.hypot(max_x - min_x, max_y - min_y)
    if max_dist == 0:
        max_dist = 1
        
    for lv in range(1, 21):
        img_copy = base_img.copy()
        new_pixels = img_copy.load()
        
        c1, c2 = create_gradient_rod(lv)
        
        for x, y in rod_pixels:
            # Gradient based on distance from the bottom-left of the rod
            dist = math.hypot(x - min_x, y - max_y)
            t = dist / max_dist
            t = max(0, min(1, t)) # Clamp 0-1
            
            # Additional glowing effect for higher levels (brightness variation)
            glow_factor = 1.0
            if lv >= 16:
                # Add some vertical banding or glowing
                glow_factor = 1.0 + 0.3 * math.sin((x + y) * 0.5)
            
            base_r, base_g, base_b, base_a = pixels[x, y]
            
            # The original pixel has some shading (it's not perfectly solid). 
            # We can use its lightness to preserve shading.
            lightness = sum([base_r, base_g, base_b]) / (3 * 255.0)
            # Normalize lightness to keep the rod structure (edges dark, center lighter)
            # The original rod is very dark (lightness ~ 0.13), so we scale it up
            shade_multiplier = lightness * 6.0 
            shade_multiplier = max(0.4, min(1.2, shade_multiplier))
            
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
