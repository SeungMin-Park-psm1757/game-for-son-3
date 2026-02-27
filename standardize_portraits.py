from PIL import Image
import os

def standardize_portraits():
    dir_path = r"assets/images"
    portraits = ['char_dad.png', 'char_mom.png', 'char_seyeon.png', 'char_jeongwoo.png']
    target_size = (512, 512)
    
    for filename in portraits:
        file_path = os.path.join(dir_path, filename)
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            continue
            
        with Image.open(file_path) as img:
            if img.size != target_size:
                print(f"Resizing {filename} from {img.size} to {target_size}")
                # Using LANCZOS for high quality upscaling
                resized_img = img.resize(target_size, Image.Resampling.LANCZOS)
                resized_img.save(file_path)
            else:
                print(f"{filename} is already {target_size}")

if __name__ == "__main__":
    standardize_portraits()
