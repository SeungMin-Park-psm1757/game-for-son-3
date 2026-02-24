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
    # 레벨 구간에 따른 낚싯대 변화
    # (레벨, 막대 색상, 막대 두께, 장식 색상, 발광 색상)
    levels = [
        (1, (139, 69, 19, 255), 2, None, None),           # 기본 나무
        (4, (101, 67, 33, 255), 3, None, None),           # 단단한 나무
        (7, (192, 192, 192, 255), 3, (169, 169, 169, 255), None), # 은빛 (철)
        (10, (255, 215, 0, 255), 3, (218, 165, 32, 255), None),   # 황금
        (13, (64, 224, 208, 255), 3, (0, 255, 255, 255), (0, 206, 209, 100)), # 터콰이즈 (약간 빛)
        (16, (30, 144, 255, 255), 4, (0, 191, 255, 255), (135, 206, 250, 150)),# 크리스탈 블루
        (19, (255, 20, 147, 255), 4, (255, 0, 255, 255), (218, 112, 214, 200)) # 핑크/보라 궁극
    ]

    os.makedirs(os.path.join("assets", "images"), exist_ok=True)

    for lv, rod_col, rod_thick, deco_col, glow_col in levels:
        img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        # === 1. 등 뒤 낚싯대 렌더링 (빛 효과 포함) ===
        rod_length = min(30 + lv, 50)
        start_x, start_y = 46, 37
        end_x = start_x + 10
        end_y = start_y - rod_length
        
        # 궁극 단계 발광 효과 (백그라운드)
        if glow_col:
            draw.line([start_x, start_y, end_x, end_y], fill=glow_col, width=rod_thick+4)
            if lv >= 19:
                 draw.ellipse([end_x-8, end_y-8, end_x+8, end_y+8], fill=glow_col)

        # 낚싯대 본체
        draw.line([start_x, start_y, end_x, end_y], fill=rod_col, width=rod_thick)

        # 낚싯대 장식
        if deco_col:
            # 중간 마디 장식
            draw.ellipse([start_x+3, start_y-15, start_x+7, start_y-11], fill=deco_col)
            # 끝부분 화려한 장식
            if lv >= 16:
                draw.polygon([(end_x-4, end_y), (end_x, end_y-6), (end_x+4, end_y), (end_x, end_y+4)], fill=deco_col)
            else:
                draw.ellipse([end_x-2, end_y-2, end_x+2, end_y+2], fill=deco_col)

        # === 2. 캐릭터 본체 (항상 동일: 정우 - 파란 셔츠, 안경, 모자) ===
        skin_color = (255, 220, 180, 255)
        shirt_color = (65, 105, 225, 255) # 파란 셔츠
        
        # 몸통 (어깨부분)
        draw.polygon([(16, 40), (8, 60), (56, 60), (48, 40)], fill=shirt_color) 
        
        # 밀짚 모자
        draw.ellipse([8, 8, 56, 56], fill=(245, 222, 179, 255), outline=(205, 133, 63, 255), width=2)
        draw.ellipse([20, 20, 44, 44], fill=(222, 184, 135, 255), outline=(139, 69, 19, 255), width=2)
        
        # 얼굴 (모자 아래 살짝 보이는 얼굴 + 안경)
        # 위에서 본 모습이라 얼굴 윗부분이 살짝 보이고 그 위에 모자가 덮인 형태.
        # 기존엔 모자 위에 아무것도 없었지만, 모자 밑에 얼굴을 살짝 드러냅니다.
        # (원래 탑다운에선 얼굴이 잘 안 보이지만, 특징을 살리기 위해 모자 챙 밖으로 살짝 코/안경 일부를 노출)
        draw.ellipse([26, 46, 38, 56], fill=skin_color) # 살짝 보이는 턱/코 라인
        
        # 안경 (검은 뿔테)
        draw.rectangle([25, 48, 31, 52], outline=(30, 30, 30, 255), width=2)
        draw.rectangle([33, 48, 39, 52], outline=(30, 30, 30, 255), width=2)
        draw.line([31, 50, 33, 50], fill=(30, 30, 30, 255), width=2)

        # 오른팔과 낚싯대 잡은 손
        draw.ellipse([46, 30, 60, 44], fill=skin_color, outline=(0, 0, 0, 255), width=1) # 손


        filename = f"char_lv{lv}.png"
        img.save(os.path.join("assets", "images", filename))
        print(f"{filename} created.")

    print("All character sprites created.")

if __name__ == "__main__":
    create_lure()
    create_character()
