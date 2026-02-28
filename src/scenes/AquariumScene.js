import { FISH_TYPES } from '../models/FishData.js';

class AquariumScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AquariumScene' });
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // 배경: 4개 지역(챕터) 비율 조정 (물고기 수: 8, 10, 15, 14 -> 합 47)
        const regionCounts = [8, 10, 15, 14];
        const totalFishCount = regionCounts.reduce((a, b) => a + b, 0);
        this.regionHeights = regionCounts.map(count => (count / totalFishCount) * height);
        this.regionYStarts = [0];
        for (let i = 0; i < 3; i++) {
            this.regionYStarts.push(this.regionYStarts[i] + this.regionHeights[i]);
        }

        // 1. 민물 (Sky Blue)
        this.add.rectangle(0, this.regionYStarts[0], width, this.regionHeights[0], 0x87CEEB).setOrigin(0);
        // 2. 연안 (Steel Blue)
        this.add.rectangle(0, this.regionYStarts[1], width, this.regionHeights[1], 0x4682B4).setOrigin(0);
        // 3. 먼 바다 (Navy)
        this.add.rectangle(0, this.regionYStarts[2], width, this.regionHeights[2], 0x000080).setOrigin(0);
        // 4. 보물섬 (Midnight Blue)
        this.add.rectangle(0, this.regionYStarts[3], width, this.regionHeights[3], 0x191970).setOrigin(0);

        // 경계선 물결 처리
        const graphics = this.add.graphics();
        const colors = [0x4682B4, 0x000080, 0x191970];
        for (let i = 1; i <= 3; i++) {
            const y = this.regionYStarts[i];
            graphics.fillStyle(colors[i - 1], 1);
            graphics.beginPath();
            graphics.moveTo(0, y);
            for (let x = 0; x <= width; x += 10) {
                graphics.lineTo(x, y - 10 * Math.sin(x * 0.05));
            }
            graphics.lineTo(width, height);
            graphics.lineTo(0, height);
            graphics.closePath();
            graphics.fillPath();
        }

        // 수초/환경 장식 추가
        this.createDecorations();

        // 제목
        this.add.text(width / 2, 40, '내 수족관', {
            fontSize: '32px', fontFamily: 'Arial', color: '#FFFFFF',
            stroke: '#000000', strokeThickness: 5, fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(10);

        // 뒤로가기 버튼
        const backBtn = this.add.text(24, 80, '⬅️ 돌아가기', {
            fontSize: '20px', fontFamily: 'Arial', color: '#FFFFFF',
            stroke: '#000000', strokeThickness: 4, backgroundColor: '#222222',
            padding: { x: 10, y: 6 }
        }).setDepth(30).setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => backBtn.setBackgroundColor('#666666'));
        backBtn.on('pointerout', () => backBtn.setBackgroundColor('#444444'));
        backBtn.on('pointerdown', () => {
            window.gameManagers.soundManager.playCoin();
            this.scene.start('IntroScene');
        });

        // 돋보기 버튼
        this.isMagnifying = false;
        const magBtn = this.add.text(width - 24, 80, '🔍 돋보기 켜기', {
            fontSize: '20px', fontFamily: 'Arial', color: '#FFFFFF',
            stroke: '#000000', strokeThickness: 4, backgroundColor: '#222222',
            padding: { x: 10, y: 6 }
        }).setOrigin(1, 0).setDepth(30).setInteractive({ useHandCursor: true });

        magBtn.on('pointerover', () => magBtn.setBackgroundColor('#666666'));
        magBtn.on('pointerout', () => magBtn.setBackgroundColor('#444444'));
        magBtn.on('pointerdown', () => {
            window.gameManagers.soundManager.playCoin();
            this.toggleMagnifier();
            magBtn.setText(this.isMagnifying ? '🔍 돋보기 끄기' : '🔍 돋보기 켜기');
        });

        // 조건: 15마리 이상 잡은 물고기만 배열 색인
        const collection = window.gameManagers.playerModel.fishCollection;
        this.fishes = [];

        Object.keys(collection).forEach(fishId => {
            if (collection[fishId] >= 15) {
                const fData = FISH_TYPES.find(f => f.id === fishId);
                if (fData && !fData.isSpecialItem) {
                    this.createFish(fData);
                }
            }
        });

        if (this.fishes.length === 0) {
            this.noFishText = this.add.text(width / 2, height / 2, '아직 물고기가 없어요!\n(같은 물고기를 15마리 이상 잡으면 나타납니다)', {
                fontSize: '24px', fontFamily: 'Arial', color: '#FFFFFF',
                stroke: '#000000', strokeThickness: 4, align: 'center', wordWrap: { width: width * 0.8 }
            }).setOrigin(0.5).setDepth(5);
        }

        this.setupMagnifier();
    }

    createDecorations() {
        const width = this.scale.width;
        const decoGraphics = this.add.graphics().setDepth(1);

        for (let i = 0; i < 4; i++) {
            const yBase = this.regionYStarts[i] + this.regionHeights[i];
            const color = [0x228B22, 0x2E8B57, 0x006400, 0x8B4513][i]; // 민물(풀색), 연안, 바다, 보물섬(바위색)

            for (let j = 0; j < 6; j++) {
                const x = Phaser.Math.Between(50, width - 50);
                const h = Phaser.Math.Between(20, 50);

                decoGraphics.lineStyle(4, color, 0.6);
                decoGraphics.beginPath();
                decoGraphics.moveTo(x, yBase);
                for (let k = 1; k <= 5; k++) {
                    const ty = yBase - (h / 5) * k;
                    const tx = x + Math.sin(k * 1.5) * 5;
                    decoGraphics.lineTo(tx, ty);
                }
                decoGraphics.strokePath();

                if (i === 3) { // 보물섬 바위 느낌
                    decoGraphics.fillStyle(0x555555, 0.4);
                    decoGraphics.fillCircle(x, yBase, 15);
                }
            }
        }
    }

    setupMagnifier() {
        const width = this.scale.width;
        const height = this.scale.height;
        const radius = 170;

        this.magCamera = this.cameras.add(0, 0, width, height).setZoom(2.5).setName('magCamera');
        this.magCamera.setVisible(false);
        this.magCamera.ignore(this.children.list.filter(child => child.depth >= 10));

        const maskGraphics = this.make.graphics();
        maskGraphics.fillStyle(0xffffff);
        maskGraphics.fillCircle(0, 0, radius);
        this.magMask = maskGraphics.createGeometryMask();
        this.magCamera.setMask(this.magMask);

        this.magBorder = this.add.graphics().setDepth(100).setVisible(false);
        this.magBorder.lineStyle(6, 0xffffff, 1);
        this.magBorder.strokeCircle(0, 0, radius);

        this.input.on('pointermove', (pointer) => {
            if (this.isMagnifying) {
                this.updateMagnifier(pointer.x, pointer.y);
            }
        });
    }

    toggleMagnifier() {
        this.isMagnifying = !this.isMagnifying;
        this.magCamera.setVisible(this.isMagnifying);
        this.magBorder.setVisible(this.isMagnifying);

        if (this.isMagnifying) {
            const pointer = this.input.activePointer;
            this.updateMagnifier(pointer.x, pointer.y);
        }
    }

    updateMagnifier(x, y) {
        this.magCamera.scrollX = x - this.scale.width / 2;
        this.magCamera.scrollY = y - this.scale.height / 2;
        this.magBorder.setPosition(x, y);
        this.magMask.geometryMask.setPosition(x, y);
    }

    createFish(fData) {
        const width = this.scale.width;
        const regionIdx = fData.region - 1;

        let minY = this.regionYStarts[regionIdx] + (this.regionHeights[regionIdx] * 0.15);
        let maxY = this.regionYStarts[regionIdx] + this.regionHeights[regionIdx] - (this.regionHeights[regionIdx] * 0.15);

        const x = Phaser.Math.Between(50, width - 50);
        const y = Phaser.Math.Between(minY, maxY);

        const fish = this.add.image(x, y, fData.id).setDepth(2);
        const maxScale = fData.scale || 1.0;
        fish.setScale(maxScale * Phaser.Math.FloatBetween(0.6, 0.8));

        // 곰치 특별 처리: 보물섬 좌하단 고정
        if (fData.id === 'fish_moray_eel') {
            fish.setPosition(100, this.regionYStarts[3] + this.regionHeights[3] - 40);
            fish.isFixed = true;
            fish.direction = 1;
            fish.flipX = true;
            fish.speed = 0;
        } else {
            let baseSpeed = 40;
            if (fData.grade === 'SSR') baseSpeed = 20;
            else if (fData.grade === 'SR') baseSpeed = 30;
            else if (fData.grade === 'R') baseSpeed = 50;
            else baseSpeed = 70;

            fish.speed = baseSpeed * Phaser.Math.FloatBetween(0.8, 1.2);
            fish.direction = (Math.random() > 0.5) ? 1 : -1;
            fish.flipX = fish.direction === 1;
        }

        fish.startY = fish.y;
        fish.sinCount = Phaser.Math.FloatBetween(0, Math.PI * 2);
        fish.sinSpeed = Phaser.Math.FloatBetween(0.5, 2);
        fish.sinRadius = Phaser.Math.FloatBetween(5, 15);
        fish.changeDirTimer = 0;
        fish.changeDirDelay = Phaser.Math.Between(3000, 8000);

        this.fishes.push(fish);
    }

    update(time, delta) {
        const width = this.scale.width;
        const dt = delta / 1000;

        this.fishes.forEach(fish => {
            if (fish.isFixed) return;

            fish.x += fish.speed * fish.direction * dt;
            fish.sinCount += fish.sinSpeed * dt;
            fish.y = fish.startY + Math.sin(fish.sinCount) * fish.sinRadius;

            if (fish.x > width + 50) {
                fish.x = width + 50;
                fish.direction = -1;
                fish.flipX = false;
            } else if (fish.x < -50) {
                fish.x = -50;
                fish.direction = 1;
                fish.flipX = true;
            }

            fish.changeDirTimer += delta;
            if (fish.changeDirTimer > fish.changeDirDelay) {
                fish.changeDirTimer = 0;
                fish.changeDirDelay = Phaser.Math.Between(3000, 8000);
                if (Math.random() < 0.2 && fish.x > 100 && fish.x < width - 100) {
                    fish.direction *= -1;
                    fish.flipX = fish.direction === 1;
                }
            }
        });
    }
}

window.gameManagers = window.gameManagers || {};
window.gameManagers.AquariumScene = AquariumScene;

export default AquariumScene;
