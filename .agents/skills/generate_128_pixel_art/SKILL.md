---
name: generate_128_pixel_art
description: "A skill for generating consistent 128x128 pixel art for games using Python PIL scripts."
---

<!-- 요약: Python PIL을 사용하여 32x32~64x64 소형 캔버스에 그리고 NEAREST 보간법으로 128x128로 확대하여 선명한 픽셀 아트를 대량 생성하는 방식 -->

# 🎨 128px Pixel Art Generation Skill

This skill defines an optimized workflow for programmatically creating high-quality 128x128 pixel art sprites using Python's `Pillow (PIL)` library.

## 🛠 Core Principle: The "Nearest-Neighbor" Scaling

The secret to maintaining the crisp, retro feel of pixel art while achieving a 128x128 resolution is to draw on a low-res canvas and scale up without anti-aliasing.

1.  **Low-Res Target:** Create a small transparent (RGBA) canvas, typically 32x32 or 64x64.
2.  **Geometric Blocking:** Use basic shapes (ellipse, polygon, line) to define the silhouette, shading, and highlights. Keep details minimal to emphasize the "blocky" aesthetic.
3.  **NEAREST Upscaling:** Resize the image to 128x128 using `Image.Resampling.NEAREST`. This avoids blurring and keeps every pixel sharp and square.

---

## 💻 Standard Sprite Generation Template

Use the following structure for Python scripts using this skill:

```python
import os
from PIL import Image, ImageDraw

def create_pixel_sprite(filepath, color_theme):
    # 1. Create low-res canvas (e.g., 64x64)
    base_size = 64
    img = Image.new("RGBA", (base_size, base_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 2. Draw layers (Silhouette -> Shading -> Eyes/Details)
    # Example: Basic Fish Shape
    # Tail
    draw.polygon([(10, 32), (5, 15), (5, 49)], fill=(color_theme[0], color_theme[1]-30, color_theme[2]-30))
    # Body
    draw.ellipse([15, 20, 55, 44], fill=color_theme)
    # Eye
    draw.ellipse([45, 26, 50, 31], fill=(255, 255, 255))
    draw.rectangle([47, 28, 48, 29], fill=(0, 0, 0)) 
    
    # 3. Scale up to 128x128 using NEAREST (CRITICAL)
    final_size = 128
    pixel_art = img.resize((final_size, final_size), Image.Resampling.NEAREST)

    # 4. Save
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    pixel_art.save(filepath)
    print(f"[Done] {filepath}")

if __name__ == "__main__":
    create_pixel_sprite("assets/images/fish_example.png", (255, 100, 100))
```

---

## ✨ Quality Optimization Pipeline

1.  **Outlines:** Draw a black silhouette 1-pixel larger than the main body first to create a classic 1px outline effect.
2.  **Palette Consistency:** Use offsets from a base `color_theme` (+/- RGB values) instead of hardcoding random colors to ensure a cohesive look across different assets.
3.  **Avoid Banding:** Use 2-3 distinct color levels for shading instead of gradients to preserve the pixel art identity.
4.  **Orientation:** Standardize assets to face right (the head at higher X coordinates) to match in-game lure/character logic without needing frequent flips.
