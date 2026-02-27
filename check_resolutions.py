import os
from PIL import Image

dir_path = r'c:\AI\my DeepL 2\game-for-son-3\assets\images'

def check_resolutions():
    print("Checking for low resolution images (< 128x128)...")
    low_res_files = []
    
    for filename in os.listdir(dir_path):
        if filename.endswith(".png") or filename.endswith(".jpg"):
            path = os.path.join(dir_path, filename)
            try:
                with Image.open(path) as img:
                    print(f"IMAGE: {filename} - {img.size}")
                    if img.width < 128 or img.height < 128:
                        low_res_files.append((filename, img.size))
                        print(f"LOW RES: {filename} - {img.size}")
            except Exception as e:
                print(f"Error reading {filename}: {e}")
                
    if not low_res_files:
        print("No low resolution images found. All images are at least 128x128.")
    
    return low_res_files

if __name__ == "__main__":
    check_resolutions()
