import { getRandomFish } from '../models/FishData.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        // 게임 상태 관리
        this.gameState = 'IDLE'; // IDLE, APPROACH, BITE, CATCH, REWARD
        this.catchGauge = 0;
        this.catchMax = 100;
        this.fish = null;
        this.lure = null;
        this.character = null;
        this.fishingLine = null;
        this.uiElements = {};

        // 디바운싱용 타임스탬프
        this.lastActionTime = 0;

        // 지역(챕터) 정보 (기본값: 1)
        this.region = 1;

        // --- 구제 시스템 (Fever Time) ---
        this.consecutiveFails = 0;   // 연속 실패 횟수
        this.isFeverTime = false;     // 현재 피버 타임 여부
        this.feverTimeRemaining = 0; // 피버 타임 남은 시간(ms)

        // --- 스플라인 물리 ---
        this.lineTension = 0; // 0~1 범위, 연타 중 올라감
    }

    init(data) {
        // IntroScene에서 넘어온 region 데이터 받기
        this.region = (data && data.region) ? data.region : 1;

        // 씬 재시작 시 상태 완전 초기화
        this.gameState = 'IDLE';
        this.catchGauge = 0;
        this.catchMax = 100;
        this.fish = null;
        this.lure = null;
        this.character = null;
        this.fishingLine = null;
        this.uiElements = {};
        this.lastActionTime = 0;
        this.consecutiveFails = 0;
        this.isFeverTime = false;
        this.feverTimeRemaining = 0;
        this.lineTension = 0;
        this.wanderingFishes = [];
    }

    create() {
        // --- 1. 배경 및 화면 셋업 ---
        const width = this.scale.width;
        const height = this.scale.height;

        // 배경 이미지 (화면 꽉 차게)
        let bgKey = 'bg_coast';
        if (this.region === 1) bgKey = 'bg_freshwater';
        else if (this.region === 3) bgKey = 'bg_sea';
        else if (this.region === 4) bgKey = 'bg_treasure_island';

        this.bg = this.add.image(width / 2, height / 2, bgKey);
        this.bg.setDisplaySize(width, height);
        this.bg.setInteractive(); // 배경 클릭으로 낚시 시작
        this.water = this.bg; // 기존 코드 호환을 위해 water 변수에 할당

        // 물고기 돌아다니는 실루엣 생성
        this.createWanderingFishes();

        // 상태창 UI (임시)
        const regionNames = { 1: "민물", 2: "연안", 3: "먼 바다", 4: "보물섬" };
        const instrFontSize = Math.max(18, Math.round(width * 0.044)) + 'px';
        this.uiElements.instruction = this.add.text(width / 2, height * 0.08, `${regionNames[this.region]}을 탭(클릭)해서 찌를 던지세요!`, {
            fontSize: instrFontSize, fontFamily: 'Arial', color: '#FFFFFF', stroke: '#000000', strokeThickness: 4,
            wordWrap: { width: width * 0.9 }
        }).setOrigin(0.5);
        // 현재 챕터 목표 표시 UI
        this.updateGoalText();

        // 피버 타임 텍스트 (화면 중앙 상단에 숨겨둠)
        this.uiElements.feverText = this.add.text(width / 2, height * 0.25, '🔥 FEVER TIME! 🔥', {
            fontSize: '40px', fontFamily: 'Arial', color: '#FF4500',
            stroke: '#FFD700', strokeThickness: 6
        }).setOrigin(0.5).setDepth(20).setVisible(false);

        // 연타 게이지바 (배경, 게이지) - 초기엔 숨김
        const gaugeWidth = Math.min(400, Math.round(width * 0.88));
        this.gaugeWidth = gaugeWidth;
        this.uiElements.gaugeBg = this.add.rectangle(width / 2, height * 0.18, gaugeWidth, 40, 0x333333).setDepth(10).setVisible(false);
        this.uiElements.gaugeBar = this.add.rectangle(width / 2 - gaugeWidth / 2, height * 0.18, 0, 40, 0x00FF00).setOrigin(0, 0.5).setDepth(11).setVisible(false);

        // 캐릭터 렌더링 (하단 선착장에 위치)
        // 지역마다 캐릭터가 조금 더 앞/뒤에 설 수 있게 조정 (임시)
        let charY = height * 0.8;
        if (this.region === 1) charY = height * 0.85;
        else if (this.region === 2) charY = height * 0.75;
        else if (this.region === 3) charY = height * 0.7;
        else if (this.region === 4) charY = height * 0.65;

        const charTexture = this.getCharacterTextureKey();
        this.character = this.add.image(width / 2, charY, charTexture).setDepth(3).setScale(1.26);

        this.fishingLine = this.add.graphics();
        this.fishingLine.setDepth(1); // 찌(2) 아래, 물고기(1)와 동일선상 (물 위)

        // 찌 (Lure) 스프라이트 - 초기 숨김
        this.lure = this.add.image(0, 0, 'lure').setVisible(false).setDepth(2);
        this.lure.setScale(0.129); // 루어 크기 3배 확대 (기존 0.043 기준)

        // 물고기 (Fish) 스프라이트 - 초기 숨김 (나중에 텍스처 변경)
        this.fish = this.add.image(0, 0, 'fish_pirami').setVisible(false).setDepth(1);

        // 큰 느낌표 텍스트 (입질용)
        this.uiElements.exclamation = this.add.text(0, 0, '!', {
            fontSize: '120px', fontFamily: 'Arial', color: '#FFFF00', stroke: '#FF0000', strokeThickness: 10
        }).setOrigin(0.5).setVisible(false).setDepth(5);

        // --- 수면 과녁 힌트 (IDLE 상태에서 깜빡거림) ---
        this.uiElements.targetHint = this.add.circle(width / 2, height * 0.7, 30, 0xffffff, 0)
            .setStrokeStyle(3, 0xffffff, 0.6).setDepth(4).setVisible(true);
        this.uiElements.targetHintInner = this.add.circle(width / 2, height * 0.7, 10, 0xffffff, 0)
            .setStrokeStyle(2, 0xffffff, 0.6).setDepth(4).setVisible(true);
        this.tweens.add({
            targets: [this.uiElements.targetHint, this.uiElements.targetHintInner],
            alpha: { from: 0.3, to: 1 },
            scaleX: { from: 0.8, to: 1.2 },
            scaleY: { from: 0.8, to: 1.2 },
            yoyo: true, repeat: -1, duration: 800, ease: 'Sine.easeInOut'
        });

        // --- 뒤로 가기 버튼 (좌측 상단) ---
        const backBtnFontSize = width < 360 ? '16px' : '20px';
        const backBtn = this.add.text(10, 10, '⬅️ 뒤로 가기', {
            fontSize: backBtnFontSize,
            fontFamily: 'Arial', color: '#FFFFFF',
            stroke: '#000000', strokeThickness: 3,
            backgroundColor: '#444444',
            padding: { x: 8, y: 5 }
        }).setDepth(20).setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => backBtn.setBackgroundColor('#666666'));
        backBtn.on('pointerout', () => backBtn.setBackgroundColor('#444444'));

        backBtn.on('pointerdown', () => {
            window.gameManagers.soundManager.playCoin();
            this.tweens.killAll();
            this.scene.start('IntroScene');
        });

        // --- 2. 입력 이벤트 핸들러 (강화된 디바운스 적용) ---
        this.input.on('pointerdown', (pointer) => {
            const now = this.time.now;
            if (this.gameState === 'CATCH') {
                if (now - this.lastActionTime < 50) return;
            } else {
                if (now - this.lastActionTime < 200) return;
            }
            this.lastActionTime = now;
            this.handlePointerDown(pointer);
        });

        console.log("GameScene Initialized with Core Loops");
    }

    getCharacterTextureKey() {
        const rodPower = window.gameManagers.playerModel.stats.rodPower;
        return `char_lv${rodPower}`;
    }

    updateCharacterTexture() {
        if (this.character) {
            const newTexture = this.getCharacterTextureKey();
            this.character.setTexture(newTexture);

            // 시각적 피드백 (반짝임) - 크기가 1.26배이므로 맞춰서 수정
            this.tweens.add({
                targets: this.character,
                scale: { from: 1.26, to: 1.092 },
                duration: 300,
                ease: 'Bounce.easeOut'
            });

            // 빛나는 효과 파티클
            const particles = this.add.particles(0, 0, 'dummy', {
                x: this.character.x,
                y: this.character.y - 20,
                speed: { min: -100, max: 100 },
                angle: { min: 0, max: 360 },
                scale: { start: 1, end: 0 },
                lifespan: 800,
                blendMode: 'ADD',
                tint: 0xFFD700
            });

            // 파티클 텍스처 (하얀 원)
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            g.fillStyle(0xffffff);
            g.fillCircle(4, 4, 4);
            g.generateTexture('charUpgradeParticle', 8, 8);
            particles.setTexture('charUpgradeParticle');

            particles.explode(20);
            this.time.delayedCall(1000, () => particles.destroy());
        }
    }


    createWanderingFishes() {
        this.wanderingFishes = [];
        const numFishes = Phaser.Math.Between(4, 7);
        for (let i = 0; i < numFishes; i++) {
            const fData = getRandomFish(0, this.region);

            const x = Phaser.Math.Between(-200, this.scale.width + 200);
            const y = Phaser.Math.Between(this.scale.height * 0.4, this.scale.height * 0.9);

            const fish = this.add.image(x, y, fData.id);
            fish.setTint(0x000000); // 검은색
            fish.setAlpha(0.15); // 실루엣 투명도
            fish.setScale(fData.scale);
            fish.setDepth(0); // 배경 바로 위, 찌보다 아래

            fish.speed = Phaser.Math.Between(20, 60);
            fish.direction = (Math.random() > 0.5) ? 1 : -1;
            fish.flipX = fish.direction === 1; // 1이면 오른쪽, -1이면 왼쪽 이동

            this.wanderingFishes.push(fish);
        }
    }

    handlePointerDown(pointer) {
        // [Phase 1: Approach-Lure] 바다를 클릭하여 찌 던지기
        if (this.gameState === 'IDLE') {
            // 지역별 낚시 가능 영역 (더 넓게 조정 — 화면 상단 30% 이하면 어디든 던질 수 있음)
            let clickableLimitY;
            if (this.region === 1) clickableLimitY = this.scale.height * 0.3;
            else if (this.region === 2) clickableLimitY = this.scale.height * 0.3;
            else clickableLimitY = this.scale.height * 0.25;

            if (pointer.y > clickableLimitY) {
                this.startApproach(pointer.x, pointer.y);
            } else {
                this.uiElements.instruction.setText('물 쪽을 클릭하세요!');
                this.time.delayedCall(1500, () => {
                    if (this.gameState === 'IDLE') {
                        const regionNames = { 1: "민물", 2: "연안", 3: "먼 바다" };
                        this.uiElements.instruction.setText(`${regionNames[this.region]}을 탭(클릭)해서 찌를 던지세요!`);
                    }
                });
            }
        }
        // [Phase 2: Bite] 입질이 왔을 때 클릭해서 챔질(Catch) 시작
        else if (this.gameState === 'BITE') {
            this.startCatch();
        }
        // [Phase 3: Catch] 버튼 연타
        else if (this.gameState === 'CATCH') {
            this.mashButton();
        }
    }

    // --- Phase 1: 찌 던지기 (Approach) ---
    startApproach(targetX, targetY) {
        this.gameState = 'APPROACH';
        this.uiElements.instruction.setText('기다리는 중...');

        // 과녁 힌트 숨기기
        this.uiElements.targetHint.setVisible(false);
        this.uiElements.targetHintInner.setVisible(false);

        // 찌를 클릭한 위치로 표시 시작 (애니메이션 시작 지점 = 캐릭터 낚싯대 끝부분)
        this.lure.setPosition(this.character.x, this.character.y - 10);
        this.lure.setVisible(true);

        window.gameManagers.soundManager.playDrop();

        this.tweens.add({
            targets: this.lure,
            x: targetX,
            y: targetY,
            duration: 800,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.waitForBite(targetX, targetY);
            }
        });
    }

    // Phase 1 -> 2 대기
    waitForBite(lureX, lureY) {
        const chanceLevel = window.gameManagers.playerModel.stats.catchChance;
        const baseMaxWait = this.region === 4 ? 5000 : 4000;
        const maxWait = Math.max(1000, baseMaxWait - (chanceLevel * 200));
        const waitTime = Phaser.Math.Between(1000, maxWait);

        // 물고기 종류 결정 (Rod Luck 적용)
        const rodLuckLevel = window.gameManagers.playerModel.stats.rodLuck;
        this.currentFish = getRandomFish(rodLuckLevel, this.region);

        // --- 3~5마리 물고기 접근 연출 ---
        this.approachFishes = [];
        const numFishes = Phaser.Math.Between(3, 5);
        const biterIndex = Phaser.Math.Between(0, numFishes - 1);

        for (let i = 0; i < numFishes; i++) {
            const isBiter = (i === biterIndex);

            // 물고기 종류: 무는 놈은 currentFish, 나머지는 랜덤
            const fData = isBiter ? this.currentFish : getRandomFish(0, this.region);

            // 사방에서 등장하도록 랜덤 시작 위치
            const side = Phaser.Math.Between(0, 3);
            let startX, startY;
            if (side === 0) { startX = lureX + Phaser.Math.Between(150, 300); startY = lureY + Phaser.Math.Between(-80, 80); }
            else if (side === 1) { startX = lureX - Phaser.Math.Between(150, 300); startY = lureY + Phaser.Math.Between(-80, 80); }
            else if (side === 2) { startX = lureX + Phaser.Math.Between(-100, 100); startY = lureY + Phaser.Math.Between(100, 200); }
            else { startX = lureX + Phaser.Math.Between(-100, 100); startY = lureY - Phaser.Math.Between(100, 200); }

            const fishSprite = this.add.image(startX, startY, fData.id);
            fishSprite.setScale(fData.scale * 1.2);
            fishSprite.setDepth(1);
            fishSprite.setAlpha(0.8);
            fishSprite.flipX = (startX > lureX); // 찌를 바라보도록

            if (isBiter) {
                // === 무는 물고기: 찌까지 직행 ===
                this.tweens.add({
                    targets: fishSprite,
                    x: lureX,
                    y: lureY + 10,
                    duration: waitTime,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        this.startBite(lureX, lureY);
                    }
                });
                // 메인 fish 스프라이트에도 반영 (입질 연출용)
                this.fish.setTexture(this.currentFish.id);
                this.fish.setScale(this.currentFish.scale * 1.5);
                console.log(`[DEBUG FISH] ${this.currentFish.id} | FishData scale: ${this.currentFish.scale} | applied: ${this.currentFish.scale * 1.5} | sprite displayW: ${this.fish.displayWidth}, displayH: ${this.fish.displayHeight}`);
                this.fish.clearTint();
                this.fish.setVisible(false); // 접근 중에는 approachFish가 보이므로 숨김
            } else {
                // === 안 무는 물고기: 다양한 행동 ===
                const behavior = Phaser.Math.Between(0, 2);

                if (behavior === 0) {
                    // (A) 거의 물 뻔하다 턱 돌아감
                    const nearX = lureX + Phaser.Math.Between(-30, 30);
                    const nearY = lureY + Phaser.Math.Between(-20, 30);
                    const approachTime = Phaser.Math.Between(800, waitTime * 0.7);
                    this.tweens.add({
                        targets: fishSprite,
                        x: nearX, y: nearY,
                        duration: approachTime,
                        ease: 'Sine.easeInOut',
                        onComplete: () => {
                            // 턱 돌아감
                            fishSprite.flipX = !fishSprite.flipX;
                            this.tweens.add({
                                targets: fishSprite,
                                x: startX + Phaser.Math.Between(-100, 100),
                                y: startY,
                                alpha: 0,
                                duration: 1000,
                                ease: 'Quad.easeIn',
                                onComplete: () => fishSprite.destroy()
                            });
                        }
                    });
                } else if (behavior === 1) {
                    // (B) 관심 없이 느릿느릿 지나감
                    const passX = startX > lureX ? lureX - 200 : lureX + 200;
                    this.tweens.add({
                        targets: fishSprite,
                        x: passX,
                        y: startY + Phaser.Math.Between(-30, 30),
                        duration: Phaser.Math.Between(2000, 3500),
                        ease: 'Linear',
                        onComplete: () => fishSprite.destroy()
                    });
                } else {
                    // (C) 빙글빙글 주위를 맴돌다 떠남
                    const orbitRadius = Phaser.Math.Between(60, 120);
                    const orbitDuration = Phaser.Math.Between(1500, 2500);
                    this.tweens.add({
                        targets: fishSprite,
                        x: lureX + orbitRadius * 0.7,
                        y: lureY - orbitRadius * 0.3,
                        duration: orbitDuration * 0.3,
                        ease: 'Sine.easeInOut',
                        onComplete: () => {
                            fishSprite.flipX = !fishSprite.flipX;
                            this.tweens.add({
                                targets: fishSprite,
                                x: lureX - orbitRadius,
                                y: lureY + orbitRadius * 0.5,
                                duration: orbitDuration * 0.4,
                                ease: 'Sine.easeInOut',
                                onComplete: () => {
                                    this.tweens.add({
                                        targets: fishSprite,
                                        x: startX, y: startY + 150,
                                        alpha: 0,
                                        duration: orbitDuration * 0.3,
                                        onComplete: () => fishSprite.destroy()
                                    });
                                }
                            });
                        }
                    });
                }
            }
            this.approachFishes.push(fishSprite);
        }
    }

    // 접근 물고기 전부 제거
    clearApproachFishes() {
        if (this.approachFishes) {
            this.approachFishes.forEach(f => {
                if (f && f.active) {
                    this.tweens.killTweensOf(f);
                    f.destroy();
                }
            });
            this.approachFishes = [];
        }
    }

    // --- Phase 2: 입질 (Bite) ---
    startBite(x, y) {
        this.gameState = 'BITE';
        this.uiElements.instruction.setText('지금 탭하세요!!!');

        // 느낌표를 화면 중앙에 크게 표시 (즉각적 피드백)
        this.uiElements.exclamation.setPosition(this.scale.width / 2, this.scale.height / 2 - 50);
        this.uiElements.exclamation.setVisible(true);
        this.uiElements.exclamation.setRotation(0);

        window.gameManagers.soundManager.playBite();

        // 느낌표 애니메이션: 스케일 펄스 + 거친 회전 진동
        this.tweens.add({
            targets: this.uiElements.exclamation,
            scale: { from: 0.8, to: 2.0 },
            yoyo: true,
            repeat: -1,
            duration: 150
        });
        this.tweens.add({
            targets: this.uiElements.exclamation,
            rotation: { from: -0.15, to: 0.15 },
            yoyo: true,
            repeat: -1,
            duration: 60,
            ease: 'Sine.easeInOut'
        });

        // 화면 번쩍 (빨간빛으로 위급함 전달)
        this.cameras.main.flash(200, 255, 50, 50, true);

        // 찌 요동치게
        this.tweens.add({
            targets: this.lure,
            x: x + 10,
            yoyo: true,
            repeat: -1,
            duration: 50
        });

        // 일정 시간 내에 클릭 안 하면 실패 (보물섬은 1.2초로 단축)
        const biteTimeout = this.region === 4 ? 1200 : 1500;
        this.time.delayedCall(biteTimeout, () => {
            if (this.gameState === 'BITE') {
                this.failFishing('물고기가 도망갔어요...');
            }
        });
    }

    // --- Phase 3: 잡기 (Catch - 연타) ---
    startCatch() {
        this.gameState = 'CATCH';
        this.lineTension = 0;

        // 물고기 등급별로 Catch Max(체력)가 다름
        this.catchMax = this.currentFish.catchMax || 100;
        this.catchGauge = this.catchMax * 0.15; // 초기 게이지 15% 제공

        // --- Fever Time 적용 체크 ---
        if (this.consecutiveFails >= 3) {
            this.activateFeverTime();
        }

        this.uiElements.instruction.setText('화면을 마구 연타하세요!!!');

        // 기존 이펙트 정리
        this.tweens.killTweensOf(this.uiElements.exclamation);
        this.tweens.killTweensOf(this.lure);
        this.uiElements.exclamation.setVisible(false);
        // 접근 물고기들 정리
        this.clearApproachFishes();
        // CATCH 단계에서는 찌를 다시 보이게 (스플라인 연출용)
        this.lure.setVisible(true);
        this.fish.setVisible(false);

        // 게이지 UI 표시
        this.uiElements.gaugeBg.setVisible(true);
        this.uiElements.gaugeBar.setVisible(true);
        this.updateGaugeUI();

        // 카메라 줌인 효과 (몰입감)
        this.cameras.main.zoomTo(1.1, 300);
    }

    activateFeverTime() {
        this.isFeverTime = true;
        this.feverTimeRemaining = 5000; // 5초
        this.consecutiveFails = 0;

        // UI 표시
        this.uiElements.feverText.setVisible(true);
        this.tweens.add({
            targets: this.uiElements.feverText,
            scale: { from: 0.5, to: 1.3 },
            yoyo: true,
            repeat: -1,
            duration: 300
        });

        // 화면 플래시 + 사운드
        this.cameras.main.flash(500, 255, 100, 0);
        window.gameManagers.soundManager.playSuccess();
    }

    endFeverTime() {
        this.isFeverTime = false;
        this.feverTimeRemaining = 0;
        this.tweens.killTweensOf(this.uiElements.feverText);
        this.uiElements.feverText.setVisible(false);
    }

    mashButton() {
        // --- 새 수식: Progress = (RodPower * ReelSpeed) / FishDifficulty ---
        const powerLevel = window.gameManagers.playerModel.stats.rodPower;
        const reelLevel = window.gameManagers.playerModel.stats.reelSpeed;
        const fishDifficulty = this.currentFish.difficulty || 1.0;

        // 기본 진행도 = (rodPower * reelSpeed) / difficulty, 최소 5
        const progress = Math.max(5, (powerLevel * reelLevel) / fishDifficulty);
        this.catchGauge += progress;

        // 장력(Tension) 증가 (스플라인용)
        this.lineTension = Phaser.Math.Clamp(this.lineTension + 0.15, 0, 1);

        // 타격감: 화면 미세 흔들림 (Redundant Feedback)
        this.cameras.main.shake(100, 0.005);
        window.gameManagers.soundManager.playTapping();

        this.updateGaugeUI();

        if (this.catchGauge >= this.catchMax) {
            this.successFishing();
        }
    }

    updateGaugeUI() {
        const gaugeWidth = this.gaugeWidth || 400;
        const widthPercent = Phaser.Math.Clamp(this.catchGauge / this.catchMax, 0, 1);
        this.uiElements.gaugeBar.width = gaugeWidth * widthPercent;

        // 색상 변화 피드백 (주황 -> 초록)
        if (widthPercent < 0.5) this.uiElements.gaugeBar.fillColor = 0xFFA500;
        else this.uiElements.gaugeBar.fillColor = 0x00FF00;
    }

    successFishing() {
        this.gameState = 'REWARD';
        this.cameras.main.zoomTo(1, 300);
        this.uiElements.gaugeBg.setVisible(false);
        this.uiElements.gaugeBar.setVisible(false);
        this.lure.setVisible(false);
        this.lineTension = 0;

        // 피버 타임 해제
        if (this.isFeverTime) this.endFeverTime();

        // 연속 실패 초기화 (성공했으므로)
        this.consecutiveFails = 0;

        // 화려한 피드백 (화면 흔들림 크게 + 텍스트)
        this.cameras.main.shake(300, 0.02);
        this.cameras.main.flash(500, 255, 255, 255);
        window.gameManagers.soundManager.playSuccess();

        this.uiElements.instruction.setText(`${this.currentFish.name}을(를) 잡았습니다!`);

        // 임시 파티클 폭죽 (스퀘어 모양)
        const particles = this.add.particles(0, 0, 'dummy', {
            x: this.scale.width / 2,
            y: this.scale.height / 2,
            speed: { min: -400, max: 400 },
            angle: { min: 0, max: 360 },
            scale: { start: 2 * this.currentFish.scale, end: 0 },
            lifespan: 1000,
            blendMode: 'ADD',
            tint: [this.currentFish.color, 0xffffff]
        });

        // 폭죽 파티클 텍스처 (하얀 원 모양)
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xffffff);
        g.fillCircle(8, 8, 8);
        g.generateTexture('particleTexture', 16, 16);
        particles.setTexture('particleTexture');

        particles.explode(50); // 한 번 터뜨림

        // 물고기 종류에 따른 기본 보상
        const baseGold = this.currentFish.baseReward;

        let milestoneStoryData = null; // 마일스톤 달성 시 재생할 스토리 데이터

        // 도감(PlayerModel)에 추가 및 마일스톤(10, 20, 50마리) 체크 (특별 아이템은 제외)
        if (!this.currentFish.isSpecialItem) {
            window.gameManagers.playerModel.addFish(this.currentFish.id);

            const count = window.gameManagers.playerModel.fishCollection[this.currentFish.id];
            const fishId = this.currentFish.id;
            const fishName = this.currentFish.name;
            const model = window.gameManagers.playerModel;

            if (!model.fishMilestonesSeen[fishId]) {
                model.fishMilestonesSeen[fishId] = {};
            }

            let title = '';
            if (count === 10 && !model.fishMilestonesSeen[fishId][10]) {
                title = '왕자';
                model.fishMilestonesSeen[fishId][10] = true;
            } else if (count === 20 && !model.fishMilestonesSeen[fishId][20]) {
                title = '왕';
                model.fishMilestonesSeen[fishId][20] = true;
            } else if (count === 50 && !model.fishMilestonesSeen[fishId][50]) {
                title = '대마왕';
                model.fishMilestonesSeen[fishId][50] = true;
            }

            if (title !== '') {
                model.notify(); // 저장
                milestoneStoryData = [
                    { speaker: '상점 할아버지', portrait: null, text: `허허! ${fishName}만 ${count}마리를 낚다니!\n너에게 [ ${fishName} ${title} ] 칭호를 주마!` },
                    { speaker: '정우', portrait: 'char_jeongwoo', text: `감사합니다! 제가 바로 ${fishName} ${title}입니다!!` }
                ];

                // 특정 물고기에 대한 재미있는 대사 추가
                if (fishName === '붕어') {
                    milestoneStoryData.push({ speaker: '세연', portrait: 'char_seyeon', text: '오빠!! 붕어빵은 왜 안나와?? 붕어빵 먹고 싶어!' });
                } else if (fishName === '피라미') {
                    milestoneStoryData.push({ speaker: '아빠', portrait: 'char_dad', text: '정우야, 피라미드랑 피라미는 다른거란다 하하하!' });
                } else if (fishName === '미꾸라지') {
                    milestoneStoryData.push({ speaker: '엄마', portrait: 'char_mom', text: '어휴 미끌미끌해라! 오늘 저녁은 추어탕이다!' });
                } else if (fishName === '고등어') {
                    milestoneStoryData.push({ speaker: '엄마', portrait: 'char_mom', text: '고갈비 해먹으면 참 맛있겠네~ 구워먹자!' });
                } else if (fishName === '참돔') {
                    milestoneStoryData.push({ speaker: '상점 할아버지', portrait: null, text: '그 귀한 참돔을 이리 많이 낚다니... 넌 전설이다 꼬마야!' });
                }
            }
        }

        // 2초 후 폭죽 파티클 제거 및 퀴즈 연동
        this.time.delayedCall(2000, async () => {
            particles.destroy();

            let finalGold = baseGold;

            if (this.currentFish.isSpecialItem) {
                // 특별 아이템은 퀴즈를 진행하지 않고 즉시 보상 혹은 텍스트 판정
                if (this.currentFish.id === 'item_treasure') {
                    this.uiElements.instruction.setText('대박! 황금 보물상자를 낚았습니다!');
                    this.cameras.main.flash(500, 255, 215, 0);
                    window.gameManagers.soundManager.playSuccess();
                } else if (this.currentFish.id === 'item_treasure_map') {
                    this.uiElements.instruction.setText('오! 보물 지도의 한 조각이다! 어딘가에 보물이 숨겨져 있나봐!');
                    this.cameras.main.flash(500, 222, 184, 135);
                    window.gameManagers.soundManager.playSuccess();
                } else if (this.currentFish.id === 'item_pirates_sword') {
                    this.uiElements.instruction.setText('옛날 해적이 쓰던 녹슨 칼이네... 멋있다!');
                } else if (this.currentFish.id === 'item_pearl') {
                    this.uiElements.instruction.setText('와!! 엄청 큰 진주다!! 엄마한테 선물해야지!');
                    this.cameras.main.flash(500, 255, 250, 240);
                    window.gameManagers.soundManager.playSuccess();
                } else if (this.currentFish.id === 'item_crown') {
                    this.uiElements.instruction.setText('전설의 해적왕이 남긴 왕관!! 대박이다!!');
                    this.cameras.main.flash(800, 255, 215, 0);
                    window.gameManagers.soundManager.playSuccess();
                } else if (this.currentFish.id === 'item_shoe') {
                    const shoeMessages = [
                        '에구... 누군가 버린 낡은 신발이네요.',
                        '아이고~ 물고기인 줄 알았는데 낡은 장화였네요!',
                        '구멍 난 신발이 올라왔어요. 발 냄새가 나는 것 같아요!',
                        '낚싯줄에 웬 신발이? 바다에 쓰레기를 버리면 안 돼요!',
                        '앗! 짝 잃은 신발이네요. 나머지 한 짝은 어디 있을까요?'
                    ];
                    const randomMsg = shoeMessages[Math.floor(Math.random() * shoeMessages.length)];
                    this.uiElements.instruction.setText(randomMsg);
                } else if (this.currentFish.id === 'item_trash') {
                    const trashMessages = [
                        '앗... 빈 깡통을 낚았습니다. 바다를 깨끗하게!',
                        '찌글찌글한 고철 덩어리가 올라왔어요. 지구가 아파해요!',
                        '물고기 대신 쓰레기가... 바다를 더 아껴줘야겠어요.',
                        '이런! 바닷속에 쓰레기가 너무 많나 봐요.',
                        '어머나, 빈 병이 올라왔네요. 분리수거를 잘해야겠어요!'
                    ];
                    const randomMsg = trashMessages[Math.floor(Math.random() * trashMessages.length)];
                    this.uiElements.instruction.setText(randomMsg);
                }
            } else {
                // 50% 확률 수학 퀴즈 팝업 (UIManager 연동)
                const quizResult = await window.gameManagers.uiManager.showMathQuiz(this.region);
                let showTypingQuiz = false;

                if (quizResult === true) {
                    // 정답 시 20% 추가 보상
                    finalGold = Math.floor(finalGold * 1.2);
                    this.cameras.main.flash(300, 255, 215, 0); // 황금색 플래시 보너스 피드백

                    // 수학 퀴즈 맞춘 후 타이핑 퀴즈 (보물섬은 50%, 기본 35%)
                    const typingQuizChance = this.region === 4 ? 0.50 : 0.35;
                    if (Math.random() < typingQuizChance) {
                        showTypingQuiz = true;
                    }
                } else if (quizResult === false) {
                    // 오답 시 50% 삭감
                    finalGold = Math.floor(baseGold * 0.5);
                    this.cameras.main.shake(300, 0.02); // 오답 피드백 흔들림
                }

                // 타이핑 퀴즈 실행 (수학 퀴즈 정답 시 35% 확률)
                if (showTypingQuiz) {
                    const typingResult = await window.gameManagers.uiManager.showTypingQuiz();
                    if (typingResult) {
                        // 타이핑 퀴즈 정답 시 기존 보상값(finalGold)의 20% 추가 상승 (복리 계산)
                        finalGold = Math.floor(finalGold * 1.2);
                        this.cameras.main.flash(300, 255, 20, 147); // 핑크색 플래시 보너스 피드백
                    }
                }
            }

            // --- Rod Luck 보너스 코인 주머니 ---
            const rodLuckLevel = window.gameManagers.playerModel.stats.rodLuck;
            const bonusChance = rodLuckLevel * 0.05; // 레벨당 5% 확률
            if (Math.random() < bonusChance) {
                const bonusGold = Phaser.Math.Between(20, 50 + rodLuckLevel * 10);
                finalGold += bonusGold;
                this.cameras.main.flash(200, 255, 255, 0);

                // 보너스 알림 텍스트
                const bonusText = this.add.text(this.scale.width / 2, this.scale.height * 0.4, `💰 보너스 코인 주머니! +${bonusGold}G`, {
                    fontSize: '36px', fontFamily: 'Arial', color: '#FFD700',
                    stroke: '#000000', strokeThickness: 5
                }).setOrigin(0.5).setDepth(50);
                this.tweens.add({
                    targets: bonusText,
                    y: bonusText.y - 80,
                    alpha: 0,
                    duration: 1500,
                    onComplete: () => bonusText.destroy()
                });
            }

            // 전역 PlayerModel에 골드 추가
            window.gameManagers.playerModel.addGold(finalGold);
            console.log(`획득 골드: ${finalGold} (현재 총합: ${window.gameManagers.playerModel.gold})`);

            // --- 획득 금액 플로팅 텍스트 애니메이션 추가 ---
            const floatingText = this.add.text(this.scale.width / 2, this.scale.height * 0.5, `+${finalGold}G`, {
                fontSize: '48px',
                fontFamily: 'Arial',
                color: '#FFD700',
                stroke: '#000',
                strokeThickness: 6,
                fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(100);

            this.tweens.add({
                targets: floatingText,
                y: floatingText.y - 120,
                alpha: 0,
                duration: 1500,
                ease: 'Power2',
                onComplete: () => floatingText.destroy()
            });
            // ------------------------------------------

            this.updateGoalText();

            // --- 챕터 진행 및 중간 이벤트 체크 ---
            const model = window.gameManagers.playerModel;
            if (model.currentChapter <= 4) {
                if (model.checkChapterGoal()) {
                    // 목표 달성 시 챕터 전환
                    this.triggerStoryTransition();
                    return;
                } else {
                    // 목표액의 50% 달성 시 중간 격려 이벤트 (각 챕터별 1회)
                    const goal = model.chapterGoals[model.currentChapter];
                    if (model.gold >= goal / 2 && !model.hasSeenMidChapterEvent[model.currentChapter]) {
                        model.hasSeenMidChapterEvent[model.currentChapter] = true;
                        model.notify(); // 저장

                        let midStoryData = [];
                        if (model.currentChapter === 1) {
                            midStoryData = [
                                { speaker: '엄마', portrait: 'char_mom', text: '정우야~ 벌써 목표 금액의 반이나 모았네! 근데 밥은 언제 먹으러 올거니?' },
                                { speaker: '정우', portrait: 'char_jeongwoo', text: '물고기가 밥인데 무슨 소리세요 엄마! 좀만 더 잡을게요!' }
                            ];
                        } else if (model.currentChapter === 2) {
                            midStoryData = [
                                { speaker: '상점 할아버지', portrait: null, text: '허허, 꼬마야. 벌써 배 살 돈을 반이나 모았군. 대단혀~' },
                                { speaker: '정우', portrait: 'char_jeongwoo', text: '할아버지 조금만 기다리세요. 제가 여기 바다 씨를 말려버릴테니까요!' }
                            ];
                        } else if (model.currentChapter === 3) {
                            midStoryData = [
                                { speaker: '세연', portrait: 'char_seyeon', text: '오빠!! 까까 살 돈 반이나 모아써?!' },
                                { speaker: '정우', portrait: 'char_jeongwoo', text: '세연아, 원양어선에는 과자 공장이 통째로 실려있단다. 기다려라!!' }
                            ];
                        } else if (model.currentChapter === 4) {
                            midStoryData = [
                                { speaker: '아빠', portrait: 'char_dad', text: '(전화) 정우야! 보물섬에 갔다며?! 거기 위험하진 않고?' },
                                { speaker: '정우', portrait: 'char_jeongwoo', text: '아빠 괜찮아요! 저 여기서 대왕오징어도 봤어요!!' },
                                { speaker: '세연', portrait: 'char_seyeon', text: '오빠!! 보물 찾으면 나도 줘!!!' }
                            ];
                        }

                        // 이벤트를 보고 난 후 다시 GameScene으로 돌아오도록 설정
                        this.scene.start('StoryScene', {
                            storyData: midStoryData,
                            nextScene: 'GameScene',
                            nextSceneData: {}
                        });
                        return;
                    }
                }
            }

            // --- 보물섬 전용 랜덤 이벤트 (5% 확률) ---
            if (this.region === 4 && !this.currentFish.isSpecialItem && Math.random() < 0.05) {
                this.triggerTreasureIslandEvent();
            }

            // --- 마일스톤 달성 스토리(칭호) ---
            if (milestoneStoryData) {
                this.scene.start('StoryScene', {
                    storyData: milestoneStoryData,
                    nextScene: 'GameScene',
                    nextSceneData: {}
                });
                return;
            }

            this.resetFishing();
        });
    }

    failFishing(msg = '물고기가 도망갔어요...') {
        this.gameState = 'IDLE';
        this.tweens.killTweensOf(this.uiElements.exclamation);
        this.tweens.killTweensOf(this.lure);
        this.uiElements.exclamation.setVisible(false);
        this.lure.setVisible(false);
        this.fish.setVisible(false);
        this.lineTension = 0;
        this.clearApproachFishes();

        if (this.isFeverTime) this.endFeverTime();
        this.consecutiveFails++;

        // 지역별 랜덤 실패 메시지 생성
        let finalMsg = msg;
        const randomChance = Math.random();

        // 약 40% 확률로 특수 메시지 출력 (기존 메시지가 있을 경우)
        if (randomChance < 0.4) {
            if (this.region === 1) {
                const freshMessages = [
                    '어라 오리가 잡아간건가?',
                    '똥새가 내걸 낚아챘어!',
                    '놓치고 주변을 둘러보니 새매가 옆에 있었다.',
                    '아 빵먹고싶다'
                ];
                finalMsg = freshMessages[Math.floor(Math.random() * freshMessages.length)];
            } else if (this.region === 4) {
                const treasureMessages = [
                    '해적 유령이 물고기를 가져갔어!',
                    '앗! 대왕문어 다리에 감겨서 놓쳤어!',
                    '바다 귀신이 방해한 거야! 분명히!',
                    '보물 지키는 수호신이 장난치나봐...',
                    '크라켄이 우리 물고기를 빼앗아갔어!!'
                ];
                finalMsg = treasureMessages[Math.floor(Math.random() * treasureMessages.length)];
            } else {
                const seaMessages = [
                    '아! 놓치고 보니 범고래였어!!',
                    '뭐지? 놓친 물고기가 아빠처럼 생긴 고기였어!!'
                ];
                finalMsg = seaMessages[Math.floor(Math.random() * seaMessages.length)];
            }
        }

        // 연속 실패 UI 피드백
        if (this.consecutiveFails >= 2) {
            const warnText = this.consecutiveFails >= 3
                ? '🔥 다음 낚시는 피버타임!'
                : `연속 실패 ${this.consecutiveFails}회...`;
            finalMsg += `\n${warnText}`;
        }

        if (window.gameManagers && window.gameManagers.uiManager) {
            window.gameManagers.uiManager.showFailModal(finalMsg);
        } else {
            this.uiElements.instruction.setText(finalMsg);
        }

        this.cameras.main.shake(200, 0.01);
        window.gameManagers.soundManager.playFail();

        this.time.delayedCall(1500, () => {
            this.resetFishing();
        });
    }

    updateGoalText() {
        if (!this.uiElements.goalText) {
            this.uiElements.goalText = this.add.text(this.scale.width / 2, this.scale.height * 0.15, '', {
                fontSize: '24px', fontFamily: 'Arial', color: '#FFD700', stroke: '#000000', strokeThickness: 3
            }).setOrigin(0.5);
        }

        const model = window.gameManagers.playerModel;
        const currentGold = model.gold;

        // 모든 챕터 클리어
        if (model.highestChapter > 4) {
            this.uiElements.goalText.setText('🎉 모든 챕터 클리어! 상점에서 엔딩 아이템을 확인하세요!');
            return;
        }

        // 현재 플레이 중인 지역이 아직 미해금 프론티어 챕터일 때만 목표 표시
        if (this.region === model.currentChapter && model.currentChapter <= 4) {
            const goal = model.chapterGoals[model.currentChapter];
            const nextRegionNames = { 1: '연안 해금', 2: '먼 바다 해금', 3: '보물섬 해금', 4: '엔딩 해금' };
            const label = nextRegionNames[model.currentChapter] || '목표';
            const percent = Math.min(100, Math.floor((currentGold / goal) * 100));

            this.uiElements.goalText.setText(`🎯 ${label}: ${currentGold} / ${goal} G (${percent}%)`);
        } else if (this.region < model.currentChapter) {
            // 이미 클리어한 지역에서 자유 낚시 중
            this.uiElements.goalText.setText('✅ 이 지역은 클리어! 자유낚시 중~');
        } else {
            this.uiElements.goalText.setText('');
        }
    }

    triggerStoryTransition() {
        this.gameState = 'STORY';
        const currentCh = window.gameManagers.playerModel.currentChapter;

        window.gameManagers.playerModel.advanceChapter();

        let storyData = [];
        let nextScene = 'IntroScene';

        if (currentCh === 1) {
            storyData = [
                { speaker: '세연', portrait: 'char_seyeon', text: '오빠!! 맛있는 까까 사왔어?! 진짜 맛있겠다 우와앙!' },
                { speaker: '정우', portrait: 'char_jeongwoo', text: '응! 오빠가 낚시에 소질이 있나봐. 더 멀리 나가서 큰 물고기를 잡아올게!' },
                { speaker: '엄마', portrait: 'char_mom', text: '정우야, 연안으로 가는 건 위험할 수도 있어. 조심해야 한단다.' },
                { speaker: '정우', portrait: 'char_jeongwoo', text: '헤헤, 걱정마세요 엄마! 더 멋진 낚싯대도 살 거예요!' }
            ];
        } else if (currentCh === 2) {
            storyData = [
                { speaker: '세연', portrait: 'char_seyeon', text: '오빠 이번엔 왕 큰 물고기 잡아왔네!! 최고야!' },
                { speaker: '엄마', portrait: 'char_mom', text: '어머, 우리 정우 정말 낚시 신동인가 보네. 오늘 저녁은 회 파티다!' },
                { speaker: '정우', portrait: 'char_jeongwoo', text: '이정도 쯤이야! 이제 진짜 먼 바다로 나가서 전설의 물고기를 낚아볼게!' }
            ];
        } else if (currentCh === 3) {
            storyData = [
                { speaker: '상점 할아버지', portrait: null, text: '정우야, 너 혹시 보물섬이라고 들어봤냐?' },
                { speaker: '정우', portrait: 'char_jeongwoo', text: '보물섬이요?! 그런 게 진짜 있어요?!' },
                { speaker: '상점 할아버지', portrait: null, text: '먼 바다 너머에 전설의 섬이 있다더라. 황금 물고기가 산다는...' },
                { speaker: '세연', portrait: 'char_seyeon', text: '오빠!! 황금 물고기 잡아와!! 반짝반짝!! ✨' },
                { speaker: '정우', portrait: 'char_jeongwoo', text: '좋아! 반드시 찾아내고 말겠어! 보물섬으로 출발!!' }
            ];
        } else if (currentCh === 4) {
            storyData = [
                { speaker: '정우', portrait: 'char_jeongwoo', text: '다 낚았다! 보물섬의 모든 물고기를 정복했어!!' },
                { speaker: '아빠', portrait: 'char_dad', text: '정우야, 아빠 휴가나왔다... 응? 보물섬까지 갔다고??' },
                { speaker: '정우', portrait: 'char_jeongwoo', text: '아빠! 저 황금 물고기도 잡았어요!! 전설이 진짜였어요!' },
                { speaker: '엄마', portrait: 'char_mom', text: '어머머... 우리 정우 정말 대단하구나!!' },
                { speaker: '세연', portrait: 'char_seyeon', text: '오빠 최고!! 이제 까까 잔뜩 사줘야돼!!' },
                { speaker: '아빠', portrait: 'char_dad', text: '하하, 우리 정우 이제 집으로 돌아오자! 축하한다 아들!!' }
            ];
        }

        // 축하 메시지 띄우기
        const celebrateText = this.add.text(this.scale.width / 2, this.scale.height / 2, '챕터 목표 달성!!', {
            fontSize: '80px', fontFamily: 'Arial', color: '#FFD700', stroke: '#FF0000', strokeThickness: 10
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: celebrateText,
            scale: { from: 0, to: 1.2 },
            yoyo: true,
            duration: 1000,
            onComplete: () => {
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    // EndingScene으로 직행 (챕터 4 클리어시)
                    if (currentCh === 4) {
                        this.scene.start('EndingScene');
                    } else {
                        this.scene.start('StoryScene', {
                            storyData: storyData,
                            nextScene: 'IntroScene',
                            nextSceneData: {}
                        });
                    }
                });
            }
        });
    }

    // --- 보물섬 전용 랜덤 이벤트 시스템 ---
    triggerTreasureIslandEvent() {
        const events = [
            {
                name: '해적선 목격',
                emoji: '🏴‍☠️',
                message: '저기... 해적선이 보인다?! 보물이 떨어졌을지도!',
                effect: () => {
                    // 다음 1회 보상 2배 버프 (플래그 설정)
                    this.treasureIslandBuff = { type: 'doubleReward', remaining: 1 };
                }
            },
            {
                name: '대왕문어 습격',
                emoji: '🐙',
                message: '으악! 대왕문어가 배를 흔든다! 물고기가 놀라서 가까이 왔나봐!',
                effect: () => {
                    // 다음 1회 게이지 하락 면제 (3초)
                    this.treasureIslandBuff = { type: 'gaugeImmunity', remaining: 1, duration: 3000 };
                }
            },
            {
                name: '인어의 노래',
                emoji: '🧜‍♀️',
                message: '저 아름다운 노래는 뭐지...? 전설의 물고기가 가까이 온 것 같아!',
                effect: () => {
                    // 다음 1회 SSR 확률 3배 (플래그 설정)
                    this.treasureIslandBuff = { type: 'ssrBoost', remaining: 1 };
                }
            },
            {
                name: '무지개 출현',
                emoji: '🌈',
                message: '와! 바다 위에 무지개가 떴어!! 행운의 징조야!',
                effect: () => {
                    // 즉시 보너스 1000G
                    window.gameManagers.playerModel.addGold(1000);
                    this.updateGoalText();
                }
            }
        ];

        const event = events[Math.floor(Math.random() * events.length)];
        event.effect();

        // 이벤트 알림 텍스트 (화면 중심에 크게)
        const eventText = this.add.text(this.scale.width / 2, this.scale.height * 0.35,
            `${event.emoji} ${event.name}! ${event.emoji}`, {
            fontSize: '36px', fontFamily: 'Arial', color: '#FFD700',
            stroke: '#000000', strokeThickness: 6, fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(100);

        const eventMsg = this.add.text(this.scale.width / 2, this.scale.height * 0.42,
            event.message, {
            fontSize: '20px', fontFamily: 'Arial', color: '#FFFFFF',
            stroke: '#000000', strokeThickness: 4,
            wordWrap: { width: this.scale.width * 0.8 }, align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.cameras.main.flash(400, 255, 215, 0);
        window.gameManagers.soundManager.playSuccess();

        // 2.5초 후 자동 페이드아웃
        this.tweens.add({
            targets: [eventText, eventMsg],
            alpha: 0,
            y: eventText.y - 50,
            duration: 1000,
            delay: 2000,
            onComplete: () => { eventText.destroy(); eventMsg.destroy(); }
        });
    }

    resetFishing() {
        this.gameState = 'IDLE';
        this.catchGauge = 0;
        const regionNames = { 1: "민물", 2: "연안", 3: "먼 바다", 4: "보물섬" };
        this.uiElements.instruction.setText(`${regionNames[this.region]}을 탭(클릭)해서 찌를 던지세요!`);
        this.updateGoalText();
        this.uiElements.gaugeBg.setVisible(false);
        this.uiElements.gaugeBar.setVisible(false);

        // 과녁 힌트 다시 표시
        if (this.uiElements.targetHint) this.uiElements.targetHint.setVisible(true);
        if (this.uiElements.targetHintInner) this.uiElements.targetHintInner.setVisible(true);
    }

    update(time, delta) {
        // 물고기 실루엣 이동
        if (this.wanderingFishes) {
            this.wanderingFishes.forEach(fish => {
                fish.x += fish.speed * fish.direction * (delta / 1000);
                if (fish.direction === 1 && fish.x > this.scale.width + 200) {
                    fish.x = -200;
                    fish.y = Phaser.Math.Between(this.scale.height * 0.4, this.scale.height * 0.9);
                    const fData = getRandomFish(0, this.region);
                    fish.setTexture(fData.id);
                    fish.setScale(fData.scale * 0.8);
                    fish.flipX = true;
                } else if (fish.direction === -1 && fish.x < -200) {
                    fish.x = this.scale.width + 200;
                    fish.y = Phaser.Math.Between(this.scale.height * 0.4, this.scale.height * 0.9);
                    const fData = getRandomFish(0, this.region);
                    fish.setTexture(fData.id);
                    fish.setScale(fData.scale * 0.8);
                    fish.flipX = false;
                }
            });
        }

        // Catch 단계: 가만히 있으면 게이지 하락 (방해 요소)
        if (this.gameState === 'CATCH') {
            // --- Fever Time 타이머 ---
            if (this.isFeverTime) {
                this.feverTimeRemaining -= delta;
                if (this.feverTimeRemaining <= 0) {
                    this.endFeverTime();
                }
            }

            // 피버 타임이 아닐 때만 게이지 하락
            if (!this.isFeverTime) {
                const reelLevel = window.gameManagers.playerModel.stats.reelSpeed;

                // 등급별로 방해 요소(게이지 하락률) 차등 적용
                let baseDrop = 15;
                if (this.currentFish.grade === 'R') baseDrop = 30;
                else if (this.currentFish.grade === 'SR') baseDrop = 60;
                else if (this.currentFish.grade === 'SSR') baseDrop = 100;

                // 보물섬(Region 4) 게이지 하락 강화
                if (this.region === 4) {
                    if (this.currentFish.grade === 'N') baseDrop = 25;
                    else if (this.currentFish.grade === 'R') baseDrop = 50;
                    else if (this.currentFish.grade === 'SR') baseDrop = 90;
                    else if (this.currentFish.grade === 'SSR') baseDrop = 150;
                }

                // 스탯 Reel Speed에 의해 초당 감소폭 완화 (레벨당 3 방어)
                const dropRate = Math.max(5, baseDrop - (reelLevel * 3));

                this.catchGauge -= (dropRate * (delta / 1000));
            }

            // 장력(Tension) 자연 감소 (연타 안 하면 서서히 내려감)
            this.lineTension = Math.max(0, this.lineTension - 0.3 * (delta / 1000));

            if (this.catchGauge <= 0) {
                this.catchGauge = 0;
                // 하락해서 0이 되면 놓침
                this.cameras.main.zoomTo(1, 300);
                this.failFishing('놓쳤습니다...');
            } else {
                this.updateGaugeUI();
            }
        }

        // --- 스플라인 낚싯줄 그리기 (캐릭터 ~ 찌) ---
        this.fishingLine.clear();
        if (this.lure && this.lure.visible && this.character) {
            const rodTipX = this.character.x + 20;
            const rodTipY = this.character.y - 15;
            const lureX = this.lure.x;
            const lureY = this.lure.y;

            // 장력에 따라 곡률 계산 (0 = 직선, 1 = 크게 휘어짐)
            const tension = this.lineTension;
            const midX = (rodTipX + lureX) / 2;
            const midY = (rodTipY + lureY) / 2;
            // 장력이 높으면 활처럼 위로 휘어지고, 0이면 중력에 의해 아래로 처짐
            const sagAmount = tension > 0.1
                ? -60 * tension   // 위로 당겨짐 (활 모양)
                : 30;              // 중력 처짐
            const ctrlX = midX + (tension > 0.1 ? 20 * Math.sin(time * 0.01) : 0);
            const ctrlY = midY + sagAmount;

            // 선 색상도 장력에 따라 변화 (흰색 → 붉은색)
            const r = Math.floor(255);
            const g = Math.floor(255 * (1 - tension * 0.8));
            const b = Math.floor(255 * (1 - tension * 0.8));
            const lineColor = (r << 16) | (g << 8) | b;
            const lineWidth = 2 + tension * 3; // 장력 높을수록 굵게

            this.fishingLine.lineStyle(lineWidth, lineColor, 0.9);
            this.fishingLine.beginPath();
            this.fishingLine.moveTo(rodTipX, rodTipY);

            // Quadratic bezier curve로 스플라인 시뮬레이션
            const steps = 20;
            for (let i = 1; i <= steps; i++) {
                const t = i / steps;
                // Quadratic bezier: B(t) = (1-t)^2*P0 + 2*(1-t)*t*P1 + t^2*P2
                const px = (1 - t) * (1 - t) * rodTipX + 2 * (1 - t) * t * ctrlX + t * t * lureX;
                const py = (1 - t) * (1 - t) * rodTipY + 2 * (1 - t) * t * ctrlY + t * t * lureY;
                this.fishingLine.lineTo(px, py);
            }
            this.fishingLine.strokePath();
        }
    }
}
