import os
from PIL import Image, ImageDraw

def create_portrait(filename, char_type):
    width, height = 160, 160
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Common skin color
    skin = (255, 220, 180, 255)
    
    if char_type == 'dad':
        # --- 아빠 (젊은 모습, 군복, 안경) ---
        # Body (Military uniform)
        draw.rounded_rectangle([20, 100, 140, 160], radius=15, fill=(75, 83, 32, 255)) # Dark olive green
        # Uniform collar
        draw.polygon([(80, 100), (60, 120), (100, 120)], fill=(85, 107, 47, 255))
        
        # Head
        draw.ellipse([45, 30, 115, 110], fill=skin)
        
        # Hair (Black, younger)
        draw.ellipse([40, 20, 120, 60], fill=(30, 30, 30, 255))
        draw.polygon([(40, 50), (45, 70), (55, 50)], fill=(30, 30, 30, 255)) # Sideburns
        
        # Glasses (Black rim)
        draw.rectangle([50, 65, 75, 80], outline=(10, 10, 10, 255), width=3)
        draw.rectangle([85, 65, 110, 80], outline=(10, 10, 10, 255), width=3)
        draw.line([75, 72, 85, 72], fill=(10, 10, 10, 255), width=3)
        
        # Eyes
        draw.ellipse([58, 68, 66, 76], fill=(0, 0, 0, 255))
        draw.ellipse([93, 68, 101, 76], fill=(0, 0, 0, 255))
        
        # Mouth (Smile)
        draw.arc([65, 85, 95, 100], start=0, end=180, fill=(200, 100, 100, 255), width=3)
        
    elif char_type == 'mom':
        # --- 엄마 (젊은 모습) ---
        # Body (Black blouse/shirt)
        draw.rounded_rectangle([30, 110, 130, 160], radius=20, fill=(30, 30, 30, 255))
        
        # Back Hair (Long brown)
        draw.ellipse([30, 30, 130, 140], fill=(101, 67, 33, 255))
        
        # Head
        draw.ellipse([50, 40, 110, 110], fill=skin)
        
        # Front Hair (Bangs)
        draw.arc([45, 30, 115, 70], start=180, end=360, fill=(101, 67, 33, 255), width=20)
        draw.polygon([(50, 40), (70, 60), (90, 40)], fill=(101, 67, 33, 255))
        
        # Eyes (Bright, big)
        draw.ellipse([60, 65, 70, 75], fill=(0, 0, 0, 255))
        draw.ellipse([62, 67, 65, 70], fill=(255, 255, 255, 255)) # Sparkle
        draw.ellipse([90, 65, 100, 75], fill=(0, 0, 0, 255))
        draw.ellipse([92, 67, 95, 70], fill=(255, 255, 255, 255))
        
        # Mouth
        draw.arc([70, 85, 90, 100], start=0, end=180, fill=(255, 105, 180, 255), width=4)
        
    elif char_type == 'seyeon':
        # --- 세연 (긴 단발머리/양갈래) ---
        # Body (Mint shirt)
        draw.rounded_rectangle([40, 110, 120, 160], radius=15, fill=(0, 250, 154, 255))
        
        # Long Hair back (Black)
        draw.polygon([(30, 60), (130, 60), (140, 150), (20, 150)], fill=(20, 20, 20, 255))
        
        # Head
        draw.ellipse([50, 40, 110, 110], fill=skin)
        
        # Front Hair (Straight bangs)
        draw.rectangle([48, 35, 112, 55], fill=(20, 20, 20, 255))
        
        # Eyes (Cute)
        draw.ellipse([60, 70, 70, 80], fill=(0, 0, 0, 255))
        draw.ellipse([62, 72, 66, 76], fill=(255, 255, 255, 255))
        draw.ellipse([90, 70, 100, 80], fill=(0, 0, 0, 255))
        draw.ellipse([92, 72, 96, 76], fill=(255, 255, 255, 255))
        
        # Blush
        draw.ellipse([50, 80, 60, 90], fill=(255, 150, 150, 150))
        draw.ellipse([100, 80, 110, 90], fill=(255, 150, 150, 150))
        
        # Mouth
        draw.chord([72, 85, 88, 95], start=0, end=180, fill=(255, 100, 100, 255))
        
    elif char_type == 'jeongwoo':
        # --- 정우 (안경 착용) ---
        # Body (Blue shirt)
        draw.rounded_rectangle([35, 105, 125, 160], radius=15, fill=(65, 105, 225, 255))
        
        # Head
        draw.ellipse([45, 35, 115, 105], fill=skin)
        
        # Hair (Spiky / messy dark hair)
        draw.polygon([(40, 50), (55, 20), (70, 40), (85, 15), (100, 35), (120, 25), (115, 60), (45, 60)], fill=(40, 30, 20, 255))
        
        # Glasses (Round or slightly square, bright blue/gray frames)
        draw.ellipse([52, 60, 78, 86], outline=(70, 130, 180, 255), width=4)
        draw.ellipse([82, 60, 108, 86], outline=(70, 130, 180, 255), width=4)
        draw.line([78, 73, 82, 73], fill=(70, 130, 180, 255), width=3)
        
        # Eyes
        draw.ellipse([60, 68, 68, 76], fill=(0, 0, 0, 255))
        draw.ellipse([90, 68, 98, 76], fill=(0, 0, 0, 255))
        
        # Mouth (Big smile)
        draw.arc([65, 85, 95, 95], start=0, end=180, fill=(200, 50, 50, 255), width=3)

    # Convert to pixel art style by downscaling and upscaling (Optional, but gives it a retro vibe)
    # img = img.resize((40, 40), Image.NEAREST).resize((160, 160), Image.NEAREST)

    img.save(filename)
    print(f"[{filename}] Created.")

if __name__ == '__main__':
    base_dir = "assets/images"
    os.makedirs(base_dir, exist_ok=True)
    
    create_portrait(os.path.join(base_dir, "char_dad.png"), 'dad')
    create_portrait(os.path.join(base_dir, "char_mom.png"), 'mom')
    create_portrait(os.path.join(base_dir, "char_seyeon.png"), 'seyeon')
    create_portrait(os.path.join(base_dir, "char_jeongwoo.png"), 'jeongwoo')
