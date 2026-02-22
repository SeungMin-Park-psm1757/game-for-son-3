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
            if (this.isQuizActive) { resolve(false); return; }
            if (Math.random() > 0.5) { resolve(false); return; }

            this.isQuizActive = true;
            this.container.style.pointerEvents = 'auto';

            // 8세 난이도: 3~12 + 1~8 혹은 빼기
            const num1 = Math.floor(Math.random() * 10) + 3;   // 3 ~ 12
            const num2 = Math.floor(Math.random() * 8) + 1;    // 1 ~ 8
            const isAddition = Math.random() > 0.5;

            let operatorSymbol = '';
            let correctAnswer = 0;

            if (isAddition) {
                operatorSymbol = '+';
                correctAnswer = num1 + num2;
            } else {
                operatorSymbol = '−';
                correctAnswer = num1 - num2;
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
                            ${renderFishIcons(num1)}
                        </div>
                        <div class="quiz-operator">${operatorSymbol}</div>
                        <div class="quiz-fish-group">
                            ${renderFishIcons(num2)}
                        </div>
                        <div class="quiz-operator">=</div>
                        <div class="quiz-answer-mark">?</div>
                    </div>
                    <p class="quiz-question" style="font-size:28px; margin-top:10px;">${num1} ${operatorSymbol} ${num2} = ?</p>
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
            praise.innerText = '정답! 보너스 10% 추가!';
            this.currentPopup.appendChild(praise);
        } else {
            clickedBtn.classList.add('wrong');
            clickedBtn.innerHTML += ' ❌';
        }
    }

    closePopup() {
        if (this.currentPopup) { this.currentPopup.remove(); this.currentPopup = null; }
        this.container.innerHTML = '';
        this.container.style.pointerEvents = 'none';
        this.isQuizActive = false;
        this.renderPersistentUI();
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

        // 콧수염 낚시꾼 NPC 대사 10가지
        const npcQuotes = [
            "맘마미아! 이 낚싯대라면 고래도 잡겠어!",
            "에이~ 100 골드면 파스타 한 접시 값이지!",
            "내 핏줄엔 토마토 소스가 흐르지... 낚싯줄엔 행운을 달아주마!",
            "가바굴! 자네 눈빛이 진정한 낚시꾼이야!",
            "우리 할아버지는 수염으로 물고기를 낚았다네!",
            "아이고~ 이 릴은 내 콧수염만큼 튼튼하다고!",
            "벨라! 돈 좀 쓰라구~ 돈은 돌고 돌아 물고기가 되는 거야!",
            "마마미아~ 자네가 오면 내 가게가 환해져!",
            "이 미끼에는 비밀 소스가 발라져 있다구... 절대 핥지 마!",
            "에이~ 전설에 따르면, 정우는 바다의 왕이 된다는데?"
        ];
        const randomQuote = npcQuotes[Math.floor(Math.random() * npcQuotes.length)];

        // 세연이를 위한 최고급 장난감 (10,000골드 이상 해금)
        const ENDING_ITEM_COST = 10000;
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
                        <div class="npc-avatar">🥸</div>
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
                        '"벨라! 탁월한 선택이다!"',
                        '"오~ 자네 센스 있군!"',
                        '"마마미아! 내 콧수염이 감동했어!"'
                    ];
                    bubble.innerText = successQuotes[Math.floor(Math.random() * successQuotes.length)];
                    bubble.classList.add('quiz-shake');
                    setTimeout(() => bubble.classList.remove('quiz-shake'), 400);
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
}
