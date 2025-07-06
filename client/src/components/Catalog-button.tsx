'use client';

import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import styled from "styled-components";

const CatalogButton = styled.button<{ $width?: string; $fontSize?: string; $theme?: 'gray' | 'blue'; }>`
    z-index: 5;
    width: ${({ $width }) => $width || '300px'};
    height: 50px;
    background-color: ${({ $theme }) => $theme === 'blue' ? COLORS.CORPORATE_BLUE : COLORS.CORPORATE_GRAY};
    color: ${({ $theme }) => $theme === 'blue' ? COLORS.CORPORATE_GRAY : COLORS.CORPORATE_BLUE};
    ${WIX_MADEFOR_TEXT_WEIGHT('400')};
    letter-spacing: -0.5px;
    font-size: ${({ $fontSize }) => $fontSize || '24px'};
    border: none;
    border-bottom: ${({ $theme }) => $theme === 'blue' ? '4px solid rgb(17, 59, 130)' : '4px solid rgb(255, 255, 255)'};
    border-radius: 12px;
    cursor: pointer;

    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${({ $theme }) => $theme === 'blue' ? 'rgb(17, 59, 130)' : 'rgb(255, 255, 255)'};
    }

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: ${({ $width }) =>
            $width ? `calc(${$width} * 0.66)` : '200px'};
        font-size: ${({ $fontSize }) =>
            $fontSize ? `calc(${$fontSize} * 0.66)` : '16px'};
        height: 40px;
    }
`

export default function CatalogButtonComponent({width, fontSize, theme, buttonName}: {
    width?: string; 
    fontSize?: string;
    theme?: 'gray' | 'blue'; 
    buttonName?: string;
}) {
    return (
        <CatalogButton $width={width} $fontSize={fontSize} $theme={theme || 'blue'}>{buttonName || `Каталог  ›`}</CatalogButton>
    )
}