'use client';

import styled from "styled-components";
import { AdvantagesComponent, ContactsComponent, FeedbackComponent, FloorsComponent, InfoComponent, MiddleLogoComponent, WallpaperComponent } from "@/components";
import { WINDOW_WIDTH } from "@/constants";
import { useAppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { closeLoader } from "@/redux/reducers";

const BodyWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px 0 20px 0;
`;

const BodyWrapperMini = styled.div`
  width: 1200px;
  min-width: 1100px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media (${WINDOW_WIDTH.MOBILE}) {
      width: 100%;
      ${WINDOW_WIDTH.SUPER_MINI};
  }
`;

export default function Home() {
  const dispatch = useAppDispatch()

  useEffect(() => {
  const preloadImages = async () => {
    const images = [...document.querySelectorAll("img")];
    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) return resolve(true);
            img.onload = img.onerror = resolve;
          })
      )
    );
    setTimeout(() => dispatch(closeLoader()), 300); // 👈 задержка для плавности
  };

  preloadImages();
}, []);

  const wallpapers = [
    { id: 1, src: "/img/main-cover/1.webp", alt: "Wallpaper 1", description: 'Высококачественные напольные покрытия: ламинат и винил' },
    { id: 2, src: "/img/main-cover/2.webp", alt: "Wallpaper 2", description: 'Комфорт и легкость, красота и уют' },
    { id: 3, src: "/img/main-cover/3.webp", alt: "Wallpaper 3", description: 'Клеевой винил' },
    { id: 4, src: "/img/main-cover/4.webp", alt: "Wallpaper 4", description: 'Пожизненная гарантия' },
  ];

  const covers = [
    { id: 1, src: "/img/info-cover/info-1.webp", alt: "Cover 1" },
    { id: 2, src: "/img/info-cover/info-2.webp", alt: "Cover 2" },
  ]

  return (
    <BodyWrapper>
      <BodyWrapperMini>
        <WallpaperComponent wallpapers={wallpapers} />
        <InfoComponent covers={covers} />
        <AdvantagesComponent />
        <FloorsComponent />
        <MiddleLogoComponent />
        <FeedbackComponent />
        <ContactsComponent />
      </BodyWrapperMini>
    </BodyWrapper>
  );
}
