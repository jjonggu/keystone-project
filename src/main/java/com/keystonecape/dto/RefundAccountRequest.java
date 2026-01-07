package com.keystonecape.dto;

import lombok.Data;

@Data
public class RefundAccountRequest {
    private String refundBank;
    private String refundAccount;
}
