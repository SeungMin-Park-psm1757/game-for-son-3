// Web Audio API를 활용한 레트로 효과음 생성기 (외부 에셋 다운로드 불필요)
export default class SoundManager {
    constructor() {
        this.ctx = null;
        this.isInitialized = false;
        this.muted = false;

        // 사용자 인터랙션이 발생하면 AudioContext 초기화
        const initAudio = () => {
            if (!this.isInitialized) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                this.isInitialized = true;
                // 한 번 초기화되면 이벤트 리스너 제거
                document.removeEventListener('pointerdown', initAudio);
            }
        };
        document.addEventListener('pointerdown', initAudio);
    }

    _playTone(freq, type, duration, volLevel = 0.5, slideFreq = null) {
        if (this.muted || !this.isInitialized || !this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        const now = this.ctx.currentTime;

        // 주파수 설정 (슬라이딩 유무)
        osc.frequency.setValueAtTime(freq, now);
        if (slideFreq) {
            osc.frequency.exponentialRampToValueAtTime(slideFreq, now + duration);
        }

        // 볼륨 설정 (ADSR 페이드 아웃)
        gain.gain.setValueAtTime(volLevel, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.start(now);
        osc.stop(now + duration);
    }

    // 1. 찌 던질 때 (물방울 퐁당 소리)
    playDrop() {
        this._playTone(300, 'sine', 0.4, 0.4, 600);
    }

    // 2. 입질 올 때 (짧고 강렬한 알림음)
    playBite() {
        this._playTone(800, 'square', 0.1, 0.3);
        setTimeout(() => this._playTone(1200, 'square', 0.15, 0.4), 100);
    }

    // 3. 버튼 마구 연타할 때 (틱틱 긁는 소리)
    playTapping() {
        this._playTone(300 + Math.random() * 200, 'triangle', 0.05, 0.2);
    }

    // 4. 잡기 실패 
    playFail() {
        this._playTone(300, 'sawtooth', 0.6, 0.5, 100);
    }

    // 5. 물고기 포획 성공 (팡파레)
    playSuccess() {
        this._playTone(400, 'square', 0.1, 0.3);
        setTimeout(() => this._playTone(500, 'square', 0.1, 0.3), 100);
        setTimeout(() => this._playTone(600, 'square', 0.1, 0.3), 200);
        setTimeout(() => this._playTone(800, 'square', 0.4, 0.4), 300);
    }

    // 6. 상점 등에서 골드 소모/획득할 때 찰캉
    playCoin() {
        this._playTone(1000, 'sine', 0.1, 0.4, 1500);
    }

    // 7. 삐익 (오답, 코인 부족 등)
    playError() {
        this._playTone(200, 'sawtooth', 0.3, 0.4, 150);
    }

    // 글로벌 음소거 토글
    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }
}
