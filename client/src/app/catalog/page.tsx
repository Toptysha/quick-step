'use client';

import styled from "styled-components";
import { CategoryComponent, ProductComponent, } from "@/components";
import { WINDOW_WIDTH } from "@/constants";
import { useCloseLoader } from "@/hooks";
import { useState } from "react";
import { Product, ProductOptionSelect, ProductOptionsSwitcher } from "@/interfaces";

const BodyWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px 0 20px 0;
`;

const BodyWrapperMini = styled.div`
  width: 1200px;
  min-width: 1100px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media (${WINDOW_WIDTH.MOBILE}) {
      width: 100%;
      ${WINDOW_WIDTH.SUPER_MINI};
  }
`;

export default function Catalog() {
  useCloseLoader()

  const [selectedCategory, setSelectedCategory] = useState<Product['type']>('laminat');
  const [selected, setSelected] = useState<ProductOptionSelect[]>([]);
  const [sortingMethod, setSortingMethod] = useState<ProductOptionSelect[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const products: Product[] = [
    {   
      cover: '/img/floor_example.jpg',
      article: 'DUBSOSNA1', 
      name: 'Дуб коттедж натуральный, Дуб коттедж Дуб коттедж Дуб коттедж Дуб коттедж Дуб коттедж Дуб коттедж', 
      type: 'laminat',
      priceOfMSqare: 2400,
      remains: 14,
      technicalData: {
        collection: {value: 'Blos base'},
      },
    },
    {   
      cover: '/img/floor_example.jpg',
      article: 'DUBSOSNA2', 
      name: 'Дуб коттедж натуральный', 
      type: 'laminat',
      priceOfMSqare: 2400,
      remains: 14,
      technicalData: {
        collection: {value: 'Blos base'}
      },
    },
    {   
      cover: '/img/floor_example.jpg',
      article: 'DUBSOSNA3', 
      name: 'Дуб коттедж натуральный', 
      type: 'laminat',
      priceOfMSqare: 2400,
      remains: 14,
      technicalData: {
        collection: {value: 'Blos base'}
      },
    },
    {   
      cover: '/img/floor_example.jpg',
      article: 'DUBSOSNA4', 
      name: 'Дуб коттедж натуральный', 
      type: 'laminat',
      priceOfMSqare: 2400,
      remains: 14,
      technicalData: {
        collection: {value: 'Blos base'}
      },
    },
    {   
      cover: '/img/floor_example.jpg',
      article: 'DUBSOSNA5', 
      name: 'Дуб коттедж натуральный', 
      type: 'laminat',
      priceOfMSqare: 2400,
      remains: 14,
      technicalData: {
        collection: {value: 'Blos base'}
      },
    },
    {   
      cover: '/img/floor_example.jpg',
      article: 'BankaMeda62', 
      name: 'Хороший товар', 
      type: 'accessory',
      priceOfMSqare: 2400,
      remains: 14,
      technicalData: {
        collection: {value: 'Blos base'}
      },
    },
    {   
      cover: '/img/floor_example.jpg',
      article: 'DUBSOSNA6', 
      name: 'Дуб коттедж натуральный', 
      type: 'laminat',
      priceOfMSqare: 2400,
      remains: 14,
      technicalData: {
        collection: {value: 'Blos base'}
      },
    },
  ]

  const switchers: ProductOptionsSwitcher[] = [
    { values: ['capture', 'capture ultra', 'castle ultra'], name: 'Коллекция' },
    { values: ['red', 'blue', 'green'], name: 'Цвет' },
    { values: ['5 мм', '8 мм', '12 мм'], name: 'Толщина' },
    { values: ['да', 'нет'], name: 'Водостойкость' },
    { values: ['V-образная', 'прямая'], name: 'Фаска' },
    { values: ['31', '32', '33', '34'], name: 'Класс износостойкости' },
  ];

  const sorting: ProductOptionsSwitcher[] = [
    { values: ['по возрастанию цены', 'по убыванию цены'], name: 'Сортировка' },
  ]; 

  return (
    <BodyWrapper>
      <BodyWrapperMini>
        <CategoryComponent selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <ProductComponent 
          switchers={switchers} 
          selected={selected} 
          setSelected={setSelected}
          sorting={sorting}
          sortingMethod={sortingMethod}
          setSortingMethod={setSortingMethod}
          products={products.filter(product => selectedCategory === product.type)}
          allPages={30}
          currentPage={currentPage}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
      </BodyWrapperMini>
    </BodyWrapper>
  );
}
