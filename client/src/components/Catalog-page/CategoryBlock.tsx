'use client';

import styled from "styled-components";
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { Categories, Product } from "@/interfaces";
import { Dispatch, SetStateAction } from "react";

const CategoriesWrapper = styled.div`
    width: 100%;
    height: 350px;
    margin: 20px 0 0 0;
    display: flex;
    justify-content: space-between;

    @media (${WINDOW_WIDTH.MOBILE}) {
        display: none;
    }
`

const CategoryBlock = styled.div`
    // border: 1px solid black;
    cursor: pointer;
    width: 300px;
    height: 350px;

    @media (${WINDOW_WIDTH.MOBILE}) {
        // border: 1px solid black;
        font-size: 20px;
        width: 90%;
        height: auto;
        display: flex;
        justify-content: center;
        ${WIX_MADEFOR_TEXT_WEIGHT('400')};
    }
`

const CategoryCover = styled.img<{ $isActive?: boolean }>`
    width: 300px;
    height: 300px;
    border-radius: 24px;
    object-fit: cover;
    object-position: bottom;
    box-shadow: ${({ $isActive }) => ($isActive ? '0px 0px 16px rgba(236, 0, 140, 0.5)' : '0px 0px 16px rgba(19, 67, 149, 0.5)')};

    transition: box-shadow 0.4s ease;

    &:hover {
        box-shadow: 0px 0px 16px rgba(236, 0, 140, 0.5);
    }
`

const CategoryName = styled.div<{ $isActive?: boolean }>`
    padding: 5px;
    // margin: 0 0 10px 0;
    // background-color: ${COLORS.CORPORATE_BLUE};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${COLORS.CORPORATE_BLUE};
    font-size: 22px;
    ${WIX_MADEFOR_TEXT_WEIGHT('600')};
    letter-spacing: -0.5px;
    border-radius: 24px 0 50px 0 ;

    @media (${WINDOW_WIDTH.MOBILE}) {
        // border: 1px solid black;
        border-radius: 0;
        margin: 0 0 10px 0;
        box-shadow: ${({ $isActive }) => $isActive ? 'none' : `inset 0 -1px 0 ${COLORS.CORPORATE_BLUE}`};

        transition: box-shadow 0.2s ease;

        &:hover {
            box-shadow: ${({ $isActive }) => $isActive ? 'none' : `inset 0 0 0 ${COLORS.CORPORATE_BLUE}`};
        }
    }
`

const CategoriesMobileWrapper = styled.div`
    display: none;

    @media (${WINDOW_WIDTH.MOBILE}) {
    border: 1px solid black;
        display: flex;
        width: 90%;
        ${WINDOW_WIDTH.SUPER_MINI};
        height: 120px;
        margin: 10px 0 40px 0;
        justify-content: center;
        flex-wrap: wrap;
    }
`

export default function CategoryComponent({selectedCategory, setSelectedCategory}: {
        selectedCategory: Product['type'];
        setSelectedCategory: Dispatch<SetStateAction<Product['type']>>;
}) {
    const categories: Categories[] = [
        {srcCover: '/img/categories-cover/laminat.jpg', name: 'Ламинат', type: 'laminat' },
        {srcCover: '/img/categories-cover/vinyl.jpg', name: 'Винил', type: 'vinyl'  },
        {srcCover: '/img/categories-cover/accessours.jpg', name: 'Аксессуары', type: 'accessory'  },
    ]

    return (
        <>
            <CategoriesWrapper>
                {categories.map((category, i) => (
                    <CategoryBlock key={category.name} onClick={() => setSelectedCategory(category.type)}>
                        <CategoryCover $isActive={selectedCategory === category.type} src={category.srcCover} alt="Cover" />
                        <CategoryName>
                            {category.name}
                        </CategoryName>
                    </CategoryBlock>
                ))}
            </CategoriesWrapper>

            <CategoriesMobileWrapper>
                {categories.map((category, i) => (
                    <CategoryBlock key={category.name} onClick={() => setSelectedCategory(category.type)}>
                        <CategoryName $isActive={category.type === selectedCategory}>
                            {category.name}
                        </CategoryName>
                    </CategoryBlock>
                ))}
            </CategoriesMobileWrapper>
        </>
    )
}