"use client";

import { COLORS, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import styled from "styled-components";

const PhoneWrapper = styled.div<{ $isMini?: boolean }>`
  width: ${({ $isMini }) => $isMini ? '160px' : '230px'};
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PhoneIcon = styled.img<{ $isMini?: boolean }>`
  width: ${({ $isMini }) => $isMini ? '14px' : '20px'};
`;

const WhatsappIcon = styled.img<{ $isMini?: boolean }>`
  width: ${({ $isMini }) => $isMini ? '16px' : '22px'};
`;

const TelegramIcon = styled.img<{ $isMini?: boolean }>`
  width: ${({ $isMini }) => $isMini ? '18px' : '25px'};
`;

const PhoneContainer = styled.div<{ $isMini?: boolean }>`
  width: ${({ $isMini }) => $isMini ? '110px' : '165px'};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const OrderCall = styled.button<{ $isMini?: boolean }>`
    width: ${({ $isMini }) => $isMini ? '160px' : '230px'};
    height: ${({ $isMini }) => $isMini ? '22px' : '30px'};
    background-color: white;
    border: 1px solid ${COLORS.CORPORATE_BLUE};
    border-radius: 6px;
    margin: ${({ $isMini }) => $isMini ? '0' : '-20px 0 0 0'};
    cursor: pointer;

    transition: background-color 0.3s ease;

  &:hover {
      background-color: ${COLORS.CORPORATE_GRAY};
  }
`


export default function PhoneBlock({srcPhone, isMini = false}: {srcPhone?: string; isMini?: boolean}) {
  return (
    <>
        <PhoneWrapper $isMini={isMini} >
            <PhoneContainer $isMini={isMini}>
                <PhoneIcon $isMini={isMini} src={srcPhone || "/icons/social/phone-blue-icon.svg"} alt="Phone" />
                <span>+7 (999) 721-57-40</span>
            </PhoneContainer>
            <a href="https://wa.me/+79997215740" target="_blank" rel="noopener noreferrer">
                <WhatsappIcon $isMini={isMini} src="/icons/social/whatsapp-icon.svg" alt="Whatsapp" />
            </a>
            <a href="https://t.me/+79997215740" target="_blank" rel="noopener noreferrer">
                <TelegramIcon $isMini={isMini} src="/icons/social/telegram-icon.svg" alt="Telegram" />
            </a>
        </PhoneWrapper>
        <OrderCall $isMini={isMini}>Заказать звонок</OrderCall>
    </>
  );
}
