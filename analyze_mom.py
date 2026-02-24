from PIL import Image
from collections import Counter

img = Image.open('assets/images/char_mom.png').convert('RGBA')
pixels = list(img.getdata())

# Count colors, excluding transparent or near-transparent
colors = [p for p in pixels if p[3] > 200]
most_common = Counter(colors).most_common(20)

print("Most common colors:")
for color, count in most_common:
    print(color, count)

# We want to change the shirt color. I'll output this first, 
# then write the replacement logic.
