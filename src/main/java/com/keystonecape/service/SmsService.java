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
                "[KEYSTONE 방탈출카페 예약]\n\n" +
                        "예약번호: " + reservationId + "\n" +
                        "예약자: " + customerName + "\n" +
                        "테마: " + themeName + "\n" +
                        "날짜: " + date + "\n" +
                        "시간: " + time + "\n" +
                        "인원: " + headCount + "명\n" +
                        "총 금액: " + totalPrice + "원\n\n" +
                        "농협 12345678 키스톤케이프" + "\n\n" +
                        "* 위 계좌로 총 금액을 이체해 주셔야 예약이 확정됩니다." + "\n" +
                        "* 이체 시 반드시 예약자 이름으로 입금 부탁드립니다." + "\n" +
                        "* 입금이 확인이 안되면 예약이 취소됩니다." + "\n" +
                        "* 취소를 원하실 경우 홈페이지에서 가능하십니다." + "\n\n" +
                        "문의 사항이 있으실 경우 010-1234-5678로 연락 부탁드립니다."

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
