'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Product, FloorCharacteristic, FloorSize, TechnicalData } from '@/interfaces';
import { COLORS } from '@/constants';
import { useSwitcherOptions } from './useSwitcherOptions';
import SwitcherOptionsEditor from '@/components/admin/SwitcherOptionsEditor';
import ProductFormView from './ProductFormView';
import { SwitcherOptionsDTO } from '@/lib/api/switcherOptions';

const Shell = styled.div`
  width: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 12px;
  box-sizing: border-box;
  overflow-x: hidden;
`;

/* Контейнер для сужения контента до ~560px внутри модалки 600px (+ padding 20px) */
const Constrain = styled.div`
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  box-sizing: border-box;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const TabButton = styled.button<{ $active?: boolean }>`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${({ $active }) => ($active ? 'transparent' : '#e5e7eb')};
  background: ${({ $active }) => ($active ? COLORS.CORPORATE_PINK : '#f9fafb')};
  color: ${({ $active }) => ($active ? '#fff' : '#374151')};
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;

  &:hover { filter: brightness(0.98); }
`;

type Props = {
  isAdmin: boolean;
  productToEdit?: Product;
};

type Tab = 'product' | 'options';

function normalizeFloorSize(raw: any): FloorSize {
  if (!raw) return {};
  const out: FloorSize = {};
  (['length','width','height','mSqareOfPack','countOfPack'] as (keyof FloorSize)[]).forEach((k) => {
    const v = raw[k];
    if (v !== undefined && v !== null && v !== '') {
      const n = Number(v);
      if (!Number.isNaN(n)) (out as any)[k] = n;
    }
  });
  return out;
}
function normalizeTechnicalData(raw: any): TechnicalData {
  if (!raw) return {};
  const out: TechnicalData = {};
  ([
    'manufacturer','collection','color','chamfersCount','chamfersType',
    'typeOfConnection','compatibilityWithHeating','waterResistance',
    'wearResistanceClass','assurance','lookLike',
  ] as (keyof TechnicalData)[]).forEach((k) => {
    const v = raw[k];
    if (v !== undefined && v !== null) (out as any)[k] = String(v);
  });
  return out;
}
const toNumberOrUndef = (s: string) => {
  if (!s) return undefined;
  const n = Number(s);
  return Number.isNaN(n) ? undefined : n;
};
const fileNameFromPath = (p: string) => {
  try {
    const parts = p.split('/');
    return parts[parts.length - 1] || p;
  } catch { return p; }
};

export default function ProductModalContent({ isAdmin, productToEdit }: Props) {
  const [tab, setTab] = useState<Tab>('product');

  // возвращает { data: SwitcherOptionsDTO | null, loading: boolean, err: string | null, setData: (v)=>void }
  const { data: sw, loading, err, setData } = useSwitcherOptions();

  const [formData, setFormData] = useState<Partial<Product>>({ type: 'laminat', isVisible: true });
  const [floorCharacteristics, setFloorCharacteristics] = useState<FloorCharacteristic[]>([]);
  const [floorSize, setFloorSize] = useState<FloorSize>({});
  const [technicalData, setTechnicalData] = useState<TechnicalData>({});
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photosMarked, setPhotosMarked] = useState<Set<string>>(new Set());
  const articleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!productToEdit) return;
    setFormData({ ...productToEdit });
    setFloorCharacteristics(productToEdit.floorCharacteristics || []);
    setFloorSize(normalizeFloorSize(productToEdit.floorSize));
    setTechnicalData(normalizeTechnicalData(productToEdit.technicalData));
    setPhotosMarked(new Set());
  }, [productToEdit]);

  const handleFileUpload = async (): Promise<{ coverPath: string | null; photoPaths: string[] } | null> => {
    if (!isAdmin) { alert('Нет прав'); return null; }
    if (!formData.article) { alert('Сначала укажите артикул'); return null; }

    let coverPath: string | null = null;
    const photoPaths: string[] = [];

    if (coverFile) {
      const fd = new FormData();
      fd.append('file', coverFile);
      fd.append('type', 'cover');
      fd.append('article', formData.article);
      const r = await fetch('/api/products/upload', { method: 'POST', body: fd });
      const j = await r.json().catch(() => ({} as any));
      if (!r.ok || !j.path) { alert('Ошибка при загрузке обложки'); return null; }
      coverPath = j.path;
    }

    if (photoFiles.length) {
      for (const ph of photoFiles) {
        const fd = new FormData();
        fd.append('file', ph);
        fd.append('type', 'photos');
        fd.append('article', formData.article);
        const r = await fetch('/api/products/upload', { method: 'POST', body: fd });
        const j = await r.json().catch(() => ({} as any));
        if (!r.ok || !j.path) { alert('Ошибка при загрузке одного из фото'); return null; }
        photoPaths.push(j.path);
      }
    }

    return { coverPath, photoPaths };
  };

  const handleSubmit = async () => {
    if (!formData.article || !formData.name || !formData.remains) {
      alert('Пожалуйста, заполните обязательные поля: артикул, название, остаток');
      return;
    }

    let coverPath = formData.cover || null;
    let uploadedPhotoPaths: string[] = [];

    const uploaded = await handleFileUpload();
    if (uploaded === null) return;
    if (uploaded.coverPath) coverPath = uploaded.coverPath;

    const existing = formData.photos || [];
    const keptExisting = existing.filter((p) => !photosMarked.has(p));
    uploadedPhotoPaths = uploaded.photoPaths?.length ? [...keptExisting, ...uploaded.photoPaths] : keptExisting;

    const payload: Product = {
      ...(formData as Product),
      cover: coverPath!,
      photos: uploadedPhotoPaths,
      floorCharacteristics,
      floorSize,
      technicalData,
    };

    const isEdit = Boolean(productToEdit);
    const url = isEdit ? `/api/products/${productToEdit!.article}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      alert(isEdit ? 'Продукт обновлён' : 'Продукт создан');
      setPhotosMarked(new Set());
      setPhotoFiles([]);
      setCoverFile(null);
    } else {
      const j = await res.json().catch(() => ({}));
      alert(`Ошибка: ${j.error || 'неизвестная'}`);
    }
  };

  return (
    <Shell>
      <Constrain>
        <Tabs>
          <TabButton $active={tab === 'product'} onClick={() => setTab('product')}>Товар</TabButton>
          <TabButton $active={tab === 'options'} onClick={() => setTab('options')}>Опции фильтров</TabButton>
        </Tabs>
      </Constrain>

      <Constrain>
        {tab === 'product' && (
          <ProductFormView
            isAdmin={isAdmin}
            sw={sw as SwitcherOptionsDTO | null}
            loading={loading}
            err={err}
            formData={formData}
            setFormData={setFormData}
            floorCharacteristics={floorCharacteristics}
            setFloorCharacteristics={setFloorCharacteristics}
            floorSize={floorSize}
            setFloorSize={setFloorSize}
            technicalData={technicalData}
            setTechnicalData={setTechnicalData}
            coverFile={coverFile}
            setCoverFile={setCoverFile}
            photoFiles={photoFiles}
            setPhotoFiles={setPhotoFiles}
            photosMarked={photosMarked}
            setPhotosMarked={setPhotosMarked}
            articleRef={articleRef}
            toNumberOrUndef={toNumberOrUndef}
            fileNameFromPath={fileNameFromPath}
            onSubmit={handleSubmit}
            onOpenOptions={() => setTab('options')}
          />
        )}

        {tab === 'options' && (
          loading ? (
            <div>Загрузка списков опций…</div>
          ) : err || !sw ? (
            <div style={{ color: 'red' }}>Не удалось загрузить списки опций{err ? `: ${err}` : ''}</div>
          ) : (
            <SwitcherOptionsEditor value={sw} onChange={setData} />
          )
        )}
      </Constrain>
    </Shell>
  );
}
