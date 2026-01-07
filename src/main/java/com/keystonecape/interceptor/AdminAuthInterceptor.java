package com.keystonecape.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    private final Environment env;

    public AdminAuthInterceptor(Environment env) {
        this.env = env;
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        String activeProfile = env.getProperty("spring.profiles.active", "dev");
        String ADMIN_KEY = env.getProperty("admin.key", "keystone-admin-secret-123");

        // 개발 환경(dev)에서 ADMIN_MODE=true이면 인증 활성화, false이면 무시
        if ("dev".equalsIgnoreCase(activeProfile)) {
            String adminMode = env.getProperty("ADMIN_MODE", "false");
            if (!Boolean.parseBoolean(adminMode)) {
                // 인증 무시
                return true;
            }
        }

        // Preflight(OPTIONS) 요청은 무조건 통과 → 브라우저 CORS 방지
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String adminKeyHeader = request.getHeader("X-ADMIN-KEY");

        // null 안전 체크
        if (adminKeyHeader == null || !ADMIN_KEY.equals(adminKeyHeader)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        return true;
    }
}
