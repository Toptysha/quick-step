"use client";

import { useMemo } from "react";
import styled from "styled-components";
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { Product } from "@/interfaces";
import { useCheckAuth, useCloseLoader } from "@/hooks";
import { FlooringCalculator, PhotoGallery, ProductAddFormComponent, ProductTabs } from "@/components";
import { ExchangeButton } from "@/components/ExchangeButton";
import { openModal } from "@/redux/reducers";
import { useAppDispatch } from "@/redux/store";

const BodyWrapper = styled.div`
  width: 100%;
  margin: 40px 0 40px 0;
  display: flex;
  justify-content: center;
`;

const BodyWrapperMini = styled.div`
  width: 1200px;
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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (${WINDOW_WIDTH.MOBILE}) {
    display: none;
  }
`;

const PhotoBlock = styled.div`
  position: relative;
  width: 49%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: space-between;

  @media (${WINDOW_WIDTH.MOBILE}) {
    width: 100%;
    margin: 0 0 20px 0;
  }
`;

const MiniDescriptionBlock = styled.div`
  width: 100%;
  font-size: 18px;
  ${WIX_MADEFOR_TEXT_WEIGHT("500")};
  letter-spacing: -0.5px;

  @media (${WINDOW_WIDTH.MOBILE}) {
    font-size: 16px;
    margin: 50px 0 40px 0;
  }
`;

const MiniDescriptionOne = styled.div`
  width: 100%;
  padding: 0 0 10px 0;
`;

const PricesAndSizesBlock = styled.div`
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

const TitleWrapper = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  color: ${COLORS.CORPORATE_BLUE};
  font-size: 28px;
  ${WIX_MADEFOR_TEXT_WEIGHT("500")};
  letter-spacing: -0.5px;

  @media (${WINDOW_WIDTH.MOBILE}) {
    font-size: 24px;
    margin: 0 0 10px 0;
  }
`;

const PriceDescription = styled.div`
  width: 49%;
  color: #666;
  font-size: 16px;
  ${WIX_MADEFOR_TEXT_WEIGHT("400")};
  letter-spacing: -0.5px;

  @media (${WINDOW_WIDTH.MOBILE}) {
    font-size: 14px;
    margin: 0 0 20px 0;
  }
`;

const PriceDescriptionPoint = styled.div`
  width: 100%;
`;

const Prices = styled.div`
  margin: 0px 0 10px 0;
  color: ${COLORS.CORPORATE_BLUE};
  font-size: 20px;
  ${WIX_MADEFOR_TEXT_WEIGHT("500")};
  letter-spacing: -0.5px;
`;

const SupInfoBlock = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin: 100px 0 0 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media (${WINDOW_WIDTH.MOBILE}) {
    margin: 0;
    width: 90%;
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
`;

type Props = {
  initialProduct: Product;
};

export default function ProductClientView({ initialProduct }: Props) {
  useCloseLoader();
  const dispatch = useAppDispatch();
  const isAdmin = useCheckAuth();

  // т.к. сервер уже проверил наличие товара, просто используем переданные данные
  const product = initialProduct;

  // подправим cover на случай, если в БД лежит без ведущего слеша
  const cover = useMemo(() => {
    if (!product?.cover) return "";
    return product.cover.startsWith("/") ? product.cover : `/${product.cover}`;
  }, [product?.cover]);

  return (
    <BodyWrapper>
      <BodyWrapperMini>
        <MainInfoBlock>
          <PhotoBlock>
            {isAdmin && (
              <ExchangeButton
                onClick={() =>
                  dispatch(
                    openModal({
                      disableOverlayClose: true,
                      content: (
                        <ProductAddFormComponent isAdmin={isAdmin} productToEdit={product} />
                      ),
                    })
                  )
                }
              >
                Изменить
              </ExchangeButton>
            )}

            <PhotoGallery photos={product?.photos || []} cover={cover} />

            {product?.description && (
              <MiniDescriptionBlock>
                {product.description.map((desc, i) => (
                  <MiniDescriptionOne key={`mini-description-${i}`}>•  {desc}</MiniDescriptionOne>
                ))}
              </MiniDescriptionBlock>
            )}
          </PhotoBlock>

          <PricesAndSizesBlock>
            <Title>{product?.title || product?.name}</Title>

            <PriceDescription>
              {product?.floorSize?.mSqareOfPack && (
                <PriceDescriptionPoint>
                  Цена м²:  <Prices>{product?.priceOfMSqare} ₽</Prices>
                </PriceDescriptionPoint>
              )}
              <PriceDescriptionPoint>
                Цена упаковки:  <Prices>{product?.priceOfPack} ₽</Prices>
              </PriceDescriptionPoint>
            </PriceDescription>

            <PriceDescription>
              {product?.floorSize?.mSqareOfPack && (
                <PriceDescriptionPoint>
                  В упаковке:  <Prices>{product.floorSize.mSqareOfPack as any} м²</Prices>
                </PriceDescriptionPoint>
              )}
              {product?.floorSize?.countOfPack && (
                <PriceDescriptionPoint>
                  В упаковке:  <Prices>{product?.floorSize?.countOfPack as any} штук</Prices>
                </PriceDescriptionPoint>
              )}
            </PriceDescription>

            {product && <FlooringCalculator product={product} />}
          </PricesAndSizesBlock>
        </MainInfoBlock>

        <MainInfoMobileBlock>
          <PricesAndSizesBlock>
            <TitleWrapper>
              <Title>{product?.title || product?.name}</Title>
            </TitleWrapper>

            <PriceDescription>
              {product?.floorSize?.mSqareOfPack && (
                <PriceDescriptionPoint>
                  Цена м²:  <Prices>{product?.priceOfMSqare} ₽</Prices>
                </PriceDescriptionPoint>
              )}
              <PriceDescriptionPoint>
                Цена упаковки:  <Prices>{product?.priceOfPack} ₽</Prices>
              </PriceDescriptionPoint>
            </PriceDescription>

            <PriceDescription>
              {product?.floorSize?.mSqareOfPack && (
                <PriceDescriptionPoint>
                  В упаковке:  <Prices>{product?.floorSize?.mSqareOfPack as any} м²</Prices>
                </PriceDescriptionPoint>
              )}
              {product?.floorSize?.countOfPack && (
                <PriceDescriptionPoint>
                  В упаковке:  <Prices>{product?.floorSize?.countOfPack as any} штук</Prices>
                </PriceDescriptionPoint>
              )}
            </PriceDescription>

            <PhotoBlock>
              {isAdmin && (
                <ExchangeButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        disableOverlayClose: true,
                        content: (
                          <ProductAddFormComponent isAdmin={isAdmin} productToEdit={product} />
                        ),
                      })
                    )
                  }
                >
                  Изменить
                </ExchangeButton>
              )}
              <PhotoGallery photos={product?.photos || []} cover={cover} />
            </PhotoBlock>

            {product && <FlooringCalculator product={product} />}

            {product?.description && (
              <MiniDescriptionBlock>
                {product.description.map((desc, i) => (
                  <MiniDescriptionOne key={`mini-description-m-${i}`}>
                    •  {desc}
                  </MiniDescriptionOne>
                ))}
              </MiniDescriptionBlock>
            )}
          </PricesAndSizesBlock>
        </MainInfoMobileBlock>

        <SupInfoBlock>{product && <ProductTabs product={product} />}</SupInfoBlock>
      </BodyWrapperMini>
    </BodyWrapper>
  );
}
