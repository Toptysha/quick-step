'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from '@/constants';

type Variant = 'generic' | 'product';

type Props = {
  /** Вид страницы: общая 404 или "товар не найден" */
  variant?: Variant;
  /** Что искали (для product-режима можно подсветить артикул/название) */
  query?: string;
};

const Wrap = styled.section`
  width: 100%;
  max-width: 960px;
  margin: 48px auto;
  padding: 24px;
  box-sizing: border-box;
  display: grid;
  gap: 18px;
  justify-items: start;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 10px rgba(16, 24, 40, 0.08);

  @media (${WINDOW_WIDTH.MOBILE}) {
    margin: 12px auto;
    padding: 16px;
    gap: 14px;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  line-height: 1.25;
  color: #0f172a;
  ${WIX_MADEFOR_TEXT_WEIGHT('700')};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 16px;
  color: #475569;
`;

const Card = styled.div`
  width: 100%;
  background: #f8fafc;
  border: 1px dashed #e2e8f0;
  color: #334155;
  border-radius: 12px;
  padding: 14px 16px;
  box-sizing: border-box;
`;

const Hint = styled.p`
  margin: 0;
  font-size: 14px;
  color: #475569;
`;

const Row = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 10px;

  @media (${WINDOW_WIDTH.MOBILE}) {
    grid-auto-flow: row;
  }
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 12px 16px;
  border-radius: 12px;
  ${WIX_MADEFOR_TEXT_WEIGHT('700')};
  font-size: 14px;
  text-decoration: none;
  text-align: center;
  border: 1px solid transparent;
  background: ${COLORS.CORPORATE_PINK};
  color: #fff;

  &:hover {
    filter: brightness(0.97);
  }
`;

const Ghost = styled(Link)`
  display: inline-block;
  padding: 12px 16px;
  border-radius: 12px;
  ${WIX_MADEFOR_TEXT_WEIGHT('600')};
  font-size: 14px;
  text-decoration: none;
  text-align: center;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #0f172a;

  &:hover {
    background: #f9fafb;
  }
`;

export default function NotFound({ variant = 'generic', query }: Props) {
  const isProduct = variant === 'product';

  return (
    <Wrap>
      <Title>
        {isProduct ? 'Товар не найден' : 'Страница не найдена'}
      </Title>

      <Subtitle>
        {isProduct
          ? 'Мы не нашли товар с указанными параметрами. Возможно, он был переименован, временно скрыт или удалён.'
          : 'Похоже, вы перешли по неверной ссылке или страница была удалена.'}
      </Subtitle>

      {isProduct && query && (
        <Card>
          <Hint>
            Искомый запрос: <b>{query}</b>
          </Hint>
        </Card>
      )}

      <Row>
        <Button href="/">На главную</Button>
        <Ghost href="/catalog">Перейти в каталог</Ghost>
        {isProduct && query ? (
          <Ghost href={`/catalog?search=${encodeURIComponent(query)}`}>
            Найти похожие
          </Ghost>
        ) : null}
      </Row>
    </Wrap>
  );
}
