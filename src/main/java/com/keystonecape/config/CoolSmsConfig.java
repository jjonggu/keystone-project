package com.keystonecape.config;

import jakarta.annotation.PostConstruct;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CoolSmsConfig {

    @Value("${coolsms.api.key}")
    private String apiKey;

    @Value("${coolsms.api.secret}")
    private String apiSecret;

    @Bean
    public DefaultMessageService messageService() {
        return NurigoApp.INSTANCE.initialize(
                apiKey,
                apiSecret,
                "https://api.coolsms.co.kr"
        );
    }
    @PostConstruct
    public void checkKeys() {
        System.out.println("CoolSMS API Key: " + apiKey);
        System.out.println("CoolSMS API Secret: " + apiSecret);
    }

}
