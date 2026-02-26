import os
from PIL import Image

DEST_DIR = r'c:\AI\my DeepL 2\game-for-son-3\assets\images'

FISH_TO_UPSCALE = [
    'fish_pirami.png',
    'fish_pollack.png',
    'fish_salmon.png',
    'fish_saury.png',
    'fish_spanish_mackerel.png',
    'fish_squid.png',
    'fish_ssogari.png',
    'fish_striped_jewfish.png',
    'fish_sunfish.png',
    'fish_tuna.png'
]

def upscale_fishes():
    for f in FISH_TO_UPSCALE:
        path = os.path.join(DEST_DIR, f)
        if os.path.exists(path):
            try:
                img = Image.open(path).convert("RGBA")
                new_width = img.width * 2
                new_height = img.height * 2
                
                # Use NEAREST to preserve pixel art crispness
                upscaled = img.resize((new_width, new_height), Image.Resampling.NEAREST)
                upscaled.save(path)
                print(f"Upscaled {f} from {img.width}x{img.height} to {new_width}x{new_height}")
            except Exception as e:
                print(f"Failed to upscale {f}: {e}")
        else:
            print(f"File not found: {f}")

if __name__ == "__main__":
    upscale_fishes()
