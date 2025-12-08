import React, { useEffect, useRef } from "react";
import markerImg from "@/assets/images/marker.png"; // 이미지 import

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => initMap());
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js?appkey=f2d5df8c425dc8bf90905633ac2b0bae&autoload=false";
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => initMap());
    };

    document.head.appendChild(script);
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    const { kakao } = window;

    const center = new kakao.maps.LatLng(37.507287, 127.028503);

    const map = new kakao.maps.Map(mapRef.current, {
      center,
      level: 3,
    });

    /** ⭐ 커진 마커 이미지 설정 (2배) */
    const imageSrc = markerImg;
    const imageSize = new kakao.maps.Size(100, 100); // ← 50 → 100 (2배)
    const imageOption = {
      offset: new kakao.maps.Point(50, 100), // 중심점도 2배로 조정
      scaledSize: new kakao.maps.Size(100, 100), // 실제 화면에서 표시되는 크기
    };

    const markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    );

    new kakao.maps.Marker({
      position: center,
      map,
      image: markerImage,
    });
  };

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%", borderRadius: "12px" }}
    />
  );
}
