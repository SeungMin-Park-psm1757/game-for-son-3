// DOM 오버레이를 담당하는 UI 모듈
// 상점, 퀴즈 팝업 등 Canvas 외부의 HTML 요소를 제어합니다.
import { FISH_TYPES } from '../models/FishData.js';

export default class UIManager {
    constructor(playerModel) {
        this.playerModel = playerModel;
        this.container = document.getElementById('ui-layer');
        this.isQuizActive = false;
        this.currentPopup = null;
    }

    // --- 수학 퀴즈 시스템 (도상학 기반 물고기 아이콘 시각화) ---
    showMathQuiz() {
        return new Promise((resolve) => {
            if (this.isQuizActive) { resolve(null); return; }
            if (Math.random() > 0.5) { resolve(null); return; }

            this.isQuizActive = true;
            this.container.style.pointerEvents = 'auto';

            // 8세 난이도: 3~12 + 1~8 혹은 빼기
            let rnd1 = Math.floor(Math.random() * 10) + 3;   // 3 ~ 12
            let rnd2 = Math.floor(Math.random() * 8) + 1;    // 1 ~ 8
            const isAddition = Math.random() > 0.5;

            // 항상 외쪽 숫자(n1)가 오른쪽 숫자(n2)보다 크거나 같도록 고정
            const n1 = Math.max(rnd1, rnd2);
            const n2 = Math.min(rnd1, rnd2);

            let operatorSymbol = '';
            let correctAnswer = 0;

            if (isAddition) {
                operatorSymbol = '+';
                correctAnswer = n1 + n2;
            } else {
                operatorSymbol = '−';
                correctAnswer = n1 - n2;
            }

            // 물고기 아이콘 렌더링 (🐟 이모지를 num1개, num2개 나열)
            const renderFishIcons = (count) => {
                let html = '';
                for (let i = 0; i < count; i++) {
                    html += '<span class="quiz-fish-icon">🐟</span>';
                }
                return html;
            };

            // 오답 보기 2개
            let wrong1 = correctAnswer + (Math.floor(Math.random() * 3) + 1);
            let wrong2 = correctAnswer - (Math.floor(Math.random() * 3) + 1);
            if (wrong2 < 0) wrong2 = correctAnswer + (Math.floor(Math.random() * 5) + 2);
            const choices = [correctAnswer, wrong1, wrong2].sort(() => Math.random() - 0.5);

            const popupHTML = `
                <div id="quiz-popup" class="popup-box quiz-shake">
                    <h2>🐟 보너스 퀴즈 타임! 🐟</h2>
                    <p style="font-size:18px; color:#666; margin-bottom:10px;">물고기를 세어보세요!</p>
                    <div class="quiz-icon-area">
                        <div class="quiz-fish-group">
                            ${renderFishIcons(n1)}
                        </div>
                        <div class="quiz-operator">${operatorSymbol}</div>
                        <div class="quiz-fish-group">
                            ${renderFishIcons(n2)}
                        </div>
                        <div class="quiz-operator">=</div>
                        <div class="quiz-answer-mark">?</div>
                    </div>
                    <p class="quiz-question" style="font-size:28px; margin-top:10px;">${n1} ${operatorSymbol} ${n2} = ?</p>
                    <div class="quiz-choices">
                        <button class="choice-btn" data-answer="${choices[0]}">${choices[0]}</button>
                        <button class="choice-btn" data-answer="${choices[1]}">${choices[1]}</button>
                        <button class="choice-btn" data-answer="${choices[2]}">${choices[2]}</button>
                    </div>
                </div>
            `;

            this.container.innerHTML = popupHTML;
            this.currentPopup = document.getElementById('quiz-popup');

            const buttons = this.container.querySelectorAll('.choice-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const selected = parseInt(e.target.getAttribute('data-answer'));
                    const isCorrect = selected === correctAnswer;
                    if (isCorrect) window.gameManagers.soundManager.playSuccess();
                    else window.gameManagers.soundManager.playError();
                    this.handleQuizResult(isCorrect, btn);
                    setTimeout(() => { this.closePopup(); resolve(isCorrect); }, 1200);
                });
            });
        });
    }

    handleQuizResult(isCorrect, clickedBtn) {
        const buttons = this.container.querySelectorAll('.choice-btn');
        buttons.forEach(btn => btn.disabled = true);
        if (isCorrect) {
            clickedBtn.classList.add('correct');
            clickedBtn.innerHTML += ' ⭕';
            const praise = document.createElement('div');
            praise.className = 'praise-text';
            praise.innerText = '정답! 보너스 20% 추가!';
            this.currentPopup.appendChild(praise);
        } else {
            clickedBtn.classList.add('wrong');
            clickedBtn.innerHTML += ' ❌';
            const penalty = document.createElement('div');
            penalty.className = 'penalty-text';
            penalty.innerText = '오답! 금액 50% 삭감...';
            this.currentPopup.appendChild(penalty);
        }
    }

    // --- 타이핑 퀴즈 시스템 (초등 1학년 수준) ---
    showTypingQuiz() {
        return new Promise((resolve) => {
            if (this.isQuizActive) { resolve(false); return; }
            this.isQuizActive = true;
            this.container.style.pointerEvents = 'auto';

            // 3~5글자 한글 단어 20개
            const wordList = [
                '장난감', '아이스크림', '소방차', '자전거', '비행기',
                '다람쥐', '개구리', '무지개', '놀이터', '피아노',
                '자동차', '코끼리', '강아지', '오렌지', '태권도',
                '햄버거', '초콜릿', '병아리', '고양이', '우리집'
            ];
            const targetWord = wordList[Math.floor(Math.random() * wordList.length)];

            const popupHTML = `
                <div id="quiz-popup" class="popup-box">
                    <h2>✏️ 반짝반짝 받아쓰기! ✏️</h2>
                    <p style="font-size:20px; color:#666; margin-bottom:15px;">아래 단어를 똑같이 써보세요!</p>
                    <div class="typing-word-area">
                        <span class="typing-target">${targetWord}</span>
                    </div>
                    <div class="quiz-input-area">
                        <input type="text" id="typing-input" class="quiz-input" autocomplete="off" autofocus placeholder="여기에 입력..." />
                    </div>
                    <div id="typing-feedback" style="margin-top:15px; min-height:30px; font-weight:bold;"></div>
                    <button id="typing-submit-btn" class="choice-btn" style="margin-top:20px; font-size:24px; width:80%;">확인!</button>
                </div>
            `;

            this.container.innerHTML = popupHTML;
            this.currentPopup = document.getElementById('quiz-popup');
            const inputField = document.getElementById('typing-input');
            const submitBtn = document.getElementById('typing-submit-btn');
            const feedbackArea = document.getElementById('typing-feedback');

            // 포커스 강제 (모바일 대응 고려)
            setTimeout(() => inputField.focus(), 100);

            const checkAnswer = () => {
                const userInput = inputField.value.trim();
                const isCorrect = userInput === targetWord;

                inputField.disabled = true;
                submitBtn.disabled = true;

                if (isCorrect) {
                    window.gameManagers.soundManager.playSuccess();
                    feedbackArea.style.color = '#FF1493';
                    feedbackArea.innerText = '우와! 완벽해! 보너스 20% 추가!';
                    inputField.classList.add('correct-input');
                } else {
                    window.gameManagers.soundManager.playError();
                    feedbackArea.style.color = '#DC143C';
                    feedbackArea.innerText = `아쉬워요! 정답은 '${targetWord}'였어요.`;
                    inputField.classList.add('wrong-input');
                }

                setTimeout(() => {
                    this.closePopup();
                    resolve(isCorrect);
                }, 1500);
            };

            submitBtn.addEventListener('click', checkAnswer);
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') checkAnswer();
            });
        });
    }

    closePopup() {
        if (this.currentPopup) { this.currentPopup.remove(); this.currentPopup = null; }
        this.container.innerHTML = '';
        this.container.style.pointerEvents = 'none';
        this.isQuizActive = false;
        this.renderPersistentUI();
    }

    // --- 낚시 실패 모달 (Phase 6 팝업) ---
    showFailModal(message) {
        if (this.isQuizActive || this.currentPopup) return;
        this.hidePersistentUI();
        this.container.style.pointerEvents = 'auto';

        const popupHTML = `
            <div id="fail-popup" class="popup-box quiz-shake" style="border-color: #DC143C; width: min(400px, 90vw);">
                <h2 style="color: #DC143C; font-size: 28px; margin-bottom: 20px;">💦 앗, 아깝다! 💦</h2>
                <div style="font-size: 80px; margin-bottom: 15px; animation: float 3s ease-in-out infinite;">🎣💨</div>
                <p style="font-size: 20px; font-weight: bold; color: #333; margin-bottom: 25px; word-break: keep-all;">${message}</p>
                <button id="fail-close-btn" class="choice-btn" style="background-color: #333; box-shadow: 0 5px 0 #000; font-size: 20px; padding: 10px 30px;">확인</button>
            </div>
        `;

        this.container.innerHTML = popupHTML;
        this.currentPopup = document.getElementById('fail-popup');

        const closeBtn = document.getElementById('fail-close-btn');
        if (closeBtn) {
            closeBtn.onclick = () => {
                window.gameManagers.soundManager.playCoin(); // click sound
                this.closePopup();
            };
        }

        // Auto close for fast gameplay flow
        setTimeout(() => {
            if (this.currentPopup && this.currentPopup.id === 'fail-popup') {
                this.closePopup();
            }
        }, 2500);
    }

    // --- 상시 UI ---
    initPersistentUI() {
        this.persistentContainer = document.createElement('div');
        this.persistentContainer.id = 'persistent-ui';
        this.persistentContainer.style.pointerEvents = 'auto';

        this.goldDisplay = document.createElement('div');
        this.goldDisplay.id = 'gold-display';
        this.goldDisplay.innerHTML = `💰 <span>${this.playerModel.gold}</span>`;

        this.shopBtn = document.createElement('button');
        this.shopBtn.id = 'shop-open-btn';
        this.shopBtn.innerText = '🛒 상점 (Shop)';
        this.shopBtn.onclick = () => this.openShop();

        this.bookBtn = document.createElement('button');
        this.bookBtn.id = 'book-open-btn';
        this.bookBtn.innerText = '📖 도감 (Book)';
        this.bookBtn.onclick = () => this.openEncyclopedia();
        this.bookBtn.className = 'persistent-btn';
        this.shopBtn.className = 'persistent-btn pulse-anim';

        // 음소거 토글 버튼
        this.muteBtn = document.createElement('button');
        this.muteBtn.id = 'mute-btn';
        this.muteBtn.innerText = '🔊';
        this.muteBtn.className = 'persistent-btn';
        this.muteBtn.onclick = () => {
            const sm = window.gameManagers.soundManager;
            const isMuted = sm.toggleMute();
            this.muteBtn.innerText = isMuted ? '🔇' : '🔊';

            // Phaser BGM도 같이 뮤트/언뮤트
            const phaserGame = window.gameManagers._phaserGame;
            if (phaserGame) {
                phaserGame.sound.mute = isMuted;
            }
        };

        this.persistentContainer.appendChild(this.goldDisplay);
        this.persistentContainer.appendChild(this.bookBtn);
        this.persistentContainer.appendChild(this.muteBtn);
        this.persistentContainer.appendChild(this.shopBtn);
        document.body.appendChild(this.persistentContainer);

        this.playerModel.subscribe(() => this.updatePersistentUI());
    }

    updatePersistentUI() {
        if (this.goldDisplay) {
            this.goldDisplay.querySelector('span').innerText = this.playerModel.gold;
        }
    }

    renderPersistentUI() {
        if (this.persistentContainer) this.persistentContainer.style.display = 'flex';
    }

    hidePersistentUI() {
        if (this.persistentContainer) this.persistentContainer.style.display = 'none';
    }

    // --- 상점 ---
    openShop() {
        if (this.isQuizActive) return;
        this.hidePersistentUI();
        this.container.style.pointerEvents = 'auto';

        const shopData = {
            rodPower: { max: 20, costBase: 100, costStep: 50 },
            catchChance: { max: 10, costBase: 100, costStep: 100 },
            reelSpeed: { max: 10, costBase: 100, costStep: 150 },
            rodLuck: { max: 5, costBase: 100, costStep: 300 }
        };
        const s = this.playerModel.stats;

        const getCost = (statName, currentLevel) => {
            const data = shopData[statName];
            return data.costBase + (currentLevel - 1) * data.costStep;
        };

        const renderBuyButton = (statName, currentLevel) => {
            const isMax = currentLevel >= shopData[statName].max;
            if (isMax) {
                return `<button class="buy-btn maxed" disabled style="background-color: #666; cursor: not-allowed;">MAX</button>`;
            } else {
                const cost = getCost(statName, currentLevel);
                return `<button class="buy-btn" data-stat="${statName}" data-cost="${cost}">💰 ${cost}</button>`;
            }
        };

        // 한국 어부 아저씨 NPC 대사 10가지
        const npcQuotes = [
            "오늘 물때가 아주 기가 막혀~ 대물 한 마리 낚아보겠나?",
            "어이구, 우리 정우 왔구나! 낚시 도구 좀 손봐줄까?",
            "바다 사나이는 낚싯대 하나로 말하는 법이지!",
            "허허, 그놈 참... 낚시꾼 눈빛이 예사롭지 않은걸?",
            "이봐, 이 릴은 내가 젊었을 때 고래도 잡던 거야!",
            "미끼가 좋아야 큰 놈이 무는 법이지. 좀 둘러보게나.",
            "낚시는 기다림의 미학이라네... 하지만 장비가 좋으면 덜 기다려도 되지!",
            "왔구나 정우야! 오늘은 어떤 바다로 나갈 겐가?",
            "허허, 자네 실력이 날로 느는구먼. 뿌듯하구먼!",
            "바다가 주는 선물은 소중히 다뤄야 한다네. 알겠지?"
        ];
        const randomQuote = npcQuotes[Math.floor(Math.random() * npcQuotes.length)];

        // 세연이를 위한 최고급 장난감 (10,000골드 이상 해금)
        const ENDING_ITEM_COST = 10000;
        // 낚싯대(Rod Power) 레벨에 따른 NPC 아바타 변화 로직
        const rodLevel = s.rodPower;
        let npcAvatar = '👴'; // Lv 1~4
        if (rodLevel >= 15) {
            npcAvatar = '👑'; // Lv 15~ (만렙 근처)
        } else if (rodLevel >= 10) {
            npcAvatar = '🤠'; // Lv 10~14
        } else if (rodLevel >= 5) {
            npcAvatar = '😎'; // Lv 5~9
        }

        const canBuyEnding = this.playerModel.gold >= ENDING_ITEM_COST;
        const showEndingItem = this.playerModel.highestChapter >= 3;

        let endingItemHTML = '';
        if (showEndingItem) {
            endingItemHTML = `
                <div class="upgrade-item" style="border-color: #FFD700; background: linear-gradient(135deg, #FFFACD, #FFF8DC);">
                    <div class="up-icon">🎁</div>
                    <div class="up-info">
                        <h3 style="color:#FF1493;">세연이를 위한 최고급 장난감</h3>
                        <p style="color:#FF69B4;">동생에게 사줄 특별한 선물! (엔딩 아이템)</p>
                    </div>
                    <button class="buy-btn ${canBuyEnding ? '' : 'maxed'}" id="ending-item-btn"
                        ${canBuyEnding ? '' : 'disabled'}
                        style="${canBuyEnding ? 'background: #FF1493; box-shadow: 0 5px 0 #C71585;' : 'background-color: #999; cursor: not-allowed;'}">
                        ${canBuyEnding ? '💰 ' + ENDING_ITEM_COST : '💰 ' + ENDING_ITEM_COST + ' (부족)'}
                    </button>
                </div>
            `;
        }

        const shopHTML = `
            <div id="shop-popup" class="popup-box">
                <div class="shop-header">
                    <h2>상점 (Shop) 🐟</h2>
                    <div class="shop-gold">현재 골드: <span>${this.playerModel.gold}</span></div>
                    <button id="shop-close-btn">❌ 닫기</button>
                </div>
                
                <div class="shop-content">
                    <div class="shop-npc">
                        <div class="npc-avatar" id="npc-avatar-display">${npcAvatar}</div>
                        <div class="npc-bubble">"${randomQuote}"</div>
                    </div>
                    
                    <div class="upgrade-list">
                        <div class="upgrade-item">
                            <div class="up-icon">💪</div>
                            <div class="up-info">
                                <h3>Rod Power (Lv.${s.rodPower}/${shopData.rodPower.max})</h3>
                                <p>연타 1회당 오르는 게이지 양 증가</p>
                            </div>
                            ${renderBuyButton('rodPower', s.rodPower)}
                        </div>
                        
                        <div class="upgrade-item">
                            <div class="up-icon">⏲️</div>
                            <div class="up-info">
                                <h3>Catch Chance (Lv.${s.catchChance}/${shopData.catchChance.max})</h3>
                                <p>입질이 올 때까지의 대기 시간 단축</p>
                            </div>
                            ${renderBuyButton('catchChance', s.catchChance)}
                        </div>
                        
                        <div class="upgrade-item">
                            <div class="up-icon">⚙️</div>
                            <div class="up-info">
                                <h3>Reel Speed (Lv.${s.reelSpeed}/${shopData.reelSpeed.max})</h3>
                                <p>게이지가 하락하는 속도 방어</p>
                            </div>
                            ${renderBuyButton('reelSpeed', s.reelSpeed)}
                        </div>
                        
                        <div class="upgrade-item">
                            <div class="up-icon">🍀</div>
                            <div class="up-info">
                                <h3>Rod Luck (Lv.${s.rodLuck}/${shopData.rodLuck.max})</h3>
                                <p>희귀한 물고기(보상) 획득 확률 증가</p>
                            </div>
                            ${renderBuyButton('rodLuck', s.rodLuck)}
                        </div>
                        
                        ${endingItemHTML}
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = shopHTML;
        this.currentPopup = document.getElementById('shop-popup');

        document.getElementById('shop-close-btn').onclick = () => { this.closePopup(); };

        // 구매 버튼 이벤트
        const buyBtns = this.container.querySelectorAll('.buy-btn:not(#ending-item-btn)');
        buyBtns.forEach(btn => {
            btn.onclick = (e) => {
                const statName = e.target.getAttribute('data-stat');
                const cost = parseInt(e.target.getAttribute('data-cost'));
                const success = this.playerModel.upgradeStat(statName, cost);

                const bubble = this.container.querySelector('.npc-bubble');
                if (success) {
                    window.gameManagers.soundManager.playCoin();
                    const successQuotes = [
                        '"허허, 아주 좋은 선택이야!"',
                        '"그렇지, 장비에 투자할 줄 알아야 진짜 강태공이지!"',
                        '"자네라면 이 도구를 잘 써줄 줄 알았네!"'
                    ];
                    bubble.innerText = successQuotes[Math.floor(Math.random() * successQuotes.length)];
                    bubble.classList.add('quiz-shake');
                    setTimeout(() => bubble.classList.remove('quiz-shake'), 400);

                    // 낚싯대(Rod Power) 업그레이드 시 캐릭터 시각적 업데이트 트리거
                    if (statName === 'rodPower') {
                        const phaserGame = window.gameManagers._phaserGame;
                        if (phaserGame && phaserGame.scene.isActive('GameScene')) {
                            const gameScene = phaserGame.scene.getScene('GameScene');
                            if (gameScene && typeof gameScene.updateCharacterTexture === 'function') {
                                gameScene.updateCharacterTexture();
                            }
                        }
                    }

                    this.openShop();
                } else {
                    window.gameManagers.soundManager.playError();
                    bubble.innerText = '"골드가 부족하잖냐! 더 낚시하고 와!"';
                    bubble.style.color = '#FF0000';
                    btn.classList.add('quiz-shake');
                    setTimeout(() => { btn.classList.remove('quiz-shake'); bubble.style.color = '#333'; }, 400);
                }
            };
        });

        // 엔딩 아이템 구매 버튼
        const endingBtn = document.getElementById('ending-item-btn');
        if (endingBtn && canBuyEnding) {
            endingBtn.onclick = () => {
                this.playerModel.gold -= ENDING_ITEM_COST;
                this.playerModel.notify();
                window.gameManagers.soundManager.playSuccess();

                this.closePopup();

                // Phaser 씬 매니저를 통해 EndingScene으로 전환
                const phaserGame = window.gameManagers._phaserGame;
                if (phaserGame) {
                    // 현재 활성 씬들 중 GameScene을 종료하고 EndingScene 시작
                    const sceneManager = phaserGame.scene;
                    if (sceneManager.isActive('GameScene')) {
                        sceneManager.stop('GameScene');
                    }
                    sceneManager.start('EndingScene');
                }
            };
        }
    }

    openEncyclopedia() {
        if (this.isQuizActive) return;
        this.hidePersistentUI();
        this.container.style.pointerEvents = 'auto';

        const collection = this.playerModel.fishCollection;

        let fishCardsHTML = '';
        FISH_TYPES.forEach(fish => {
            const count = collection[fish.id] || 0;
            const isDiscovered = count > 0;

            if (isDiscovered) {
                fishCardsHTML += `
                    <div class="fish-card discovered">
                        <img src="assets/images/${fish.id}.png" class="fish-img-sprite" style="transform: scale(${Math.min(1.2, fish.scale)});" />
                        <h3>${fish.name}</h3>
                        <p class="fish-grade grade-${fish.grade}">등급: ${fish.grade}</p>
                        <p class="fish-count">포획 수: ${count}마리</p>
                        <p class="fish-reward">기본 보상: 💰${fish.baseReward}</p>
                    </div>
                `;
            } else {
                fishCardsHTML += `
                    <div class="fish-card undiscovered">
                        <img src="assets/images/${fish.id}.png" class="fish-img-sprite silhouette-img" style="transform: scale(${Math.min(1.2, fish.scale)});" />
                        <h3>???</h3>
                        <p class="fish-grade">등급: ???</p>
                        <p class="fish-count">포획 수: 0마리</p>
                    </div>
                `;
            }
        });

        const encyclopediaHTML = `
            <div id="encyclopedia-popup" class="popup-box">
                <div class="shop-header">
                    <h2>내 물고기 도감 📖</h2>
                    <button id="book-close-btn">❌ 닫기</button>
                </div>
                <div class="encyclopedia-grid">
                    ${fishCardsHTML}
                </div>
            </div>
        `;

        this.container.innerHTML = encyclopediaHTML;
        this.currentPopup = document.getElementById('encyclopedia-popup');
        document.getElementById('book-close-btn').onclick = () => { this.closePopup(); };
    }

    openFishMilestonePopup(currentScene) {
        if (this.isQuizActive) return;
        this.hidePersistentUI();
        this.container.style.pointerEvents = 'auto';

        const collection = this.playerModel.fishCollection;
        const milestones = this.playerModel.fishMilestonesSeen || {};

        let fishCardsHTML = '';
        FISH_TYPES.forEach(fish => {
            const count = collection[fish.id] || 0;
            const isDiscovered = count > 0;

            // 칭호 결정
            let titleText = '없음';
            let titleClass = '';

            if (milestones[fish.id]) {
                if (milestones[fish.id][50]) {
                    titleText = '대마왕 👑';
                    titleClass = 'title-ssr';
                } else if (milestones[fish.id][20]) {
                    titleText = '왕 👑';
                    titleClass = 'title-sr';
                } else if (milestones[fish.id][10]) {
                    titleText = '왕자 👑';
                    titleClass = 'title-r';
                }
            }

            if (isDiscovered) {
                fishCardsHTML += `
                    <div class="fish-card discovered" style="border-color: ${titleText !== '없음' ? '#FFD700' : '#DEB887'};">
                        <img src="assets/images/${fish.id}.png" class="fish-img-sprite" style="transform: scale(${Math.min(1.2, fish.scale)});" />
                        <h3>${fish.name}</h3>
                        <p class="fish-count">총 <strong>${count}</strong>마리</p>
                        <p class="fish-title ${titleClass}">칭호: ${titleText}</p>
                    </div>
                `;
            } else {
                fishCardsHTML += `
                    <div class="fish-card undiscovered">
                        <img src="assets/images/${fish.id}.png" class="fish-img-sprite silhouette-img" style="transform: scale(${Math.min(1.2, fish.scale)});" />
                        <h3>???</h3>
                        <p class="fish-count">0마리</p>
                        <p class="fish-title">칭호: 없음</p>
                    </div>
                `;
            }
        });

        const popupHTML = `
            <div id="encyclopedia-popup" class="popup-box">
                <div class="shop-header" style="flex-direction: column; align-items: center;">
                    <h2>🏆 잡은 물고기 기록 🏆</h2>
                    <p style="margin: 5px 0; color: #666; font-size: 14px;">10마리: 왕자 / 20마리: 왕 / 50마리: 대마왕</p>
                    <button id="book-close-btn" style="align-self: flex-end; margin-top: -40px;">❌ 닫기</button>
                </div>
                <div class="encyclopedia-grid">
                    ${fishCardsHTML}
                </div>
            </div>
        `;

        this.container.innerHTML = popupHTML;
        this.currentPopup = document.getElementById('encyclopedia-popup');

        // 닫기 버튼 이벤트
        document.getElementById('book-close-btn').onclick = () => {
            this.closePopup();
            // 줌 아웃 등의 효과를 다시 주고 싶다면 IntroScene과 상호작용 가능
        };
    }
}
