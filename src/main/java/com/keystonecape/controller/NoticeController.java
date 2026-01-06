package com.keystonecape.controller;

import com.keystonecape.dto.NoticeFaqResponse;
import com.keystonecape.repository.FaqRepository;
import com.keystonecape.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class NoticeController {

    private final NoticeRepository noticeRepository;
    private final FaqRepository faqRepository;

    @GetMapping("/notice")
    public NoticeFaqResponse getNoticePage() {
        return new NoticeFaqResponse(
                noticeRepository.findAll(Sort.by(Sort.Direction.DESC, "noticeDate")),
                faqRepository.findAll(Sort.by("id"))
        );
    }

}
