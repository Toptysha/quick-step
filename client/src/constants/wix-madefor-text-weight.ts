import { css } from "styled-components";

export const WIX_MADEFOR_TEXT_WEIGHT = (wght?: string) => css`
  font-family: 'wix-madefor-text';
  font-variation-settings: 'wght' ${wght ?? '500'};
`;