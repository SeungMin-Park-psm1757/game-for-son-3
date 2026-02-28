from PIL import Image
import os

files = ['char_dad.png', 'char_mom.png', 'char_seyeon.png', 'char_shopkeeper.png']
for f in files:
    img_path = f'assets/images/{f}'
    img = Image.open(img_path).convert("RGBA")
    
    # Save a backup just in case
    backup_path = f'assets/images/backup_{f}'
    if not os.path.exists(backup_path):
        img.save(backup_path)
    
    # Attempt 1: Just saving with optimize=True
    img.save(img_path, optimize=True)
    size_kb = os.path.getsize(img_path) / 1024
    
    # If still > 150, apply quantization
    if size_kb > 150:
        quantized = img.quantize(colors=256, method=2)
        quantized.save(img_path, optimize=True)
        size_kb = os.path.getsize(img_path) / 1024
        
    print(f"{f}: {size_kb:.2f} KB")

# If it drops below 50, maybe we can try varying colors slightly but usually it's fine.
