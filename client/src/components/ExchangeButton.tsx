import { COLORS, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import styled from "styled-components";

export const ExchangeButton = styled.button<{ $top?: string }>`
  position: absolute;
  cursor: pointer;
  background: ${COLORS.CORPORATE_PINK};
  top: 40%;
  top: ${({ $top }) => ($top || '40%')};
  right: 20px;
  width: 180px;
  height: 80px;
  z-index: 20;
  font-size: 24px;
  color: ${COLORS.CORPORATE_GRAY};
  ${WIX_MADEFOR_TEXT_WEIGHT('500')};
  letter-spacing: -1.5px;
  border: none;
  border-radius: 24px;
`