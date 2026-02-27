// 물고기 데이터 정의
// id, 이름, 등급(N, R, SR, SSR), 보상, 기본 등장 확률(Weight), 픽셀 파티클 색상, 지역(region)
// catchMax: 기존 대비 10% 상향, difficulty: Catch 수식에 사용되는 난이도 계수
// scale 7단계: XS(0.09), S(0.14), MS(0.20), M(0.30), ML(0.40), L(0.55), XL(0.70)
export const FISH_TYPES = [
    // --- Region 1: 민물 (8마리) ---
    // 챕터 1 초반(rodPower=1,reelSpeed=1): progress=1/diff, 후반(rP=3,rS=2): progress=6/diff
    // N등급 목표: 초반 10~15클릭, 업글 후 5~8클릭 / R: 12~25클릭 → 업글 후 8~15클릭
    { id: 'fish_pirami', name: '피라미', grade: 'N', baseReward: 30, baseWeight: 40, region: 1, color: 0xcccccc, scale: 0.293, catchMax: 14, difficulty: 1.0 },    // ~10cm XS
    { id: 'fish_loach', name: '미꾸라지', grade: 'N', baseReward: 35, baseWeight: 40, region: 1, color: 0x8b7355, scale: 0.0732, catchMax: 16, difficulty: 1.1 },    // ~12cm XS
    { id: 'fish_smelt', name: '빙어', grade: 'R', baseReward: 70, baseWeight: 20, region: 1, color: 0xe0ffff, scale: 0.0732, catchMax: 35, difficulty: 1.3 },         // ~15cm XS
    { id: 'fish_boonguh', name: '붕어', grade: 'R', baseReward: 80, baseWeight: 20, region: 1, color: 0x8b6508, scale: 0.8203, catchMax: 40, difficulty: 1.5 },       // ~25cm S
    { id: 'fish_catfish', name: '메기', grade: 'R', baseReward: 100, baseWeight: 15, region: 1, color: 0x2f4f4f, scale: 0.1318, catchMax: 50, difficulty: 1.7 },      // ~40cm MS
    { id: 'fish_ssogari', name: '쏘가리', grade: 'SR', baseReward: 200, baseWeight: 5, region: 1, color: 0xcd853f, scale: 0.5273, catchMax: 80, difficulty: 2.2 },    // ~35cm MS
    { id: 'fish_carp', name: '잉어', grade: 'SR', baseReward: 220, baseWeight: 4, region: 1, color: 0xb8860b, scale: 0.625, catchMax: 90, difficulty: 2.4 },         // ~60cm M
    { id: 'fish_gamulchi', name: '마왕 가물치', grade: 'SSR', baseReward: 800, baseWeight: 0.5, region: 1, color: 0x556b2f, scale: 1.4844, catchMax: 140, difficulty: 3.5 }, // ~100cm ML

    // --- Region 2: 연안 (10마리) ---
    // 챕터 2 진입(rP=5,rS=3): progress=15/diff → N: 8~10클릭, R: 12~20클릭, SR/SSR: 25~50클릭
    // 보상: 챕터1 대비 약 2.5~3배 인상
    { id: 'fish_anchovy', name: '멸치', grade: 'N', baseReward: 90, baseWeight: 40, region: 2, color: 0xc0c0c0, scale: 0.0732, catchMax: 130, difficulty: 1.0 },     // ~10cm XS
    { id: 'fish_mangdoong', name: '망둥어', grade: 'N', baseReward: 110, baseWeight: 30, region: 2, color: 0x8b5a2b, scale: 0.5859, catchMax: 150, difficulty: 1.1 }, // ~15cm XS
    { id: 'fish_gizzard_shad', name: '전어', grade: 'N', baseReward: 130, baseWeight: 30, region: 2, color: 0xadd8e6, scale: 0.2051, catchMax: 170, difficulty: 1.2 }, // ~25cm S
    { id: 'fish_webfoot_octopus', name: '쭈꾸미', grade: 'R', baseReward: 250, baseWeight: 15, region: 2, color: 0xd2b48c, scale: 0.4102, catchMax: 280, difficulty: 1.8 }, // ~20cm S
    { id: 'fish_urock', name: '우럭', grade: 'R', baseReward: 280, baseWeight: 20, region: 2, color: 0x4f4f4f, scale: 1.0547, catchMax: 320, difficulty: 2.0 },      // ~35cm MS
    { id: 'fish_flounder', name: '도다리', grade: 'R', baseReward: 320, baseWeight: 15, region: 2, color: 0x8b4513, scale: 1.0547, catchMax: 350, difficulty: 2.2 },  // ~30cm MS
    { id: 'fish_black_porgy', name: '감성돔', grade: 'SR', baseReward: 700, baseWeight: 5, region: 2, color: 0x2f4f4f, scale: 0.5273, catchMax: 580, difficulty: 3.5 }, // ~40cm MS → grade change 반영(SR→SR 유지, 보상 조정)
    { id: 'fish_gwangeo', name: '광어', grade: 'SR', baseReward: 800, baseWeight: 4, region: 2, color: 0xd2b48c, scale: 0.7422, catchMax: 630, difficulty: 3.8 },    // ~70cm ML
    { id: 'fish_sea_bass', name: '농어', grade: 'SSR', baseReward: 2200, baseWeight: 0.5, region: 2, color: 0x708090, scale: 0.3711, catchMax: 1050, difficulty: 6.5 }, // ~80cm ML
    { id: 'fish_chamdom', name: '참돔', grade: 'SSR', baseReward: 2500, baseWeight: 0.5, region: 2, color: 0xff6347, scale: 1.25, catchMax: 1200, difficulty: 7.5 }, // ~50cm M

    // --- Region 3: 먼 바다 (15마리) ---
    // 챕터 3 진입(rP=10,rS=6): progress=60/diff → N: 7~10클릭, R: 10~18클릭, SR: 18~30클릭, SSR: 35~55클릭
    // 보상: 챕터1 대비 5~10배 인상
    { id: 'fish_saury', name: '꽁치', grade: 'N', baseReward: 220, baseWeight: 25, region: 3, color: 0x87ceeb, scale: 0.4102, catchMax: 480, difficulty: 1.4 },      // ~30cm S
    { id: 'fish_godeungeo', name: '고등어', grade: 'N', baseReward: 250, baseWeight: 30, region: 3, color: 0x4682b4, scale: 1.0547, catchMax: 510, difficulty: 1.5 }, // ~35cm MS
    { id: 'fish_squid', name: '오징어', grade: 'N', baseReward: 280, baseWeight: 25, region: 3, color: 0xffe4b5, scale: 0.5273, catchMax: 550, difficulty: 1.6 },     // ~35cm MS (몸통)
    { id: 'fish_spanish_mackerel', name: '삼치', grade: 'N', baseReward: 300, baseWeight: 20, region: 3, color: 0x5f9ea0, scale: 0.625, catchMax: 590, difficulty: 1.7 }, // ~60cm M
    { id: 'fish_pollack', name: '명태', grade: 'R', baseReward: 500, baseWeight: 15, region: 3, color: 0xdeb887, scale: 0.625, catchMax: 910, difficulty: 2.3 },     // ~50cm M
    { id: 'fish_salmon', name: '연어', grade: 'R', baseReward: 550, baseWeight: 15, region: 3, color: 0xfa8072, scale: 0.625, catchMax: 980, difficulty: 2.5 },      // ~70cm M
    { id: 'fish_galchi', name: '은빛 갈치', grade: 'R', baseReward: 600, baseWeight: 12, region: 3, color: 0xe6e6fa, scale: 1.25, catchMax: 1050, difficulty: 2.7 }, // ~100cm 길지만 가늘어서 M
    { id: 'fish_cod', name: '대구', grade: 'R', baseReward: 650, baseWeight: 12, region: 3, color: 0xcd853f, scale: 1.25, catchMax: 1120, difficulty: 2.9 },        // ~70cm M
    { id: 'fish_monkfish', name: '아귀', grade: 'R', baseReward: 700, baseWeight: 10, region: 3, color: 0x8b4513, scale: 1.25, catchMax: 1190, difficulty: 3.1 },   // ~50cm M (넓적)
    { id: 'fish_bangeo', name: '대방어', grade: 'SR', baseReward: 1400, baseWeight: 5, region: 3, color: 0x778899, scale: 1.4844, catchMax: 1890, difficulty: 4.5 },  // ~100cm ML
    { id: 'fish_tuna', name: '참치', grade: 'SR', baseReward: 1800, baseWeight: 4, region: 3, color: 0x4169e1, scale: 0.9375, catchMax: 2240, difficulty: 5.5 },      // ~150cm L
    { id: 'fish_sunfish', name: '개복치', grade: 'SR', baseReward: 2200, baseWeight: 2, region: 3, color: 0xa9a9a9, scale: 0.9375, catchMax: 2450, difficulty: 6.5 },  // ~200cm L
    { id: 'fish_striped_jewfish', name: '돗돔', grade: 'SSR', baseReward: 4500, baseWeight: 0.5, region: 3, color: 0x2f4f4f, scale: 0.7422, catchMax: 3150, difficulty: 8.0 }, // ~120cm ML
    { id: 'fish_cheongsaechi', name: '청새치', grade: 'SSR', baseReward: 5500, baseWeight: 0.5, region: 3, color: 0x1e90ff, scale: 1.875, catchMax: 3500, difficulty: 9.0 }, // ~300cm L
    { id: 'fish_whale_shark', name: '고래상어', grade: 'SSR', baseReward: 8000, baseWeight: 0.2, region: 3, color: 0x4682b4, scale: 2.3438, catchMax: 4200, difficulty: 10.0 }, // ~500cm+ XL

    // --- Region 4: 보물섬 (14마리) ---
    // 챕터 4 진입(rP=15,rS=8): progress=120/diff → N: 8~12클릭, R: 15~25클릭, SR: 25~40클릭, SSR: 50~80클릭
    // 보상: 챕터3 대비 2~4배 인상, 열대/심해/전설 생물
    { id: 'fish_flying_fish', name: '날치', grade: 'N', baseReward: 500, baseWeight: 30, region: 4, color: 0x87ceeb, scale: 1.6406, catchMax: 1200, difficulty: 2.0 },  // ~25cm S
    { id: 'fish_lionfish', name: '쏠배감펭', grade: 'N', baseReward: 550, baseWeight: 25, region: 4, color: 0xff4500, scale: 1.6406, catchMax: 1350, difficulty: 2.2 },  // ~30cm S
    { id: 'fish_parrotfish', name: '앵무고기', grade: 'N', baseReward: 600, baseWeight: 25, region: 4, color: 0x00fa9a, scale: 2.1094, catchMax: 1500, difficulty: 2.4 }, // ~40cm MS
    { id: 'fish_moray_eel', name: '곰치', grade: 'N', baseReward: 650, baseWeight: 20, region: 4, color: 0x556b2f, scale: 2.9688, catchMax: 1650, difficulty: 2.6 },    // ~100cm ML (길다)
    { id: 'fish_barracuda', name: '바라쿠다', grade: 'R', baseReward: 1200, baseWeight: 15, region: 4, color: 0xc0c0c0, scale: 2.9688, catchMax: 2500, difficulty: 3.5 }, // ~120cm ML
    { id: 'fish_mahi_mahi', name: '만새기', grade: 'R', baseReward: 1300, baseWeight: 12, region: 4, color: 0x32cd32, scale: 2.9688, catchMax: 2800, difficulty: 3.8 },   // ~100cm ML
    { id: 'fish_giant_trevally', name: '자이언트 트레발리', grade: 'R', baseReward: 1500, baseWeight: 12, region: 4, color: 0x708090, scale: 2.9688, catchMax: 3100, difficulty: 4.2 }, // ~100cm ML
    { id: 'fish_sailfish', name: '돛새치', grade: 'R', baseReward: 1800, baseWeight: 10, region: 4, color: 0x4169e1, scale: 3.75, catchMax: 3500, difficulty: 4.8 },    // ~250cm L
    { id: 'fish_hammerhead', name: '귀상어', grade: 'SR', baseReward: 3500, baseWeight: 5, region: 4, color: 0x778899, scale: 3.75, catchMax: 5000, difficulty: 7.0 },   // ~300cm L
    { id: 'fish_manta_ray', name: '쥐가오리', grade: 'SR', baseReward: 4000, baseWeight: 4, region: 4, color: 0x191970, scale: 4.6875, catchMax: 5500, difficulty: 7.5 },  // ~500cm XL
    { id: 'fish_giant_squid', name: '대왕오징어', grade: 'SR', baseReward: 5000, baseWeight: 3, region: 4, color: 0x8b0000, scale: 4.6875, catchMax: 6200, difficulty: 8.5 }, // ~600cm+ XL
    { id: 'fish_golden_fish', name: '황금 물고기', grade: 'SSR', baseReward: 10000, baseWeight: 0.5, region: 4, color: 0xffd700, scale: 1.0547, catchMax: 8000, difficulty: 11.0 },  // 전설 ~40cm MS (작지만 빛난다)
    { id: 'fish_coelacanth', name: '실러캔스', grade: 'SSR', baseReward: 15000, baseWeight: 0.3, region: 4, color: 0x2f4f4f, scale: 1.875, catchMax: 9000, difficulty: 12.0 },    // ~150cm L
    { id: 'fish_oarfish', name: '산갈치', grade: 'SSR', baseReward: 20000, baseWeight: 0.2, region: 4, color: 0xff6347, scale: 4.6875, catchMax: 10000, difficulty: 13.0 }         // ~500cm+ XL
];

// 특별 아이템 데이터 (1% 확률용)
export const SPECIAL_ITEMS = [
    { id: 'item_shoe', name: '낡은 신발', grade: 'N', baseReward: 0, isSpecialItem: true, color: 0x654321, scale: 0.8203, catchMax: 50, difficulty: 1.0 },
    { id: 'item_trash', name: '빈 깡통', grade: 'N', baseReward: 0, isSpecialItem: true, color: 0x999999, scale: 0.5859, catchMax: 50, difficulty: 1.0 },
    { id: 'item_treasure', name: '황금 보물상자', grade: 'SSR', baseReward: 500, isSpecialItem: true, color: 0xffd700, scale: 1.0547, catchMax: 300, difficulty: 4.0 },
    // 보물섬 전용 특수 아이템
    { id: 'item_treasure_map', name: '보물 지도 조각', grade: 'R', baseReward: 1000, isSpecialItem: true, color: 0xdeb887, scale: 1.0547, catchMax: 200, difficulty: 2.0, region: 4 },
    { id: 'item_pirates_sword', name: '해적의 녹슨 칼', grade: 'N', baseReward: 200, isSpecialItem: true, color: 0x808080, scale: 1.0547, catchMax: 100, difficulty: 1.5, region: 4 },
    { id: 'item_pearl', name: '거대 진주', grade: 'SR', baseReward: 3000, isSpecialItem: true, color: 0xfffaf0, scale: 0.8203, catchMax: 400, difficulty: 3.0, region: 4 },
    { id: 'item_crown', name: '해적왕의 왕관', grade: 'SSR', baseReward: 8000, isSpecialItem: true, color: 0xffd700, scale: 1.0547, catchMax: 600, difficulty: 5.0, region: 4 }
];

// 낚시 성공 시 잡을 확률 계산 로직 (Rod Luck 스탯 및 현재 Region 적용)
export const getRandomFish = (rodLuckLevel, currentRegion) => {
    // 1% 확률로 특별 아이템 등장 (보물섬에서는 전용 아이템)
    if (Math.random() < 0.01) {
        let availableItems;
        if (currentRegion === 4) {
            // 보물섬: 보물섬 전용 아이템만
            availableItems = SPECIAL_ITEMS.filter(item => item.region === 4);
        } else {
            // 기존 지역: 범용 아이템만
            availableItems = SPECIAL_ITEMS.filter(item => !item.region);
        }
        if (availableItems.length > 0) {
            return availableItems[Math.floor(Math.random() * availableItems.length)];
        }
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

        // --- '왕(20마리)' 칭호 달성 시 등장 확률 30% 감소 로직 ---
        const pm = window.gameManagers && window.gameManagers.playerModel;
        if (pm && pm.fishMilestonesSeen && pm.fishMilestonesSeen[fish.id] && pm.fishMilestonesSeen[fish.id][20]) {
            weight = weight * 0.7;
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
