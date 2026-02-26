import os
from PIL import Image, ImageDraw

def create_lure():
    # 32x32 사이즈의 찌 (수면에 떠있는 동그란 찌)
    img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 둥근 찌 모양 (위는 빨강, 아래는 하양)
    draw.pieslice([4, 4, 28, 28], 180, 360, fill=(255, 50, 50, 255))
    draw.pieslice([4, 4, 28, 28], 0, 180, fill=(255, 255, 255, 255))
    
    # 찌 테두리
    draw.arc([4, 4, 28, 28], 0, 360, fill=(0, 0, 0, 255), width=2)
    # 가운데 띠
    draw.line([4, 16, 28, 16], fill=(0, 0, 0, 255), width=2)
    # 찌 위의 안테나
    draw.line([16, 4, 16, 0], fill=(255, 200, 0, 255), width=2)

    os.makedirs(os.path.join("assets", "images"), exist_ok=True)
    img.save(os.path.join("assets", "images", "lure.png"))
    print("lure.png created.")

def create_character():
    # 64x64 사이즈의 탑다운(위에서 본) 캐릭터
    # 레벨에 따라 낚싯대 속성을 동적으로 계산합니다.
    os.makedirs(os.path.join("assets", "images"), exist_ok=True)

    for lv in range(1, 21):
        img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        # --- 레벨별 낚싯대 속성 결정 ---
        if lv < 4:    # Lv 1-3: 기본 나무
            rod_col = (139, 69, 19, 255)
            rod_thick = 2
            deco_col = None
            glow_col = None
        elif lv < 7:  # Lv 4-6: 단단한 나무
            rod_col = (101, 67, 33, 255)
            rod_thick = 3
            deco_col = None
            glow_col = None
        elif lv < 10: # Lv 7-9: 철제
            rod_col = (192, 192, 192, 255)
            rod_thick = 3
            deco_col = (169, 169, 169, 255)
            glow_col = None
        elif lv < 13: # Lv 10-12: 황금
            rod_col = (255, 215, 0, 255)
            rod_thick = 3
            deco_col = (218, 165, 32, 255)
            glow_col = None
        elif lv < 16: # Lv 13-15: 터콰이즈
            rod_col = (64, 224, 208, 255)
            rod_thick = 4
            deco_col = (0, 255, 255, 255)
            glow_col = (0, 206, 209, 80)
        elif lv < 19: # Lv 16-18: 크리스탈
            rod_col = (30, 144, 255, 255)
            rod_thick = 4
            deco_col = (0, 191, 255, 255)
            glow_col = (135, 206, 250, 120)
        else:         # Lv 19-20: 궁극
            rod_col = (255, 20, 147, 255)
            rod_thick = 5
            deco_col = (255, 0, 255, 255)
            glow_col = (218, 112, 214, 180)

        # === 1. 등 뒤 낚싯대 렌더링 (빛 효과 포함) ===
        rod_length = min(30 + lv, 55)
        start_x, start_y = 46, 37
        end_x = start_x + 10
        end_y = start_y - rod_length
        
        if glow_col:
            draw.line([start_x, start_y, end_x, end_y], fill=glow_col, width=rod_thick+4)
            if lv >= 19:
                 draw.ellipse([end_x-8, end_y-8, end_x+8, end_y+8], fill=glow_col)

        draw.line([start_x, start_y, end_x, end_y], fill=rod_col, width=rod_thick)

        if deco_col:
            if lv >= 16:
                draw.polygon([(end_x-4, end_y), (end_x, end_y-6), (end_x+4, end_y), (end_x, end_y+4)], fill=deco_col)
            else:
                draw.ellipse([end_x-2, end_y-2, end_x+2, end_y+2], fill=deco_col)

        # === 2. 캐릭터 본체 (항상 동일: 정우 - 파란 셔츠, 안경, 머리카락) ===
        skin_color = (255, 220, 180, 255)
        shirt_color = (0, 250, 154, 255) # 민트색 셔츠 (세연 컬러)
        hair_color = (40, 30, 20, 255) # 고동색 머리
        
        # 몸통 (어깨부분)
        draw.polygon([(16, 40), (8, 60), (56, 60), (48, 40)], fill=shirt_color) 
        
        # 머리카락 (모자 대신 머리카락 표현)
        draw.ellipse([16, 12, 48, 44], fill=hair_color)
        # 머리카락 결 약간 추가
        draw.chord([16, 12, 48, 30], 180, 360, fill=(60, 50, 40, 255))
        
        # 얼굴 (머리카락 아래 살짝 보이는 얼굴 + 안경)
        draw.ellipse([22, 38, 42, 54], fill=skin_color) 
        
        # 안경 (검은 뿔테)
        draw.rectangle([24, 46, 30, 50], outline=(30, 30, 30, 255), width=2)
        draw.rectangle([34, 46, 40, 50], outline=(30, 30, 30, 255), width=2)
        draw.line([30, 48, 34, 48], fill=(30, 30, 30, 255), width=1)

        # 오른팔과 낚싯대 잡은 손
        draw.ellipse([46, 30, 60, 44], fill=skin_color, outline=(0, 0, 0, 255), width=1) # 손

        filename = f"char_lv{lv}.png"
        img.save(os.path.join("assets", "images", filename))
        if lv == 1:
            # 기본 character.png 도 이것으로 교체
            img.save(os.path.join("assets", "images", "character.png"))

    print("All 20 character sprites created.")

if __name__ == "__main__":
    create_lure()
    create_character()
