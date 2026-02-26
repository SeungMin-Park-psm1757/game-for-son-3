import os
from PIL import Image

image_filenames = [
    "fish_golden_koi.png",
    "fish_monkfish.png",
    "fish_urock.png",
    "fish_whale_shark.png",
    "item_shoe.png",
    "item_trash.png",
    "item_treasure.png",
    "lure.png",
    "fish_bangeo.png",
    "fish_godeungeo.png"
]

images_dir = os.path.join("assets", "images")

for filename in image_filenames:
    filepath = os.path.join(images_dir, filename)
    if os.path.exists(filepath):
        try:
            with Image.open(filepath) as img:
                # Resize to 128x128 using LANCZOS for high quality
                resized_img = img.resize((128, 128), Image.Resampling.LANCZOS)
                resized_img.save(filepath)
                print(f"Resized {filename} to 128x128.")
        except Exception as e:
            print(f"Error resizing {filename}: {e}")
    else:
        print(f"File not found: {filepath}")
