// 물고기 데이터 정의
// id, 이름, 등급(N, R, SR, SSR), 보상, 기본 등장 확률(Weight), 픽셀 파티클 색상, 지역(region)
// catchMax: 기존 대비 10% 상향, difficulty: Catch 수식에 사용되는 난이도 계수
export const FISH_TYPES = [
    // --- Region 1: 민물 ---
    { id: 'fish_pirami', name: '피라미', grade: 'N', baseReward: 30, baseWeight: 60, region: 1, color: 0xcccccc, scale: 0.5, catchMax: 55, difficulty: 1.0 },
    { id: 'fish_boonguh', name: '붕어', grade: 'R', baseReward: 80, baseWeight: 25, region: 1, color: 0x8b6508, scale: 0.8, catchMax: 110, difficulty: 1.5 },
    { id: 'fish_ssogari', name: '쏘가리', grade: 'SR', baseReward: 200, baseWeight: 5, region: 1, color: 0xcd853f, scale: 1.0, catchMax: 220, difficulty: 2.5 },
    { id: 'fish_gamulchi', name: '마왕 가물치', grade: 'SSR', baseReward: 800, baseWeight: 0.5, region: 1, color: 0x556b2f, scale: 1.5, catchMax: 440, difficulty: 4.0 },

    // --- Region 2: 연안 ---
    { id: 'fish_mangdoong', name: '망둥어', grade: 'N', baseReward: 50, baseWeight: 60, region: 2, color: 0x8b5a2b, scale: 0.6, catchMax: 66, difficulty: 1.2 },
    { id: 'fish_urock', name: '우럭', grade: 'R', baseReward: 120, baseWeight: 25, region: 2, color: 0x4f4f4f, scale: 0.9, catchMax: 132, difficulty: 1.8 },
    { id: 'fish_gwangeo', name: '광어', grade: 'SR', baseReward: 300, baseWeight: 5, region: 2, color: 0xd2b48c, scale: 1.2, catchMax: 275, difficulty: 3.0 },
    { id: 'fish_chamdom', name: '참돔', grade: 'SSR', baseReward: 1000, baseWeight: 0.5, region: 2, color: 0xff6347, scale: 1.3, catchMax: 550, difficulty: 5.0 },

    // --- Region 3: 먼 바다 ---
    { id: 'fish_godeungeo', name: '고등어', grade: 'N', baseReward: 80, baseWeight: 60, region: 3, color: 0x4682b4, scale: 0.8, catchMax: 88, difficulty: 1.5 },
    { id: 'fish_galchi', name: '은빛 갈치', grade: 'R', baseReward: 180, baseWeight: 25, region: 3, color: 0xe6e6fa, scale: 1.0, catchMax: 165, difficulty: 2.0 },
    { id: 'fish_bangeo', name: '대방어', grade: 'SR', baseReward: 400, baseWeight: 5, region: 3, color: 0x778899, scale: 1.5, catchMax: 330, difficulty: 3.5 },
    { id: 'fish_cheongsaechi', name: '청새치', grade: 'SSR', baseReward: 1500, baseWeight: 0.5, region: 3, color: 0x1e90ff, scale: 2.0, catchMax: 660, difficulty: 6.0 }
];

// 낚시 성공 시 잡을 확률 계산 로직 (Rod Luck 스탯 및 현재 Region 적용)
export const getRandomFish = (rodLuckLevel, currentRegion) => {
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
