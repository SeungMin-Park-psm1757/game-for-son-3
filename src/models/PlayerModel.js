import { saveGameData, loadGameData } from '../utils/Storage.js';

// 옵저버 패턴 및 데이터 저장을 위한 간단한 모델 클래스 (MVC 중 Model 역할)
export default class PlayerModel {
    constructor() {
        // 초기화 시 로컬 스토리지에서 데이터 로드
        const savedData = loadGameData('fishingGameData', null);

        if (savedData) {
            this.gold = savedData.gold;
            this.stats = savedData.stats;
            this.fishCollection = savedData.fishCollection || {};
            this.currentChapter = savedData.currentChapter || 1;
            this.highestChapter = savedData.highestChapter || 1;
            this.hasSeenFirstStory = savedData.hasSeenFirstStory || false;
        } else {
            this.gold = 0;
            this.stats = {
                rodPower: 1,      // 클릭 1회당 오르는 게이지
                catchChance: 1,   // 입질 확률 증가 (기본 대기시간 단축)
                reelSpeed: 1,     // 연타 효율 강화 혹은 자동 게이지 하락 방지
                rodLuck: 1        // 희귀 보상 획득 확률
            };
            this.fishCollection = {};
            this.currentChapter = 1;
            this.highestChapter = 1;
            this.hasSeenFirstStory = false;
        }
        this.listeners = [];

        // 챕터별 목표 금액
        this.chapterGoals = {
            1: 3000,
            2: 8000,
            3: 20000
        };
    }

    // 상태 변화를 UI에 알리기 위한 옵저버 메서드
    subscribe(callback) {
        this.listeners.push(callback);
    }

    notify() {
        // 상태가 변할 때마다 옵저버에게 알리고, 로컬 스토리지에 자동 저장
        this.listeners.forEach(cb => cb(this));

        saveGameData('fishingGameData', {
            gold: this.gold,
            stats: this.stats,
            fishCollection: this.fishCollection,
            currentChapter: this.currentChapter,
            highestChapter: this.highestChapter,
            hasSeenFirstStory: this.hasSeenFirstStory
        });
    }

    // 챕터 진행 목표 달성 여부 확인
    checkChapterGoal() {
        if (this.currentChapter > 3) return false; // 이미 엔딩 봄
        const goal = this.chapterGoals[this.currentChapter];
        return this.gold >= goal;
    }

    advanceChapter() {
        if (this.currentChapter <= 3) {
            this.currentChapter++;
            if (this.currentChapter > this.highestChapter) {
                this.highestChapter = this.currentChapter;
            }
            this.notify();
        }
    }

    addGold(amount) {
        this.gold += amount;
        this.notify();
    }

    addFish(fishId) {
        if (!this.fishCollection[fishId]) {
            this.fishCollection[fishId] = 0;
        }
        this.fishCollection[fishId] += 1;
        this.notify();
    }

    upgradeStat(statName, cost) {
        const MAX_LEVELS = {
            rodPower: 20,
            catchChance: 10,
            reelSpeed: 10,
            rodLuck: 5
        };

        const currentLevel = this.stats[statName];

        if (currentLevel >= MAX_LEVELS[statName]) {
            return false; // 이미 최대 레벨
        }

        if (this.gold >= cost && currentLevel !== undefined) {
            this.gold -= cost;
            this.stats[statName] += 1;
            this.notify();
            return true;
        }
        return false;
    }
}
