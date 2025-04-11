// App.js
import React, { useState } from 'react';
import NaverMapLoader from './NaverMapLoader';
import NaverMap from './NaverMap';

function App() {
  // === 기존 상태들 ===
  const [mapReady, setMapReady] = useState(false); 
  const [cityName, setCityName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // === 로그인 모달 관련 추가 ===
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  // 지도 스크립트 로딩 완료
  const handleMapLoad = () => {
    console.log('[App] Naver Map script loaded!');
    setMapReady(true);
  };

  // 지도에서 역지오코딩으로 받은 시/도명
  const handleCityChange = (name) => {
    setCityName(name);
  };

  // "매물 보기" 버튼 클릭 시
  const handleClick = () => {
    if (!cityName) {
      alert('현재 시/도를 불러오지 못했습니다!');
      return;
    }
    setIsLoading(true);
    alert(`${cityName} 매물 보기 기능 작동!`);
    // 로딩 예시
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // === 마이페이지 아이콘(로그인 모달) 열기 ===
  const handleMyPageClick = () => {
    setShowLoginModal(true);
  };

  // 로그인 모달 닫기
  const handleCloseModal = () => {
    setShowLoginModal(false);
    // 입력값 초기화 (원하면)
    setUserId('');
    setPassword('');
  };

  // 로그인 처리 (아직 DB 없음)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('아이디:', userId);
    console.log('비밀번호:', password);

    // TODO: fetch로 DB/서버 연결 → 로그인 검증

    alert(`아이디:${userId} / 비번:${password} 로그인 시도! (DB 연동은 미구현)`);

    // 로그인 성공 가정 → 모달 닫기
    setShowLoginModal(false);
    setUserId('');
    setPassword('');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 1) 네이버 지도 스크립트 로더 */}
      <NaverMapLoader onLoad={handleMapLoad} />

      {/* 2) 지도 or '지도 로딩중...' */}
      {mapReady ? (
        <NaverMap height={500} onCityChange={handleCityChange} />
      ) : (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>지도 로딩중...</p>
      )}

      {/* 3) 지도 우측 하단: "매물 보기" 버튼 */}
      <button
        onClick={handleClick}
        disabled={isLoading || !mapReady}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#2b2b2b',
          color: '#fff',
          padding: '12px 18px',
          border: 'none',
          borderRadius: '25px',
          fontWeight: 'bold',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          zIndex: 999,
        }}
      >
        {isLoading ? '로딩 중...' : `📍 ${cityName || '알 수 없음'} 매물 보기`}
      </button>

      {/* === 우측 상단: "마이페이지" 아이콘/버튼 추가 === */}
      <button
        onClick={handleMyPageClick}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: '#333',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '20px',
          border: 'none',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        마이페이지
      </button>

      {/* === 로그인 모달 === */}
      {showLoginModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h2>로그인</h2>
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label>아이디</label><br/>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>비밀번호</label><br/>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ textAlign: 'right' }}>
                <button type="button" onClick={handleCloseModal}>
                  닫기
                </button>
                <button type="submit" style={{ marginLeft: '10px' }}>
                  로그인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 간단한 모달 스타일
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '300px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
  },
};

export default App;
