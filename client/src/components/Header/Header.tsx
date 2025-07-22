"use client";

import styled from "styled-components";
import { COLORS, URL, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { HeaderMobile, PhoneBlock, SearchLine } from "@/components";
import { HeaderLinks } from "@/interfaces";

const HeaderWrapper = styled.header`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  @media (${WINDOW_WIDTH.MOBILE}) {
    height: 80px;
  }
`;

const HeaderLogo = styled.img`
  width: 180px;
`;

const BucketIcon = styled.img`
  width: 35px;
  opacity: 0.7;
`;

const HeaderWrapperMini = styled.div`
  width: 1200px;
  height: 100px;
  min-width: 1100px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (${WINDOW_WIDTH.MOBILE}) {
    display: none;
  }
`;

const SideBlock = styled.div`
  width: calc((100% - 600px) / 2);
  min-width: 230px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LeftBlock = styled(SideBlock)`
  left: 0;
`;

const RightBlock = styled(SideBlock)`
  right: 0;
  flex-wrap: wrap;
  padding: 20px 0 0 0;
`;

const CenterBlock = styled.div`
    position: fixed;
    z-index: 1000;
    top: 20px;
    width: 560px;
    height: 80px;
    min-width: 500px;
    border-radius: 12px;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 100px;

    @media (${WINDOW_WIDTH.MOBILE}) {
      display: none;
    }
`;

const CenterBlockContainer = styled.div`
  width: 500px;
  height: 70px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const Navigation = styled.nav`
    width: 450px;
    height: 40%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const NavLink = styled.a`
    font-size: 20px;
    color: ${COLORS.CORPORATE_BLUE};
    ${WIX_MADEFOR_TEXT_WEIGHT('400')};
    letter-spacing: -0.5px;

    transition: color 0.3s ease;

    &:hover {
        color: black;
    }
`

const DivBucket = styled.div`
    position: relative;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
`
const BucketCount = styled.div`
    position: absolute;
    top: 8px;
    left: 32px;
    width: 15px;
    height: 15px;
    background-color: rgb(255, 0, 0);
    color: white;
    border-radius: 50%;
    text-align: center;
    font-size: 12px;
`;

export default function Header() {
  const links: HeaderLinks[] = [
    {title: 'Главная', href: URL.HOME},
    {title: 'Каталог', href: URL.CATALOG},
    {title: 'Клиентам', href: URL.FOR_CLIENTS},
    {title: 'Контакты', href: URL.CONTACTS},
  ]

  return (
    <HeaderWrapper>
        <HeaderWrapperMini>
            <LeftBlock>
                <HeaderLogo src="/icons/header-logo.svg" alt="Logo" />
            </LeftBlock>
            <RightBlock>
                <PhoneBlock />
            </RightBlock>
        </HeaderWrapperMini>
        <CenterBlock>
            <CenterBlockContainer>
                <Navigation>
                    {links.map((link, i) => (
                      <NavLink href={link.href} key={`link-${i}`} >{link.title}</NavLink>
                    ))}
                </Navigation>
                <SearchLine />
            </CenterBlockContainer>
            <DivBucket>
                <BucketIcon src="/icons/decor-elements/bucket-blue-icon.svg" alt="Bucket" />
                <BucketCount>
                    0
                </BucketCount>
            </DivBucket>
        </CenterBlock>
        <HeaderMobile links={links} />
    </HeaderWrapper>
  );
}

