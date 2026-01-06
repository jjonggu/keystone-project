package com.keystonecape.dto;

import com.keystonecape.entity.Faq;
import com.keystonecape.entity.Notice;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class NoticeFaqResponse {
    private List<Notice> notices;
    private List<Faq> faqs;
}
