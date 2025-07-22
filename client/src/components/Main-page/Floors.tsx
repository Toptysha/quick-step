'use client';

import styled from "styled-components";
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { CatalogButtonComponent } from "@/components";

const FloorsWrapper = styled.div`
    width: 100%;
    height: 350px;
    margin: 20px 0 0 0;
    display: flex;
    flex-wrap: wrap;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 90%;
        ${WINDOW_WIDTH.SUPER_MINI};
        height: 980px;
        margin: 10px 0 0 0;
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
const FloorsBlock = styled.div`
    width: 100%;
    height: 260px;
    display: flex;
    justify-content: space-between;
    border-radius: 24px;
    margin: -50px 0 0 0;

    @media (${WINDOW_WIDTH.MOBILE}) {
        height: 850px;
        flex-wrap: wrap;
    }
`

const Floor = styled.div`
    position: relative;
    background-color: ${COLORS.CORPORATE_GRAY};
    width: 32%;
    height: 100%;
    display: flex;
    // justify-content: center;
    flex-wrap: wrap;
    margin: 0 0 40px 0;
    padding: 0 0 10px 0;
    border-radius: 24px;
    box-shadow: 4px -4px 12px rgba(0, 0, 0, 0.1);
    color: ${COLORS.CORPORATE_GRAY};
    font-size: 24px;
    ${WIX_MADEFOR_TEXT_WEIGHT('600')};
    letter-spacing: -0.5px;
    overflow: hidden;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 100%;
        height: 250px;
    }
`

const TitleBox = styled.div`
    box-sizing: border-box;
    position: relative;
    height: 40px;
    padding: 10px 0px 0px 10px;
    // border-radius: 24px 80px 24px 0;
    ${WIX_MADEFOR_TEXT_WEIGHT('700')};
    z-index: 1;
    text-shadow: #000 1px 0 20px;

    @media (${WINDOW_WIDTH.MOBILE}) {
        font-size: 24px;
        ${WIX_MADEFOR_TEXT_WEIGHT('700')};
        padding: 10px 0px 0px 20px;
    }
`

const CoverBox = styled.img`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: bottom;
    border-radius: 24px 130px 0 0;
    z-index: 0;
`
const ButtonWrapper = styled.div`
    position: absolute;
    width: 200px;
    right: 0px;
    bottom: 10px;
`

export default function FloorsComponent() {
    const floorBoxContent = [
        {title: 'ЛАМИНАТ', src: '/img/floor/floor-1.webp'},
        {title: 'ВИНИЛ', src: '/img/floor/floor-2.webp'},
        {title: 'АКСЕССУАРЫ', src: '/img/floor/floor-3.webp'},
    ]

    // const [refsCurrent, bgCounts] = useTextBackground(floorBoxContent.length)

    return (
        <FloorsWrapper>
            <Header>
                <HeaderLogo src="/icons/logo.svg" alt="Logo" />
                ПОЛЫ  QUICK-STEP
            </Header> 
            <FloorsBlock>
    {floorBoxContent.map((item, index) => (
        <Floor key={`Floor-${index}`}>
            <TitleBox>
                {item.title}
            </TitleBox>
            <CoverBox src={item.src} alt="Logo" />
            <ButtonWrapper>
                <CatalogButtonComponent width="180px" />
            </ButtonWrapper>
        </Floor>
    ))}
</FloorsBlock>
        </FloorsWrapper>
    )
}