'use client';

import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { openModal } from "@/redux/reducers";
import { useAppDispatch } from "@/redux/store";
import { Cover } from "@/types";
import styled from "styled-components";
import { ExchangeButton } from "../ExchangeButton";
import CoverExchangeComponent from "./CoverExchange";

const InfoWrapper = styled.div`
    width: 100%;
    height: 250px;
    margin: 40px 0 0 0;
    display: flex;
    justify-content: space-between;
    border-radius: 24px;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 90%;
        ${WINDOW_WIDTH.SUPER_MINI};
        height: 250px;
    }
`

const ItemWrapper = styled.div`
    position: relative;
    width: 48%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    border-radius: 24px;
`

const BlockName = styled.div`
    position: absolute;
    padding: 20px;
    background-color: ${COLORS.CORPORATE_BLUE};
    color: #fff;
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    ${WIX_MADEFOR_TEXT_WEIGHT('500')};
    letter-spacing: -0.5px;
    border-radius: 24px 0 50px 0 ;

    @media (${WINDOW_WIDTH.MOBILE}) {
        font-size: 14px;
    }

    @media (max-width: 530px) {
        font-size: 9px;
        ${WIX_MADEFOR_TEXT_WEIGHT('400')};
    }
`

const InfoImg = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 24px;
    object-fit: cover;
`

const MoreInfoButton = styled.button`
    cursor: pointer;
    position: absolute;
    inset: auto 25px 25px auto;
    padding: 10px 15px;
    background-color: ${COLORS.CORPORATE_GRAY};
    color: #000;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    ${WIX_MADEFOR_TEXT_WEIGHT('400')};
    border: none;
    border-radius: 10px;

    transition: background-color 0.3s ease;

    &:hover {
        background-color: rgb(255, 255, 255);
    }
`

export default function InfoComponent({covers, isAdmin}: {covers: Cover[]; isAdmin: boolean}) {

      const dispatch = useAppDispatch()

    return (
        <InfoWrapper>
            <ItemWrapper>
                <BlockName>
                    НАШ  СЕРВИС
                </BlockName>
                <MoreInfoButton>
                    Подробнее
                </MoreInfoButton>
                <InfoImg src={covers[1]?.path} alt={`cover-1`} />
            </ItemWrapper>
            <ItemWrapper>
                {isAdmin && <ExchangeButton onClick={() => dispatch(openModal({content: <CoverExchangeComponent wallpapers={covers} type='info' isAdmin={isAdmin} /> }))}>
                    Изменить
                </ExchangeButton>}
                <BlockName>
                    РЕШЕНИЯ  В  ИНТЕРЬЕРЕ
                </BlockName>
                <MoreInfoButton>
                    Подробнее
                </MoreInfoButton>
                <InfoImg src={covers[0]?.path} alt={`cover-2`} />
            </ItemWrapper>
        </InfoWrapper>
    )
}