'use client';

import React from 'react';
import styled from 'styled-components';
import { Product, FloorCharacteristic, FloorSize, TechnicalData } from '@/interfaces';
import { COLORS, WIX_MADEFOR_TEXT_WEIGHT } from '@/constants';
import SelectField from './fields/SelectField';
import { SwitcherOptionsDTO } from '@/lib/api/switcherOptions';

const Wrap = styled.div`
  width: 100%;
  max-width: 560px;
  display: grid;
  grid-auto-rows: min-content;
  gap: 10px;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const SectionTitle = styled.h3`
  margin: 8px 0 4px 0;
  font-size: 18px;
  ${WIX_MADEFOR_TEXT_WEIGHT('700')};
  color: ${COLORS.CORPORATE_BLUE};
`;

const Label = styled.label`
  font-size: 14px;
  color: #374151;
  ${WIX_MADEFOR_TEXT_WEIGHT('600')};
`;

const Field = styled.div`
  width: 100%;
  max-width: 560px;
  display: grid;
  grid-template-rows: min-content min-content;
  gap: 6px;
  box-sizing: border-box;
`;

const Input = styled.input`
  width: 100%;
  max-width: 560px;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fafafa;
  outline: none;
  box-sizing: border-box;
  &:focus { background: #fff; border-color: #cbd5e1; }
`;

const TextArea = styled.textarea`
  width: 100%;
  max-width: 560px;
  min-height: 80px;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fafafa;
  outline: none;
  resize: vertical;
  box-sizing: border-box;
  &:focus { background: #fff; border-color: #cbd5e1; }
`;

const FileInput = styled.input`
  width: 100%;
  max-width: 560px;
  display: block;
  box-sizing: border-box;
`;

const PhotoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 4px 0 0 0;
  width: 100%;
  max-width: 560px;
  box-sizing: border-box;
`;

const PhotoItem = styled.li<{ $marked?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  margin-bottom: 6px;
  border: 1px solid ${({ $marked }) => ($marked ? '#e11d48' : '#ddd')};
  border-radius: 8px;
  background: ${({ $marked }) => ($marked ? 'rgba(225, 29, 72, 0.08)' : 'white')};
  color: ${({ $marked }) => ($marked ? '#b91c1c' : 'inherit')};
  box-sizing: border-box;
`;

const PhotoName = styled.span`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`;

const ToggleRemoveBtn = styled.button<{ $marked?: boolean }>`
  flex: 0 0 auto;
  ${WIX_MADEFOR_TEXT_WEIGHT('600')};
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid ${({ $marked }) => ($marked ? '#16a34a' : '#e11d48')};
  color: ${({ $marked }) => ($marked ? '#166534' : '#b91c1c')};
  background: ${({ $marked }) => ($marked ? 'rgba(22, 163, 74, 0.08)' : 'rgba(225, 29, 72, 0.08)')};
  cursor: pointer;
`;

const PrimaryBtn = styled.button`
  background: ${COLORS.CORPORATE_PINK};
  color: #fff;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 12px 14px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  max-width: 560px;
  box-sizing: border-box;
  &:hover { filter: brightness(0.98); }
`;

const SecondaryBtn = styled.button`
  background: #f3f4f6;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  max-width: 560px;
  box-sizing: border-box;
  &:hover { filter: brightness(0.98); }
`;

/* Блок для одной характеристики — просто визуальное разделение */
const CharBlock = styled.div`
  width: 100%;
  max-width: 560px;
  border: 1px dashed #e5e7eb;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
`;

const InlineHint = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: -2px;
`;

type Props = {
  isAdmin: boolean;

  sw: SwitcherOptionsDTO | null;
  loading: boolean;
  err: string | null;

  formData: Partial<Product>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  floorCharacteristics: FloorCharacteristic[];
  setFloorCharacteristics: React.Dispatch<React.SetStateAction<FloorCharacteristic[]>>;
  floorSize: FloorSize;
  setFloorSize: React.Dispatch<React.SetStateAction<FloorSize>>;
  technicalData: TechnicalData;
  setTechnicalData: React.Dispatch<React.SetStateAction<TechnicalData>>;

  coverFile: File | null;
  setCoverFile: (f: File | null) => void;
  photoFiles: File[];
  setPhotoFiles: (f: File[]) => void;
  photosMarked: Set<string>;
  setPhotosMarked: React.Dispatch<React.SetStateAction<Set<string>>>;

  articleRef: React.RefObject<HTMLInputElement | null>;
  toNumberOrUndef: (s: string) => number | undefined;
  fileNameFromPath: (p: string) => string;

  onSubmit: () => void;
  onOpenOptions: () => void;
};

export default function ProductFormView(props: Props) {
  const {
    sw, loading, err,
    formData, setFormData,
    floorCharacteristics, setFloorCharacteristics,
    floorSize, setFloorSize,
    technicalData, setTechnicalData,
    setCoverFile,
    photoFiles, setPhotoFiles,
    photosMarked, setPhotosMarked,
    articleRef, toNumberOrUndef, fileNameFromPath,
    onSubmit, onOpenOptions,
  } = props;

  const existingPhotos = formData.photos || [];

  const setSize = <K extends keyof FloorSize>(key: K, v?: number) =>
    setFloorSize(prev => {
      const next = { ...prev };
      if (v === undefined) delete (next as any)[key];
      else (next as any)[key] = v;
      return next;
    });

  // Можно ли добавлять следующую характеристику
  const canAddCharacteristic = (() => {
    if (floorCharacteristics.length === 0) return true;
    const last = floorCharacteristics[floorCharacteristics.length - 1];
    return Boolean(last.title?.trim() && last.description?.trim());
  })();

  const addCharacteristic = () => {
    if (!canAddCharacteristic) return;
    setFloorCharacteristics(prev => [...prev, { title: '', description: '' }]);
  };

  const updateCharacteristic = (index: number, patch: Partial<FloorCharacteristic>) => {
    setFloorCharacteristics(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  if (loading) return <div>Загрузка списков опций…</div>;
  if (err) return <div style={{ color: 'red' }}>Не удалось загрузить списки опций: {err}</div>;

  return (
    <Wrap>
      <SectionTitle>Карточка товара</SectionTitle>

      <Field>
        <Label>Артикул*</Label>
        <Input
          ref={articleRef as any}
          value={formData.article || ''}
          onChange={(e) => setFormData((p) => ({ ...p, article: e.target.value }))}
        />
      </Field>

      <Field>
        <Label>Название*</Label>
        <Input
          value={formData.name || ''}
          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
        />
      </Field>

      <Field>
        <Label>Расширенное название</Label>
        <Input
          value={formData.title || ''}
          onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
        />
      </Field>

      <SectionTitle>Тип товара</SectionTitle>
      <SelectField
        label=""
        value={formData.type ?? ''}
        onChange={(v) => setFormData((p) => ({ ...p, type: v as Product['type'] }))}
        options={sw?.productTypes ?? []}
        placeholder="— выберите тип —"
      />

      <Field>
        <Label>Цена за м²</Label>
        <Input
          type="number"
          value={formData.priceOfMSqare ?? ''}
          onChange={(e) => setFormData((p) => ({ ...p, priceOfMSqare: toNumberOrUndef(e.target.value) }))}
        />
      </Field>

      <Field>
        <Label>Цена за упаковку</Label>
        <Input
          type="number"
          value={formData.priceOfPack ?? ''}
          onChange={(e) => setFormData((p) => ({ ...p, priceOfPack: toNumberOrUndef(e.target.value) }))}
        />
      </Field>

      <Field>
        <Label>Остаток*</Label>
        <Input
          type="number"
          value={formData.remains ?? ''}
          onChange={(e) => setFormData((p) => ({ ...p, remains: Number(e.target.value || 0) }))}
        />
      </Field>

      <SectionTitle>Медиа</SectionTitle>
      <Field>
        <Label>Обложка (файл){formData.cover ? '' : ' *'}</Label>
        <FileInput type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
      </Field>

      <Field>
        <Label>Доп. фото</Label>
        {existingPhotos.length > 0 && (
          <PhotoList>
            {existingPhotos.map((p) => {
              const marked = photosMarked.has(p);
              return (
                <PhotoItem key={p} $marked={marked}>
                  <PhotoName title={p}>{fileNameFromPath(p)}</PhotoName>
                  <ToggleRemoveBtn
                    type="button"
                    onClick={() =>
                      setPhotosMarked(prev => {
                        const next = new Set(prev);
                        if (next.has(p)) next.delete(p); else next.add(p);
                        return next;
                      })
                    }
                    $marked={marked}
                  >
                    {marked ? 'Отменить' : 'Удалить'}
                  </ToggleRemoveBtn>
                </PhotoItem>
              );
            })}
          </PhotoList>
        )}
        <FileInput type="file" multiple accept="image/*" onChange={(e) => setPhotoFiles(Array.from(e.target.files || []))} />
      </Field>

      <Field>
        <Label>Описание (каждый факт с новой строки)</Label>
        <TextArea
          value={(formData.description || []).join('\n')}
          onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value.split('\n') }))}
          rows={4}
        />
      </Field>

      {/* Характеристики пола */}
      <SectionTitle>Характеристики пола</SectionTitle>
      {floorCharacteristics.map((fc, idx) => (
        <CharBlock key={idx}>
          <Field>
            <Label>Заголовок*</Label>
            <Input
              value={fc.title}
              onChange={(e) => updateCharacteristic(idx, { title: e.target.value })}
              placeholder="Например: Назначение"
            />
          </Field>
          <Field>
            <Label>Описание*</Label>
            <Input
              value={fc.description}
              onChange={(e) => updateCharacteristic(idx, { description: e.target.value })}
              placeholder="Например: Для жилых помещений"
            />
          </Field>
        </CharBlock>
      ))}
      <SecondaryBtn
        type="button"
        onClick={addCharacteristic}
        disabled={!canAddCharacteristic}
        title={!canAddCharacteristic ? 'Заполните предыдущую характеристику, чтобы добавить новую' : ''}
      >
        Добавить характеристику
      </SecondaryBtn>
      {!canAddCharacteristic && (
        <InlineHint>Заполните «Заголовок» и «Описание» у последнего элемента, затем можно добавить следующий.</InlineHint>
      )}

      <SectionTitle>Размеры</SectionTitle>
      <SelectField
        label="Длина (мм)"
        value={floorSize.length !== undefined ? String(floorSize.length) : ''}
        onChange={(v) => setSize('length', v ? Number(v) : undefined)}
        options={sw?.lengths ?? []}
        placeholder="— выберите —"
      />
      <SelectField
        label="Ширина (мм)"
        value={floorSize.width !== undefined ? String(floorSize.width) : ''}
        onChange={(v) => setSize('width', v ? Number(v) : undefined)}
        options={sw?.widths ?? []}
        placeholder="— выберите —"
      />
      <SelectField
        label="Высота (мм)"
        value={floorSize.height !== undefined ? String(floorSize.height) : ''}
        onChange={(v) => setSize('height', v ? Number(v) : undefined)}
        options={sw?.heights ?? []}
        placeholder="— выберите —"
      />
      <Field>
        <Label>м² / упаковка</Label>
        <Input
          type="number"
          value={floorSize.mSqareOfPack ?? ''}
          onChange={(e) => setSize('mSqareOfPack', e.target.value ? Number(e.target.value) : undefined)}
        />
      </Field>
      <Field>
        <Label>штук / упаковка</Label>
        <Input
          type="number"
          value={floorSize.countOfPack ?? ''}
          onChange={(e) => setSize('countOfPack', e.target.value ? Number(e.target.value) : undefined)}
        />
      </Field>

      <SectionTitle>Технические данные</SectionTitle>
      <SelectField
        label="Производитель"
        value={technicalData.manufacturer ?? ''}
        onChange={(v) => setTechnicalData((p) => ({ ...p, manufacturer: v || undefined }))}
        options={sw?.manufacturers ?? []}
        placeholder="— выберите —"
      />
      <SelectField
        label="Коллекция"
        value={technicalData.collection ?? ''}
        onChange={(v) => setTechnicalData((p) => ({ ...p, collection: v || undefined }))}
        options={sw?.collections ?? []}
        placeholder="— выберите —"
      />
      <SelectField
        label="Цвет"
        value={technicalData.color ?? ''}
        onChange={(v) => setTechnicalData((p) => ({ ...p, color: v || undefined }))}
        options={sw?.colors ?? []}
        placeholder="— выберите —"
      />
      <SelectField
        label="Количество фасок"
        value={technicalData.chamfersCount ?? ''}
        onChange={(v) => setTechnicalData((p) => ({ ...p, chamfersCount: v || undefined }))}
        options={sw?.chamfersCount ?? []}
        placeholder="— выберите —"
      />
      <SelectField
        label="Тип фаски"
        value={technicalData.chamfersType ?? ''}
        onChange={(v) => setTechnicalData((p) => ({ ...p, chamfersType: v || undefined }))}
        options={sw?.chamfersType ?? []}
        placeholder="— выберите —"
      />
      <SelectField
        label="Тип соединения"
        value={technicalData.typeOfConnection ?? ''}
        onChange={(v) => setTechnicalData((p) => ({ ...p, typeOfConnection: v || undefined }))}
        options={sw?.typeOfConnection ?? []}
        placeholder="— выберите —"
      />
      <SelectField
        label="Подогрев полов"
        value={technicalData.compatibilityWithHeating ?? ''}
        onChange={(v) => setTechnicalData((p) => ({ ...p, compatibilityWithHeating: v || undefined }))}
        options={sw?.compatibilityWithHeating ?? []}
        placeholder="— выберите —"
      />
      <SelectField
        label="Влагостойкость"
        value={technicalData.waterResistance ?? ''}
        onChange={(v) => setTechnicalData((p) => ({ ...p, waterResistance: v || undefined }))}
        options={sw?.waterResistance ?? []}
        placeholder="— выберите —"
      />
      <SelectField
        label="Класс износостойкости"
        value={technicalData.wearResistanceClass ?? ''}
        onChange={(v) => setTechnicalData((p) => ({ ...p, wearResistanceClass: v || undefined }))}
        options={sw?.wearResistanceClass ?? []}
        placeholder="— выберите —"
      />
      <SelectField
        label="Гарантия"
        value={technicalData.assurance ?? ''}
        onChange={(v) => setTechnicalData((p) => ({ ...p, assurance: v || undefined }))}
        options={sw?.assurance ?? []}
        placeholder="— выберите —"
      />
      <SelectField
        label="Вид под"
        value={technicalData.lookLike ?? ''}
        onChange={(v) => setTechnicalData((p) => ({ ...p, lookLike: v || undefined }))}
        options={sw?.lookLike ?? []}
        placeholder="— выберите —"
      />

      <Field>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={!formData.isVisible}
            onChange={(e) => setFormData((p) => ({ ...p, isVisible: !e.target.checked }))}
          />
          Скрыть товар
        </label>
      </Field>

      <SecondaryBtn type="button" onClick={onOpenOptions}>
        Настроить списки опций
      </SecondaryBtn>

      <PrimaryBtn onClick={onSubmit}>
        {formData.article ? 'Сохранить' : 'Создать'}
      </PrimaryBtn>
    </Wrap>
  );
}
