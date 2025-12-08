package com.keystonecape.controller;

import com.keystonecape.service.MapService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MapController {

    private final MapService mapService;
    
    // 예제
    // react에서 axois로 받아서 처리 없으면 intail해야함
    // /api 맵핑된 이유는 react 에 src/api/index.ts 에서 /api 로 기로 약속되었기 때문에
    // @GetMapping("/map")
    // public List<Map> maps() {
    //    return mapService.mapList();
    //}
}
