'use client';

import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import styled from "styled-components";

const AdvantagesWrapper = styled.div`
    width: 100%;
    height: 350px;
    margin: 30px 0 0 0;
    display: flex;
    flex-wrap: wrap;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 90%;
        ${WINDOW_WIDTH.SUPER_MINI};
        height: 980px;
    }
`

const Header = styled.div`
    width: 100%;
    height: 80px;
    margin: 0 0 40px 0;
    color: ${COLORS.CORPORATE_BLUE};
    font-size: 30px;
    ${WIX_MADEFOR_TEXT_WEIGHT('600')};
    letter-spacing: -1.5px;
    display: flex;
    align-items: center;

    @media (${WINDOW_WIDTH.MOBILE}) {
        height: 60px;
        font-size: 20px;
        letter-spacing: -1px;
        margin: 0;
    }

    @media (max-width: 480px) {
        font-size: 16px;
    }
`

const HeaderLogo = styled.img`
    width: 70px;
    margin: 0px 20px 0 0;
`
const AdvantagesBlock = styled.div`
    width: 100%;
    height: 260px;
    display: flex;
    justify-content: space-between;
    border-radius: 24px;
    margin: -60px 0 0 0;

    @media (${WINDOW_WIDTH.MOBILE}) {
        height: 850px;
        flex-wrap: wrap;
    }
`

const Advantage = styled.div`
    position: relative;
    background-color: ${COLORS.CORPORATE_GRAY};
    width: 32%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin: 0 0 40px 0;
    padding: 0 0 10px 0;
    border-radius: 24px;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.1);
    color: ${COLORS.CORPORATE_BLUE};
    font-size: 16px;
    ${WIX_MADEFOR_TEXT_WEIGHT('400')};
    letter-spacing: -0.5px;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 100%;
        height: 260px;
    }
`

const AdvantageInnerWrapper = styled.div`
    position: absolute;
    top: 0;
    background-color: ${COLORS.CORPORATE_BLUE};
    width: 100%;
    height: 80%;
    display: flex;
    flex-wrap: wrap;
    padding: 0 0 10px 0;
    border-radius: 24px 24px 170px 24px;
    color: ${COLORS.CORPORATE_GRAY};
    font-size: 24px;
    ${WIX_MADEFOR_TEXT_WEIGHT('500')};
    letter-spacing: -1px;
`

const HeaderAdvantageInner = styled.div`
    width: 85%;
    height: 50px;
    padding: 20px 0 0px 20px;
    border-bottom: 1px solid lightpink;
`

const AdvantageInner = styled.div`
    box-sizing: border-box;
    width: 90%;
    height: 70%;
    padding: 0 30px 0 0;
    display: flex;
`

const AdvantageLogo = styled.img`
    width: 50px;
    margin: -55px 20px 0 20px;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 30px;
    }
`

const AdvantageInnerInfo = styled.div`
    color: ${COLORS.CORPORATE_GRAY};
`

const AdvantageTitle = styled.p`
    margin: 10px 0 0 0;
    font-size: 20px;
    ${WIX_MADEFOR_TEXT_WEIGHT()};
    letter-spacing: -0.5px;
`

const AdvantageDescription = styled.div`
    height: 20px;
    margin: 10px 0 0 0;
    font-size: 16px;
    ${WIX_MADEFOR_TEXT_WEIGHT('400')};
    letter-spacing: -1px;
`


export default function AdvantagesComponent() {
    const advantageBoxContent = [
        {header: 'Преимущества  ламината', title: 'Влагостойкость', description: 'Защита от воды и загрязнений с влагостойкой технологией. 100% защита от воды', src: '/icons/advantage/feature-icon-1.svg'},
        {header: 'Преимущества  винила', title: 'Простой  монтаж', description: 'Замок по технологии Uniclic позволяет легко и быстро выполнить работы по укладке пола', src: '/icons/advantage/feature-icon-2.svg'},
        {header: 'Преимущества  аксессуаров', title: 'Износостойкость', description: 'Технология Scratch Guard предотвращает образование царапин до 10 раз лучше, чем другой аналогичный продукт', src: '/icons/advantage/feature-icon-3.svg'},
    ]

    return (
        <AdvantagesWrapper>
           <Header>
                <HeaderLogo src="/icons/logo.svg" alt="Logo" />
                ПРЕИМУЩЕСТВА  QUICK-STEP
            </Header> 
            <AdvantagesBlock>
                {advantageBoxContent.map((item, index) => (
                    <Advantage key={`advantage-${index}`}>
                        <AdvantageInnerWrapper>
                            <HeaderAdvantageInner>
                                {item.header}
                            </HeaderAdvantageInner>
                            <AdvantageInner>
                                <AdvantageLogo src={item.src} alt="Logo" />
                                <AdvantageInnerInfo>
                                    <AdvantageTitle>
                                        {item.title}
                                    </AdvantageTitle>
                                    <AdvantageDescription>
                                        {item.description}
                                    </AdvantageDescription>
                                </AdvantageInnerInfo>
                            </AdvantageInner>
                        </AdvantageInnerWrapper>
                        Ознакомиться со всеми преимуществами ➔
                    </Advantage>
                ))}
            </AdvantagesBlock>
        </AdvantagesWrapper>
    )
}