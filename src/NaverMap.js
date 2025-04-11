// NaverMap.js
import React, { useEffect, useRef } from 'react';

function NaverMap({ height = 400, onCityChange }) {
  // 지도 표시될 div
  const mapRef = useRef(null);

  // 지도 객체를 저장할 ref
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    console.log('[NaverMap] useEffect');

    if (!window.naver?.maps) {
      console.warn('[NaverMap] window.naver.maps 아직 로드 안됨');
      return;
    }

    // 이미 지도 객체를 생성했다면, 재생성 방지
    if (mapInstanceRef.current) {
      console.log('[NaverMap] 이미 지도 생성 -> 스킵');
      return;
    }

    // === 지도 생성 (처음 한 번만) ===
    console.log('[NaverMap] 새 지도 생성');
    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.5665, 126.9780), // 초기 서울
      zoom: 12,
      draggable: true,
      scrollWheel: true,
    });

    // 생성된 지도 객체를 저장
    mapInstanceRef.current = map;

    // === 지도 중심 좌표를 시/도명으로 변환 ===
    const updateCityName = () => {
      const center = map.getCenter();
      window.naver.maps.Service.reverseGeocode(
        { coords: center },
        (status, response) => {
          if (
            status === window.naver.maps.Service.Status.OK &&
            response?.v2?.results?.length > 0
          ) {
            const region = response.v2.results[0].region;
            const cityName = region?.area1?.name || '알 수 없음';
            console.log('[NaverMap] cityName =>', cityName);
            onCityChange?.(cityName);
          }
        }
      );
    };

    // 지도 이동/확대 끝난 뒤('idle')에 updateCityName 실행
    window.naver.maps.Event.addListener(map, 'idle', updateCityName);

    // 컴포넌트 마운트 시에 초기 1회
    updateCityName();
  }, [onCityChange]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: `${height}px`,
        border: '1px solid #ccc',
      }}
    />
  );
}

export default NaverMap;
