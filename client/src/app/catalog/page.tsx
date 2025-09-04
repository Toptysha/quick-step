'use client';

import styled from 'styled-components';
import { CategoryComponent, ProductComponent } from '@/components';
import { WINDOW_WIDTH, COLORS } from '@/constants';
import { useCheckAuth, useCloseLoader } from '@/hooks';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Product, ProductOptionSelect, ProductOptionsSwitcher } from '@/interfaces';

type SwitcherOptions = {
  productTypes: string[];
  manufacturers: string[];
  collections: string[];
  colors: string[];
  chamfersCount: string[];
  chamfersType: string[];
  typeOfConnection: string[];
  compatibilityWithHeating: string[];
  waterResistance: string[];
  wearResistanceClass: string[];
  assurance: string[];
  lookLike: string[];
  lengths: string[];
  widths: string[];
  heights: string[];
  sortings?: string[];
};

type ProductsResponse = {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

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

const SearchBar = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  margin: 30px 0 20px 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fafafa;
  outline: none;
  &:focus { background: #fff; border-color: #cbd5e1; }
`;

const SearchBtn = styled.button`
  background: ${COLORS.CORPORATE_PINK};
  color: #fff;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
  &:hover { filter: brightness(0.98); }
`;

const FIELD_LABELS = {
  manufacturers: 'Производитель',
  collections: 'Коллекция',
  colors: 'Цвет',
  chamfersCount: 'Количество фасок',
  chamfersType: 'Тип фаски',
  typeOfConnection: 'Тип соединения',
  compatibilityWithHeating: 'Подогрев полов',
  waterResistance: 'Водостойкость',
  wearResistanceClass: 'Класс износостойкости',
  assurance: 'Гарантия',
  lookLike: 'Вид под',
  lengths: 'Длина (мм)',
  widths: 'Ширина (мм)',
  heights: 'Толщина (мм)',
} as const;

function buildSwitchersFromOptions(sw: SwitcherOptions | null | undefined): ProductOptionsSwitcher[] {
  if (!sw) return [];
  const out: ProductOptionsSwitcher[] = [];
  (Object.keys(FIELD_LABELS) as Array<keyof typeof FIELD_LABELS>).forEach((key) => {
    const arr = (sw as any)[key] as string[] | undefined;
    if (Array.isArray(arr) && arr.length) out.push({ name: FIELD_LABELS[key], values: arr.slice() });
  });
  return out;
}

function buildSortingSwitchers(sw: SwitcherOptions | null | undefined): ProductOptionsSwitcher[] {
  const vals = sw?.sortings?.length ? sw.sortings : ['стандартная', 'по возрастанию цены', 'по убыванию цены'];
  return [{ name: 'Сортировка', values: vals }];
}

const NAME_TO_PARAM: Record<string, string> = {
  'Производитель': 'manufacturers',
  'Коллекция': 'collections',
  'Цвет': 'colors',
  'Количество фасок': 'chamfersCount',
  'Тип фаски': 'chamfersType',
  'Тип соединения': 'typeOfConnection',
  'Подогрев полов': 'compatibilityWithHeating',
  'Водостойкость': 'waterResistance',
  'Класс износостойкости': 'wearResistanceClass',
  'Гарантия': 'assurance',
  'Вид под': 'lookLike',
  'Длина (мм)': 'lengths',
  'Ширина (мм)': 'widths',
  'Толщина (мм)': 'heights',
};

function mapSortValue(v?: string): 'standard' | 'price_asc' | 'price_desc' {
  switch ((v || '').toLowerCase()) {
    case 'по возрастанию цены': return 'price_asc';
    case 'по убыванию цены':    return 'price_desc';
    default:                    return 'standard';
  }
}

export default function Catalog() {
  useCloseLoader();
  const isAdmin = useCheckAuth();

  const router = useRouter();
  const searchParams = useSearchParams()!;

  // query из URL (чтобы работали прямые переходы /catalog?q=...)
  const initialQ = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<Product['type']>('laminat');
  const [selected, setSelected] = useState<ProductOptionSelect[]>([]);
  const [sortingMethod, setSortingMethod] = useState<ProductOptionSelect[]>([{ name: 'Сортировка', value: 'стандартная' }]);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page') || 1));

  const [products, setProducts] = useState<ProductsResponse | null>(null);
  const [sw, setSw] = useState<SwitcherOptions | null>(null);

  // локальная строка поиска в каталоге (отражает URL q)
  const [q, setQ] = useState(initialQ);

  const pageSize = 9;
  const sortKey = mapSortValue(sortingMethod[0]?.value);

  // подтянуть SwitcherOptions
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/switcher-options');
        const j = await r.json();
        setSw(j);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // если меняется URL (?q=...), синхронизируем поле
  useEffect(() => {
    setQ(searchParams.get('q') || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]);

  // собрать параметры запроса к /api/products
  function buildQuery(page: number) {
    const p = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      sort: sortKey,
      type: selectedCategory,
    });

    if (q.trim()) p.set('q', q.trim());

    selected.forEach(({ name, value }) => {
      const key = NAME_TO_PARAM[name];
      if (!key || !value) return;
      p.append(key, value);
    });

    return p;
  }

  async function fetchProducts(page = 1) {
    const params = buildQuery(page);
    const res = await fetch(`/api/products?${params.toString()}`);
    const data = (await res.json()) as ProductsResponse;
    setProducts(data);
  }

  // первичная загрузка и реакция на изменения
  useEffect(() => {
    fetchProducts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortKey, selectedCategory, JSON.stringify(selected), q]);

  const switchers = useMemo(() => buildSwitchersFromOptions(sw), [sw]);
  const sorting = useMemo(() => buildSortingSwitchers(sw), [sw]);

  const items: Product[] = products?.items ?? [];

  // применить поиск (меняем URL и сбрасываем пагинацию)
  const applySearch = () => {
    const usp = new URLSearchParams(searchParams);
    if (q.trim()) usp.set('q', q.trim());
    else usp.delete('q');
    usp.set('page', '1');
    router.push(`/catalog?${usp.toString()}`);
    setCurrentPage(1);
  };

  return (
    <BodyWrapper>
      <BodyWrapperMini>

        <CategoryComponent
          selectedCategory={selectedCategory}
          setSelectedCategory={(t) => { setSelectedCategory(t); setCurrentPage(1); }}
        />

        <SearchBar>
          <SearchInput
            placeholder="Поиск по каталогу…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applySearch()}
          />
          <SearchBtn onClick={applySearch}>Искать</SearchBtn>
        </SearchBar>

        <ProductComponent
          isAdmin={isAdmin}
          switchers={switchers}
          selected={selected}
          setSelected={(v) => { setSelected(v); setCurrentPage(1); }}

          sorting={sorting}
          sortingMethod={sortingMethod}
          setSortingMethod={(v) => { setSortingMethod(v); setCurrentPage(1); }}

          products={items}
          allPages={products?.totalPages ?? 1}
          currentPage={products?.page ?? 1}
          onPageChange={(page) => setCurrentPage(page)}
          onProductDeleted={() => fetchProducts(currentPage)}
        />
      </BodyWrapperMini>
    </BodyWrapper>
  );
}
