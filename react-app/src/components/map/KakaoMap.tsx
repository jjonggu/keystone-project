import React, { useEffect, useRef } from "react";
import markerImg from "@/assets/images/marker.png";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  lat: number;
  lng: number;
}

export default function KakaoMap({ lat, lng }: KakaoMapProps) {
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
  }, [lat, lng]);

  const initMap = () => {
    if (!mapRef.current) return;

    const { kakao } = window;

    const center = new kakao.maps.LatLng(lat, lng);

    const map = new kakao.maps.Map(mapRef.current, {
      center,
      level: 3,
    });

    const imageSize = new kakao.maps.Size(100, 100);
    const imageOption = {
      offset: new kakao.maps.Point(50, 100),
      scaledSize: new kakao.maps.Size(100, 100),
    };

    const markerImage = new kakao.maps.MarkerImage(markerImg, imageSize, imageOption);

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
