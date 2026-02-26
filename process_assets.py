import os
import glob
import shutil
from PIL import Image

brain_dir = r"C:\Users\QuIC\.gemini\antigravity\brain\50fe2dff-bdda-46a4-b0da-423aef079172"
dest_dir = r"c:\AI\my DeepL 2\game-for-son-3\assets\images"

chars = ['char_dad', 'char_mom', 'char_jeongwoo', 'char_seyeon', 'lure_new']

print("--- Copying Generated Images ---")
for char in chars:
    pattern = os.path.join(brain_dir, f"{char}_*.png")
    files = glob.glob(pattern)
    if files:
        latest = max(files, key=os.path.getmtime)
        dest_filename = f"{char.replace('_new', '')}.png"
        dest_path = os.path.join(dest_dir, dest_filename)
        shutil.copy2(latest, dest_path)
        print(f"Copied {latest} to {dest_filename}")

print("\n--- Upscaling Images < 30KB ---")
for filename in os.listdir(dest_dir):
    if filename.endswith(".png"):
        filepath = os.path.join(dest_dir, filename)
        size = os.path.getsize(filepath)
        if size < 30000:
            print(f"Upscaling {filename} (Current size: {size // 1024} KB)")
            try:
                with Image.open(filepath) as img:
                    current_img = img.convert("RGBA")
                    attempts = 0
                    while True:
                        new_w, new_h = current_img.width * 2, current_img.height * 2
                        if new_w > 2048 or new_h > 2048 or attempts > 4:
                            break # Prevent excessive memory usage
                        current_img = current_img.resize((new_w, new_h), Image.NEAREST)
                        current_img.save(filepath)
                        new_size = os.path.getsize(filepath)
                        attempts += 1
                        if new_size >= 30000:
                            print(f"  -> Upscaled to {new_w}x{new_h}, New size: {new_size // 1024} KB")
                            break
            except Exception as e:
                print(f"Error processing {filename}: {e}")
