package com.keystonecape.service;

import com.keystonecape.repository.MapRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MapService {

    private  final MapRepository mapRepository;
}
