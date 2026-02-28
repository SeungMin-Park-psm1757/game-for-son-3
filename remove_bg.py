import os
from PIL import Image, ImageDraw

image_dir = r"c:\AI\my DeepL 2\game-for-son-3\assets\images"

def remove_background(filepath):
    try:
        img = Image.open(filepath).convert("RGBA")
        width, height = img.size
        
        # Check corners to see if they are a solid non-transparent background
        corners = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
        processed = False
        
        for cx, cy in corners:
            bg_pixel = img.getpixel((cx, cy))
            # If the pixel is not transparent, we flood fill from it
            if bg_pixel[3] > 0:
                ImageDraw.floodfill(img, xy=(cx, cy), value=(255, 255, 255, 0), thresh=5)
                processed = True
                
        if processed:
            img.save(filepath, "PNG")
            print(f"Transformed background to transparent: {os.path.basename(filepath)}")
            
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

if __name__ == "__main__":
    count = 0
    for filename in os.listdir(image_dir):
        if filename.endswith(".png") and (filename.startswith("item_") or filename.startswith("fish_")):
            filepath = os.path.join(image_dir, filename)
            remove_background(filepath)
            count += 1
    print(f"Processed {count} image files.")
