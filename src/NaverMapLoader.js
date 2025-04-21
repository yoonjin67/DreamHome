// NaverMapLoader.js
import { useEffect, useRef } from 'react';

function NaverMapLoader({ onLoad }) {
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) {
      console.log('[NaverMapLoader] 이미 로드됨 -> 스킵');
      return;
    }
    loadedRef.current = true;

    const naverKey = process.env.REACT_APP_NAVER_MAP_KEY;
    console.log('[DEBUG] Netlify에서 전달된 NAVER KEY:', naverKey); // ✅ 디버깅 추가

    if (!naverKey) {
      console.error('[NaverMapLoader] NAVER_MAP_KEY가 설정되지 않았습니다!');
      return;
    }

    // === 스크립트 삽입 ===
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverKey}&submodules=geocoder`;

    script.async = true;
    script.onload = () => {
      console.log('[NaverMapLoader] 스크립트 로드 완료 -> onLoad() 호출');
      onLoad?.();
    };
    document.head.appendChild(script);
    console.log('[NaverMapLoader] 스크립트를 head에 추가');
  }, [onLoad]);

  return null;
}

export default NaverMapLoader;
