'use client';

import { useEffect } from 'react';

export default function PreloaderScript () {
  useEffect(() => {
    const removePreloader = () => {
      document.documentElement.classList.remove("loading");
      const el = document.getElementById("preloader-html");
      if (el) {
        el.style.transition = "opacity 0.4s ease";
        el.style.opacity = "0";
        setTimeout(() => el.remove(), 400);
      }
    };

    document.documentElement.classList.add("loading");

    // Случай, если window уже загрузился
    if (document.readyState === 'complete') {
      removePreloader();
    } else {
      // Подписка на событие загрузки
      window.addEventListener("load", removePreloader);
    }

    // Очистка подписки
    return () => {
      window.removeEventListener("load", removePreloader);
    };
  }, []);

  return null;
};