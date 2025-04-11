// NaverMapLoader.js
import { useEffect, useRef } from 'react';

function NaverMapLoader({ onLoad }) {
  // 이미 스크립트를 로딩했는지 추적
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) {
      console.log('[NaverMapLoader] 이미 로드됨 -> 스킵');
      return;
    }
    loadedRef.current = true;

    const naverKey = process.env.REACT_APP_NAVER_MAP_KEY;
    if (!naverKey) {
      console.error('[NaverMapLoader] NAVER_MAP_KEY가 설정되지 않았습니다!');
      return;
    }

    // ▼ 여기서 Key ID vs Client ID 중 골라야 합니다.
    // Key ID라면:
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverKey}&submodules=geocoder`;

    // 만약 Client ID였다면:
    // script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverKey}&submodules=geocoder`;

    script.async = true;
    script.onload = () => {
      console.log('[NaverMapLoader] 스크립트 로드 완료 -> onLoad() 호출');
      onLoad?.();
    };
    document.head.appendChild(script);

    console.log('[NaverMapLoader] 스크립트를 head에 추가');

    // ✅ 스크립트를 제거하지 않음 (지도 유지 위해)
    return () => {
      // document.head.removeChild(script); // 주석 처리
    };
  }, [onLoad]);

  return null;
}

export default NaverMapLoader;
