package com.keystonecape.entity.enumtype;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum NoticeType {
    EVENT,
    MAINTENANCE,
    NEW_THEME;

    @JsonCreator
    public static NoticeType from(String value) {
        return NoticeType.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}
