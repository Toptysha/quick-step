'use client';

import { useState } from 'react';
import styled from 'styled-components';
import type { Product } from '@/interfaces';
import { COLORS, WIX_MADEFOR_TEXT_WEIGHT } from '@/constants';

const TabsWrapper = styled.div`
    width: 100%;
`;

const TabHeaders = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 20px;
`;

const TabButton = styled.button<{ $active: boolean }>`
    cursor: pointer;
    padding: 10px 24px;
    border: 1px solid ${({ $active }) => ($active ? `${COLORS.CORPORATE_BLUE}` : '#ccc')};
    background: ${({ $active }) => ($active ? 'white' : `${COLORS.CORPORATE_GRAY}`)};
    color: ${COLORS.CORPORATE_BLUE};
    font-size: 18px;
    ${WIX_MADEFOR_TEXT_WEIGHT('500')};
    letter-spacing: -0.5px;
    border-radius: 12px;

    &:hover {
        background: white;
    }
`;

const TabContent = styled.div`
    // background: green;
    padding: 24px;
    border-radius: 24px;
    box-shadow: 0 0px 12px rgba(0, 0, 0, 0.3);
    font-size: 18px;
    ${WIX_MADEFOR_TEXT_WEIGHT('500')};
    letter-spacing: -0.5px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(200px, 1fr));
  max-width: 1024px;
  margin: 0 auto;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Block = styled.div`
  box-sizing: border-box;
  background: rgba(252, 252, 252, 1);
  border-radius: 16px;
  padding: 20px;
`;

const BlockTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Text = styled.p`
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
`;

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const { floorCharacteristics, floorSize, technicalData } = product;

  const availableTabs = [
    floorCharacteristics?.length && { id: 'characteristics', label: 'Характеристики' },
    floorSize && Object.values(floorSize).some(Boolean) && { id: 'sizes', label: 'Размеры' },
    technicalData && Object.values(technicalData).some(Boolean) && { id: 'tech', label: 'Технические данные' },
  ].filter(Boolean) as { id: string; label: string }[];

  const [activeTab, setActiveTab] = useState(availableTabs[0]?.id || '');

  if (availableTabs.length === 0) return null;

  return (
    <TabsWrapper>
      <TabHeaders>
        {availableTabs.map((tab) => (
          <TabButton
            key={tab.id}
            $active={tab.id === activeTab}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabHeaders>

      <TabContent>
        {activeTab === 'characteristics' && floorCharacteristics && (
          <Grid>
            {floorCharacteristics.map((item, i) => (
              <Block key={i}>
                <BlockTitle>{item.title}</BlockTitle>
                <Text>{item.description}</Text>
              </Block>
            ))}
          </Grid>
        )}

        {activeTab === 'sizes' && floorSize && (
          <Grid>
            {Object.entries(floorSize).map(
              ([key, value]) =>
                value && (
                  <Block key={key}>
                    <BlockTitle>{value.name}</BlockTitle>
                    <Text>{value.value}</Text>
                  </Block>
                )
            )}
          </Grid>
        )}

        {activeTab === 'tech' && technicalData && (
          <Grid>
            {Object.entries(technicalData).map(
              ([key, value]) =>
                value && (
                  <Block key={key}>
                    <BlockTitle>{value.name}</BlockTitle>
                    <Text>{value.value}</Text>
                  </Block>
                )
            )}
          </Grid>
        )}
      </TabContent>
    </TabsWrapper>
  );
}

