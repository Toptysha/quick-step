'use client';

import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { CatalogButtonComponent, CustomSelect } from '@/components';
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from '@/constants';

const CalculatorWrapper = styled.div`
  width: 100%;
  border-radius: 16px;
  padding: 24px;
  background: ${COLORS.CORPORATE_GRAY};
  font-size: 18px;
  ${WIX_MADEFOR_TEXT_WEIGHT('500')};
  letter-spacing: -0.5px;
  box-shadow: 0 0px 12px rgba(0, 0, 0, 0.3);
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 14px 0;
`;

const Label = styled.label`
  flex: 1;
  margin-right: 16px;
  font-size: 16px;
`;

const Input = styled.input`
  width: 260px;
  padding: 8px 12px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  background: #eaeaea;
  outline: none;
  box-sizing: border-box;

  &:focus {
    background: #ddd;
  }

  @media (${WINDOW_WIDTH.MOBILE}) {
      width: 160px;
  }
`;

const Result = styled.div`
  margin-top: 24px;
  padding-top: 10px;
  font-weight: bold;
  font-size: 18px;
  color: ${COLORS.CORPORATE_BLUE};
  border-top: 1px solid #ccc;
`;

const ToggleWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 16px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: ${({ $active }) => ($active ? `${COLORS.CORPORATE_BLUE}` : '#eaeaea')};
  color: ${({ $active }) => ($active ? '#eaeaea' : `${COLORS.CORPORATE_BLUE}` )};
  transition: background 0.2s;
`;

const CartButtonWrapper = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BucketIcon = styled.img`
  width: 30px;
  height: 30px;
`;

interface CalculatorProps {
  m2PerPack: number;
  packPrice: number;
}

const reserveOptions: { label: string; value: number }[] = [
  { label: 'Без запаса (0%)', value: 0 },
  { label: 'Прямая укладка (5%)', value: 5 },
  { label: '1/2 или 1/3 (8%)', value: 8 },
  { label: 'Диагональная укладка (10%)', value: 10 },
  { label: 'Елочка (12%)', value: 12 },
];

export default function FlooringCalculator({ m2PerPack, packPrice }: CalculatorProps) {
  const [mode, setMode] = useState<'area' | 'packs'>('area');
  const [area, setArea] = useState(5);
  const [reservePercent, setReservePercent] = useState(0);
  const [packsManual, setPacksManual] = useState(1);

  const areaWithReserve = useMemo(
    () => +(area * (1 + reservePercent / 100)).toFixed(3),
    [area, reservePercent]
  );

  const calculatedPacks = useMemo(
    () => Math.ceil(areaWithReserve / m2PerPack),
    [areaWithReserve, m2PerPack]
  );

  const totalPrice = useMemo(() => {
    const packs = mode === 'area' ? calculatedPacks : packsManual;
    return +(packs * packPrice).toFixed(2);
  }, [mode, calculatedPacks, packsManual, packPrice]);

  return (
    <CalculatorWrapper>
      <ToggleWrapper>
        <ToggleButton $active={mode === 'area'} onClick={() => setMode('area')}>
          По площади
        </ToggleButton>
        <ToggleButton $active={mode === 'packs'} onClick={() => setMode('packs')}>
          По упаковкам
        </ToggleButton>
      </ToggleWrapper>

      {mode === 'area' && (
        <>
          <Row>
            <Label>Площадь помещения (м²):</Label>
            <Input
              type="number"
              value={area}
              min={0}
              onChange={(e) => setArea(+e.target.value)}
            />
          </Row>
          <Row>
            <Label>Способ укладки:</Label>
            <CustomSelect
              options={reserveOptions}
              selectedValue={reservePercent}
              onChange={(val) => setReservePercent(val)}
            />
          </Row>
          <Row>
            <Label style={{marginTop: '10px'}}>С учётом запаса:</Label>
            <div>{areaWithReserve} м²</div>
          </Row>
          <Row>
            <Label style={{marginTop: '15px'}}>Необходимое кол-во упаковок:</Label>
            <div>{calculatedPacks} уп.</div>
          </Row>
        </>
      )}

      {mode === 'packs' && (
        <Row>
          <Label>Количество упаковок:</Label>
          <Input
            type="number"
            value={packsManual}
            min={1}
            onChange={(e) => setPacksManual(+e.target.value)}
          />
        </Row>
      )}

      <Result>
        Итого: {totalPrice} ₽
      </Result>

      <CartButtonWrapper>
        <CatalogButtonComponent>
          В корзину  
          <BucketIcon src="/icons/decor-elements/bucket-pink-icon.svg" alt="Bucket" />
        </CatalogButtonComponent>
      </CartButtonWrapper>
    </CalculatorWrapper>
  );
}