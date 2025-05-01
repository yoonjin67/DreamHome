// src/NaverMap.js (스타일 분리됨)
import React, { useEffect, useRef, useState } from 'react';
import { fetchAptPrices } from './api';
import LAWD_CD_MAP from './lawdCodes';
import { clusterByRegion } from './utils/clusterUtils';
import './NaverMap.css';

function NaverMap({ height = 500, onRegionClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const geocodeCache = useRef(new Map());
  const aptCache = useRef({});
  const [zoomLevel, setZoomLevel] = useState(12);
  const [currentRegion, setCurrentRegion] = useState('');

  const getClusterCenter = (apts) => {
    const latSum = apts.reduce((sum, a) => sum + (a.lat || 0), 0);
    const lngSum = apts.reduce((sum, a) => sum + (a.lng || 0), 0);
    return new window.naver.maps.LatLng(
      latSum / apts.length,
      lngSum / apts.length
    );
  };

  const getLatLngFromAddress = async (addr) => {
    if (geocodeCache.current.has(addr)) return geocodeCache.current.get(addr);
    const latlng = await new Promise((resolve) => {
      window.naver.maps.Service.geocode({ query: addr }, (status, res) => {
        if (status === window.naver.maps.Service.Status.OK && res.v2.addresses[0]) {
          resolve({
            lat: parseFloat(res.v2.addresses[0].y),
            lng: parseFloat(res.v2.addresses[0].x),
          });
        } else {
          resolve(null);
        }
      });
    });
    if (latlng) geocodeCache.current.set(addr, latlng);
    return latlng;
  };

  useEffect(() => {
    if (!window.naver?.maps || mapInstanceRef.current) return;

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.5133, 126.9264),
      zoom: 12,
    });

    mapInstanceRef.current = map;

    const updateDataByCenter = async () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      setZoomLevel(zoom);
      const geocoder = window.naver.maps.Service;

      let centerGu = null;
      await new Promise((resolve) => {
        geocoder.reverseGeocode({ coords: center }, (status, response) => {
          if (status === geocoder.Status.OK) {
            centerGu = response.v2.results?.[0]?.region?.area2?.name;
            setCurrentRegion(centerGu);
          }
          resolve();
        });
      });

      if (!centerGu || !LAWD_CD_MAP[centerGu]) return;

      const lawdCd = LAWD_CD_MAP[centerGu];
      let aptList = aptCache.current[lawdCd];

      if (!aptList) {
        aptList = await fetchAptPrices(lawdCd, '202403');

        for (let apt of aptList) {
          apt.gu = centerGu;
          const fullAddr = `서울특별시 ${apt.gu} ${apt.dong} ${apt.jibun}`;
          const latlng = await getLatLngFromAddress(fullAddr);
          if (latlng) {
            apt.lat = latlng.lat;
            apt.lng = latlng.lng;
          }
        }

        aptCache.current[lawdCd] = aptList;
      }

      const newMarkers = [];

      if (zoom >= 16) {
        for (const apt of aptList) {
          if (!apt.lat || !apt.lng) continue;

          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(apt.lat, apt.lng),
            map,
            icon: {
              content: `<div class="price-marker">${apt.price}만원</div>`,
              anchor: new window.naver.maps.Point(12, 12),
            },
          });

          window.naver.maps.Event.addListener(marker, 'click', () => {
            onRegionClick(`${apt.dong} ${apt.name}`, [apt]);
            map.panTo(new window.naver.maps.LatLng(apt.lat, apt.lng));
          });

          newMarkers.push(marker);
        }
      } else {
        const { clusters } = clusterByRegion(aptList, zoom);

        clusters.forEach((clusterApts, regionName) => {
          const latlng = getClusterCenter(clusterApts);

          const marker = new window.naver.maps.Marker({
            position: latlng,
            map,
            icon: {
              content: `<div class="cluster-marker">${clusterApts.length}</div>`,
              anchor: new window.naver.maps.Point(24, 24),
            },
          });

          window.naver.maps.Event.addListener(marker, 'click', () => {
            onRegionClick(regionName, clusterApts);
            map.panTo(latlng);
          });

          newMarkers.push(marker);
        });
      }

      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = newMarkers;
    };

    window.naver.maps.Event.addListener(map, 'idle', updateDataByCenter);
    updateDataByCenter();
  }, [onRegionClick]);

  return (
    <div className="map-container" style={{ height: `${height}px` }}>
      <div ref={mapRef} className="map-element" />

      <div className="zoom-indicator">
        줌 레벨: {zoomLevel}
      </div>

      {currentRegion && (
        <button className="region-button" onClick={async () => {
          const lawdCd = LAWD_CD_MAP[currentRegion];
          if (!lawdCd) return;
          let aptList = aptCache.current[lawdCd];
          if (!aptList) return;

          const zoom = mapInstanceRef.current.getZoom();
          const { clusters } = clusterByRegion(aptList, zoom);

          const regionKey = [...clusters.keys()].find(k =>
            k.includes(currentRegion) || currentRegion.includes(k)
          ) || currentRegion;

          const apts = clusters.get(regionKey) || [];
          onRegionClick(regionKey, apts);
        }}>
          {currentRegion} 매물 보기
        </button>
      )}
    </div>
  );
}

export default NaverMap;
