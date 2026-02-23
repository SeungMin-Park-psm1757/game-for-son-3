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
    # 레벨 구간: 1, 4, 7, 10, 13, 16, 19
    levels = [
        (1, (100, 149, 237, 255), (205, 133, 63, 255)),   # Lv 1~3: 파란 셔츠, 기본 나무 낚싯대
        (4, (34, 139, 34, 255), (139, 69, 19, 255)),     # Lv 4~6: 초록 셔츠, 진한 나무 낚싯대
        (7, (139, 69, 19, 255), (160, 82, 45, 255)),     # Lv 7~9: 갈색 가죽 갑옷, 튼튼한 낚싯대 (약간 두꺼움)
        (10, (169, 169, 169, 255), (192, 192, 192, 255)),# Lv 10~12: 회색 철갑옷, 은빛 낚싯대
        (13, (255, 215, 0, 255), (218, 165, 32, 255)),   # Lv 13~15: 황금 갑옷, 황금 낚싯대
        (16, (0, 255, 255, 255), (0, 206, 209, 255)),    # Lv 16~18: 다이아몬드 갑옷, 빛나는 낚싯대
        (19, (138, 43, 226, 255), (255, 20, 147, 255))   # Lv 19~20: 전설의 보라색 갑옷, 핑크빛 궁극의 낚싯대
    ]

    os.makedirs(os.path.join("assets", "images"), exist_ok=True)

    for lv, shirt_color, rod_color in levels:
        img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        # 1. 낚싯대 (레벨이 오를수록 길어지고 화려해짐)
        rod_length = min(30 + lv, 50)
        rod_thickness = 2 if lv < 7 else 3
        draw.line([46, 37, 46 + 10, 37 - rod_length], fill=rod_color, width=rod_thickness)

        if lv >= 13: # 황금 이상 - 낚싯대 끝 장식 추가
            draw.ellipse([52, 33 - rod_length, 60, 41 - rod_length], fill=rod_color, outline=(255,255,255,255))

        # 2. 밀짚 모자 (유지)
        draw.ellipse([8, 8, 56, 56], fill=(245, 222, 179, 255), outline=(205, 133, 63, 255), width=2)
        draw.ellipse([20, 20, 44, 44], fill=(222, 184, 135, 255), outline=(139, 69, 19, 255), width=2)
        
        # 3. 어깨, 몸통 (옷 색상 변경 / 레벨업 시 갑옷 장식 추가)
        draw.polygon([(16, 40), (8, 60), (56, 60), (48, 40)], fill=shirt_color) 
        
        if lv >= 10: # 철갑옷 이상 - 견갑(어깨 장식) 추가
            draw.ellipse([10, 38, 24, 50], fill=(200, 200, 200, 255), outline=(100, 100, 100, 255), width=1) # 왼쪽
            draw.ellipse([40, 38, 54, 50], fill=(200, 200, 200, 255), outline=(100, 100, 100, 255), width=1) # 오른쪽

        if lv >= 16: # 다이아/전설 - 등 뒤에 망토 형태 추가
            draw.polygon([(24, 60), (16, 64), (48, 64), (40, 60)], fill=(255, 0, 0, 255))

        # 4. 오른팔과 낚싯대 잡은 손
        draw.ellipse([46, 30, 60, 44], fill=(255, 228, 196, 255), outline=(0, 0, 0, 255), width=1) # 손

        filename = f"char_lv{lv}.png"
        img.save(os.path.join("assets", "images", filename))
        print(f"{filename} created.")

    print("All character sprites created.")

if __name__ == "__main__":
    create_lure()
    create_character()
