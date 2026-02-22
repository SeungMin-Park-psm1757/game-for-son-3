// 로컬 스토리지 데이터 영속성을 위한 유틸리티 함수
export const saveGameData = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn("Storage save failed", e);
    }
};

export const loadGameData = (key, defaultData) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultData;
    } catch (e) {
        console.warn("Storage load failed", e);
        return defaultData;
    }
};
