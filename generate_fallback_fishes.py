import os
from PIL import Image, ImageDraw

def create_fallback_fishes():
    fish_list = [
        ('fish_chamdom', (255, 100, 120), (200, 50, 70), 80, 50, 'medium_red'),
        ('fish_godeungeo', (50, 100, 200), (220, 220, 220), 80, 25, 'medium_slim'),
        ('fish_squid', (200, 150, 150), (150, 100, 100), 60, 60, 'squid'),
        ('fish_saury', (100, 150, 220), (220, 220, 220), 100, 15, 'very_long'),
        ('fish_spanish_mackerel', (80, 120, 180), (220, 220, 220), 90, 20, 'long_torpedo'),
        ('fish_salmon', (255, 150, 150), (180, 100, 100), 100, 35, 'large_torpedo'),
        ('fish_pollack', (120, 100, 80), (80, 60, 40), 90, 25, 'slim_long'),
        ('fish_galchi', (230, 230, 240), (255, 255, 255), 120, 12, 'extremely_long'),
        ('fish_cod', (150, 130, 100), (100, 80, 60), 90, 35, 'medium_fat'),
        ('fish_monkfish', (80, 60, 40), (50, 40, 20), 70, 70, 'flat_wide'),
        ('fish_bangeo', (100, 120, 150), (200, 210, 230), 110, 45, 'large_torpedo_stripe'),
        ('fish_tuna', (20, 40, 120), (180, 190, 200), 140, 55, 'very_large_torpedo'),
        ('fish_sunfish', (180, 180, 190), (120, 120, 130), 60, 100, 'tall_oval'),
        ('fish_striped_jewfish', (50, 50, 50), (30, 30, 30), 120, 60, 'massive_plump'),
        ('fish_whale_shark', (40, 60, 100), (200, 200, 220), 160, 50, 'massive_long_dots'),
        ('fish_cheongsaechi', (40, 80, 180), (150, 180, 255), 140, 36, 'sword_bill'),
    ]

    dest_dir = "assets/images"
    os.makedirs(dest_dir, exist_ok=True)

    for f_id, color1, color2, fw, fh, body_type in fish_list:
        canvas_w, canvas_h = 180, 180
        img = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        cx, cy = canvas_w // 2, canvas_h // 2
        x1, y1 = cx - fw // 2, cy - fh // 2
        x2, y2 = cx + fw // 2, cy + fh // 2

        tail_x = x1 - fh
        draw.polygon([(x1 + fh//2, cy), (tail_x, cy - fh//1.5), (tail_x, cy + fh//1.5)], fill=color2)

        if body_type == 'very_long' or body_type == 'extremely_long':
            draw.rectangle([x1, y1, x2, y2], fill=color1)
        elif body_type == 'sword_bill':
            draw.ellipse([x1, y1, x2, y2], fill=color1)
            draw.polygon([(x2 - 10, cy - 2), (x2 + fh, cy), (x2 - 10, cy + 2)], fill=color2)
            draw.polygon([(x1 + 10, y1 + 5), (x1 + 30, y1 - 20), (x2 - 20, y1 + 2)], fill=color2)
        elif body_type == 'flat_wide':
            draw.ellipse([x1, y1, x2, y2], fill=color1)
            draw.ellipse([x1 + 5, y1 - 10, x2 - 5, y1], fill=color2)
            draw.ellipse([x1 + 5, y2, x2 - 5, y2 + 10], fill=color2)
        elif body_type == 'squid':
            # Draw head
            draw.polygon([(cx + 20, cy), (x1, y1), (x1, y2)], fill=color1)
            # Draw tentacles
            for i in range(5):
                ty = y1 + (y2 - y1) * (i / 4.0)
                draw.line([(cx + 20, cy), (x2 + 20, ty)], fill=color2, width=4)
        elif body_type == 'tall_oval':
            draw.ellipse([cx - fh//2, cy - fw//2, cx + fh//2, cy + fw//2], fill=color1)
            # fins
            draw.polygon([(cx, cy - fw//2 + 10), (cx, cy - fw//1.5), (cx + 20, cy - fw//2 + 10)], fill=color2)
            draw.polygon([(cx, cy + fw//2 - 10), (cx, cy + fw//1.5), (cx + 20, cy + fw//2 - 10)], fill=color2)
        elif body_type == 'massive_long_dots':
            draw.ellipse([x1, y1, x2, y2], fill=color1)
            for dx in range(0, fw, 15):
                for dy in range(0, fh, 15):
                    if (dx+dy) % 2 == 0:
                        draw.ellipse([x1+dx, y1+dy, x1+dx+3, y1+dy+3], fill=color2)
        elif body_type == 'large_torpedo_stripe':
            draw.ellipse([x1, y1, x2, y2], fill=color1)
            draw.line([(x1, cy), (x2, cy)], fill=(255, 255, 0, 255), width=3)
        else:
            draw.ellipse([x1, y1, x2, y2], fill=color1)

        # Eye
        if body_type != 'squid':
            eye_x = x2 - fh // 2
            eye_y = cy - fh // 4
            eye_size = 4 if fh < 30 else 6
            draw.ellipse([eye_x, eye_y, eye_x + eye_size, eye_y + eye_size], fill=(255, 255, 255, 255))
            draw.ellipse([eye_x + eye_size//2, eye_y + eye_size//4, eye_x + eye_size, eye_y + eye_size*0.75], fill=(0, 0, 0, 255))
        
        # Pixelate by downsizing and upsizing
        small_img = img.resize((canvas_w // 4, canvas_h // 4), Image.Resampling.NEAREST)
        pixelated = small_img.resize((canvas_w, canvas_h), Image.Resampling.NEAREST)

        out_path = os.path.join(dest_dir, f"{f_id}.png")
        pixelated.save(out_path)
        print(f"Generated {out_path}")

if __name__ == '__main__':
    create_fallback_fishes()
