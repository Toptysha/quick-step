'use client';

import styled from "styled-components";
import { COLORS, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { CatalogButtonComponent, PhoneBlock } from "@/components";

const FooterWrapper = styled.footer`
    background: ${COLORS.CORPORATE_BLUE};
    width: 100%;
    height: 300px;
    margin: 20px 0 0px 0;
    color: ${COLORS.CORPORATE_GRAY};
    ${WIX_MADEFOR_TEXT_WEIGHT('400')};
    letter-spacing: -0.5px;
`

const FooterDiv = styled.div`
    width: 1200px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
`

const LeftBlock = styled.div`
    width: 33%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    font-size: 14px;
`

const MiddleBlock = styled.div`
    box-sizing: border-box;
    width: 33%;
    height: 100%;
    padding: 40px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    font-size: 16px;
`

const RightBlock = styled.div`
    width: 33%;
    padding: 0 0 0 20px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    font-size: 14px;
`

const Logo = styled.img`
    width: 80%;
    margin: 0 0 40px 0;
`

const PrivacyPolicy = styled.a`
    box-shadow: inset 0 -1px 0 white;
    transition: box-shadow 0.2s ease;
    color: ${COLORS.CORPORATE_GRAY};
    ${WIX_MADEFOR_TEXT_WEIGHT('400')};
    letter-spacing: -0.5px;

    &:hover {
        box-shadow: inset 0 0 0 white;
    }
`

const InfoPoint = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 30px 0;
`;

const Icon = styled.img`
  width: 25px;
  margin: 0 10px 0 0;
`;

const TextWrapper = styled.div`

`

const InfoTitle = styled.div`
    width: 100%;
`;

const InfoDescription = styled.div`
    width: 100%;
    ${WIX_MADEFOR_TEXT_WEIGHT('500')};
    font-size: 20px;
`;


export default function Footer() {
    return (
        <FooterWrapper>
            <FooterDiv>
                <LeftBlock>
                    <Logo src="icons/header-logo-white.svg" alt="Logo" /> 
                    © 2021 Quick-Step
                </LeftBlock>
                <MiddleBlock>
                    г. Воронеж, ул. Донбасская, 5
                    <PhoneBlock srcPhone="/icons/social/phone-white-icon.svg" />
                    quickstep.vrn@gmail.com
                </MiddleBlock>
                <RightBlock>
                    <InfoPoint>
                        <Icon src='icons/decor-elements/clock-white.svg' alt="icon" />
                        <TextWrapper>
                            <InfoTitle>
                                Время работы:
                            </InfoTitle>
                            <InfoDescription>
                                Пн-Пт: 10:00 - 19:00 <br /> Сб-Вс: 10:00 - 18:00
                            </InfoDescription>
                        </TextWrapper>
                    </InfoPoint>
                    <PrivacyPolicy>Политика конфиденциальности</PrivacyPolicy>
                </RightBlock>
            </FooterDiv>
        </FooterWrapper>
    )
}