import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

// 🔹 CSS 및 라이브러리 import (최상단 유지)
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './MapPage.css';

// 🔹 마커 아이콘 이미지
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const CONTEXT_PATH = "/MemorySpace";
const API_BASE = `${CONTEXT_PATH}/api`;

const MapPage = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 파란색 계열 색상 배열
  const blueColors = [
    '#3366FF', '#007FFF', '#00BFFF', '#1E90FF', '#6495ED',
    '#4169E1', '#0000FF', '#0000CD', '#00008B', '#00BFF7'
  ];

  const getRandomBlue = () => {
    return blueColors[Math.floor(Math.random() * blueColors.length)];
  };

  // 1. DB 데이터 가져오기
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${API_BASE}/map/locations`, { method: "GET" });
        if (!res.ok) throw new Error("위치 데이터 로드 실패");

        const text = await res.text();
        const parts = text.split("|");

        if (parts[0] === "SUCCESS") {
          const locationData = [];
          for (let i = 1; i < parts.length; i += 4) {
            if (i + 3 < parts.length) {
              locationData.push({
                name: parts[i] || "Unknown",
                lat: parseFloat(parts[i + 1]),
                lng: parseFloat(parts[i + 2]),
                value: parseInt(parts[i + 3]) // 기억 개수
              });
            }
          }
          setLocations(locationData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocations();
  }, []);

  // 2. 지도 초기화 및 클러스터링
  useEffect(() => {
    if (isLoading || mapInstanceRef.current) return;

    if (!window.L) {
        window.L = L;
    }
    // eslint-disable-next-line global-require
    require('leaflet.markercluster'); 

    // --- 기본 아이콘 설정 ---
    const DefaultIcon = L.icon({
        iconUrl: iconMarker,
        iconRetinaUrl: iconRetina,
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    // --- 지도 생성 ---
    const corner1 = L.latLng(-85, -180);
    const corner2 = L.latLng(85, 180);
    const bounds = L.latLngBounds(corner1, corner2);

    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 3,
      minZoom: 3,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0
    });

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
      noWrap: true,
      bounds: bounds
    }).addTo(map);

    L.control.scale({ imperial: true, metric: true }).addTo(map);

    // 🔹 [핵심 변경 1] 마커 클러스터 그룹 설정
    const markers = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 60,
      
      iconCreateFunction: function(cluster) {
        // 기존: const count = cluster.getChildCount(); (위치 개수)
        
        // 🔹 [변경] 자식 마커들의 값을 모두 더하기
        const children = cluster.getAllChildMarkers();
        let totalMemoryCount = 0;

        for (let i = 0; i < children.length; i++) {
            // 마커 생성 시 options에 심어둔 memoryValue를 가져와서 합산
            totalMemoryCount += (children[i].options.memoryValue || 0);
        }

        // 개수가 아니라 '총합'에 따라 크기/색상 결정 (기준값은 필요에 따라 조절하세요)
        let sizeClass = 'small';
        let bgColor = 'rgba(51, 102, 255, 0.8)';
        let sizePx = 40;

        if (totalMemoryCount > 100) { // 예: 기억 합이 100개가 넘으면 대형
          sizeClass = 'large';
          bgColor = 'rgba(0, 0, 139, 0.85)';
          sizePx = 60;
        } else if (totalMemoryCount > 20) { // 예: 기억 합이 20개가 넘으면 중형
          sizeClass = 'medium';
          bgColor = 'rgba(30, 144, 255, 0.85)';
          sizePx = 50;
        }
        
        return L.divIcon({
          html: `<div style="background-color: ${bgColor};" class="cluster-circle ${sizeClass}">
                   <span>${totalMemoryCount}</span>
                 </div>`,
          className: 'custom-cluster-icon',
          iconSize: L.point(sizePx, sizePx)
        });
      }
    });

    // 🔹 데이터가 있을 때 마커 추가
    if (locations.length > 0) {
      const maxValue = Math.max(...locations.map(loc => loc.value), 1);
      
      locations.forEach((loc) => {
        const baseRadius = 30;
        const radiusMultiplier = 0.5;
        const size = baseRadius + (loc.value / maxValue) * baseRadius * radiusMultiplier;
        
        const baseOpacity = 0.9;
        const opacityReduction = 0.3;
        const opacity = Math.max(0.6, baseOpacity - (loc.value / maxValue) * opacityReduction);

        const randomBlue = getRandomBlue();

        const customIcon = L.divIcon({
          className: 'custom-single-icon',
          html: `<div class="single-circle" style="
                    background-color: ${randomBlue}; 
                    opacity: ${opacity};
                    width: ${size}px;
                    height: ${size}px;
                    line-height: ${size}px; 
                  ">
                   ${loc.value}
                 </div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2]
        });

        // 🔹 [핵심 변경 2] 마커를 만들 때 'memoryValue'라는 옵션에 기억 개수를 저장해둡니다.
        const marker = L.marker([loc.lat, loc.lng], { 
            icon: customIcon,
            memoryValue: loc.value  // <-- 여기에 값을 저장해야 클러스터가 읽을 수 있음
        });
        
        marker.bindPopup(`<b>${loc.name}</b><br>기억: ${loc.value}개`);

        markers.addLayer(marker);
      });
    }

    map.addLayer(markers);

    setTimeout(() => { map.invalidateSize(); }, 100);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isLoading, locations]);

  return (
    <div className="map-page-container">
      {isLoading && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
          지도 로딩 중...
        </div>
      )}
      <div id="map" ref={mapContainerRef}></div>
    </div>
  );
};

export default MapPage;