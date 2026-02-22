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

        this.bg = this.add.image(width / 2, height / 2, bgKey);
        this.bg.setDisplaySize(width, height);
        this.bg.setInteractive(); // 배경 클릭으로 낚시 시작
        this.water = this.bg; // 기존 코드 호환을 위해 water 변수에 할당

        // 물고기 돌아다니는 실루엣 생성
        this.createWanderingFishes();

        // 상태창 UI (임시)
        const regionNames = { 1: "민물", 2: "연안", 3: "먼 바다" };
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
        let charY = height * 0.9;
        if (this.region === 1) charY = height * 0.95;
        else if (this.region === 2) charY = height * 0.85;
        else charY = height * 0.8;

        this.character = this.add.image(width / 2, charY, 'character').setDepth(3);

        // 낚싯줄 그리기용 Graphics 객체 생성
        this.fishingLine = this.add.graphics();
        this.fishingLine.setDepth(1); // 찌(2) 아래, 물고기(1)와 동일선상 (물 위)

        // 찌 (Lure) 스프라이트 - 초기 숨김
        this.lure = this.add.image(0, 0, 'lure').setVisible(false).setDepth(2);
        this.lure.setScale(1.2); // 새로 만들어진 32x32 픽셀 기준 1.2배 확대

        // 물고기 (Fish) 스프라이트 - 초기 숨김 (나중에 텍스처 변경)
        // 처음에 dummy로 아무 텍스처나 잡아둠 (어차피 안 보임)
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
        // --- 뒤로 가기 버튼 (좌측 상단) ---
        const backBtnFontSize = this.scale.width < 360 ? '16px' : '20px'; // 과감하게 축소
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
                // CATCH 페이즈: 50ms 미니 디바운스 (다중 터치 오류 방지하되 연타 허용)
                if (now - this.lastActionTime < 50) return;
            } else {
                // 기타 페이즈: 200ms 디바운싱
                if (now - this.lastActionTime < 200) return;
            }
            this.lastActionTime = now;

            this.handlePointerDown(pointer);
        });

        console.log("GameScene Initialized with Core Loops");
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
        const maxWait = Math.max(1000, 4000 - (chanceLevel * 200));
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

        // 일정 시간(예: 1.5초) 내에 클릭 안 하면 실패
        this.time.delayedCall(1500, () => {
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

        // 도감(PlayerModel)에 추가
        window.gameManagers.playerModel.addFish(this.currentFish.id);

        // 2초 후 폭죽 파티클 제거 및 퀴즈 연동
        this.time.delayedCall(2000, async () => {
            particles.destroy();

            // 50% 확률 수학 퀴즈 팝업 (UIManager 연동)
            const isQuizCorrect = await window.gameManagers.uiManager.showMathQuiz();

            let finalGold = baseGold;
            if (isQuizCorrect) {
                // 정답 시 10% 추가 보상
                finalGold += Math.floor(baseGold * 0.1);
                this.cameras.main.flash(300, 255, 215, 0); // 황금색 플래시 보너스 피드백
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

            // --- 챕터 진행 체크 ---
            const model = window.gameManagers.playerModel;
            if (model.currentChapter <= 3 && model.checkChapterGoal()) {
                this.triggerStoryTransition();
            } else {
                this.resetFishing();
            }
        });
    }

    failFishing(msg) {
        this.gameState = 'IDLE';
        this.tweens.killTweensOf(this.uiElements.exclamation);
        this.tweens.killTweensOf(this.lure);
        this.uiElements.exclamation.setVisible(false);
        this.lure.setVisible(false);
        this.fish.setVisible(false);
        this.lineTension = 0;
        // 접근 물고기들 정리
        this.clearApproachFishes();

        // 피버 타임 도중 실패하더라도 해제
        if (this.isFeverTime) this.endFeverTime();

        // 연속 실패 카운트 증가
        this.consecutiveFails++;

        // 연속 실패 UI 피드백
        if (this.consecutiveFails >= 2) {
            const warnText = this.consecutiveFails >= 3
                ? '🔥 다음 낚시는 피버타임!'
                : `연속 실패 ${this.consecutiveFails}회...`;
            msg += `\n${warnText}`;
        }

        this.uiElements.instruction.setText(msg);
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
        if (model.highestChapter > 3) {
            this.uiElements.goalText.setText('🎉 모든 챕터 클리어! 상점에서 엔딩 아이템을 확인하세요!');
            return;
        }

        // 현재 플레이 중인 지역이 아직 미해금 프론티어 챕터일 때만 목표 표시
        if (this.region === model.currentChapter && model.currentChapter <= 3) {
            const goal = model.chapterGoals[model.currentChapter];
            const nextRegionNames = { 1: '연안 해금', 2: '먼 바다 해금', 3: '엔딩 해금' };
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
                { speaker: '정우', portrait: 'char_jeongwoo', text: '다 낚았다! 나는 낚시에 천재적인 소질이 있는 게 분명해!!' },
                { speaker: '아빠', portrait: 'char_dad', text: '정우야, 아빠 휴가나왔다... 응? 낚시 천재라고??' },
                { speaker: '정우', portrait: 'char_jeongwoo', text: '아빠! 저 원양어선 타러 갈게요! 배웅해주세요!!' },
                { speaker: '엄마', portrait: 'char_mom', text: '안돼 정우야!! 아직 초등학생이잖아!!' },
                { speaker: '세연', portrait: 'char_seyeon', text: '오빠 원양어선 타면 까까 못사주자나 앙대!!' },
                { speaker: '아빠', portrait: 'char_dad', text: '이 녀석 안되겠군, 당장 집으로 들어가자!!' }
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
                    // EndingScene으로 직행 (챕터 3 클리어시)
                    if (currentCh === 3) {
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

    resetFishing() {
        this.gameState = 'IDLE';
        this.catchGauge = 0;
        const regionNames = { 1: "민물", 2: "연안", 3: "먼 바다" };
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
