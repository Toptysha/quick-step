'use client';

import styled from "styled-components";
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { CatalogButtonComponent, PhoneBlock } from "@/components";

const FooterWrapper = styled.footer`
    box-sizing: border-box;
    background: ${COLORS.CORPORATE_BLUE};
    width: 100%;
    height: 300px;
    margin: 20px 0 0px 0;
    color: ${COLORS.CORPORATE_GRAY};
    ${WIX_MADEFOR_TEXT_WEIGHT('400')};
    letter-spacing: -0.5px;

    @media (${WINDOW_WIDTH.MOBILE}) {
        height: auto;
        ${WINDOW_WIDTH.SUPER_MINI};
        padding: 20px 0;
    }
`

const FooterDiv = styled.div`
    box-sizing: border-box;
    width: 1200px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 100%;
        flex-wrap: wrap;
        justify-content: center;
        ${WINDOW_WIDTH.SUPER_MINI};
    }
`

const LeftBlock = styled.div`
    // border: 1px solid black;
    width: 33%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    font-size: 14px;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 100%;
    }
`

const MiddleBlock = styled.div`
    // border: 1px solid black;
    box-sizing: border-box;
    width: 33%;
    height: 240px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    
    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 280px;
        height: 100%;
        padding: 40px 0;
        font-size: 16px;
    }
`

const MiddleElements = styled.div`
    @media (${WINDOW_WIDTH.MOBILE}) {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`

const MiddleElementPhone = styled(MiddleElements)`
    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 200px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
    }
`

const RightBlock = styled.div`
    // border: 1px solid black;
    width: 33%;
    padding: 0 0 0 20px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    font-size: 14px;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 100%;
        padding: 0;
    }
`

const Logo = styled.img`
    width: 80%;
    margin: 0 0 40px 0;

    @media (${WINDOW_WIDTH.MOBILE}) {
        display: none;
    }
`

const MiniLogo = styled.img`
    width: 40px;
    margin: 0 20px 0 0;
    display: none;

    @media (${WINDOW_WIDTH.MOBILE}) {
        display: flex;
    }
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
                    <Logo src="/icons/header-logo-white.svg" alt="Logo" />
                    <MiniLogo src="/icons/logo.svg" alt="Logo" />
                    © 2021 Quick-Step
                </LeftBlock>
                <MiddleBlock>
                <MiddleElements>
                    г. Воронеж, ул. Донбасская, 5
                </MiddleElements>
                <MiddleElementPhone>
                    <PhoneBlock srcPhone="/icons/social/phone-white-icon.svg" />
                </MiddleElementPhone>
                <MiddleElements>
                    quickstep.vrn@gmail.com
                </MiddleElements>
                </MiddleBlock>
                <RightBlock>
                    <InfoPoint>
                        <Icon src='/icons/decor-elements/clock-white.svg' alt="icon" />
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