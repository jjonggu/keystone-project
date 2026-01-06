package com.keystonecape.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class RecaptchaService {

    @Value("${recaptcha.secret}")
    private String secretKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean verify(String token) {
        String url = "https://www.google.com/recaptcha/api/siteverify"
                + "?secret=" + secretKey
                + "&response=" + token;

        try {
            Map response = restTemplate.postForObject(url, null, Map.class);
            return response != null && Boolean.TRUE.equals(response.get("success"));
        } catch (Exception e) {
            return false;
        }
    }
}
