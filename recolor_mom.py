from PIL import Image
import os

img = Image.open('assets/images/char_mom.png').convert('RGBA')
if hasattr(img, 'get_flattened_data'):
    data = img.get_flattened_data()
else:
    data = list(img.getdata())

new_data = []

for r, g, b, a in data:
    if a > 50:
        # Detect Yellow-ish colors for the shirt
        # Skin colors also have high R and G, but they also have high B (e.g. 252, 199, 165)
        # Yellow has very low B (e.g. 252, 252, 0)
        if r > 120 and g > 120 and b < 100:
            # Map yellow to dark gray
            intensity = (r + g + b) / 3
            # map intensity ~170-255 to 30-50
            v = int(20 + (intensity / 255) * 30)
            new_data.append((v, v, v, a))
        # Handle darker yellow shadow pixels
        elif r > 80 and g > 80 and b < 50:
            new_data.append((20, 20, 20, a))
        else:
            new_data.append((r, g, b, a))
    else:
        new_data.append((r, g, b, a))


img.putdata(new_data)
img.save('assets/images/char_mom.png')
print("Mom's shirt recolored to black/dark gray!")
