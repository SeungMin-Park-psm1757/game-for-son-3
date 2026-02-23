// 물고기 데이터 정의
// id, 이름, 등급(N, R, SR, SSR), 보상, 기본 등장 확률(Weight), 픽셀 파티클 색상, 지역(region)
// catchMax: 기존 대비 10% 상향, difficulty: Catch 수식에 사용되는 난이도 계수
export const FISH_TYPES = [
    // --- Region 1: 민물 (8마리) ---
    { id: 'fish_pirami', name: '피라미', grade: 'N', baseReward: 30, baseWeight: 40, region: 1, color: 0xcccccc, scale: 0.5, catchMax: 55, difficulty: 1.0 },
    { id: 'fish_loach', name: '미꾸라지', grade: 'N', baseReward: 35, baseWeight: 40, region: 1, color: 0x8b7355, scale: 0.5, catchMax: 60, difficulty: 1.1 },
    { id: 'fish_boonguh', name: '붕어', grade: 'R', baseReward: 80, baseWeight: 20, region: 1, color: 0x8b6508, scale: 0.8, catchMax: 110, difficulty: 1.5 },
    { id: 'fish_smelt', name: '빙어', grade: 'R', baseReward: 70, baseWeight: 20, region: 1, color: 0xe0ffff, scale: 0.4, catchMax: 100, difficulty: 1.3 },
    { id: 'fish_catfish', name: '메기', grade: 'R', baseReward: 100, baseWeight: 15, region: 1, color: 0x2f4f4f, scale: 0.9, catchMax: 130, difficulty: 1.7 },
    { id: 'fish_ssogari', name: '쏘가리', grade: 'SR', baseReward: 200, baseWeight: 5, region: 1, color: 0xcd853f, scale: 1.0, catchMax: 220, difficulty: 2.5 },
    { id: 'fish_carp', name: '잉어', grade: 'SR', baseReward: 220, baseWeight: 4, region: 1, color: 0xb8860b, scale: 1.2, catchMax: 250, difficulty: 2.7 },
    { id: 'fish_gamulchi', name: '마왕 가물치', grade: 'SSR', baseReward: 800, baseWeight: 0.5, region: 1, color: 0x556b2f, scale: 1.5, catchMax: 440, difficulty: 4.0 },

    // --- Region 2: 연안 (10마리) ---
    { id: 'fish_anchovy', name: '멸치', grade: 'N', baseReward: 40, baseWeight: 40, region: 2, color: 0xc0c0c0, scale: 0.4, catchMax: 50, difficulty: 1.0 },
    { id: 'fish_mangdoong', name: '망둥어', grade: 'N', baseReward: 50, baseWeight: 30, region: 2, color: 0x8b5a2b, scale: 0.6, catchMax: 66, difficulty: 1.2 },
    { id: 'fish_gizzard_shad', name: '전어', grade: 'N', baseReward: 60, baseWeight: 30, region: 2, color: 0xadd8e6, scale: 0.5, catchMax: 70, difficulty: 1.3 },
    { id: 'fish_urock', name: '우럭', grade: 'R', baseReward: 120, baseWeight: 20, region: 2, color: 0x4f4f4f, scale: 0.9, catchMax: 132, difficulty: 1.8 },
    { id: 'fish_webfoot_octopus', name: '쭈꾸미', grade: 'R', baseReward: 100, baseWeight: 15, region: 2, color: 0xd2b48c, scale: 0.7, catchMax: 110, difficulty: 1.6 },
    { id: 'fish_flounder', name: '도다리', grade: 'R', baseReward: 140, baseWeight: 15, region: 2, color: 0x8b4513, scale: 1.0, catchMax: 150, difficulty: 2.0 },
    { id: 'fish_gwangeo', name: '광어', grade: 'SR', baseReward: 300, baseWeight: 5, region: 2, color: 0xd2b48c, scale: 1.2, catchMax: 275, difficulty: 3.0 },
    { id: 'fish_sea_bass', name: '농어', grade: 'SR', baseReward: 350, baseWeight: 4, region: 2, color: 0x708090, scale: 1.2, catchMax: 300, difficulty: 3.2 },
    { id: 'fish_black_porgy', name: '감성돔', grade: 'SSR', baseReward: 900, baseWeight: 0.5, region: 2, color: 0x2f4f4f, scale: 1.2, catchMax: 500, difficulty: 4.5 },
    { id: 'fish_chamdom', name: '참돔', grade: 'SSR', baseReward: 1000, baseWeight: 0.5, region: 2, color: 0xff6347, scale: 1.3, catchMax: 550, difficulty: 5.0 },

    // --- Region 3: 먼 바다 (15마리) ---
    { id: 'fish_godeungeo', name: '고등어', grade: 'N', baseReward: 80, baseWeight: 30, region: 3, color: 0x4682b4, scale: 0.8, catchMax: 88, difficulty: 1.5 },
    { id: 'fish_saury', name: '꽁치', grade: 'N', baseReward: 70, baseWeight: 25, region: 3, color: 0x87ceeb, scale: 0.7, catchMax: 80, difficulty: 1.4 },
    { id: 'fish_spanish_mackerel', name: '삼치', grade: 'N', baseReward: 90, baseWeight: 25, region: 3, color: 0x5f9ea0, scale: 0.9, catchMax: 100, difficulty: 1.6 },
    { id: 'fish_squid', name: '오징어', grade: 'N', baseReward: 100, baseWeight: 20, region: 3, color: 0xffe4b5, scale: 0.8, catchMax: 110, difficulty: 1.7 },
    { id: 'fish_salmon', name: '연어', grade: 'R', baseReward: 160, baseWeight: 15, region: 3, color: 0xfa8072, scale: 1.1, catchMax: 160, difficulty: 2.1 },
    { id: 'fish_pollack', name: '명태', grade: 'R', baseReward: 150, baseWeight: 15, region: 3, color: 0xdeb887, scale: 0.9, catchMax: 150, difficulty: 1.9 },
    { id: 'fish_galchi', name: '은빛 갈치', grade: 'R', baseReward: 180, baseWeight: 12, region: 3, color: 0xe6e6fa, scale: 1.0, catchMax: 165, difficulty: 2.0 },
    { id: 'fish_cod', name: '대구', grade: 'R', baseReward: 190, baseWeight: 12, region: 3, color: 0xcd853f, scale: 1.2, catchMax: 180, difficulty: 2.2 },
    { id: 'fish_monkfish', name: '아귀', grade: 'R', baseReward: 200, baseWeight: 10, region: 3, color: 0x8b4513, scale: 1.1, catchMax: 190, difficulty: 2.3 },
    { id: 'fish_bangeo', name: '대방어', grade: 'SR', baseReward: 400, baseWeight: 5, region: 3, color: 0x778899, scale: 1.5, catchMax: 330, difficulty: 3.5 },
    { id: 'fish_tuna', name: '참치', grade: 'SR', baseReward: 500, baseWeight: 4, region: 3, color: 0x4169e1, scale: 1.6, catchMax: 400, difficulty: 3.8 },
    { id: 'fish_sunfish', name: '개복치', grade: 'SR', baseReward: 600, baseWeight: 2, region: 3, color: 0xa9a9a9, scale: 1.8, catchMax: 450, difficulty: 4.0 },
    { id: 'fish_striped_jewfish', name: '돗돔', grade: 'SSR', baseReward: 1200, baseWeight: 0.5, region: 3, color: 0x2f4f4f, scale: 1.8, catchMax: 600, difficulty: 5.5 },
    { id: 'fish_whale_shark', name: '고래상어', grade: 'SSR', baseReward: 2000, baseWeight: 0.2, region: 3, color: 0x4682b4, scale: 2.5, catchMax: 800, difficulty: 7.0 },
    { id: 'fish_cheongsaechi', name: '청새치', grade: 'SSR', baseReward: 1500, baseWeight: 0.5, region: 3, color: 0x1e90ff, scale: 2.0, catchMax: 660, difficulty: 6.0 }
];

// 특별 아이템 데이터 (1% 확률용)
export const SPECIAL_ITEMS = [
    { id: 'item_shoe', name: '낡은 신발', grade: 'N', baseReward: 0, isSpecialItem: true, color: 0x654321, scale: 1.0, catchMax: 50, difficulty: 1.0 },
    { id: 'item_trash', name: '빈 깡통', grade: 'N', baseReward: 0, isSpecialItem: true, color: 0x999999, scale: 1.0, catchMax: 50, difficulty: 1.0 },
    { id: 'item_treasure', name: '황금 보물상자', grade: 'SSR', baseReward: 500, isSpecialItem: true, color: 0xffd700, scale: 1.2, catchMax: 300, difficulty: 4.0 }
];

// 낚시 성공 시 잡을 확률 계산 로직 (Rod Luck 스탯 및 현재 Region 적용)
export const getRandomFish = (rodLuckLevel, currentRegion) => {
    // 1% 확률로 특별 아이템(신발, 쓰레기, 보물) 등장
    if (Math.random() < 0.01) {
        return SPECIAL_ITEMS[Math.floor(Math.random() * SPECIAL_ITEMS.length)];
    }

    // 1. 현재 지역에 맞는 물고기만 필터링
    const regionFishes = FISH_TYPES.filter(fish => fish.region === currentRegion);

    // 2. Rod Luck 1레벨당 가중치(Weight) 조정
    let totalWeight = 0;
    const adjustedWeights = regionFishes.map(fish => {
        let weight = fish.baseWeight;

        // 희귀 확률을 어렵게 만들었으므로 Rod Luck의 효과도 난이도에 맞게 조정
        if (fish.grade === 'N') {
            weight = Math.max(20, weight - (rodLuckLevel * 2));
        } else if (fish.grade === 'R') {
            weight += (rodLuckLevel * 0.5);
        } else if (fish.grade === 'SR') {
            weight += (rodLuckLevel * 0.5); // 예전 2에서 하향
        } else if (fish.grade === 'SSR') {
            weight += (rodLuckLevel * 0.2); // 예전 1에서 하향
        }

        totalWeight += weight;
        return { ...fish, weight };
    });

    let randomVal = Math.random() * totalWeight;
    for (const fish of adjustedWeights) {
        if (randomVal < fish.weight) {
            return fish;
        }
        randomVal -= fish.weight;
    }

    // Fallback
    return adjustedWeights[0];
};
