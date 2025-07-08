'use client';

import styled from "styled-components";
import { useEffect, useState } from "react";
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { Cover } from "@/interfaces";
import { CatalogButtonComponent } from "@/components";

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
  // border: 1px solid black;
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
`

const BackgroundDescriptionWrapper = styled.div`
  text-shadow: #000 1px 0 40px;
  @media (${WINDOW_WIDTH.MOBILE}) {
    text-shadow: #000 1px 0 10px;
  }
`;

// const BackgroundWrapper = styled.div`
//   position: absolute;
//   top: 10px;
//   left: 0;
//   z-index: -1;
//   display: flex;
//   flex-direction: column;
//   gap: 0px;
// `;

// const BackgroundWrapperLine = styled.div`
//   margin: 4px 0 -6px 0;
//   display: flex;
// `;

// const BackgroundImg = styled.img`
//   width: 100px;
//   height: 60px;
//   margin: 0 0 0 -24px;
//   object-fit: fill;

// `;

export default function WallpaperComponent({wallpapers}: {wallpapers: Cover[]}) {

  const [currentIndex, setCurrentIndex] = useState(0);
  // const [refs, metrics] = useTextMetrics(wallpapers.map(w => w.description as string));

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
          {wallpapers.map((wallpaperInfo, index) => {
            return (
              <div key={wallpaperInfo.id}>
                <WallpaperImage
                  src={wallpaperInfo.src}
                  alt={wallpaperInfo.alt}
                  $active={index === currentIndex}
                  onClick={() => handleNext()}
                />
                <WallpaperDescription
                  $active={index === currentIndex}
                  $index={index}
                  // ref={el => {refs.current[index] = el; }}
                >
                    {/* <BackgroundWrapper>
                      {Array.from({ length: metrics[index]?.lineCount || 1 }).map((_, lineIdx) => (
                        <BackgroundWrapperLine key={lineIdx}>
                          {Array.from({ length: metrics[index]?.bgCount || 0 }).map((_, bgIdx) => (
                            <BackgroundImg
                              key={`${lineIdx}-${bgIdx}`}
                              src="/icons/text-background.svg"
                              alt="Background"
                            />
                          ))}
                        </BackgroundWrapperLine>
                      ))}
                    </BackgroundWrapper> */}
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
