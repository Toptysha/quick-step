'use client';

import styled from "styled-components";
import { COLORS, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { CatalogButtonComponent } from "@/components";

const MiddleLogoWrapper = styled.div`
    background-color: ${COLORS.CORPORATE_BLUE};
    width: 100%;
    height: 250px;
    margin: 80px 0 80px 0;
    padding: 0 30px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // flex-wrap: wrap;
`

const Logo = styled.img`
    width: 32%;
`

const InfoBox = styled.div`
    width: 32%;
    height: 75%;
    padding: 20px;
    background-color: rgb(29, 81, 172);
    color: ${COLORS.CORPORATE_GRAY};
    border-radius: 24px;
`

const InfoBoxTitle = styled.div`
    width: 100%;
    margin: 0 0 15px 0;
    font-size: 24px;
    ${WIX_MADEFOR_TEXT_WEIGHT('600')};
    letter-spacing: -0.5px;
`

const InfoBoxDescription = styled.div`
    width: 100%;
    font-size: 18px;
    ${WIX_MADEFOR_TEXT_WEIGHT('400')};
    letter-spacing: -0.5px;
`




export default function MiddleLogoComponent() {
    return (
        <MiddleLogoWrapper>
            <Logo src="icons/header-logo-white.svg" alt="Logo" /> 
            <InfoBox>
                <InfoBoxTitle>
                    СОЗДАЙТЕ  АТМОСФЕРУ   УЮТА  В  ДОМЕ
                </InfoBoxTitle>
                <InfoBoxDescription>
                    Нам хочется, чтобы вы смогли создать дом, наполненный радостью. Уверены, что вместе мы подберем напольное покрытие, которое сделает вашу мечту реальностью и прослужит долго.
                </InfoBoxDescription>
            </InfoBox>
            <CatalogButtonComponent width="250px" theme="gray" />
        </MiddleLogoWrapper>
    )
}