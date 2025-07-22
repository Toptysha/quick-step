import { closeLoader } from "@/redux/reducers";
import { useAppDispatch } from "@/redux/store";
import { useEffect } from "react";

export const useCloseLoader = () => {
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
        setTimeout(() => dispatch(closeLoader()), 300); // задержка для плавности
      };
    
      preloadImages();
    }, []);
}