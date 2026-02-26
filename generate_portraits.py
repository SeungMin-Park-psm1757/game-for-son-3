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
        # --- 엄마 (검은 머리 파마, 검은 옷) ---
        # Body (Black clothes)
        draw.rounded_rectangle([30, 110, 130, 160], radius=20, fill=(30, 30, 30, 255))
        
        # Hair (Curly black hair)
        for i in range(10):
            draw.ellipse([25 + i*8, 30, 45 + i*8, 60], fill=(20, 20, 20, 255))
            draw.ellipse([25 + i*8, 50, 45 + i*8, 80], fill=(20, 20, 20, 255))
        draw.ellipse([30, 30, 130, 110], fill=(20, 20, 20, 255)) # Base hair
        
        # Head
        draw.ellipse([50, 45, 110, 115], fill=skin)
        
        # Eyes
        draw.ellipse([60, 70, 70, 80], fill=(0, 0, 0, 255))
        draw.ellipse([90, 70, 100, 80], fill=(0, 0, 0, 255))
        
        # Mouth
        draw.arc([70, 90, 90, 105], start=0, end=180, fill=(200, 80, 80, 255), width=3)
        
    elif char_type == 'seyeon':
        # --- 세연 (민트색 옷, 긴 생머리) ---
        # Body (Mint shirt)
        draw.rounded_rectangle([40, 110, 120, 160], radius=15, fill=(0, 250, 154, 255))
        
        # Long Hair back (Black)
        draw.rectangle([35, 60, 125, 155], fill=(20, 20, 20, 255))
        
        # Head
        draw.ellipse([50, 40, 110, 110], fill=skin)
        
        # Front Hair
        draw.rectangle([48, 35, 112, 55], fill=(20, 20, 20, 255))
        
        # Eyes
        draw.ellipse([60, 70, 70, 80], fill=(0, 0, 0, 255))
        draw.ellipse([90, 70, 100, 80], fill=(0, 0, 0, 255))
        
        # Mouth
        draw.chord([72, 85, 88, 95], start=0, end=180, fill=(255, 100, 100, 255))
        
    elif char_type == 'jeongwoo':
        # --- 정우 (안경 착용, 민트색 옷) ---
        # Body (Mint shirt - Seyeon's color)
        draw.rounded_rectangle([35, 105, 125, 160], radius=15, fill=(0, 250, 154, 255))
        
        # Head
        draw.ellipse([45, 35, 115, 105], fill=skin)
        
        # Hair 
        draw.polygon([(40, 50), (55, 20), (70, 40), (85, 15), (100, 35), (120, 25), (115, 60), (45, 60)], fill=(40, 30, 20, 255))
        
        # Glasses (Black frame)
        draw.rectangle([54, 62, 76, 74], outline=(10, 10, 10, 255), width=2)
        draw.rectangle([84, 62, 106, 74], outline=(10, 10, 10, 255), width=2)
        draw.line([76, 68, 84, 68], fill=(10, 10, 10, 255), width=2)
        
        # Eyes
        draw.ellipse([62, 65, 68, 71], fill=(0, 0, 0, 255))
        draw.ellipse([92, 65, 98, 71], fill=(0, 0, 0, 255))
        
        # Mouth
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
