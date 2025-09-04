"use client";

import { COLORS } from "@/constants";
import { openModal } from "@/redux/reducers";
import { useAppDispatch } from "@/redux/store";
import styled from "styled-components";
import { useState } from "react";
import CallbackModal from "@/components/modals/CallbackModal";

const PhoneWrapper = styled.div<{ $isMini?: boolean }>`
  box-sizing: border-box;
  width: ${({ $isMini }) => ($isMini ? "160px" : "230px")};
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${({ $isMini }) => ($isMini ? "0" : "0 0 10px 0")};
  font-size: ${({ $isMini }) => ($isMini ? "10px" : "14px")};
`;

const PhoneIcon = styled.img<{ $isMini?: boolean }>`
  width: ${({ $isMini }) => ($isMini ? "14px" : "20px")};
`;

const WhatsappIcon = styled.img<{ $isMini?: boolean }>`
  width: ${({ $isMini }) => ($isMini ? "16px" : "22px")};
`;

const TelegramIcon = styled.img<{ $isMini?: boolean }>`
  width: ${({ $isMini }) => ($isMini ? "18px" : "25px")};
`;

const PhoneContainer = styled.div<{ $isMini?: boolean }>`
  width: ${({ $isMini }) => ($isMini ? "110px" : "165px")};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LinksIcons = styled.a`
  margin: 0 0 0 10px;
`;

const OrderCall = styled.button<{ $isMini?: boolean; disabled?: boolean }>`
  width: ${({ $isMini }) => ($isMini ? "160px" : "230px")};
  height: ${({ $isMini }) => ($isMini ? "22px" : "30px")};
  background-color: white;
  border: 1px solid ${COLORS.CORPORATE_BLUE};
  border-radius: 6px;
  margin: ${({ $isMini }) => ($isMini ? "0" : "-20px 0 0 0")};
  cursor: pointer;
  transition: background-color 0.3s ease, opacity .2s ease;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

  &:hover {
    background-color: ${COLORS.CORPORATE_GRAY};
  }
`;

export default function PhoneBlock({
  srcPhone,
  isMini = false,
}: {
  srcPhone?: string;
  isMini?: boolean;
}) {
  const dispatch = useAppDispatch();
  const [requestSent, setRequestSent] = useState(false);

  const openCallback = () => {
    if (requestSent) return;
    dispatch(
      openModal({
        content: (
          <CallbackModal
            defaultMethod="call"
            onSuccess={() => setRequestSent(true)}
          />
        ),
      })
    );
  };

  return (
    <>
      <PhoneWrapper $isMini={isMini}>
        <PhoneContainer $isMini={isMini}>
          <PhoneIcon
            $isMini={isMini}
            src={srcPhone || "/icons/social/phone-blue-icon.svg"}
            alt="Phone"
          />
          <span>+7 (999) 721-57-40</span>
        </PhoneContainer>
        <LinksIcons
          href="https://wa.me/+79997215740"
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsappIcon
            $isMini={isMini}
            src="/icons/social/whatsapp-icon.svg"
            alt="Whatsapp"
          />
        </LinksIcons>
        <LinksIcons
          href="https://t.me/+79997215740"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TelegramIcon
            $isMini={isMini}
            src="/icons/social/telegram-icon.svg"
            alt="Telegram"
          />
        </LinksIcons>
      </PhoneWrapper>

      <OrderCall $isMini={isMini} onClick={openCallback} disabled={requestSent}>
        {requestSent ? "Заявка отправлена" : "Заказать звонок"}
      </OrderCall>
    </>
  );
}
