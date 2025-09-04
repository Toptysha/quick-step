'use client';

import styled from "styled-components";
import { useEffect, useState } from "react";
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { Cover } from "@/types";
import { CatalogButtonComponent } from "@/components";
import { useAppDispatch } from "@/redux/store";
import { openModal } from "@/redux/reducers";
import { ExchangeButton } from "../ExchangeButton";
import CoverExchangeComponent from "./CoverExchange";

const WallpaperWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  min-width: 1100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  overflow: hidden;
  // background: black;

  @media (${WINDOW_WIDTH.MOBILE}) {
      width: 90%;
      ${WINDOW_WIDTH.SUPER_MINI};
      height: 500px;
  }
`;

const WallpaperImageBase = ({ $active, ...rest }: {$active?: boolean} & React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img {...rest} />
);

const WallpaperImage = styled(WallpaperImageBase)<{$active?: boolean}>`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
  transition: opacity 0.8s ease-in-out;
  top: 0;
  left: 0;
  opacity: ${(props) => (props.$active ? 1 : 0)};
  pointer-events: ${(props) => (props.$active ? 'auto' : 'none')};
`

const WallpaperDescription = styled.div<{
  $active?: boolean;
  $index?: number;
}>`
  // border: 1px solid black;
  position: absolute;
  top: ${(props) => (props.$index! % 2 === 0 ? "350px" : "70px")};
  left: 30px;
  z-index: 5;
  // background: rgba(0, 0, 0, 0.1);
  padding: 12px 20px;
  border-radius: 12px;
  max-width: 500px;
  font-size: 44px;
  color: ${COLORS.CORPORATE_GRAY};
  ${WIX_MADEFOR_TEXT_WEIGHT('600')};
  letter-spacing: -1.5px;

  opacity: ${(props) => (props.$active ? 1 : 0)};
  transition:
    opacity 0.8s ease-in-out,
    top 0.8s ease-in-out;
  pointer-events: none;

  @media (${WINDOW_WIDTH.MOBILE}) {
    font-size: 22px;
    max-width: 250px;
    letter-spacing: -0.5px;
    ${WIX_MADEFOR_TEXT_WEIGHT('500')};
  }
`

const BackgroundDescriptionWrapper = styled.div`
  text-shadow: #000 1px 0 40px;
  @media (${WINDOW_WIDTH.MOBILE}) {
    text-shadow: #000 1px 0 10px;
  }
`;

export default function WallpaperComponent({wallpapers, isAdmin}: {wallpapers: Cover[]; isAdmin: boolean}) {

  const [currentIndex, setCurrentIndex] = useState(0);

  const dispatch = useAppDispatch()

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % wallpapers.length);
  };

  useEffect(() => {
    if (!wallpapers.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % wallpapers.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [wallpapers.length]);

  return (
        <WallpaperWrapper>
          {isAdmin && <ExchangeButton onClick={() => dispatch(openModal({content: <CoverExchangeComponent wallpapers={wallpapers} type='wallpaper' isAdmin={isAdmin} /> }))}>
            Изменить
          </ExchangeButton>}
          {wallpapers.map((wallpaperInfo, index) => {
            return (
              <div key={`wallpaper-${index}`}>
                <WallpaperImage
                  src={wallpaperInfo.path}
                  alt={`wallpaper-${index}`}
                  $active={index === currentIndex}
                  onClick={() => handleNext()}
                />
                <WallpaperDescription
                  $active={index === currentIndex}
                  $index={index}
                >
                    <BackgroundDescriptionWrapper>
                      {wallpaperInfo.description}
                    </BackgroundDescriptionWrapper>
                </WallpaperDescription>
              </div>
            )
          })}
          <CatalogButtonComponent />
        </WallpaperWrapper>
  );
}
