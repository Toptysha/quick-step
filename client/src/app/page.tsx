'use client';

import styled from "styled-components";
import { AdvantagesComponent, ContactsComponent, FeedbackComponent, FloorsComponent, InfoComponent, MiddleLogoComponent, WallpaperComponent } from "@/components";
import { WINDOW_WIDTH } from "@/constants";
import { useCheckAuth, useCloseLoader } from "@/hooks";
import { Cover } from "@/types";
import { useEffect, useState } from "react";

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
 
  useCloseLoader()

  const isAdmin = useCheckAuth();

  const [wallpapers, setWallpapers] = useState<Cover[]>([])
  const [infoCovers, setInfoCovers] = useState<Cover[]>([])
  const [floorCovers, setFloorCovers] = useState<Cover[]>([])
  const [salonCovers, setSalonCovers] = useState<Cover[]>([])

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        const res = await fetch("/api/covers/get-all");
        if (!res.ok) throw new Error("Ошибка при получении covers");

        const data: Cover[] = await res.json();

        const filteredWrapper: Cover[] = []
        const filteredInfoCovers: Cover[] = []
        const filteredFloorCovers: Cover[] = []
        const filteredSalonCovers: Cover[] = []

        data.forEach(cover => {
          if (cover.type === "wallpaper") {
            filteredWrapper.push(cover)
          } else if (cover.type === "info") {
            filteredInfoCovers.push(cover)
          } else if (cover.type === "floor") {
            filteredFloorCovers.push(cover)
          } else if (cover.type === "salon") {
            filteredSalonCovers.push(cover)
          }
        })

        setWallpapers(filteredWrapper);
        setInfoCovers(filteredInfoCovers)
        setFloorCovers(filteredFloorCovers)
        setSalonCovers(filteredSalonCovers)
      } catch (err) {
        console.error("❌ Не удалось загрузить обои:", err);
      }
    };

    fetchWallpapers();
  }, []);

  return (
    <BodyWrapper>
      <BodyWrapperMini>
        <WallpaperComponent wallpapers={wallpapers} isAdmin={isAdmin} />
        <InfoComponent covers={infoCovers} isAdmin={isAdmin} />
        <AdvantagesComponent />
        <FloorsComponent covers={floorCovers} isAdmin={isAdmin} />
        <MiddleLogoComponent />
        <FeedbackComponent />
        <ContactsComponent covers={salonCovers} isAdmin={isAdmin} />
      </BodyWrapperMini>
    </BodyWrapper>
  );
}
