"use client";
import styled from "styled-components";

const SelectEl = styled.select`
  padding: 8px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 95%;
  background: #fff;
`;

type Props = {
  label: string;
  value: string | undefined | null;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string; // показываем пустой вариант
};

export default function SelectField({ label, value, onChange, options, placeholder }: Props) {
  return (
    <label style={{ display: "block" }}>
      {label}
      <SelectEl value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder ?? "— не выбрано —"}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </SelectEl>
    </label>
  );
}
