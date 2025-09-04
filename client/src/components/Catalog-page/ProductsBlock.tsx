'use client';

import styled from "styled-components";
import { Dispatch, SetStateAction } from "react";
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { Product, ProductOptionSelect, ProductOptionsSwitcher } from "@/interfaces";
import { OptionsSwitcher, CatalogButtonComponent, PaginationComponent, ProductAddFormComponent, ConfirmDeleteProduct } from "@/components";
import { truncateText } from "@/utils";
import { useAppDispatch } from "@/redux/store";
import { openModal } from "@/redux/reducers";
import { ExchangeButton } from "../ExchangeButton";

const ProductsWrapper = styled.div`
  width: 100%;
  margin: 20px 0 0 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  @media (${WINDOW_WIDTH.MOBILE}) {
    display: none;
  }
`;

const SortingWrapper = styled.div`
  width: 100%;

  @media (${WINDOW_WIDTH.MOBILE}) {
    display: flex;
    justify-content: center;
  }
`;

const ProductsBlock = styled.div`
  position: relative;
  width: 70%;
  display: flex;
  flex-wrap: wrap;

  @media (${WINDOW_WIDTH.MOBILE}) {
    width: 100%;
    justify-content: center;
  }
`;

const ProductContainer = styled.div<{ $height: number }>`
  width: 100%;
  height: ${({ $height }) => $height}px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (${WINDOW_WIDTH.MOBILE}) {
    height: auto;
  }
`;

const OneOfProduct = styled.div<{ $height: number }>`
  position: relative;
  box-sizing: border-box;
  width: 32%;
  height: ${({ $height }) => $height}%;
  overflow: hidden;
  border-radius: 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);

  @media (${WINDOW_WIDTH.MOBILE}) {
    width: 49%;
    min-height: 350px;
    margin: 10px 0 0 0;
  }
`;

/* Обёртка для обложки, чтобы накладывать плашку поверх */
const CoverWrap = styled.div`
  position: relative;
  width: 100%;
`;

const Cover = styled.img<{ $dim?: boolean }>`
  width: 100%;
  height: 280px;
  object-fit: cover;
  object-position: bottom;
  border-radius: 24px;

  /* затемнение, если товар скрыт */
  filter: ${({ $dim }) => ($dim ? "brightness(0.6)" : "none")};

  @media (${WINDOW_WIDTH.MOBILE}) {
    height: 180px;
  }
`;

/* Плашка "Скрыто от пользователей" */
const HiddenBadge = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 16px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  ${WIX_MADEFOR_TEXT_WEIGHT('700')};
  font-size: 14px;
  letter-spacing: -0.2px;
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
`;

const ProductDescriptionContainer = styled.div`
  width: 100%;
  height: 40%;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  justify-content: center;
  padding: 2px 15px 0 15px;
`;

const ProductDescription = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  color: #777;
  font-size: 14px;
  ${WIX_MADEFOR_TEXT_WEIGHT('400')};
  letter-spacing: -0.5px;
`;

const ProductName = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  color: ${COLORS.CORPORATE_BLUE};
  font-size: 18px;
  ${WIX_MADEFOR_TEXT_WEIGHT('600')};
  letter-spacing: -0.5px;
`;

const ProductPrice = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 5px 0 5px 0;
  color: ${COLORS.CORPORATE_PINK};
  font-size: 18px;
  ${WIX_MADEFOR_TEXT_WEIGHT('600')};
  letter-spacing: -0.5px;
`;

const ProductsMobileWrapper = styled.div`
  display: none;

  @media (${WINDOW_WIDTH.MOBILE}) {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 90%;
    margin: 10px 0 0 0;
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const BurgerSwitcherMenuWrapper = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 20px 0;
  color: ${COLORS.CORPORATE_BLUE};
  font-size: 18px;
  ${WIX_MADEFOR_TEXT_WEIGHT('600')};
  letter-spacing: -0.5px;
`;

const OptionsSwitcherWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BurgerSwitcherMenu = styled.img`
  cursor: pointer;
  width: 40px;
  margin: 0 0 0 15px;
`;

const RemoveButton = styled.button`
  cursor: pointer;
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 24px;
  width: 50px;
  height: 50px;
  font-size: 36px;
`;

interface ProductComponentProps {
  isAdmin: boolean;
  switchers: ProductOptionsSwitcher[];
  selected: ProductOptionSelect[];
  setSelected: Dispatch<SetStateAction<ProductOptionSelect[]>>;
  sorting: ProductOptionsSwitcher[];
  sortingMethod: ProductOptionSelect[];
  setSortingMethod: Dispatch<SetStateAction<ProductOptionSelect[]>>;
  products: Product[];
  allPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onProductDeleted?: () => void;
}

export default function ProductComponent({
  isAdmin,
  switchers,
  selected,
  setSelected,
  sorting,
  sortingMethod,
  setSortingMethod,
  products,
  allPages,
  currentPage,
  onPageChange,
  onProductDeleted
}: ProductComponentProps) {
  const dispatch = useAppDispatch();
  const countColumns = Math.ceil(products.length / 3);
  const countColumnsMobile = Math.ceil(products.length / 2);

  return (
    <>
      <ProductsWrapper>
        <OptionsSwitcher switchers={switchers} selected={selected} setSelected={setSelected} />
        <ProductsBlock>
          {isAdmin && (
            <ExchangeButton
              $top='-15px'
              onClick={() =>
                dispatch(
                  openModal({
                    disableOverlayClose: true,
                    content: <ProductAddFormComponent isAdmin={isAdmin} />
                  })
                )
              }
            >
              Добавить товар
            </ExchangeButton>
          )}
          <SortingWrapper>
            <OptionsSwitcher switchers={sorting} selected={sortingMethod} setSelected={setSortingMethod} />
          </SortingWrapper>
          <ProductContainer $height={countColumns * 500}>
            {products.map((product, i) => {
              if ((!isAdmin && product.isVisible) || isAdmin) {
                const isHiddenForUsers = isAdmin && !product.isVisible; // ← условие для плашки/затемнения

                return (
                  <OneOfProduct
                    $height={
                      countColumns === 1 ? 100 :
                      countColumns === 2 ? 47 :
                      countColumns === 3 ? 32 : 23
                    }
                    key={`${product.article}-${i}`}
                  >
                    {isAdmin && (
                      <ExchangeButton
                        onClick={() =>
                          dispatch(
                            openModal({
                              disableOverlayClose: true,
                              content: <ProductAddFormComponent isAdmin={isAdmin} productToEdit={product} />
                            })
                          )
                        }
                      >
                        Изменить
                      </ExchangeButton>
                    )}
                    {isAdmin && (
                      <RemoveButton
                        onClick={() =>
                          dispatch(
                            openModal({
                              content: <ConfirmDeleteProduct productArticle={product.article} onDeleted={onProductDeleted} />
                            })
                          )
                        }
                      >
                        ×
                      </RemoveButton>
                    )}

                    <CoverWrap>
                      <Cover src={product.cover} alt={product.name} $dim={isHiddenForUsers} />
                      {isHiddenForUsers && <HiddenBadge>Скрыто от пользователей</HiddenBadge>}
                    </CoverWrap>

                    <ProductDescriptionContainer>
                      <ProductDescription>
                        {`${product.type} | ${product.technicalData?.collection ? `${product.technicalData.collection} |` : '' } ${product.article}`}
                      </ProductDescription>
                      <ProductName>{truncateText(product.name)}</ProductName>
                      <ProductPrice>
                        {`${product.priceOfMSqare !== null ? product.priceOfMSqare + ' ₽/м²' : product.priceOfPack + ' ₽/шт' }`}
                      </ProductPrice>
                      <CatalogButtonComponent
                        width='200px'
                        fontSize='16px'
                        buttonName='Подробнее  ›'
                        route={`/catalog/${product.article}`}
                      />
                    </ProductDescriptionContainer>
                  </OneOfProduct>
                );
              }
              return null;
            })}
          </ProductContainer>
          <PaginationComponent
            allPages={allPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </ProductsBlock>
      </ProductsWrapper>

      <ProductsMobileWrapper>
        <ProductsBlock>
          <BurgerSwitcherMenuWrapper
            onClick={() =>
              dispatch(
                openModal({
                  content: (
                    <OptionsSwitcherWrapper>
                      <OptionsSwitcher switchers={switchers} selected={selected} setSelected={setSelected} />
                    </OptionsSwitcherWrapper>
                  )
                })
              )
            }
          >
            Параметры&nbsp;&nbsp;
            <BurgerSwitcherMenu src="/icons/decor-elements/burger-switcher-menu-icon.svg" alt="Menu" />
          </BurgerSwitcherMenuWrapper>

          <SortingWrapper>
            <OptionsSwitcher switchers={sorting} selected={sortingMethod} setSelected={setSortingMethod} />
          </SortingWrapper>

          <ProductContainer $height={countColumnsMobile * 500}>
            {products.map((product, i) => {
              if ((!isAdmin && product.isVisible) || isAdmin) {
                const isHiddenForUsers = isAdmin && !product.isVisible;

                return (
                  <OneOfProduct
                    $height={
                      countColumnsMobile === 1 ? 100 :
                      countColumnsMobile === 2 ? 48 :
                      countColumnsMobile === 3 ? 33 :
                      countColumnsMobile === 4 ? 24 :
                      countColumnsMobile === 5 ? 19 : 15
                    }
                    key={`${product.article}-${i}`}
                  >
                    {isAdmin && (
                      <ExchangeButton
                        onClick={() =>
                          dispatch(
                            openModal({
                              disableOverlayClose: true,
                              content: <ProductAddFormComponent isAdmin={isAdmin} productToEdit={product} />
                            })
                          )
                        }
                      >
                        Изменить
                      </ExchangeButton>
                    )}
                    {isAdmin && (
                      <RemoveButton
                        onClick={() =>
                          dispatch(
                            openModal({
                              content: <ConfirmDeleteProduct productArticle={product.article} onDeleted={onProductDeleted} />
                            })
                          )
                        }
                      >
                        ×
                      </RemoveButton>
                    )}

                    <CoverWrap>
                      <Cover src={product.cover} alt={product.name} $dim={isHiddenForUsers} />
                      {isHiddenForUsers && <HiddenBadge>Скрыто от пользователей</HiddenBadge>}
                    </CoverWrap>

                    <ProductDescriptionContainer>
                      <ProductDescription>
                        {`${product.type} | ${product.technicalData?.collection && `${product.technicalData?.collection} |` } ${product.article}`}
                      </ProductDescription>
                      <ProductName>{truncateText(product.name, 22)}</ProductName>
                      <ProductPrice>
                        {`${product.priceOfMSqare !== null ? product.priceOfMSqare + ' ₽/м²' : product.priceOfPack + ' ₽/шт' }`}
                      </ProductPrice>
                      <CatalogButtonComponent
                        width='200px'
                        fontSize='16px'
                        buttonName='Подробнее  ›'
                        route={`/catalog/${product.article}`}
                      />
                    </ProductDescriptionContainer>
                  </OneOfProduct>
                );
              }
              return null;
            })}
          </ProductContainer>

          <PaginationComponent
            allPages={allPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </ProductsBlock>
      </ProductsMobileWrapper>
    </>
  );
}
