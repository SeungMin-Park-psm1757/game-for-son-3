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
    img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 밀짚 모자 (위에서 본 둥근 형태)
    draw.ellipse([8, 8, 56, 56], fill=(245, 222, 179, 255), outline=(205, 133, 63, 255), width=2)
    # 모자 윗부분 (볼록)
    draw.ellipse([20, 20, 44, 44], fill=(222, 184, 135, 255), outline=(139, 69, 19, 255), width=2)
    
    # 어깨, 몸통 (모자 아래 살짝 보이는 옷)
    draw.polygon([(16, 40), (8, 60), (56, 60), (48, 40)], fill=(100, 149, 237, 255)) # 파란 셔츠
    
    # 오른팔과 낚싯대 잡은 손
    draw.ellipse([46, 30, 60, 44], fill=(255, 228, 196, 255), outline=(0, 0, 0, 255), width=1) # 손

    img.save(os.path.join("assets", "images", "character.png"))
    print("character.png created.")

if __name__ == "__main__":
    create_lure()
    create_character()
