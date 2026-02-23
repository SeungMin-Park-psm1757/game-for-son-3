import os
from rembg import remove
from PIL import Image

ARTIFACT_DIR = r"C:\Users\QuIC\.gemini\antigravity\brain\b77eeac2-62c5-4cf8-98b9-64f43448a353"
DEST_DIR = r"C:\AI\my DeepL 2\game-for-son-3\assets\images"

prefix_mapping = {
    "fish_pirami_": "fish_pirami.png",
    "fish_loach_": "fish_loach.png",
    "fish_boonguh_": "fish_boonguh.png",
    "fish_smelt_": "fish_smelt.png",
    "fish_catfish_": "fish_catfish.png",
    "fish_ssogari_": "fish_ssogari.png",
    "fish_carp_": "fish_carp.png",
    "fish_gamulchi_": "fish_gamulchi.png",
    "fish_mangdoong_": "fish_mangdoong.png",
    "fish_anchovy_": "fish_anchovy.png",
    "fish_gizzard_shad_": "fish_gizzard_shad.png",
    "fish_urock_": "fish_urock.png",
    "fish_webfoot_octopus_": "fish_webfoot_octopus.png",
    "fish_flounder_": "fish_flounder.png",
    "fish_gwangeo_": "fish_gwangeo.png",
    "fish_sea_bass_": "fish_sea_bass.png",
    "fish_black_porgy_": "fish_black_porgy.png",
    "fish_chamdom_": "fish_chamdom.png",
    "fish_godeungeo_": "fish_godeungeo.png",
    "fish_squid_": "fish_squid.png",
    "fish_saury_": "fish_saury.png",
    "fish_spanish_mackerel_": "fish_spanish_mackerel.png",
    "fish_salmon_": "fish_salmon.png",
    "fish_pollack_": "fish_pollack.png",
    "fish_galchi_": "fish_galchi.png",
    "fish_cod_": "fish_cod.png",
    "fish_monkfish_": "fish_monkfish.png",
    "fish_bangeo_": "fish_bangeo.png",
    "fish_tuna_": "fish_tuna.png",
    "fish_sunfish_": "fish_sunfish.png",
    "fish_striped_jewfish_": "fish_striped_jewfish.png",
    "fish_whale_shark_": "fish_whale_shark.png",
    "fish_cheongsaechi_": "fish_cheongsaechi.png"
}

def process_images():
    if not os.path.exists(DEST_DIR):
        os.makedirs(DEST_DIR)

    for filename in os.listdir(ARTIFACT_DIR):
        if not filename.endswith(".png"):
            continue
            
        for prefix, final_name in prefix_mapping.items():
            if filename.startswith(prefix):
                src_path = os.path.join(ARTIFACT_DIR, filename)
                dest_path = os.path.join(DEST_DIR, final_name)
                
                print(f"Processing {filename} -> {final_name}")
                
                try:
                    img = Image.open(src_path)
                    img = img.convert("RGBA")
                    output = remove(img, alpha_matting=True)
                    output.thumbnail((128, 128), Image.Resampling.NEAREST)
                    output.save(dest_path)
                    os.remove(src_path)
                    print(f"Saved {dest_path}")
                except Exception as e:
                    print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    process_images()
