import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import StyledComponentsRegistry from "./styled-components-registry";
import { Footer, Header, Loader, Modal } from "@/components";
import { ReduxProvider } from "@/providers";

export const metadata: Metadata = {
  title: 'QuickStep — напольные покрытия, ламинат, винил | Продажа и доставка',
  description:
    'Интернет-магазин напольных покрытий QuickStep — ламинат, виниловые и паркетные полы. Широкий ассортимент, выгодные цены, доставка по России.',
  keywords: [
    'ламинат QuickStep',
    'виниловые полы',
    'купить ламинат',
    'напольные покрытия',
    'плитка ПВХ',
    'ламинат с доставкой',
    'интернет-магазин пола',
    'пароизоляция',
    'подложка под ламинат',
    'клеевой винил',
    'замковый винил',
  ],
  applicationName: 'QuickStep Shop',
  authors: [{ name: 'QuickStep', url: 'http://quickstepshop36-1.ru' }],
  creator: 'QuickStep',
  generator: 'Next.js',
  openGraph: {
    title: 'QuickStep — качественные напольные покрытия с доставкой',
    description:
      'Огромный выбор ламината и виниловых полов QuickStep. Онлайн-заказ, консультации, доставка по всей России. Только оригинальная продукция.',
    url: 'http://quickstepshop36-1.ru',
    siteName: 'QuickStep Shop',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: 'https://quickstep-shop.ru/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Интернет-магазин QuickStep — напольные покрытия',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="loading">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html.loading, html.loading body {
                overflow: hidden;
              }

              #preloader-html {
                position: fixed;
                inset: 0;
                background-color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
              }

              .preloader-loaderVision {
                width: 50px;
                aspect-ratio: 1;
                --_c: no-repeat radial-gradient(farthest-side, #EC008C 92%, #0000);
                background:
                  var(--_c) top,
                  var(--_c) left,
                  var(--_c) right,
                  var(--_c) bottom;
                background-size: 12px 12px;
                animation: l7 1s infinite;
              }

              @keyframes l7 {
                to {
                  transform: rotate(0.5turn);
                }
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener("DOMContentLoaded", function () {
                document.documentElement.classList.add("loading");
              });

              window.addEventListener("load", function () {
                document.documentElement.classList.remove("loading");
                const el = document.getElementById("preloader-html");
                if (el) {
                  el.style.transition = "opacity 0.4s ease";
                  el.style.opacity = "0";
                  setTimeout(() => el.remove(), 400);
                }
              });
            `,
          }}
        />
      </head>
      <body>
        <div id="preloader-html">
          <div className="preloader-loaderVision"></div>
        </div>

        <ReduxProvider>
          <StyledComponentsRegistry>
            <Loader />
            <Header />
            {children}
            <Footer />
            <Modal />
          </StyledComponentsRegistry>
        </ReduxProvider>
      </body>
    </html>
  );
}