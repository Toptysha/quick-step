'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from '@/constants';

const GalleryWrapper = styled.div`
    width: 100%;
    height: 40%;
`;

const MainPhotoWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    transition: opacity 0.4s ease;
`;

const MainPhoto = styled.img<{ $isMiniHeight: boolean }>`
    width: 100%;
    // height: 100%;
    height: ${({ $isMiniHeight }) => ($isMiniHeight ? '80%' : '100%')};
    object-fit: cover;
    border-radius: 16px;
    pointer-events: none;
    user-select: none;
`;

const SliderWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
`;

const ArrowButton = styled.div`
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    padding: 0 0 7px 0;
    border-radius: 50%;
    background: ${COLORS.CORPORATE_GRAY};
    color: ${COLORS.CORPORATE_BLUE};
    font-size: 28px;
    ${WIX_MADEFOR_TEXT_WEIGHT('500')};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 2;
    user-select: none;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
`;

const LeftArrow = styled(ArrowButton)`
    left: 10px;
`;

const RightArrow = styled(ArrowButton)`
    right: 10px;
`;

const Thumbnails = styled.div`
    margin-top: 10px;
    display: flex;
    justify-content: center;
    gap: 10px;
`;

const Thumbnail = styled.img<{ $active: boolean }>`
    width: calc((100% - 40px) / 5); // 5 превью с 10px gap между ними
    max-width: 100px;
    height: 80px;
    object-fit: cover;
    border-radius: 12px;
    border: ${({ $active }) => ($active ? `2px solid ${COLORS.CORPORATE_BLUE}` : 'none')};
    cursor: pointer;
    flex-shrink: 0;
`;

interface PhotoGalleryProps {
  photos: string[];
  cover: string;
}

export default function PhotoGallery({ photos, cover }: PhotoGalleryProps) {
  const images = photos?.length ? photos : [cover];
  const [current, setCurrent] = useState(0);

  const maxVisible = 5;

  // Определяем сдвиг окна превью
  let start = Math.max(0, current - 2);
  let end = start + maxVisible;

  // Корректируем, если мы у конца
  if (end > images.length) {
    end = images.length;
    start = Math.max(0, end - maxVisible);
  }

  const visibleThumbnails = images.slice(start, end);

  if (!photos || photos.length <= 1) {
    return <MainPhoto $isMiniHeight={true} src={cover} alt="Product Cover" />;
  }

  const next = () => setCurrent((current + 1) % images.length);
  const prev = () => setCurrent((current - 1 + images.length) % images.length);

  return (
    <GalleryWrapper>
      <SliderWrapper>
        <LeftArrow onClick={prev}>‹</LeftArrow>
        {images.map((img, index) => (
          <MainPhotoWrapper
            key={index}
            style={{ opacity: index === current ? 1 : 0 }}
          >
            <MainPhoto $isMiniHeight={false} src={img} alt={`Photo ${index + 1}`} />
          </MainPhotoWrapper>
        ))}
        <RightArrow onClick={next}>›</RightArrow>
      </SliderWrapper>

      <Thumbnails>
        {visibleThumbnails.map((img, index) => {
          const actualIndex = start + index;
          return (
            <Thumbnail
              key={actualIndex}
              src={img}
              alt={`Thumb ${actualIndex + 1}`}
              $active={actualIndex === current}
              onClick={() => setCurrent(actualIndex)}
            />
          );
        })}
      </Thumbnails>
    </GalleryWrapper>
  );
}
