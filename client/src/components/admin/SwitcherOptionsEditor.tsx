"use client";

import { useState } from "react";
import styled from "styled-components";
import { COLORS, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { addSwitcherValue, removeSwitcherValue, SwitcherOptionsDTO } from "@/lib/api/switcherOptions";

const Wrap = styled.div`
  width: 640px;
  max-width: 100%;
  display: grid;
  gap: 14px;
`;

const Title = styled.h3`
  margin: 0 0 6px 0;
  color: ${COLORS.CORPORATE_BLUE};
  ${WIX_MADEFOR_TEXT_WEIGHT("700")};
`;

const Block = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  margin: 4px;
  border-radius: 8px;
  background: #f3f4f6;
  font-size: 12px;
`;

const Remove = styled.button`
  border: none;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 6px;
  padding: 2px 6px;
  cursor: pointer;
`;

type Props = {
  value: SwitcherOptionsDTO;
  onChange: (next: SwitcherOptionsDTO) => void;
};

const GROUPS: Array<{ key: keyof SwitcherOptionsDTO; title: string }> = [
  { key: "productTypes", title: "Тип товара" },
  { key: "manufacturers", title: "Производитель" },
  { key: "collections", title: "Коллекция" },
  { key: "colors", title: "Цвет" },
  { key: "chamfersCount", title: "Количество фасок" },
  { key: "chamfersType", title: "Тип фаски" },
  { key: "typeOfConnection", title: "Тип соединения" },
  { key: "compatibilityWithHeating", title: "Совместим с подогревом" },
  { key: "waterResistance", title: "Влагостойкость" },
  { key: "wearResistanceClass", title: "Класс износостойкости" },
  { key: "assurance", title: "Гарантия" },
  { key: "lookLike", title: "Вид под" },
  { key: "lengths", title: "Длина (мм)" },
  { key: "widths", title: "Ширина (мм)" },
  { key: "heights", title: "Высота (мм)" },
];

export default function SwitcherOptionsEditor({ value, onChange }: Props) {
  const [pending, setPending] = useState<Record<string, string>>({});

  const add = async (field: keyof SwitcherOptionsDTO) => {
    const v = (pending[field] ?? "").trim();
    if (!v) return;
    const next = await addSwitcherValue(field, v);
    onChange(next);
    setPending((p) => ({ ...p, [field]: "" }));
  };

  const remove = async (field: keyof SwitcherOptionsDTO, v: string) => {
    const next = await removeSwitcherValue(field, v);
    onChange(next);
  };

  return (
    <Wrap>
      <Title>Настройка списков опций</Title>

      {GROUPS.map(({ key, title }) => (
        <Block key={String(key)}>
          <strong>{title}</strong>
          <div style={{ marginTop: 8 }}>
            {(value[key] as string[]).map((opt) => (
              <Badge key={opt}>
                {opt}
                <Remove onClick={() => remove(key, opt)}>×</Remove>
              </Badge>
            ))}
          </div>

          <Row style={{ marginTop: 8 }}>
            <Input
              placeholder="Добавить значение…"
              value={pending[key] ?? ""}
              onChange={(e) => setPending((p) => ({ ...p, [key]: e.target.value }))}
            />
            <button onClick={() => add(key)}>Добавить</button>
          </Row>
        </Block>
      ))}
    </Wrap>
  );
}
