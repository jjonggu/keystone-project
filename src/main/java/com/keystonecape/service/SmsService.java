package com.keystonecape.service;

import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SmsService {

    private final DefaultMessageService messageService;

    @Value("${coolsms.from.number}")
    private String fromNumber;

    public void sendReservationSms(
            Long reservationId,
            String to,
            String customerName,
            String themeName,
            String date,
            String time,
            int headCount,
            int totalPrice
    ) {
        System.out.println(">>> SmsService 진입");

        Message message = new Message();
        message.setFrom(fromNumber); // 발신번호 반드시 CoolSMS 등록 번호
        message.setTo(to);           // 수신번호는 01012345678 형식
        message.setText(
                "[KEYSTONE 예약 완료]\n\n" +
                        "예약번호: " + reservationId + "\n" +
                        "예약자: " + customerName + "\n" +
                        "테마: " + themeName + "\n" +
                        "날짜: " + date + "\n" +
                        "시간: " + time + "\n" +
                        "인원: " + headCount + "명\n" +
                        "금액: " + totalPrice + "원\n\n" +
                        "예약이 정상적으로 완료되었습니다."
        );

        try {
            messageService.sendOne(new SingleMessageSendingRequest(message));
            System.out.println(">>> 문자 전송 성공");
        } catch (Exception e) {
            System.err.println(">>> CoolSMS 전송 실패: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
