import { useEffect, useRef } from 'react';

function NaverMapLoader({ onLoad }) {
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) {
      console.log('[NaverMapLoader] 이미 로드됨 -> 스킵');
      onLoad?.(); // 혹시 재렌더링 때도 안전하게 호출
      return;
    }

    loadedRef.current = true;

    const naverKey = process.env.REACT_APP_NAVER_MAP_KEY;
    console.log('[DEBUG] 환경변수 NAVER KEY:', naverKey);

    if (!naverKey) {
      console.error('[NaverMapLoader] NAVER_MAP_KEY가 설정되지 않았습니다!');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverKey}&submodules=geocoder`;
    script.async = true;

    script.onload = () => {
      console.log('[NaverMapLoader] 지도 스크립트 로드 완료');
      onLoad?.();
    };

    document.head.appendChild(script);
    console.log('[NaverMapLoader] 스크립트 삽입 완료');
  }, [onLoad]);

  return null;
}

export default NaverMapLoader;
