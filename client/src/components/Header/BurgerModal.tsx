"use client";

import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { HeaderLinks } from "@/interfaces";
import { PhoneBlock, SearchLine } from "@/components";
import styled from "styled-components";
import { useAppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectModal } from "@/redux/selectors";
import { closeModal, openModal } from "@/redux/reducers";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const BurgerModalWrapper = styled.div`
    width: 100%;
    ${WINDOW_WIDTH.SUPER_MINI};
    margin: 80px 0 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
`

const LogoContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 0px 0 30px 0;
`

const HeaderLogo = styled.img`
    width: 180px;
`

const SelectPagesContainer = styled.div`
    width: 100%;
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
`

const SelectPage = styled.a<{ $active?: boolean }>`
    cursor: ${({ $active }) => $active ? 'default' : 'pointer'};
    box-shadow: ${({ $active }) => $active ? 'none' : `inset 0 -1px 0 ${COLORS.CORPORATE_BLUE}`};
    color: ${COLORS.CORPORATE_BLUE};
    ${WIX_MADEFOR_TEXT_WEIGHT('400')};
    letter-spacing: -0.5px;
    font-size: 22px;

    transition: box-shadow 0.2s ease;

    &:hover {
        box-shadow: ${({ $active }) => $active ? 'none' : `inset 0 0 0 ${COLORS.CORPORATE_BLUE}`};
    }
`

const PhoneBlockWrapper = styled.div`
  width: 450px;
  height: 80px;
  margin: 30px 0 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  font-size: 16px;
`

export default function BurgerModal({links}: {
    links: HeaderLinks[];
}) {
    const pathname = usePathname();
    const dispatch = useAppDispatch()
    const modal = useSelector(selectModal)

    useEffect(() => {
    const handleResize = () => {
      const maxMobileWidth = parseInt(WINDOW_WIDTH.MOBILE.replace(/\D/g, ""));
      if (window.innerWidth > maxMobileWidth && modal.isOpen) {
        dispatch(closeModal());
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch, modal.isOpen]);

  return (
    <BurgerModalWrapper>
        <LogoContainer>
            <HeaderLogo src="/icons/header-logo.svg" alt="Logo" />
        </LogoContainer>
        <SearchLine />
        <SelectPagesContainer>
            {links.map((link, i) => (
                <SelectPageContainer key={`mini-link-${i}`}>
                    <SelectPage href={link.href} $active={pathname === link.href}  >{link.title}</SelectPage>
                </SelectPageContainer>
            ))}
        </SelectPagesContainer>
        <PhoneBlockWrapper>
            <PhoneBlock />
        </PhoneBlockWrapper>
    </BurgerModalWrapper>
  );
}