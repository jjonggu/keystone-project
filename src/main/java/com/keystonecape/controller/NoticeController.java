package com.keystonecape.controller;

import com.keystonecape.dto.NoticeFaqResponse;
import com.keystonecape.entity.Faq;
import com.keystonecape.entity.Notice;
import com.keystonecape.repository.FaqRepository;
import com.keystonecape.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/notice")
    public Notice createNotice(@RequestBody Notice notice) {
        return noticeRepository.save(notice);
    }

    @PostMapping("/faq")
    public Faq createFaq(@RequestBody Faq faq) {
        return faqRepository.save(faq);
    }

}
