'use client';

import styled from "styled-components";
import { WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";

const ContactsWrapper = styled.div`
    width: 100%;
    height: 600px;
    margin: 40px 0 40px 0;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 90%;
        height: 400px;
        ${WINDOW_WIDTH.SUPER_MINI};
    }
`

const MapContainer = styled.div`
    width: 50%;
    height: 100%;
    border-radius: 24px;
    overflow: hidden;
`;

const MapIframe = styled.iframe`
    width: 100%;
    height: 100%;
    border: none;
`;

const InfoContainer = styled.div`
    width: 50%;
    height: 100%;
    overflow: hidden;
    padding: 0 40px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    ${WIX_MADEFOR_TEXT_WEIGHT('400')};
    letter-spacing: -0.5px;
    font-size: 18px;

    @media (${WINDOW_WIDTH.MOBILE}) {
        font-size: 14px;
    }
`;

const HeaderLogo = styled.img`
    width: 220px;
    margin: 0px 0 30px 0;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 160px;
    }
`;

const Description = styled.div`
    width: 100%;
    margin: 0 0 20px 0;

    @media (max-width: 800px) {
        display: none;
    }
`

const SalonBox = styled.div`
    position: relative;
    width: 50%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;

    @media (${WINDOW_WIDTH.MOBILE}) {
        display: none;
    }
`

const SalonImg = styled.img`
    position: absolute;
    bottom: 0;
    left: 0px;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: bottom;
    z-index: 0;
`

const InfoBottom = styled.div`
    width: 100%;
    min-height: 50%;
    display: flex;
    justify-content: space-between;
`;

const Info = styled.div`
    width: 50%;
    height: 100%;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 18px;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 100%;
        margin: -30px 0 0 0;
        font-size: 14px;
    }
`

const InfoPoint = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Icon = styled.img`
  width: 25px;
  opacity: 0.7;
  margin: 0 10px 0 0;
`;

const TextWrapper = styled.div`
    width: 80%;
`

const InfoTitle = styled.div`
    width: 100%;
`;

const InfoDescription = styled.div`
    width: 100%;
    ${WIX_MADEFOR_TEXT_WEIGHT('500')};
    font-size: 20px;

    @media (${WINDOW_WIDTH.MOBILE}) {
        font-size: 14px;
    }
`;

export default function ContactsComponent() {
    const infoPoints = [
        {title: 'Адрес магазина:', description: 'г. Воронеж, ул. Донбасская, 5', src: 'icons/decor-elements/location-pin.svg'},
        {title: 'Наш телефон:', description: '+7 (999) 721-57-40', src: 'icons/social/phone-icon.svg'},
        {title: 'Время работы:', description: `Пн-Пт: 10:00 - 19:00 \n Сб-Вс: 10:00 - 18:00`, src: 'icons/decor-elements/clock.svg'},
    ]

    return (
        <ContactsWrapper>
            <MapContainer>
                <MapIframe
                    src="https://yandex.ru/map-widget/v1/?ll=39.181869%2C51.673449&mode=search&poi%5Bpoint%5D=39.181957%2C51.673277&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D120254340909&z=16.9"
                    allowFullScreen
                    title="Yandex Map"
                />
            </MapContainer>
            <InfoContainer>
                <HeaderLogo src="/icons/header-logo.svg" alt="Logo" />
                <Description>
                    Удобный дом невозможно представить без качественных полов. Компания Quick-Step следует этому постулату с 1990 года. Сегодня мы предлагаем широкий ассортимент долговечного ламината и виниловых напольных покрытий.
                </Description>
                <InfoBottom>
                    <SalonBox>
                        <SalonImg src="img/salon/salon.jpg" alt="Salon" /> 
                    </SalonBox>
                    <Info>
                        {infoPoints.map((point, index )=> (
                            <InfoPoint key={`info-point-${index}`}>
                                <Icon src={point.src} alt="icon" />
                                <TextWrapper>
                                    <InfoTitle>
                                        {point.title}
                                    </InfoTitle>
                                    <InfoDescription>
                                        {point.description}
                                    </InfoDescription>
                                </TextWrapper>
                            </InfoPoint>
                        ))}
                    </Info>
                </InfoBottom>
            </InfoContainer>
        </ContactsWrapper>
    )
}