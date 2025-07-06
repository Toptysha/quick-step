'use client';

import styled from "styled-components";
import { useEffect, useState } from "react";
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { Cover } from "@/interfaces";
import { CatalogButtonComponent } from "@/components";

const WallpaperWrapper = styled.div`
  width: 100%;
  height: 600px;
  min-width: 1100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
  transition: opacity 0.8s ease-in-out;
  position: absolute;
  top: 0;
  left: 0;
  opacity: ${(props) => (props.$active ? 1 : 0)};
  pointer-events: ${(props) => (props.$active ? 'auto' : 'none')};
`

const WallpaperDescription = styled.div<{
  $active?: boolean;
  $index?: number;
}>`
  position: absolute;
  top: ${(props) => (props.$index! % 2 === 0 ? "350px" : "70px")};
  left: 30px;
  z-index: 5;
  // background: rgba(0, 0, 0, 0.1);
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 44px;
  max-width: 500px;
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
`;

export default function WallpaperComponent({wallpapers}: {wallpapers: Cover[]}) {

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % wallpapers.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
        <WallpaperWrapper>
          {wallpapers.map((img, index) => (
              <WallpaperImage
                key={img.id}
                src={img.src}
                alt={img.alt}
                $active={index === currentIndex}
                onClick={() => handleNext()}
              />
          ))}
          {wallpapers.map((img, index) => (
            <WallpaperDescription
              key={img.id}
              $active={index === currentIndex}
              $index={index}
            >
              {img.description}
            </WallpaperDescription>
          ))}
          <CatalogButtonComponent />
        </WallpaperWrapper>
  );
}
