'use client';

import { use, useState } from 'react';
import { useCloseLoader } from '@/hooks';
import { notFound } from 'next/navigation';
import styled from 'styled-components';
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from '@/constants';
import { Product } from '@/interfaces';
import { FlooringCalculator, PhotoGallery, ProductTabs } from '@/components';

const BodyWrapper = styled.div`
    width: 100%;
    margin: 40px 0 40px 0;
    display: flex;
    justify-content: center;
`;

const BodyWrapperMini = styled.div`
    // border: 1px solid black;
    width: 1200px;
    // min-width: 1100px;
    min-height: 1000px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 90%;
    }
`;


const MainInfoBlock = styled.div`
    width: 100%;
    // height: 600px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    @media (${WINDOW_WIDTH.MOBILE}) {
        display: none;
    }
`;

const PhotoBlock = styled.div`
    width: 49%;
    // height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 100%;
        margin: 0 0 20px 0;
    }
`;

const MiniDescriptionBlock = styled.div`
    width: 100%;
    margin: -60px 0 0 0px;
    // color: ${COLORS.CORPORATE_BLUE};
    font-size: 18px;
    ${WIX_MADEFOR_TEXT_WEIGHT('500')};
    letter-spacing: -0.5px;

    @media (${WINDOW_WIDTH.MOBILE}) {
        font-size: 16px;
        margin: 50px 0 40px 0;
    }
`

const MiniDescriptionOne = styled.div`
    width: 100%;
    padding: 0 0 10px 0;
`

const PricesAndSizesBlock = styled.div`
    // border: 1px solid black;
    box-sizing: border-box;
    width: 49%;
    padding: 0 5px 0 5px;
    display: flex;
    flex-wrap: wrap;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 100%;
        justify-content: center;
    }
`;

const Title = styled.h1`
    color: ${COLORS.CORPORATE_BLUE};
    font-size: 28px;
    ${WIX_MADEFOR_TEXT_WEIGHT('500')};
    letter-spacing: -0.5px;

    @media (${WINDOW_WIDTH.MOBILE}) {
        font-size: 24px;
        margin: 0 0 10px 0;
    }
`

const PriceDescription = styled.div`
    width: 49%;
    color: #666;
    font-size: 16px;
    ${WIX_MADEFOR_TEXT_WEIGHT('400')};
    letter-spacing: -0.5px;

    @media (${WINDOW_WIDTH.MOBILE}) {
        font-size: 14px;
        margin: 0 0 20px 0;
    }
`

const PriceDescriptionPoint = styled.div`
    width: 100%;
`

const Prices = styled.span`
    color: ${COLORS.CORPORATE_BLUE};
    font-size: 20px;
    ${WIX_MADEFOR_TEXT_WEIGHT('500')};
    letter-spacing: -0.5px;
`

const SupInfoBlock = styled.div`
    box-sizing: border-box;
    width: 100%;
    // height: 600px;
    margin: 100px 0 0 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    @media (${WINDOW_WIDTH.MOBILE}) {
        margin: 0;
    }
`;

const MainInfoMobileBlock = styled.div`
    display: none;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
`

export default function ProductPage({ params }: { params: Promise<{ productArticle: '' }> }) {
    useCloseLoader();
    const { productArticle } = use(params); // for server request

    const [product, setProduct] = useState<Product>( // for example
        {   
            cover: '/img/floor_example.jpg',
            photos: ['/img/test/floor_1.jpg', '/img/test/floor_2.jpg', '/img/test/floor_3.jpg',],
            article: 'DUBSOSNA2', 
            name: 'Дуб коттедж натуральный', 
            title: 'Дуб коттедж натуральный. Очень классный', 
            type: 'laminat',
            priceOfMSqare: 2400,
            priceOfPack: 6808,
            remains: 14,
            description: ['Пожизненная гарантия', '33 класс износостойкости', 'Совместим с системами подогрева полов', 'Имитация поверхности под дерево'],
            technicalData: {
                manufacturer: {name: 'Производитель', value: 'EGGER HOME'},
                collection: {name: 'Коллекция', value: 'Blos base'},
                color: {name: 'Цвет', value: 'Светло-коричневый'},
                chamfersCount: {name: 'Количество фасок', value: '4'},
                chamfersType: {name: 'Тип Фаски', value: 'Вдавленная фаска'},
                typeOfConnection: {name: 'Тип соединения', value: 'Uniclic'},
                compatibilityWithHeating: {name: 'Подогрев полов', value: 'Совместим с системами подогрева полов'},
                waterResistance: {name: 'Влагостойкость', value: 'Присутствует'},
                wearResistanceClass: {name: 'Класс влагостойкости', value: '3'},
                assurance: {name: 'Гарантия', value: 'Пожизненная гарантия'},
                lookLike: {name: 'Вид под', value: 'Дерево'},
            },
            floorSize: {
                length: {name: 'Длина мм', value: 1251},
                width: {name: 'Ширина мм', value: 189},
                height: {name: 'Высота мм', value: 4},
                mSqareOfPack: {name: 'м² / упаковка', value: 2.837},
                countOfPack: {name: 'штук / упаковка', value: 12},

            },
            floorCharacteristics: [
                {
                    title: 'Uniclic',
                    description: 'Компания Quick-Step является изобретателем системы монтажа Uniclic, которая сегодня стала стандартом замковых систем монтажа. Воспользуйтесь революционной запатентованной системой замков для простого соединения планок пола друг с другом.'
                },
                {
                    title: 'Водонепроницаемость',
                    description: 'Забудьте о проблемах с влажностью, выбрав водостойкий пол Quick-Step. Полы Quick-Step не пропускают воду и являются полностью герметичными. Вода не повредит ваш пол, под ним не будет плесени и грибка.'
                },
                {
                    title: 'Scratch & Stain Guard',
                    description: 'Наслаждайтесь своим виниловым полом долгие годы благодаря герметичному верхнему слою с технологией Stain and Scratch Guard. Этот слой обеспечивает превосходную защиту от царапин, пятен, грязи и потертостей.'
                },
                {
                    title: 'Устойчивость к локальному нагреву (защита HOTSPOT)',
                    description: 'В случае с жестким типом ПВХ-плитки клиенты могут столкнуться с проблемой термостабильности продукта. Происходит это в результате перепада температур / нагрева от солнечных лучей. В местах куда попадают солнечные лучи, происходит сильный нагрев и планки начинают расширяться в зоне нагрева. При этом другие планки, которые не подвержены нагреву сдерживают это расширение. В итоге возникает сильное напряжение и если эту проблему не решить, то стыки начнут подниматься и планки «встанут домиком».Чтобы избежать проблему поднятия планок в месте нагрева, мы разработали специальный замок для Альфа-Винила с защитой HOTSPOT (защита от перегрева и поднятия планок).'
                },
                {
                    title: 'Тихий',
                    description: 'Шаги в другой комнате, звук падающих предметов, игры в детской, активность ваших домашних питомцев — все это будет теперь в зоне звукового комфорта. АЛЬФА ВИНИЛ действительно очень «тихий», и это благодаря структуре материала: чередующиеся слои разной плотности отлично поглощают звуковые волны.'
                },
            ]
        }
    );


    return (
        <BodyWrapper>
            <BodyWrapperMini>
                {/* <MainInfoBlock>
                    <PhotoBlock>
                        <PhotoGallery photos={product.photos} cover={product.cover} />
                        {product.description &&  <MiniDescriptionBlock>
                            {product.description.map((desc, i) => (
                            <MiniDescriptionOne key={`mini-description-${i}`}>•  {desc}</MiniDescriptionOne>
                            ))}
                        </MiniDescriptionBlock>}
                    </PhotoBlock>
                    <PricesAndSizesBlock>
                        <Title>{product.title || product.name}</Title>
                        <PriceDescription>
                            <PriceDescriptionPoint> Цена м²:  <Prices>{product.priceOfMSqare} ₽</Prices> </PriceDescriptionPoint>
                            <PriceDescriptionPoint> Цена упаковки:  <Prices>{product.priceOfPack} ₽</Prices> </PriceDescriptionPoint>
                        </PriceDescription>
                        <PriceDescription>
                            <PriceDescriptionPoint> В упаковке:  <Prices>{product.floorSize?.mSqareOfPack?.value} м²</Prices> </PriceDescriptionPoint>
                            <PriceDescriptionPoint> В упаковке:  <Prices>{product.floorSize?.countOfPack?.value} штук</Prices> </PriceDescriptionPoint>
                        </PriceDescription>
                        <FlooringCalculator m2PerPack={product.floorSize?.mSqareOfPack?.value as number} packPrice={product.priceOfPack as number} />
                    </PricesAndSizesBlock>
                </MainInfoBlock> */}

                <MainInfoMobileBlock>
                    <PricesAndSizesBlock>
                        <Title>{product.title || product.name}</Title>
                        <PriceDescription>
                            <PriceDescriptionPoint> Цена м²:  <Prices>{product.priceOfMSqare} ₽</Prices> </PriceDescriptionPoint>
                            <PriceDescriptionPoint> Цена упаковки:  <Prices>{product.priceOfPack} ₽</Prices> </PriceDescriptionPoint>
                        </PriceDescription>
                        <PriceDescription>
                            <PriceDescriptionPoint> В упаковке:  <Prices>{product.floorSize?.mSqareOfPack?.value} м²</Prices> </PriceDescriptionPoint>
                            <PriceDescriptionPoint> В упаковке:  <Prices>{product.floorSize?.countOfPack?.value} штук</Prices> </PriceDescriptionPoint>
                        </PriceDescription>
                        <PhotoBlock>
                            <PhotoGallery photos={product.photos} cover={product.cover} />                            
                        </PhotoBlock>
                        <FlooringCalculator m2PerPack={product.floorSize?.mSqareOfPack?.value as number} packPrice={product.priceOfPack as number} />
                        {product.description &&  <MiniDescriptionBlock>
                                {product.description.map((desc, i) => (
                                <MiniDescriptionOne key={`mini-description-${i}`}>•  {desc}</MiniDescriptionOne>
                                ))}
                            </MiniDescriptionBlock>}
                    </PricesAndSizesBlock>
                </MainInfoMobileBlock>
                <SupInfoBlock>
                    <ProductTabs product={product} />
                </SupInfoBlock>
            </BodyWrapperMini>
        </BodyWrapper>
    );
}