// StoryData.js
// 첫 획득 및 마왕 조우 이벤트 대사 데이터를 보관합니다.

export const BOSS_STORIES = {
    1: [ // 마왕 가물치 (Region 1)
        [
            { speaker: '마왕 가물치', portrait: null, text: '크헉! 내가 꼬맹이에게 낚이다니! 제발 살려다오!' },
            { speaker: '정우', portrait: 'char_jeongwoo', text: '와! 엄청 큰 물고기가 말을 해!' },
            { speaker: '마왕 가물치', portrait: null, text: '내... 내가 숨겨둔 비상금을 줄 테니 이번 한 번만 놔주라!' }
        ],
        [
            { speaker: '마왕 가물치', portrait: null, text: '아닛, 또 너냐?! 오늘은 컨디션이 안 좋았을 뿐이야!' },
            { speaker: '정우', portrait: 'char_jeongwoo', text: '벌써 두 번째야! 이제 우리 집 연못으로 갈래?' },
            { speaker: '마왕 가물치', portrait: null, text: '으아악! 연못은 좁아서 싫어! 용돈 줄 테니 제발 놔줘!!' }
        ],
        [
            { speaker: '마왕 가물치', portrait: null, text: '...그래, 네가 이 구역의 진짜 마왕이다. 인정하마.' },
            { speaker: '정우', portrait: 'char_jeongwoo', text: '히히! 낚시 마왕 정우라고 불러줘!' },
            { speaker: '마왕 가물치', portrait: null, text: '에휴... 옛다, 쌈짓돈. 나 이제 은퇴할란다...' }
        ]
    ],
    2: [ // 바다의 여왕 참돔 (Region 2)
        [
            { speaker: '바다의 여왕 참돔', portrait: null, text: '어딜 감히 여왕의 옥체에 낚싯바늘을 들이대느냐!' },
            { speaker: '정우', portrait: 'char_jeongwoo', text: '우와! 핑크색 엄청 예쁜 물고기다!!' },
            { speaker: '바다의 여왕 참돔', portrait: null, text: '핑크가 아니라 우아한 진홍빛이다! 여비를 줄 테니 어서 놔주거라!' }
        ],
        [
            { speaker: '바다의 여왕 참돔', portrait: null, text: '또 너로구나! 내 아름다움에 반해서 스토킹하는 것이냐!' },
            { speaker: '정우', portrait: 'char_jeongwoo', text: '아닌데? 맛있는 회 떠먹으려고 잡은 건데?' },
            { speaker: '바다의 여왕 참돔', portrait: null, text: '회... 회라니!! 여기 보물 줄 테니 험한 말 하지 말거라!!' }
        ],
        [
            { speaker: '바다의 여왕 참돔', portrait: null, text: '졌어... 미용 자고 일어났는데 또 잡히다니...' },
            { speaker: '정우', portrait: 'char_jeongwoo', text: '이제 나랑 친해진 거 아냐? 또 놔줄게!' },
            { speaker: '바다의 여왕 참돔', portrait: null, text: '착한 꼬마로구나. 옛다 여왕의 하사품이다.' }
        ]
    ],
    3: [ // 고래상어 (Region 3)
        [
            { speaker: '고래상어', portrait: null, text: '퍼엉- (물을 엄청나게 내뿜음)' },
            { speaker: '정우', portrait: 'char_jeongwoo', text: '으아악! 물벼락 맞았어! 엄청 큰 상어다!!' },
            { speaker: '고래상어', portrait: null, text: '난 이빨도 작고 플랑크톤만 먹는 착한 상어란다. 용돈 줄 테니 바다로 보내주렴~' }
        ],
        [
            { speaker: '고래상어', portrait: null, text: '어이쿠 꼬마야, 내 등 위에 타려고 또 잡은 거니?' },
            { speaker: '정우', portrait: 'char_jeongwoo', text: '응! 버스보다 커서 타보고 싶어!' },
            { speaker: '고래상어', portrait: null, text: '허허, 무거워서 안 된단다. 이거 받고 맛있는 거 사먹으렴.' }
        ],
        [
            { speaker: '고래상어', portrait: null, text: '우리 동네 꼬마들은 다 네 얘기만 하더구나. 대단한 녀석.' },
            { speaker: '정우', portrait: 'char_jeongwoo', text: '나 이제 엄청 유명하구나!!' },
            { speaker: '고래상어', portrait: null, text: '그래, 바다의 전설이지. 기념품으로 이거나 받아라.' }
        ]
    ],
    4: [ // 산갈치 (Region 4)
        [
            { speaker: '용왕 산갈치', portrait: null, text: '감히 심해의 지배자를 빛이 드는 곳으로 끌어올리다니!' },
            { speaker: '정우', portrait: 'char_jeongwoo', text: '우와! 끝이 어딘지 안 보여! 밧줄로 써도 되겠다!' },
            { speaker: '용왕 산갈치', portrait: null, text: '바... 밧줄이라니! 이 영롱한 자태를 보고도!! 황금 줄 테니 어서 놔라!' }
        ],
        [
            { speaker: '용왕 산갈치', portrait: null, text: '또 너냐!! 덕분에 눈이 부셔서 시력이 다 나빠지겠어!' },
            { speaker: '정우', portrait: 'char_jeongwoo', text: '세연이가 머리 묶을 때 쓴다고 리본으로 쓰재!' },
            { speaker: '용왕 산갈치', portrait: null, text: '내 몸이 리본이라고?! 경악스럽군! 돈 줄 테니 제발 가라!!' }
        ],
        [
            { speaker: '용왕 산갈치', portrait: null, text: '하아... 이제 올라오는 길도 익숙해지는군...' },
            { speaker: '정우', portrait: 'char_jeongwoo', text: '안녕 친구야! 오늘 날씨 좋지?' },
            { speaker: '용왕 산갈치', portrait: null, text: '친구... 나쁘지 않군. 옛다, 심해의 보물이다.' }
        ]
    ]
};

// 47종 첫 획득 대사
export const FIRST_CATCH_STORIES = {
    // 민물 N (2씬)
    'fish_pirami': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '와! 엄청 작고 날쌘 은빛 물고기를 잡았어!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '그거 피라미야 오빠! 계곡가면 엄청 많아서 잡기 놀이하기 좋아!' }
    ],
    'fish_loach': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '어휴! 미끌미끌해서 손에서 자꾸 빠져나가!!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '미꾸라지네! 수염도 있고 진흙 속을 엄청 좋아한대!' }
    ],
    // 민물 R (3씬)
    'fish_smelt': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '어? 몸이 투명해서 뼈가 다 보여! 신기하다!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '와아~ 빙어다! 겨울에 얼음 깨고 낚시하는 그 물고기야!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '오~ 그래서 이름이 얼음 빙(氷)자를 써서 빙어구나!' }
    ],
    'fish_boonguh': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '와, 통통하고 친근하게 생긴 물고기야!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '붕어잖아! 오빠, 진짜 붕어빵에는 이 붕어가 들어가는 거야?' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '아니야~ 붕어빵은 밀가루랑 팥으로 몸통 모양만 만든 거지!' }
    ],
    'fish_catfish': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '우왁! 입이 엄청 크고 긴 수염이 4개나 있어!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '아빠 수염보다 더 길어 ㅋㅋ 야행성 메기야!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '밤에 이 긴 수염으로 더듬거리면서 먹이를 찾는대!' }
    ],
    // 민물 SR, SSR (4씬)
    'fish_ssogari': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '우와! 호랑이 무늬 같기도 하고 표범 무늬 같기도 해!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '정말 예쁘다! 쏘가리라는 물고기래.' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '예쁘지만 등에 뾰족한 가시가 있어서 찔리면 엄청 아프대. 조심해야겠다!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '치사하게 무기까지 숨기고 있다니!!' }
    ],
    'fish_carp': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '엄청 크고 황금빛이 도는 멋진 물고기야! 힘이 진짜 세!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '잉어다! 옛날 사람들은 잉어가 폭포를 거슬러 올라가면 용이 된다고 믿었대!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '우와, 포켓몬스터 잉어킹이 갸라도스 되는 거랑 똑같네?!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '그게 여기서 따온 이야기니까 그렇지 바보 오빠야!' }
    ],
    'fish_gamulchi': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '헉! 이건 물고기가 아니라 괴물뱀 같아! 무늬도 무시무시해!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '가물치야! 성질이 엄청 사나워서 다른 물고기를 다 잡아먹는대!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '심지어 아가미 말고도 공기로 숨을 쉴 수 있어서 물 밖에서도 살 수 있대!!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '진짜 괴물이다 으악!! 빨리 놔줘!' }
    ],

    // 연안 N
    'fish_anchovy': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '이 쪼끄만 은빛 물고기는 뭐지?' },
        { speaker: '세연', portrait: 'char_seyeon', text: '오빠 맨날 반찬으로 먹는 멸치잖아 ㅋㅋ 살아있는 건 처음 보지?' }
    ],
    'fish_mangdoong': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '눈이 정수리에 튀어나와 있어 ㅋㅋ 엄청 웃기게 생겼다!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '망둥어야! 갯벌에서 폴짝폴짝 뛰어다녀!' }
    ],
    'fish_gizzard_shad': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '가을 되면 엄청 고소한 냄새가 난다는 그 물고기!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '맞아! 전어야. 돈(錢)을 생각하지 않고 사 먹을 정도로 맛있대서 전어래!' }
    ],
    // 연안 R
    'fish_webfoot_octopus': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '다리가 8개! 문어의 미니 사이즈 버전 같아!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '쭈꾸미야! 위험하면 먹물을 뿜고 도망가니까 조심해!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '머리(몸통)에 밥알 모양 알이 가득 찰 때가 제일 맛있대!' }
    ],
    'fish_urock': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '까무잡잡하고 머리가 진짜 크네!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '우럭(조피볼락)이야! 국민 횟감으로 엄청 유명하지!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '바위 틈에 숨어 사는 걸 좋아한대. 나랑 숨바꼭질하면 내가 이길 텐데!' }
    ],
    'fish_flounder': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '얘는 왜 눈이 오른쪽에 몰려 있어?! 몸도 엄청 납작해!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '도다리야! 모래 바닥에 딱 붙어서 숨어 지내려고 납작해진 거래.' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '아하~ "좌광우도"라고 눈이 오른쪽에 있으면 도다리, 왼쪽이면 광어라더라!' }
    ],
    // 연안 SR, SSR
    'fish_black_porgy': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '와, 삐죽삐죽한 지느러미에 은빛 몸이 진짜 기사 갑옷 같아!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '바다의 흑기사 감성돔이야! 엄청 예민해서 잡기 어려운 물고기래.' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '신기한 건, 어릴 때는 다 수컷이다가 크면서 암컷으로 성별이 바뀌기도 한대!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '우와! 마법사 물고기인가봐!!' }
    ],
    'fish_gwangeo': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '도다리랑 비슷하게 생겼는데, 얘는 눈이 왼쪽에 있네!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '넙치(광어)야! 입이 도다리보다 훨씬 크고 날카로운 이빨이 있어.' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '모래 속에 숨어 있다가 휙 튀어나와서 작은 물고기를 잡아먹는대!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '그래서 납작해도 엄청 무서운 사냥꾼이구나!' }
    ],
    'fish_sea_bass': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '입이 엄청 커! 은빛 비늘이 너무 멋지다!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '농어야! 여름철 바다에서는 제일 힘이 센 녀석 중 하나지!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '어릴 땐 점농어라고 해서 점이 있다가 크면서 사라지기도 한대.' },
        { speaker: '세연', portrait: 'char_seyeon', text: '오빠도 크면 얼굴에 있는 점 사라졌음 좋겠다 ㅋㅋㅋ' }
    ],
    'fish_chamdom': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '와... 온몸이 진분홍색으로 빛나!! 진짜 예쁘다!!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '참돔! 너무 예뻐서 바다의 여왕이라고 불린대!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '수명이 무려 30년이 넘어서 행운과 장수의 상징이래. 할아버지 생신 때 선물해야겠다!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '잔치상에 참돔이 올라가면 최고지 최고!' }
    ],

    // 먼 바다 N
    'fish_saury': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '뾰족하고 은빛으로 반짝이는 긴 물고기야!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '꽁치네! 아랫입술이 조금 더 튀어나와 있어 ㅋㅋ' }
    ],
    'fish_godeungeo': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '등에 파란색 물결무늬가 엄청 멋있다!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '국민 반찬 고등어! 성격이 진짜 급해서 잡히면 금방 화병으로 죽는대.' }
    ],
    'fish_squid': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '머리가 삼각형이고 다리가 10개야!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '오징어! 사실 우리가 머리라고 생각하는 세모난 부분이 지느러미래 ㅋㅋ' }
    ],
    'fish_spanish_mackerel': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '고등어보다 훨씬 크고 날씬하게 생겼어!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '삼치야! 이빨이 칼날처럼 날카로우니까 오빠 조심해!!' }
    ],
    // 먼 바다 R
    'fish_pollack': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '아랫턱에 작은 수염이 하나 콕 나있네?' },
        { speaker: '세연', portrait: 'char_seyeon', text: '명태야! 잡아서 얼리면 동태, 얼렸다 녹였다 말리면 황태! 이름이 엄청 많아!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '완전 변신 로봇 같네! 난 생태탕이 제일 좋아!' }
    ],
    'fish_salmon': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '비늘은 은색인데 살은 살구색이야! 엄청난 힘으로 헤엄쳐 왔나 봐.' },
        { speaker: '세연', portrait: 'char_seyeon', text: '연어야! 강에서 태어나 바다로 갔다가, 커서 다시 자기가 태어난 강으로 돌아온대!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '엄청 먼 바다를 여행하고 고향을 찾아온다니 진정한 모험가구나!' }
    ],
    'fish_galchi': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '와! 진짜 길고 은식기로 만든 칼처럼 번쩍번쩍 빛나!!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '갈치야! 밤바다에서 보면 은빛 조명처럼 반짝인대.' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '물속에서 헤엄칠 땐 눕지 않고 서서 꼿꼿하게 헤엄을 친대. 완전 신기해!!' }
    ],
    'fish_cod': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '입이 내 머리통만하게 엄청 큰 물고기다!!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '그래서 이름이 큰 입을 뜻하는 대구(大口)래!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '엄청난 대식가라서 눈에 보이는 건 다 집어삼킨대 ㅋㅋ 나처럼 뷔페 가면 잘 먹겠다!' }
    ],
    'fish_monkfish': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '으아아! 머리가 몸통의 거의 절반이고 입 안에 날카로운 이빨이 가득해!!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '못생긴 물고기의 대표 아귀야! 입 위에 낚싯대 같은 더듬이가 있어.' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '저 초롱불 같은 더듬이를 흔들어서 작은 물고기를 유인해서 꿀꺽 한대!' }
    ],
    // 먼 바다 SR, SSR
    'fish_bangeo': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '엄청 통통하고 묵직한 물고기다! 힘이 장난이 아니야!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '겨울 바다의 끝판왕 방어야! 추운 바다를 이기려고 지방을 엄청 찌운대.' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '크면 클수록 맛있는 물고기는 방어가 유일하대! 대방어 만세!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '오빠도 나중에 크면 방어처럼 통통해지는 거 아냐? ㅋㅋㅋ' }
    ],
    'fish_tuna': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '와... 차 한 대만한 엄청난 은빛 물고기다!! 로켓 모터라도 달린 것 같아!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '참치(참다랑어)야! 시속 100km로 수영할 수 있는 바다의 스포츠카야!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '참치는 죽을 때까지 헤엄을 멈추지 않는대. 멈추면 숨을 쉴 수가 없대 ㅠㅠ' },
        { speaker: '세연', portrait: 'char_seyeon', text: '헐퀴... 잠도 헤엄치면서 자?! 진짜 대단하다...' }
    ],
    'fish_sunfish': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '꼬리가 잘린 것처럼 생겼네?! 입은 동그랗고 눈만 엄청 커 ㅋㅋㅋ' },
        { speaker: '세연', portrait: 'char_seyeon', text: '개복치네! 몸무게가 2톤까지도 크는데 성격이 엄청 겁쟁이래.' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '조금만 놀라도 기절해버린대. 스트레스에 제일 약한 물고기란다 ㅋㅋ' },
        { speaker: '세연', portrait: 'char_seyeon', text: '조심조심 놔줘야겠다. 놀래켜서 기절하면 불쌍하잖아 ㅠㅠ' }
    ],
    'fish_striped_jewfish': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '와, 커다란 비늘에 검은 줄무늬가 있는 엄청 크고 무거운 물고기야!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '전설의 물고기 돗돔이야! 원래 심해 400m 아래에 살아서 보기 엄청 힘들대.' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '크기가 2미터까지 크는 바다의 불도저란다. 이걸 낚다니 나 정말 대단한걸?!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '오빠 팔통증 올 거 같아... 파스 붙여줄게!' }
    ],
    'fish_cheongsaechi': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '우와아! 윗입술이 길고 뾰족한 창처럼 생겼어!! 등지느러미도 돛단배 같아!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '청새치다! 저 창으로 다른 물고기를 기절시켜서 사냥한대!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '노인과 바다 책에 나오는 바로 그 물고기야! 시속 110km 바다에서 제일 빠르대!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '오빠 그 책 읽은 척 하지마 ㅋㅋㅋ 앞장만 읽은 거 다 알어!' }
    ],
    'fish_whale_shark': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '이건 상어야 고래야?! 몸에 하얀 별무늬가 가득하고 입이 내 키보다 커!!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '지구에서 제일 큰 물고기 고래상어야! 성격이 완전 멍순이래 ㅋㅋ' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '이빨이 엄청 치밀해서 새우나 플랑크톤 같은 작은 것만 물과 함께 꿀꺽 한대!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '아하! 상어인데도 사람을 물지 않는 착한 상어구나!' }
    ],

    // 보물섬 N
    'fish_flying_fish': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '물고기한테 새의 날개 같은 가슴지느러미가 달려있어!!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '물 위를 날아다니는 날치! 포식자를 피하려고 수십 미터를 글라이더처럼 날아!' }
    ],
    'fish_lionfish': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '빨간색, 하얀색 줄무늬에 지느러미가 화려한 사자 갈기 같아!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '쏠배감펭이야! 예쁘지만 저 뾰족한 지느러미에 엄청난 독이 있으니 만지지 마!!' }
    ],
    'fish_parrotfish': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '입이 딱딱하고 앵무새 부리처럼 생겼어! 무지개색으로 빛나!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '앵무고기! 저 단단한 이빨로 산호를 오도독 갉아먹는대 ㅋㅋ' }
    ],
    'fish_moray_eel': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '뱀장어처럼 생겼는데 턱이나 눈매가 진짜 무섭게 생겼네 ㅠㅠ' },
        { speaker: '세연', portrait: 'char_seyeon', text: '곰치야! 입 안에 이빨이 또 있어서 한 번 물면 절대 놓지 않는 바다의 마피아래!' }
    ],
    // 보물섬 R
    'fish_barracuda': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '길쭉하게 생겼는데 이빨이 완전 톱날 같아! 은빛 화살처럼 생겼어.' },
        { speaker: '세연', portrait: 'char_seyeon', text: '바다의 늑대 바라쿠다야. 무리를 지어 다니며 순식간에 사냥감을 찢어발긴대!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '번쩍이는 은색 물체를 보면 달려드는 습성이 있대.' }
    ],
    'fish_mahi_mahi': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '이마가 엄청 튀어나왔고 초록, 노랑, 파랑 온갖 형광색이 나!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '만새기(마히마히)야! 바다의 치타처럼 엄청 빠르고 날치를 제일 좋아한대.' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '죽으면 이 아름다운 무지개색이 순식간에 사라진다니 너무 슬프다.' }
    ],
    'fish_giant_trevally': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '크고 엄청 두꺼워보이는 은빛 물고기다! 힘이 와이어를 끊을 뻔했어!!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '자이언트 트레발리(GT)! 물 위로 날아오르는 바닷새도 튀어올라 낚아채는 괴력의 소유자래!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '낚시꾼들의 평생의 로망인 물고기라는데, 내가 해냈다!!' }
    ],
    'fish_sailfish': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '청새치랑 비슷한데 등지느러미가 엄청나게 커다란 돛 모양이야!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '돛새치야! 물속의 치타인데, 저 돛을 접으면 물의 저항을 안 받아서 엄청 빠르대!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '사냥할 때나 위협할 때는 돛을 쫙 파서 몸집을 크게 보이게 한단다!' }
    ],
    // 보물섬 SR, SSR
    'fish_hammerhead': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '와하하! 진짜 머리가 양옆으로 툭 튀어나와서 망치 모양이야!!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '눈이 상어의 저 끝에 달려있는 귀상어야! 머리 모양이 특이하게 진화했지.' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '저 넓은 머리로 다른 상어보다 전자기장 센서가 발달해서 모래 속 먹이를 잘 찾는대!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '생긴 건 완전 웃긴데 똑똑한 금속탐지기를 갖고 달고 다니는구나!' }
    ],
    'fish_manta_ray': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '우와! 진짜 무슨 날으는 양탄자처럼 생겼어! 크기가 마법의 융단이야!!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '만타가오리(쥐가오리)야. 가오리 중에서 제일 크고 멋진 바다의 비행사지.' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '크기는 엄청 큰데 입에 달린 두 개의 뿔 같은 걸로 플랑크톤을 모아 먹고 산대.' },
        { speaker: '세연', portrait: 'char_seyeon', text: '사람이랑 헤엄치는 것도 좋아하는 바다의 온순한 천사래~' }
    ],
    'fish_giant_squid': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '이... 이게 뭐야! 다리가 내 방보다 길어!! 눈알이 축구공 만해!!!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '크라켄의 모티브가 된 심해의 제왕 자이언트 스퀴드(대왕오징어)야!!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '향유고래랑 심해에서 목숨 걸고 싸운다던데... 이걸 낚아 올린 내 팔뚝 실화냐?!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '오빠 기절하지마!! 이거 오징어튀김 하면 일년 내내 먹겠다 ㅋㅋㅋ' }
    ],
    'fish_golden_fish': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '헉!! 이건 물고기 맞아?! 온몸이 진짜 순금으로 된 조각상처럼 빛나!!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '전설의 황금 물고기다!! 이거 보면 세 가지 소원을 들어준다던데?!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '오! 첫 번째 소원은 로봇 장난감! 두 번째는 피자! 세 번째는...' },
        { speaker: '세연', portrait: 'char_seyeon', text: '내 예쁜 원피스 사달라고 빌어!! 안 그럼 오빠 수영장 파티 때 놀릴 거다!' }
    ],
    'fish_coelacanth': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '이건 공룡 사전에서 본 물고기잖아?! 비늘이 돌처럼 단단해 보여!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '4억 년 전부터 살아남은 살아있는 화석 실러캔스야!! 오빠 이거 대박 발명품급 발견이야!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '공룡 시대의 비밀을 알고 있는 할아버지 물고기구나.' },
        { speaker: '세연', portrait: 'char_seyeon', text: '심해 200m 동굴에 산다는데... 정우 오빠 진짜 못 낚는 게 없구나 너...' }
    ],
    'fish_oarfish': [
        { speaker: '정우', portrait: 'char_jeongwoo', text: '끝이 안 보여!! 은빛 테이프처럼 생겼고 머리에 빨간 왕관 같은 지느러미가 있어!!' },
        { speaker: '세연', portrait: 'char_seyeon', text: '용궁에서 온 사자, 산갈치야! 몸길이가 10미터가 넘기도 하는 세계에서 제일 긴 경골어류래!' },
        { speaker: '정우', portrait: 'char_jeongwoo', text: '옛날 사람들은 이걸 보고 바다괴물이나 인어로 착각했대. 지진이 나면 물 위로 올라온다는 전설도 있어.' },
        { speaker: '세연', portrait: 'char_seyeon', text: '진짜 아름답고 신비롭다... 얼른 다시 용궁으로 보내주자 오빠!' }
    ]
};
