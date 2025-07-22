'use client';

import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { WINDOW_WIDTH } from '@/constants';

const SelectWrapper = styled.div`
    position: relative;
    width: 260px;

    @media (${WINDOW_WIDTH.MOBILE}) {
        width: 160px;
    }
`;

const Selected = styled.div`
    padding: 10px 12px;
    background: #eaeaea;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
`;

const Dropdown = styled.ul<{ $open: boolean }>`
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    width: 100%;
    max-height: 240px;
    overflow-y: auto;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    list-style: none;
    padding: 0;
    margin: 0;
    z-index: 10;
    display: ${({ $open }) => ($open ? 'block' : 'none')};
`;

const Option = styled.li`
    padding: 10px 12px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
        background: #f1f1f1;
    }
`;

interface CustomSelectProps {
  options: { label: string; value: number }[];
  selectedValue: number;
  onChange: (value: number) => void;
}

export default function CustomSelect({ options, selectedValue, onChange }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((opt) => opt.value === selectedValue)?.label || '';

  // Закрытие выпадашки при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <SelectWrapper ref={wrapperRef}>
      <Selected onClick={() => setOpen((prev) => !prev)}>
        {selectedLabel}
      </Selected>
      <Dropdown $open={open}>
        {options.map((opt) => (
          <Option key={opt.value} onClick={() => {
            onChange(opt.value);
            setOpen(false);
          }}>
            {opt.label}
          </Option>
        ))}
      </Dropdown>
    </SelectWrapper>
  );
}
