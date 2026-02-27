export default class IntroScene extends Phaser.Scene {
    // Helper to brighten a hex color (compatible with all Phaser 3 versions)
    brightenColor(color, amount) {
        const c = Phaser.Display.Color.ValueToColor(color);
        const r = Math.min(255, c.red + amount);
        const g = Math.min(255, c.green + amount);
        const b = Math.min(255, c.blue + amount);
        return (r << 16) | (g << 8) | b;
    }

    constructor() {
        super('IntroScene');
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // 배경음악 재생 (글로벌하게 한 번만)
        if (!this.sound.get('bgm')) {
            const bgm = this.sound.add('bgm', { loop: true, volume: 0.45 });
            bgm.play();
        } else if (!this.sound.get('bgm').isPlaying) {
            this.sound.get('bgm').play();
        }

        // 배경 적용 (타이틀용으로 bg_coast 사용하고 어둡게 처리)
        this.bg = this.add.image(width / 2, height / 2, 'bg_coast');
        this.bg.setDisplaySize(width, height);
        this.bg.setTint(0x777777); // 인트로 화면은 조금 어둡게

        const titleFontSize = Math.max(40, Math.round(width * 0.11)) + 'px';
        const titleText = this.add.text(width / 2, height * 0.12, '정우의 낚시 대모험!', {
            fontSize: titleFontSize,
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#FFFFFF',
            stroke: '#0055FF',
            strokeThickness: 12,
            shadow: { offsetX: 6, offsetY: 6, color: '#002277', blur: 0, stroke: true, fill: true },
            wordWrap: { width: width * 0.95 }
        }).setOrigin(0.5);

        // Add a gentle floating animation to the title
        this.tweens.add({
            targets: titleText,
            y: titleText.y - 10,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const subFontSize = Math.max(18, Math.round(width * 0.044)) + 'px';
        this.add.text(width / 2, height * 0.24, '낚시할 지역을 선택하세요', {
            fontSize: subFontSize,
            fontFamily: 'Arial',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // PlayerModel에서 현재 언락된 최고 챕터 가져오기
        const highestChapter = window.gameManagers.playerModel.highestChapter;
        const pm = window.gameManagers.playerModel;

        // 챕터 선택 버튼들 생성 (언락되지 않은 챕터는 비활성화/회색 처리)
        // 모바일 최적화: 버튼 간격을 조금 더 좁히고 크기 조정
        this.createChapterButton(width / 2, height * 0.32, '🌊 챕터 1: 민물', 1, highestChapter >= 1 ? 0x4CAF50 : 0x555555, highestChapter >= 1);
        this.createChapterButton(width / 2, height * 0.43, '⛱️ 챕터 2: 연안', 2, highestChapter >= 2 ? 0x2196F3 : 0x555555, highestChapter >= 2);
        this.createChapterButton(width / 2, height * 0.54, '🐋 챕터 3: 바다', 3, highestChapter >= 3 ? 0x3F51B5 : 0x555555, highestChapter >= 3);
        this.createChapterButton(width / 2, height * 0.65, '🏴‍☠️ 챕터 4: 보물섬', 4, highestChapter >= 4 ? 0x8B0000 : 0x555555, highestChapter >= 4);

        // 진행 상태 안내 텍스트
        const goalFontSize = width < 360 ? '16px' : '20px';
        if (pm.currentChapter <= 4) {
            const goal = pm.chapterGoals[pm.currentChapter];
            const nextNames = { 1: '연안', 2: '먼 바다', 3: '보물섬', 4: '엔딩' };
            const nextName = nextNames[pm.currentChapter] || '';
            const percent = Math.min(100, Math.floor((pm.gold / goal) * 100));
            this.add.text(width / 2, height * 0.76, `🎯 ${nextName} 해금: ${pm.gold} / ${goal} G (${percent}%)`, {
                fontSize: goalFontSize, fontFamily: 'Arial', color: '#FFD700',
                stroke: '#000', strokeThickness: 3
            }).setOrigin(0.5);
        } else {
            this.add.text(width / 2, height * 0.76, '🎉 모든 챕터 클리어! 상점에서 엔딩 아이템을 확인하세요!', {
                fontSize: goalFontSize, fontFamily: 'Arial', color: '#FFD700',
                stroke: '#000', strokeThickness: 3
            }).setOrigin(0.5);
        }

        // --- 물고기 기록 (마일스톤) 버튼 (중앙 하단) ---
        const milestoneBtnSize = width < 360 ? '20px' : '28px'; // Increased font size
        const milestoneBtn = this.add.text(width / 2, height * 0.85, '🐟 잡은 물고기 기록 보기', {
            fontSize: milestoneBtnSize,
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#FFFFFF',
            backgroundColor: '#FF8C00',
            padding: { x: 20, y: 12 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        milestoneBtn.on('pointerdown', () => {
            window.gameManagers.uiManager.openFishMilestonePopup(this);
        });

        // 펄스 애니메이션 추가
        this.tweens.add({
            targets: milestoneBtn,
            scale: { from: 1, to: 1.05 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // --- 초기화 버튼 (좌측 하단) ---
        const resetBtnSize = width < 360 ? '14px' : '18px';
        const resetBtn = this.add.text(20, height - 120, '⚠️ 데이터 초기화', {
            fontSize: resetBtnSize,
            fontFamily: 'Arial',
            color: '#FFCCCC',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: { x: 8, y: 5 }
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });

        resetBtn.on('pointerdown', () => {
            const firstConfirm = confirm("⚠️ 경고: 모든 게임 데이터(골드, 강화 능력치, 물고기 도감)가 영구적으로 삭제됩니다.\n정말로 초기화하시겠습니까?");
            if (firstConfirm) {
                const secondConfirm = confirm("다시 한번 확인합니다. 정말 모든 데이터를 지울까요? 이 작업은 취소할 수 없습니다.");
                if (secondConfirm) {
                    localStorage.removeItem('fishingGameData');
                    alert("데이터가 초기화되었습니다. 게임을 다시 시작합니다.");
                    window.location.reload();
                }
            }
        });

        resetBtn.on('pointerover', () => resetBtn.setTint(0xff0000));
        resetBtn.on('pointerout', () => resetBtn.clearTint());


    }

    createChapterButton(x, y, text, regionCode, color, isUnlocked) {
        // Button size responsive to screen width (mobile optimized)
        const maxBtnWidth = 320; // Reduced from 400
        const minBtnWidth = 240;
        const btnWidth = Phaser.Math.Clamp(Math.round(this.scale.width * 0.8), minBtnWidth, maxBtnWidth);
        const btnHeight = 66; // Reduced from 80
        // Adjust font size for small screens
        const btnFontSize = this.scale.width < 360 ? '20px' : '24px'; // Reduced from 24px/28px


        // 버튼 컨테이너
        const button = this.add.container(x, y);

        // 버튼 배경 (둥근 사각형 느낌을 위해 Graphics 사용 또는 잘라낸 이미지 사용 가능, 여기선 단순 Rectangle)
        const bg = this.add.rectangle(0, 0, btnWidth, btnHeight, color)
            .setInteractive({
                useHandCursor: true,
                hitArea: new Phaser.Geom.Rectangle(-10, -10, btnWidth + 20, btnHeight + 20),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains
            })
            .setStrokeStyle(4, 0xffffff);

        // 버튼 텍스트
        const btnText = this.add.text(0, 0, text, {
            fontSize: btnFontSize,
            fontFamily: 'Arial',
            color: '#FFFFFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        button.add([bg, btnText]);

        // 펄스 애니메이션 추가 ( Phraser Tween 사용)
        this.tweens.add({
            targets: button,
            scale: 1.02,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        if (!isUnlocked) {
            // 잠긴 챕터: 상호작용 완전 비활성화
            bg.disableInteractive();

            // 어두운 반투명 오버레이
            const overlay = this.add.rectangle(0, 0, btnWidth, btnHeight, 0x000000, 0.5);
            button.add(overlay);

            // 큰 자물쇠 아이콘 (중앙 배치)
            const lockIcon = this.add.text(0, 0, '🔒', {
                fontSize: '40px'
            }).setOrigin(0.5);
            button.add(lockIcon);

            // 텍스트 흐리게
            btnText.setAlpha(0.4);
            return; // 클릭 및 호버 이벤트 추가 안 함
        }

        // 호버 효과
        bg.on('pointerover', () => {
            const bright = this.brightenColor(color, 30);
            bg.setFillStyle(bright);
            this.tweens.add({ targets: button, scale: 1.05, duration: 100 });
        });

        bg.on('pointerout', () => {
            bg.setFillStyle(color);
            this.tweens.add({ targets: button, scale: 1.0, duration: 100 });
        });

        // 클릭 이벤트: 지역 코드를 들고 GameScene으로 진입
        bg.on('pointerdown', () => {
            window.gameManagers.soundManager.playCoin(); // 임시 효과음

            // 카메라 페이드 아웃 후 씬 전환
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                // 게임 첫 진입 시 (highestChapter가 1이고 돈이 0일 때) 첫 스토리 재생
                if (regionCode === 1 && window.gameManagers.playerModel.gold === 0 && !window.gameManagers.playerModel.hasSeenFirstStory) {
                    window.gameManagers.playerModel.hasSeenFirstStory = true; // 중복 재생 방지
                    window.gameManagers.playerModel.notify(); // 저장

                    this.scene.start('StoryScene', {
                        storyData: [
                            { speaker: '아빠', portrait: 'char_dad', text: '정우야, 아빠는 나라를 지키러 부대로 간단다. 엄마랑 세연이 잘 부탁해!' },
                            { speaker: '엄마', portrait: 'char_mom', text: '여보 조심히 다녀와요~ 정우야, 엄마는 집안일을 해야하니까 세연이랑 놀고있으렴.' },
                            { speaker: '세연', portrait: 'char_seyeon', text: '오빠... 나 배고파... 까까 사먹고 싶어!!' },
                            { speaker: '정우', portrait: 'char_jeongwoo', text: '걱정마 세연아! 오빠가 낚시로 물고기를 잡아서 돈을 벌어올게!!' }
                        ],
                        nextScene: 'GameScene',
                        nextSceneData: { region: regionCode }
                    });
                } else {
                    this.scene.start('GameScene', { region: regionCode });
                }
            });
        });
    }
}
