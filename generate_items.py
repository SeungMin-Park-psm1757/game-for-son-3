import sys
from PIL import Image, ImageDraw

def create_pixel_art(filename, color_map, scale=4, size=16):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    pixels = img.load()

    for y, row in enumerate(color_map):
        for x, color in enumerate(row):
            if color:
                pixels[x, y] = color

    # Scale up for crisp pixel art look
    img = img.resize((size * scale, size * scale), Image.NEAREST)
    img.save(f"assets/images/{filename}.png")
    print(f"Generated {filename}.png")

def generate_shoe():
    # 16x16 pixel art for a brown old shoe
    O = (0, 0, 0, 0)
    B = (101, 67, 33, 255) # Brown
    D = (50, 30, 10, 255)  # Dark brown
    L = (200, 200, 200, 255) # Laces
    
    cmap = [
        [O,O,O,O, O,O,O,O, O,O,O,O, O,O,O,O],
        [O,O,O,O, O,O,O,O, O,O,O,O, O,O,O,O],
        [O,O,O,O, O,O,O,O, O,O,O,O, O,O,O,O],
        [O,O,O,O, O,O,O,O, O,O,O,O, O,O,O,O],
        [O,O,O,O, O,O,O,B, B,O,O,O, O,O,O,O],
        [O,O,O,O, O,O,O,B, B,O,O,O, O,O,O,O],
        [O,O,O,O, O,O,O,B, B,B,O,O, O,O,O,O],
        [O,O,O,O, O,O,O,B, B,B,O,O, O,O,O,O],
        [O,O,O,O, O,O,O,B, B,B,B,O, O,O,O,O],
        [O,O,O,O, O,L,L,B, B,B,B,O, O,O,O,O],
        [O,O,O,D, D,B,B,B, B,B,B,B, B,O,O,O],
        [O,O,B,B, B,B,B,B, B,B,B,B, B,B,O,O],
        [O,B,B,B, B,B,B,B, B,B,B,B, B,B,B,O],
        [O,D,D,D, D,D,D,D, D,D,D,D, D,D,D,O],
        [O,O,O,O, O,O,O,O, O,O,O,O, O,O,O,O],
        [O,O,O,O, O,O,O,O, O,O,O,O, O,O,O,O],
    ]
    create_pixel_art("item_shoe", cmap)

def generate_trash():
    # 16x16 pixel art for a crumpled tin can
    O = (0, 0, 0, 0)
    G = (160, 160, 160, 255) # Gray
    D = (100, 100, 100, 255) # Dark Gray
    W = (220, 220, 220, 255) # White/light gray
    M = (180, 50, 50, 255) # red label
    
    cmap = [
        [O,O,O,O, O,O,O,O, O,O,O,O, O,O,O,O],
        [O,O,O,O, O,O,O,O, O,O,O,O, O,O,O,O],
        [O,O,O,O, O,O,O,O, O,O,O,O, O,O,O,O],
        [O,O,O,O, O,O,D,W, W,D,O,O, O,O,O,O],
        [O,O,O,O, O,G,M,G, G,D,O,O, O,O,O,O],
        [O,O,O,O, O,D,M,M, M,D,O,O, O,O,O,O],
        [O,O,O,O, W,D,M,G, M,D,W,O, O,O,O,O],
        [O,O,O,W, G,M,M,W, M,G,D,O, O,O,O,O],
        [O,O,O,D, G,D,M,M, M,D,W,O, O,O,O,O],
        [O,O,O,G, W,G,G,W, D,D,G,O, O,O,O,O],
        [O,O,O,O, D,W,W,W, W,G,O,O, O,O,O,O],
        [O,O,O,O, O,D,W,G, G,D,O,O, O,O,O,O],
        [O,O,O,O, O,O,D,W, G,O,O,O, O,O,O,O],
        [O,O,O,O, O,O,O,O, O,O,O,O, O,O,O,O],
        [O,O,O,O, O,O,O,O, O,O,O,O, O,O,O,O],
        [O,O,O,O, O,O,O,O, O,O,O,O, O,O,O,O],
    ]
    create_pixel_art("item_trash", cmap)

def generate_treasure():
    # 16x16 pixel art for a golden treasure chest
    O = (0, 0, 0, 0)
    G = (255, 215, 0, 255) # Gold
    Y = (255, 255, 100, 255) # Yellow highlight
    B = (139, 69, 19, 255) # Brown wood
    D = (80, 40, 10, 255)  # Dark wood/Shadow
    M = (0, 0, 0, 255)     # metal outline/lock
    R = (255, 0, 0, 255)   # Red gem
    
    cmap = [
        [O,O,O,O, O,O,O,O, O,O,O,O, O,O,O,O],
        [O,O,O,O, O,O,O,O, O,O,O,O, O,O,O,O],
        [O,O,M,M, M,M,M,M, M,M,M,M, M,O,O,O],
        [O,M,Y,G, G,G,G,G, G,G,Y,G, M,O,O,O],
        [M,G,B,B, B,D,B,D, B,D,B,G, M,O,O,O],
        [M,Y,B,B, B,B,B,B, B,B,B,G, M,O,O,O],
        [M,G,B,B, B,D,R,D, B,D,B,Y, M,O,O,O],
        [M,Y,G,G, G,M,G,M, G,G,G,G, M,O,O,O],
        [M,M,M,M, M,M,M,M, M,M,M,M, M,M,O,O],
        [M,G,B,B, B,M,G,M, B,B,B,G, M,O,O,O],
        [M,Y,B,B, B,M,M,M, B,B,B,G, M,O,O,O],
        [M,G,B,B, B,D,B,B, B,D,B,Y, M,O,O,O],
        [M,B,D,D, D,D,D,D, D,D,B,G, M,O,O,O],
        [O,M,M,M, M,M,M,M, M,M,M,M, O,O,O,O],
        [O,O,O,O, O,O,O,O, O,O,O,O, O,O,O,O],
        [O,O,O,O, O,O,O,O, O,O,O,O, O,O,O,O],
    ]
    create_pixel_art("item_treasure", cmap)

if __name__ == '__main__':
    generate_shoe()
    generate_trash()
    generate_treasure()
