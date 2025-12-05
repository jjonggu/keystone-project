import React, { useEffect, useRef } from "react";

export default function KakaoMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        initMap();
        return;
      }

      const script = document.createElement("script");
      script.id = "kakao-map-sdk";
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=f2d5df8c425dc8bf90905633ac2b0bae&autoload=false`;
      script.async = true;

      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(initMap);
        }
      };

      document.head.appendChild(script);
    };

    const initMap = () => {
      const center = new window.kakao.maps.LatLng(37.507287, 127.028503);

      const map = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: 3,
      });

      new window.kakao.maps.Marker({
        position: center,
        map,
      });
    };

    loadKakaoMap();
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "500px", borderRadius: "12px" }}
    />
  );
}
