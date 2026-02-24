import os
import requests
import json
from PIL import Image
from io import BytesIO
from rembg import remove

# Dictionary mapping fish ID to their English/Scientific Wikipedia page titles for reliable image lookup
FISH_QUERIES = {
    'fish_pirami': 'Zacco_platypus',
    'fish_boonguh': 'Crucian_carp',
    'fish_bangeo': 'Japanese_amberjack',
    'fish_chamdom': 'Red_seabream',
    'fish_cod': 'Pacific_cod',
    'fish_cheongsaechi': 'Striped_marlin',
    'fish_galchi': 'Largehead_hairtail',
    'fish_gamulchi': 'Northern_snakehead',
    'fish_godeungeo': 'Chub_mackerel',
    'fish_gwangeo': 'Olive_flounder',
    'fish_mangdoong': 'Mudskipper',
    'fish_urock': 'Sebastes_schlegelii',
    'fish_salmon': 'Chum_salmon',
    'fish_ssogari': 'Siniperca_scherzeri'
}

DEST_DIR = 'assets/images'
os.makedirs(DEST_DIR, exist_ok=True)

def get_wikipedia_image(page_title):
    # Hit Wikipedia API to get the main page image
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={page_title}&prop=pageimages&format=json&pithumbsize=800"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    try:
        response = requests.get(url, headers=headers)
        data = response.json()
        pages = data['query']['pages']
        for page_id in pages:
            if 'thumbnail' in pages[page_id]:
                return pages[page_id]['thumbnail']['source']
    except Exception as e:
        print(f"Error fetching image URL for {page_title}: {e}")
    return None

def process_and_save_image(img_url, fish_id):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        response = requests.get(img_url, headers=headers)
        if response.status_code != 200:
            print(f"Failed to download image: HTTP {response.status_code}")
            return False
            
        img = Image.open(BytesIO(response.content)).convert("RGBA")
        
        # 1. Remove background
        img_no_bg = remove(img)
        
        # 2. Resize and Pixelate
        # Resize to standard size 128x128 bounding box while preserving aspect ratio
        img_no_bg.thumbnail((128, 128), Image.Resampling.LANCZOS)
        
        # Create a blank 128x128 canvas
        canvas = Image.new('RGBA', (128, 128), (0, 0, 0, 0))
        # Paste centered
        x_offset = (128 - img_no_bg.width) // 2
        y_offset = (128 - img_no_bg.height) // 2
        canvas.paste(img_no_bg, (x_offset, y_offset))
        
        # Pixelate: scale down to 32x32, then back up to 128x128 with NEAREST
        small = canvas.resize((32, 32), Image.Resampling.NEAREST)
        pixelated = small.resize((128, 128), Image.Resampling.NEAREST)
        
        # Save
        out_path = os.path.join(DEST_DIR, f"{fish_id}.png")
        pixelated.save(out_path)
        print(f"Successfully processed {fish_id} from {img_url}")
        return True
    except Exception as e:
        print(f"Error processing {fish_id}: {e}")
        return False

def main():
    print("Starting Wikipedia image scraping and processing...")
    for fish_id, query in FISH_QUERIES.items():
        print(f"Searching for {fish_id} ({query})...")
        img_url = get_wikipedia_image(query)
        if img_url:
            print(f"Found image: {img_url}")
            process_and_save_image(img_url, fish_id)
        else:
            print(f"Failed to find image for {fish_id}")

if __name__ == "__main__":
    main()
