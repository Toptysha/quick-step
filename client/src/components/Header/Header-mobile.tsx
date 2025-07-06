"use client";

import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { HeaderLinks } from "@/interfaces";
import { BurgerModal, PhoneBlock } from "@/components";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { useAppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectModal } from "@/redux/selectors";
import { openModal } from "@/redux/reducers";

const MobileBlock = styled.div`
  display: none;
  
  @media (${WINDOW_WIDTH.MOBILE}) {
    display: flex;
    width: 100%;
    ${WINDOW_WIDTH.SUPER_MINI};
    // justify-content: space-between;
    justify-content: center;
    align-items: center;
  }
`

const HeaderLogo = styled.img`
  width: 80px;
`

const SelectPagesContainer = styled.div`
    width: 50%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 30px 0 0px 0;
`

const SelectPageContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 0px 0 10px 0;

    @media (max-width: 380px) {
      display: none;
    } 
`


const SideBlock = styled.div`
  width: 50%;
  min-width: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const SelectPage = styled.a<{ $active?: boolean }>`
  cursor: ${({ $active }) => $active ? 'default' : 'pointer'};
  box-shadow: ${({ $active }) => $active ? 'none' : `inset 0 -1px 0 ${COLORS.CORPORATE_BLUE}`};
  color: ${COLORS.CORPORATE_BLUE};
  ${WIX_MADEFOR_TEXT_WEIGHT('400')};
  letter-spacing: -0.5px;
  margin: 0 0 0 20px;

  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: ${({ $active }) => $active ? 'none' : `inset 0 0 0 ${COLORS.CORPORATE_BLUE}`};
  }
`;

const PhoneBlockWrapper = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  font-size: 10px;

  @media (max-width: 590px) {
    display: none;
  } 
`

const DivBucket = styled.div`
    position: relative;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 380px) {
      display: none;
    } 
`

const BucketIcon = styled.img`
    width: 25px;
    opacity: 0.7;
`

const BucketCount = styled.div`
    position: absolute;
    top: 2px;
    left: 20px;
    width: 12px;
    height: 12px;
    background-color: rgb(255, 0, 0);
    color: white;
    border-radius: 50%;
    text-align: center;
    font-size: 10px;
`

const BurgerMenu = styled.img`
  cursor: pointer;
  width: 40px;
  margin: 0 0 0 15px;
`

export default function HeaderMobile({links}: {
    links: HeaderLinks[];
}) {
  const pathname = usePathname();
  const dispatch = useAppDispatch()
  const modal = useSelector(selectModal)

  return (
    <MobileBlock>
       <SideBlock>
            <HeaderLogo src="/icons/header-logo.svg" alt="Logo" />
            <SelectPagesContainer>
              {[links[0], links[1]].map((link, i) => (
                  <SelectPageContainer key={`mini-link-${i}`}>
                      <SelectPage href={link.href} $active={pathname === link.href}  >{link.title}</SelectPage>
                  </SelectPageContainer>
              ))}
          </SelectPagesContainer>
        </SideBlock>
        <SideBlock>
            <PhoneBlockWrapper>
              <PhoneBlock isMini={true} />
            </PhoneBlockWrapper>
            <DivBucket>
                <BucketIcon src="/icons/decor-elements/bucket-blue-icon.svg" alt="Bucket" />
                <BucketCount>
                    0
                </BucketCount>
            </DivBucket>
            <BurgerMenu src="/icons/decor-elements/burger-menu-icon.svg" alt="Menu" onClick={() => dispatch(openModal({content: <BurgerModal links={links} /> }))} />
        </SideBlock>
    </MobileBlock>
  );
}