import React, { useState } from 'react';
import NaverMapLoader from './NaverMapLoader';
import NaverMap from './NaverMap';
import './App.css';

function App() {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [aptList, setAptList] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  return (
    <div className="app-layout">
      {/* 사이드바 */}
      <aside className={`sidebar ${sidebarOpen ? 'visible' : 'hidden'}`}>
        <div className="sidebar-header">
          <h2>{selectedRegion || '선택 지역 없음'}</h2>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            ⟵ 닫기
          </button>
        </div>
        <div className="apt-list">
          {aptList.length > 0 ? (
            aptList.map((apt, i) => (
              <div key={i} className="apt-item">
                <b>{apt.name}</b>
                <p>{apt.dong} · {apt.area}㎡ · {apt.floor}층</p>
                <p>{apt.year}.{apt.month}.{apt.day} · <b>{apt.price}만원</b></p>
              </div>
            ))
          ) : (
            <p>매물을 선택하면 여기에 표시됩니다.</p>
          )}
        </div>
      </aside>

      {/* 지도 */}
      <main className="map-section">
        <NaverMapLoader onLoad={() => setMapReady(true)} />
        {mapReady && (
          <NaverMap
            onRegionClick={(regionName, apts) => {
              console.log('[DEBUG] 지역 클릭:', regionName, apts);
              setSelectedRegion(regionName);
              setAptList(apts);
              setSidebarOpen(true);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
