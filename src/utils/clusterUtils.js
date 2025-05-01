// src/utils/clusterUtils.js
/**
 * 매물 리스트를 줌레벨에 따라 구별/동별로 클러스터링하여 반환
 * @param {Array} aptList - 전체 매물 배열
 * @param {Number} zoom - 현재 지도 줌레벨
 * @returns {Object} { clusters: Map, level: 'gu' | 'dong' }
 */
export function clusterByRegion(aptList, zoom) {
    const clusters = new Map();
    const level = zoom < 13 ? 'gu' : 'dong';
    aptList.forEach((apt) => {
        const rawkey = level === 'gu' ? apt.gu : apt.dong;
        const key = rawkey?.trim()
        if (!key) return;
        if (!clusters.has(key)) {
        clusters.set(key, []);
        }
        clusters.get(key).push(apt);
    });
    return { clusters, level };
}