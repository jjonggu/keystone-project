// src/api/index.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

/**
 * ✅ 요청 인터셉터
 * - 모든 요청에 무조건 ADMIN KEY 주입
 * - 첫 요청 타이밍 문제 완전 차단
 */
api.interceptors.request.use(
  (config) => {
    config.headers = config.headers ?? {};
    config.headers["X-ADMIN-KEY"] = "keystone-admin-secret-123";
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * (선택) 응답 인터셉터 – 401 로그 확인용
 */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.error("❌ ADMIN 인증 실패 (401)");
    }
    return Promise.reject(err);
  }
);

export default api;
