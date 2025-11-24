package com.keystonecape.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KstController {

    @GetMapping("/api/test")
    public String test(){
        return "hello word dddddd";
    }
}
