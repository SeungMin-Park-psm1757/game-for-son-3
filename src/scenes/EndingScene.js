export default class EndingScene extends Phaser.Scene {
    constructor() {
        super('EndingScene');
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // 따뜻한 황금색 배경
        this.cameras.main.setBackgroundColor('#FFF8DC');
        this.cameras.main.fadeIn(1000);

        // 별 파티클 배경
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xFFD700);
        g.fillCircle(4, 4, 4);
        g.generateTexture('star_particle', 8, 8);

        // 반짝이는 별
        for (let i = 0; i < 30; i++) {
            const star = this.add.image(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                'star_particle'
            );
            star.setAlpha(Phaser.Math.FloatBetween(0.2, 0.8));
            star.setScale(Phaser.Math.FloatBetween(0.5, 2));
            this.tweens.add({
                targets: star,
                alpha: { from: 0.2, to: 1 },
                scale: { from: star.scale, to: star.scale * 1.5 },
                yoyo: true,
                repeat: -1,
                duration: Phaser.Math.Between(800, 2000),
                delay: Phaser.Math.Between(0, 1000)
            });
        }

        // 엔딩 스토리 대화문
        const storyLines = [
            { speaker: '정우', portrait: 'char_jeongwoo', text: '세연아!! 오빠가 열심히 낚시해서 돈을 벌었어!!' },
            { speaker: '정우', portrait: 'char_jeongwoo', text: '이거 봐! 최고급 장난감!! 세연이 줄라고 샀어!' },
            { speaker: '세연', portrait: 'char_seyeon', text: '와아아아!! 오빠 최고!!! 오빠가 세상에서 제일 좋아!!!! 💖💖💖' },
            { speaker: '엄마', portrait: 'char_mom', text: '우리 정우... 동생을 위해 이렇게까지... 엄마가 너무 자랑스럽다 ㅠㅠ' },
            { speaker: '아빠', portrait: 'char_dad', text: '(전화) 정우야! 아빠가 들었어. 최고의 오빠구나! 사랑한다 아들!' },
            { speaker: '정우', portrait: 'char_jeongwoo', text: '히히... 당연하지! 나는 세연이의 최고의 오빠니까!! 😎' }
        ];

        this.currentLineIndex = 0;
        this.storyLines = storyLines;

        // 대화 배경 박스
        this.dialogBg = this.add.rectangle(width / 2, height * 0.75, width * 0.9, 180, 0x000000, 0.7)
            .setDepth(10);

        // 초상화
        this.portrait = this.add.image(120, height * 0.75, 'char_jeongwoo')
            .setDepth(11).setScale(2);

        // 이름표
        this.speakerText = this.add.text(240, height * 0.75 - 60, '', {
            fontSize: '28px', fontFamily: 'Arial', color: '#FFD700',
            fontStyle: 'bold', stroke: '#000', strokeThickness: 2
        }).setDepth(11);

        // 본문 텍스트
        this.dialogText = this.add.text(240, height * 0.75 - 20, '', {
            fontSize: '24px', fontFamily: 'Arial', color: '#FFFFFF',
            wordWrap: { width: width * 0.65 }, lineSpacing: 8
        }).setDepth(11);

        // 계속 안내
        this.continueHint = this.add.text(width / 2, height * 0.75 + 70, '[ 화면을 탭(클릭)하세요 ]', {
            fontSize: '18px', fontFamily: 'Arial', color: '#AAAAAA'
        }).setOrigin(0.5).setDepth(11);

        this.tweens.add({
            targets: this.continueHint, alpha: { from: 0.3, to: 1 },
            yoyo: true, repeat: -1, duration: 600
        });

        // 타이틀
        this.add.text(width / 2, height * 0.15, '🎉 THE END 🎉', {
            fontSize: '72px', fontFamily: 'Arial', color: '#FFD700',
            stroke: '#8B4513', strokeThickness: 8,
            shadow: { offsetX: 3, offsetY: 3, color: '#000', blur: 5, fill: true }
        }).setOrigin(0.5).setDepth(5);

        this.add.text(width / 2, height * 0.28, '정우의 낚시 대모험 — 完', {
            fontSize: '32px', fontFamily: 'Arial', color: '#8B4513',
            stroke: '#FFF8DC', strokeThickness: 3
        }).setOrigin(0.5).setDepth(5);

        // 첫 대사 표시
        this.showLine(0);

        // 클릭으로 다음 대사 진행
        this.input.on('pointerdown', () => {
            this.currentLineIndex++;
            if (this.currentLineIndex < this.storyLines.length) {
                this.showLine(this.currentLineIndex);
            } else {
                this.showCredits();
            }
        });
    }

    showLine(index) {
        const line = this.storyLines[index];
        this.speakerText.setText(line.speaker);
        this.dialogText.setText(line.text);

        // 초상화 전환
        if (this.textures.exists(line.portrait)) {
            this.portrait.setTexture(line.portrait);
        }

        // 등장 애니메이션
        this.tweens.add({ targets: this.portrait, scale: { from: 1.8, to: 2 }, duration: 200 });
    }

    showCredits() {
        this.dialogBg.setVisible(false);
        this.portrait.setVisible(false);
        this.speakerText.setVisible(false);
        this.dialogText.setVisible(false);
        this.continueHint.setVisible(false);

        const width = this.scale.width;
        const height = this.scale.height;

        this.add.text(width / 2, height * 0.5, '감사합니다! 정우가 훌륭한 오빠가 되었습니다!\n\n🐟 물고기도, 가족도, 모두 행복합니다 🐟', {
            fontSize: '28px', fontFamily: 'Arial', color: '#8B4513',
            align: 'center', lineSpacing: 10
        }).setOrigin(0.5).setDepth(20);

        // 처음으로 돌아가기 버튼
        const restartBtn = this.add.text(width / 2, height * 0.75, '[ 처음 화면으로 돌아가기 ]', {
            fontSize: '24px', fontFamily: 'Arial', color: '#4169E1',
            backgroundColor: '#FFF', padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setDepth(20).setInteractive({ useHandCursor: true });

        restartBtn.on('pointerdown', () => {
            this.scene.start('IntroScene');
        });
    }
}
