import os
from PIL import Image, ImageDraw

def create_topdown_background(filename):
    width, height = 1280, 720
    img = Image.new('RGBA', (width, height), (30, 144, 255, 255))
    draw = ImageDraw.Draw(img)

    # 파도/일렁임 표현 (단순 픽셀)
    for y in range(0, height, 40):
        for x in range(0, width, 40):
            if (x + y) % 120 == 0:
                draw.rectangle([x, y, x + 20, y + 10], fill=(70, 170, 255, 100))
            if (x - y) % 160 == 0:
                draw.rectangle([x, y, x + 30, y + 5], fill=(20, 120, 230, 80))

    # 하단 15% 영역에 캐릭터가 서 있을 나무 데크 (Dock) 생성
    dock_height = int(height * 0.15)
    dock_y = height - dock_height
    draw.rectangle([0, dock_y, width, height], fill=(139, 69, 19, 255)) # 갈색 나무

    # 나무 판자 질감 (선)
    for x in range(0, width, 60):
        draw.line([x, dock_y, x, height], fill=(101, 42, 14, 255), width=2)
    # 판자 못 (점)
    for x in range(30, width, 60):
        draw.ellipse([x - 2, dock_y + 10, x + 2, dock_y + 14], fill=(50, 50, 50, 255))
        draw.ellipse([x - 2, height - 20, x + 2, height - 16], fill=(50, 50, 50, 255))

    img.save(filename)
    print(f"[{filename}] Created.")

def create_korean_fish_sprites():
    fish_list = [
        # Chapter 1: 민물
        ('fish_pirami', (180, 180, 180), (255, 50, 50), 32, 16, 'small_slim'),
        ('fish_boonguh', (160, 130, 80), (100, 80, 50), 48, 32, 'medium_fat'),
        ('fish_ssogari', (180, 150, 50), (100, 50, 20), 56, 28, 'medium_spiky'), # 쏘가리 (레오파드 느낌의 점은 코드로 대충 처리)
        ('fish_gamulchi', (80, 90, 80), (30, 40, 30), 80, 24, 'large_long'),
        # Chapter 2: 연안
        ('fish_mangdoong', (120, 100, 80), (80, 60, 40), 40, 20, 'small_bottom'),
        ('fish_urock', (60, 60, 70), (30, 30, 40), 50, 34, 'medium_dark'),
        ('fish_gwangeo', (130, 110, 80), (200, 190, 180), 64, 64, 'flat_wide'), # 광어 (넓적)
        ('fish_chamdom', (255, 100, 120), (200, 50, 70), 60, 40, 'medium_red'),
        # Chapter 3: 먼 바다
        ('fish_godeungeo', (50, 100, 200), (220, 220, 220), 60, 20, 'medium_slim'),
        ('fish_galchi', (230, 230, 240), (255, 255, 255), 120, 12, 'very_long'),
        ('fish_bangeo', (100, 120, 150), (200, 210, 230), 90, 40, 'large_torpedo'),
        ('fish_cheongsaechi', (40, 80, 180), (150, 180, 255), 140, 36, 'sword_bill'),
    ]

    for f_id, color1, color2, fw, fh, body_type in fish_list:
        canvas_w, canvas_h = 160, 160
        img = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        cx, cy = canvas_w // 2, canvas_h // 2
        # 중심 기준으로 몸통 그리기
        x1, y1 = cx - fw // 2, cy - fh // 2
        x2, y2 = cx + fw // 2, cy + fh // 2

        # 꼬리 지느러미
        tail_x = x1 - fh
        draw.polygon([(x1 + fh//2, cy), (tail_x, cy - fh//1.5), (tail_x, cy + fh//1.5)], fill=color2)

        if body_type == 'very_long':
            # 갈치 (직사각형에 가까움)
            draw.rectangle([x1, y1, x2, y2], fill=color1)
        elif body_type == 'sword_bill':
            # 청새치 (앞에 뾰족한 주둥이)
            draw.ellipse([x1, y1, x2, y2], fill=color1)
            draw.polygon([(x2 - 10, cy - 2), (x2 + fh, cy), (x2 - 10, cy + 2)], fill=color2)
            # 등지느러미
            draw.polygon([(x1 + 10, y1 + 5), (x1 + 30, y1 - 20), (x2 - 20, y1 + 2)], fill=color2)
        elif body_type == 'flat_wide':
            # 광어 (위아래로 납작/넓적)
            draw.ellipse([x1, y1, x2, y2], fill=color1)
            draw.ellipse([x1 + 5, y1 - 10, x2 - 5, y1], fill=color2) # 지느러미 테두리
            draw.ellipse([x1 + 5, y2, x2 - 5, y2 + 10], fill=color2)
        elif body_type == 'medium_spiky':
            # 쏘가리 (등지느러미 뾰족)
            draw.ellipse([x1, y1, x2, y2], fill=color1)
            # 얼룩무늬
            for _ in range(5):
                rx = x1 + (x2 - x1) * 0.2
                ry = y1 + (y2 - y1) * 0.2
                draw.rectangle([rx, ry, rx+4, ry+4], fill=(50, 40, 20, 255))
            # 뾰족 지느러미
            draw.polygon([(cx - 10, y1 + 5), (cx, y1 - 15), (cx + 10, y1 + 5)], fill=color2)
        else:
            # 기본 계란형 몸통
            draw.ellipse([x1, y1, x2, y2], fill=color1)

        # 눈 그리기 (오른쪽을 봄)
        eye_x = x2 - fh // 2
        eye_y = cy - fh // 4
        eye_size = 4 if fh < 30 else 6
        draw.ellipse([eye_x, eye_y, eye_x + eye_size, eye_y + eye_size], fill=(255, 255, 255, 255))
        draw.ellipse([eye_x + eye_size//2, eye_y + eye_size//4, eye_x + eye_size, eye_y + eye_size*0.75], fill=(0, 0, 0, 255))

        out_path = os.path.join("assets", "images", f"{f_id}.png")
        img.save(out_path)
        print(f"[{out_path}] Created.")

if __name__ == "__main__":
    os.makedirs(os.path.join("assets", "images"), exist_ok=True)
    create_topdown_background(os.path.join("assets", "images", "background_topdown.png"))
    create_korean_fish_sprites()
    print("All specific assets generated successfully.")
