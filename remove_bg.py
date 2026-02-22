import sys
import subprocess
import os

def install_deps():
    print("Checking dependencies...")
    try:
        import rembg
        from PIL import Image
    except ImportError:
        print("Installing rembg and pillow. This may take a minute...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "rembg", "pillow"])
        
def process_images():
    from rembg import remove
    from PIL import Image

    files = [
        "lure.png",
        "fish_anchovy.png",
        "fish_crucian.png",
        "fish_salmon.png",
        "fish_golden_koi.png"
    ]

    base_dir = "e:/AI2/game-for-son-3/assets/images"

    for file_name in files:
        input_path = os.path.join(base_dir, file_name)
        if not os.path.exists(input_path):
            print(f"File not found: {input_path}")
            continue
            
        print(f"Processing {input_path}...")
        try:
            input_image = Image.open(input_path)
            
            # Using alpha matting to help clean edges
            output_image = remove(input_image, alpha_matting=True)
            output_image.save(input_path)
            print(f"Success: {input_path}")
        except Exception as e:
            print(f"Error processing {file_name}: {e}")

if __name__ == "__main__":
    install_deps()
    process_images()
    print("All done!")
