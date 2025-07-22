'use client';

import styled from "styled-components";
import { Dispatch, SetStateAction, useState } from "react";
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { Product, ProductOptionSelect, ProductOptionsSwitcher } from "@/interfaces";
import { OptionsSwitcher, CatalogButtonComponent, PaginationComponent,  } from "@/components";
import { truncateText } from "@/utils";
import { useAppDispatch } from "@/redux/store";
import { openModal } from "@/redux/reducers";

const ProductsWrapper = styled.div`
    // border: 1px solid black;
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
    width: 70%;
    display: flex;
    flex-wrap: wrap;

    @media (${WINDOW_WIDTH.MOBILE}) {
        // border: 1px solid black;
        width: 100%;
        justify-content: center;
    }
`;

const ProductContainer = styled.div<{ $height: number }>`
    // border: 1px solid black;
    width: 100%;
    height: ${({ $height }) => $height}px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    @media (${WINDOW_WIDTH.MOBILE}) {
        // border: 1px solid black;
        height: auto;
    }
`

const OneOfProduct = styled.div<{ $height: number }>`
    // border: 1px solid black;
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
`

const Cover = styled.img`
    width: 100%;
    height: 280px;
    object-fit: cover;
    object-position: bottom;
    border-radius: 24px;

    @media (${WINDOW_WIDTH.MOBILE}) {
        height: 180px;
    }
`

const ProductDescriptionContainer = styled.div`
    width: 100%;
    height: 40%;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    justify-content: center;
    padding: 2px 15px 0 15px;
`

const ProductDescription = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    color: #777;
    font-size: 14px;
    ${WIX_MADEFOR_TEXT_WEIGHT('400')};
    letter-spacing: -0.5px;
`
const ProductName = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    // margin: 5px 0 0 0;
    color: ${COLORS.CORPORATE_BLUE};
    font-size: 18px;
    ${WIX_MADEFOR_TEXT_WEIGHT('600')};
    letter-spacing: -0.5px;
`
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
`

const ProductsMobileWrapper = styled.div`
    display: none;

    @media (${WINDOW_WIDTH.MOBILE}) {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 90%;
        // height: 1980px;
        margin: 10px 0 0 0;
        justify-content: center;
        flex-wrap: wrap;
    }
`;

const BurgerSwitcherMenuWrapper = styled.div`
    // border: 1px solid black;
    cursor: pointer;
    // width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 0 20px 0;
    color: ${COLORS.CORPORATE_BLUE};
    font-size: 18px;
    ${WIX_MADEFOR_TEXT_WEIGHT('600')};
    letter-spacing: -0.5px;
`

const OptionsSwitcherWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const BurgerSwitcherMenu = styled.img`
  cursor: pointer;
  width: 40px;
  margin: 0 0 0 15px;
`

interface ProductComponentProps {
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
}

export default function ProductComponent({
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
}: ProductComponentProps) {

    const dispatch = useAppDispatch()
    const countColumns = Math.ceil(products.length / 3)
    const countColumnsMobile = Math.ceil(products.length / 2)

    return (
        <>
            <ProductsWrapper>
                <OptionsSwitcher switchers={switchers} selected={selected} setSelected={setSelected} />
                <ProductsBlock>
                    <SortingWrapper>
                        <OptionsSwitcher switchers={sorting} selected={sortingMethod} setSelected={setSortingMethod} />
                    </SortingWrapper>
                    <ProductContainer $height={countColumns * 500}>
                        {products.map((product, i) => (
                            <OneOfProduct 
                                $height={
                                    countColumns === 1 ? 100 : 
                                    countColumns === 2 ? 47 : 
                                    countColumns === 3 ? 32 : 
                                                        23
                                } 
                                key={`${product.article}-${i}`}
                            >
                                <Cover src={product.cover} />
                                <ProductDescriptionContainer>
                                    <ProductDescription>
                                        {`${product.type} | ${product.technicalData?.collection?.value && `${product.technicalData?.collection?.value} |` } ${product.article}`}
                                    </ProductDescription>
                                    <ProductName>
                                        {truncateText(product.name)}
                                    </ProductName>
                                    <ProductPrice>
                                        {`${product.priceOfMSqare} ${product.type === 'laminat' || product.type === 'vinyl' ? 'руб/м2' : 'руб/шт' }`}
                                    </ProductPrice>
                                    <CatalogButtonComponent width='200px' fontSize='16px' buttonName='Подробнее  ›' route={`/catalog/${product.article}`} />
                                </ProductDescriptionContainer>
                            </OneOfProduct>
                        ))}
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
                    <BurgerSwitcherMenuWrapper onClick={() => dispatch(openModal({content: <OptionsSwitcherWrapper><OptionsSwitcher switchers={switchers} selected={selected} setSelected={setSelected} /></OptionsSwitcherWrapper>}))}>
                        Параметры  
                        <BurgerSwitcherMenu src="/icons/decor-elements/burger-switcher-menu-icon.svg" alt="Menu"  />
                    </BurgerSwitcherMenuWrapper>
                    <SortingWrapper>
                        <OptionsSwitcher switchers={sorting} selected={sortingMethod} setSelected={setSortingMethod} />
                    </SortingWrapper>
                    <ProductContainer $height={countColumnsMobile * 500}>
                        {products.map((product, i) => (
                            <OneOfProduct 
                                $height={
                                    countColumnsMobile === 1 ? 100 : 
                                    countColumnsMobile === 2 ? 48 : 
                                    countColumnsMobile === 3 ? 33 : 
                                    countColumnsMobile === 4 ? 24 : 
                                    countColumnsMobile === 5 ? 19 : 
                                                        15
                                } 
                                key={`${product.article}-${i}`}
                            >
                                <Cover src={product.cover} />
                                <ProductDescriptionContainer>
                                    <ProductDescription>
                                        {`${product.type} | ${product.technicalData?.collection?.value && `${product.technicalData?.collection?.value} |` } ${product.article}`}
                                    </ProductDescription>
                                    <ProductName>
                                        {truncateText(product.name, 22)}
                                    </ProductName>
                                    <ProductPrice>
                                        {`${product.priceOfMSqare} ${product.type === 'laminat' || product.type === 'vinyl' ? 'руб/м2' : 'руб/шт' }`}
                                    </ProductPrice>
                                    <CatalogButtonComponent width='200px' fontSize='16px' buttonName='Подробнее  ›' route={`/catalog/${product.article}`} />
                                </ProductDescriptionContainer>
                            </OneOfProduct>
                        ))}
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
