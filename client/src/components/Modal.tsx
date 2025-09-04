"use client";

import { useEffect } from "react";
import styled from "styled-components";
import { WINDOW_WIDTH } from "@/constants";
import { useAppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectModal } from "@/redux/selectors";
import { closeModal } from "@/redux/reducers";

const Overlay = styled.div`
  position: fixed;
  z-index: 9999;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;

  @media (${WINDOW_WIDTH.MOBILE}) {
    background-color: white;
    // align-items: flex-end;
  }
`;

const ModalContainer = styled.div`
  position: relative;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  width: 600px;
  height: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);

  @media (${WINDOW_WIDTH.MOBILE}) {
    width: 100%;
    ${WINDOW_WIDTH.SUPER_MINI};
    height: 90%;
    border-radius: 16px 16px 0 0;
    max-height: 100%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 24px;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  z-index: 10;

  &:hover {
    color: black;
  }
`;

export default function Modal() {
    const dispatch = useAppDispatch()
    const modal = useSelector(selectModal)

  useEffect(() => {
    if (modal.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modal.isOpen]);

  if (!modal.isOpen) return null;

  return (
    <Overlay
      onClick={() => {
        if (!modal.disableOverlayClose) {
          dispatch(closeModal());
        }
      }}
    >
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={() => dispatch(closeModal())}>×</CloseButton>
        {modal.content}
      </ModalContainer>
    </Overlay>
  );
}