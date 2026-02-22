import BootScene from './scenes/BootScene.js';
import IntroScene from './scenes/IntroScene.js';
import GameScene from './scenes/GameScene.js';
import StoryScene from './scenes/StoryScene.js';
import EndingScene from './scenes/EndingScene.js';

const config = {
    type: Phaser.AUTO,
    // Enable crisp pixel art rendering (no smoothing)
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        autoRound: true,
        parent: 'game-container',
        width: 720,
        height: 1280
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [BootScene, IntroScene, GameScene, StoryScene, EndingScene]
};

// 디바운스/에러 방지를 위한 윈도우 에러 캡처 (게임 진행 방해 최소화)
window.addEventListener('error', (e) => {
    console.warn("Error Handled to prevent freeze:", e.message);
});

import PlayerModel from './models/PlayerModel.js';
import UIManager from './utils/UIManager.js';
import SoundManager from './utils/SoundManager.js';

// 글로벌 모델 및 매니저 초기화
const playerModel = new PlayerModel();
const soundManager = new SoundManager();
const uiManager = new UIManager(playerModel);

// 화면에 항상 띄워둘 UI (골드, 상점 버튼) 초기화
uiManager.initPersistentUI();

// 외부 모듈에서 접근 가능하도록 window 객체에 임시 할당 (Phaser 씬 내부에서 꺼내쓰기 위함)
window.gameManagers = { playerModel, uiManager, soundManager };

const game = new Phaser.Game(config);

// UIManager에서 씬 전환을 위해 Phaser 게임 인스턴스 참조를 글로벌에 저장
window.gameManagers._phaserGame = game;
