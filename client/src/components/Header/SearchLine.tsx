"use client";

import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { HeaderMobile, PhoneBlock } from "@/components";
import styled from "styled-components";
import { HeaderLinks } from "@/interfaces";

const SearchWrapper = styled.div`
    width: 450px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 250px;
    }
`

const SearchIcon = styled.img`
  cursor: pointer;
  width: 25px;
  height: 25px;
  transform: scaleX(-1);
  padding: 0 0 0 5px;
  opacity: 0.7;
`;

const InputSearch = styled.input`
    width: 520px;
    height: 25px;
    border-radius: 6px;
    border: none;
    padding: 0 0 0 5px;
    background-color: ${COLORS.CORPORATE_GRAY};
    outline: none;

    &:focus {
        border: 1px solid ${COLORS.CORPORATE_BLUE};
    }

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 220px;
    }
`

export default function SearchLine() {

    return (
        <SearchWrapper>
            <SearchIcon src="/icons/search-icon.svg" alt="Search" />
            <InputSearch placeholder="Поиск по каталогу..."  />
        </SearchWrapper>       
    );
}

