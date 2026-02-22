export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        console.log("BootScene: Preloading assets...");

        // 이미지 에셋 로드 (지역별 배경)
        this.load.image('bg_freshwater', 'assets/images/bg_freshwater.png');
        this.load.image('bg_coast', 'assets/images/bg_coast.png');
        this.load.image('bg_sea', 'assets/images/bg_sea.png');
        this.load.image('lure', 'assets/images/lure.png');
        this.load.image('character', 'assets/images/character.png');

        // 민물 (Region 1)
        this.load.image('fish_pirami', 'assets/images/fish_pirami.png');
        this.load.image('fish_boonguh', 'assets/images/fish_boonguh.png');
        this.load.image('fish_ssogari', 'assets/images/fish_ssogari.png');
        this.load.image('fish_gamulchi', 'assets/images/fish_gamulchi.png');

        // 연안 (Region 2)
        this.load.image('fish_mangdoong', 'assets/images/fish_mangdoong.png');
        this.load.image('fish_urock', 'assets/images/fish_urock.png');
        this.load.image('fish_gwangeo', 'assets/images/fish_gwangeo.png');
        this.load.image('fish_chamdom', 'assets/images/fish_chamdom.png');

        // 먼 바다 (Region 3)
        this.load.image('fish_godeungeo', 'assets/images/fish_godeungeo.png');
        this.load.image('fish_galchi', 'assets/images/fish_galchi.png');
        this.load.image('fish_bangeo', 'assets/images/fish_bangeo.png');
        this.load.image('fish_cheongsaechi', 'assets/images/fish_cheongsaechi.png');

        // 스토리 캐릭터 초상화 로드
        this.load.image('char_dad', 'assets/images/char_dad.png');
        this.load.image('char_mom', 'assets/images/char_mom.png');
        this.load.image('char_seyeon', 'assets/images/char_seyeon.png');
        this.load.image('char_jeongwoo', 'assets/images/char_jeongwoo.png');

        // 배경음악 로드
        this.load.audio('bgm', 'assets/audio/back.mp3');
    }

    create() {
        // 로드 완료 후 픽셀 아트 필터 적용 (NEAREST)
        const fishKeys = [
            'fish_pirami', 'fish_boonguh', 'fish_ssogari', 'fish_gamulchi',
            'fish_mangdoong', 'fish_urock', 'fish_gwangeo', 'fish_chamdom',
            'fish_godeungeo', 'fish_galchi', 'fish_bangeo', 'fish_cheongsaechi'
        ];
        fishKeys.forEach(key => {
            const tex = this.textures.get(key);
            if (tex) tex.setFilter(Phaser.Textures.FilterMode.NEAREST);
        });

        // 에셋 로딩이 끝나면 IntroScene으로 전환
        this.scene.start('IntroScene');
    }
}
