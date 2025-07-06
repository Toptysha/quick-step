import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import StyledComponentsRegistry from "./styled-components-registry";
import { Footer, Header, Modal } from "@/components";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <StyledComponentsRegistry>
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
