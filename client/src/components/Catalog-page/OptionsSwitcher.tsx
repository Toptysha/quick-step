'use client';

import styled from "styled-components";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { ProductOptionSelect, ProductOptionsSwitcher } from "@/interfaces";

const SwitchersWrapper = styled.div`
    width: 300px;
    height: 100%;
`;

const SwitcherBlock = styled.div`
    position: relative;
    cursor: pointer;
    width: 100%;
    margin: 0 0 20px 0;
    border-radius: 24px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    color: ${COLORS.CORPORATE_BLUE};
    font-size: 16px;
    ${WIX_MADEFOR_TEXT_WEIGHT('500')};
    letter-spacing: -0.5px;
`;

const SwitcherTitle = styled.div`
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Arrow = styled.span<{ open: boolean }>`
    display: inline-block;
    transition: transform 0.3s ease;
    transform: rotate(${({ open }) => (open ? '180deg' : '0deg')});
    color: ${COLORS.CORPORATE_PINK};
    font-size: 22px;
`;

const DropdownWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'maxHeight',
})<{ maxHeight: number }>`
  overflow: hidden;
  max-height: ${({ maxHeight }) => `${maxHeight}px`};
  transition: max-height 0.4s ease;
`;

const Dropdown = styled.div<{ $open?: boolean }>`
    background: ${COLORS.CORPORATE_GRAY};
    padding: ${({ $open }) => ($open ? '10px' : '0 10px')};
    border-radius: 24px;
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    transition: padding 0.4s ease, opacity 0.4s ease;
`;

const RadioItem = styled.label`
    display: flex;
    align-items: center;
    margin: 0 0 8px 5px;
    font-size: 14px;
    cursor: pointer;
    user-select: none;

    input {
        display: none;
    }
`;

const OuterSquare = styled.div<{ $checked: boolean }>`
    width: 18px;
    height: 18px;
    min-width: 18px;
    min-height: 18px;
    margin-right: 8px;
    border-radius: 6px;
    border: 2px solid ${({ $checked }) =>
        $checked ? COLORS.CORPORATE_BLUE : '#bbb'};
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    transition: border-color 0.2s ease;

    ${RadioItem}:hover & {
        border-color: ${({ $checked }) =>
            $checked ? COLORS.CORPORATE_BLUE : COLORS.CORPORATE_BLUE};
    }
`;

const InnerSquare = styled.div<{ $checked: boolean }>`
    width: 10px;
    height: 10px;
    border-radius: 3px;
    background-color: ${({ $checked }) =>
        $checked ? COLORS.CORPORATE_BLUE : 'transparent'};
    transition: background-color 0.2s ease;
`;

type SwitcherProps = {
    productOptions: ProductOptionsSwitcher;
    selectedValue?: string;
    onSelect: (name: string, value: string) => void;
};

function Switcher({ productOptions, selectedValue, onSelect }: SwitcherProps) {
    const [open, setOpen] = useState(false);
    const [maxHeight, setMaxHeight] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setOpen(prev => !prev);
    };

    useEffect(() => {
        if (open && dropdownRef.current) {
            setMaxHeight(dropdownRef.current.scrollHeight + 50);
        } else {
            setMaxHeight(0);
        }
    }, [open]);

    const handleChange = (value: string) => {
        if (value === selectedValue) {
            onSelect(productOptions.name, ''); // снимаем выбор
        } else {
            onSelect(productOptions.name, value); // новый выбор
        }
    };

    return (
        <SwitcherBlock>
            <SwitcherTitle onClick={toggleDropdown}>
                {/* <span>{productOptions.name}{selectedValue ? `: ${selectedValue}` : ''}</span> */}
                <span>{productOptions.name}</span>
                <Arrow open={open}>▼</Arrow>
            </SwitcherTitle>

            <DropdownWrapper maxHeight={maxHeight}>
                <Dropdown ref={dropdownRef} $open={open}>
                    {productOptions.values.map((variant, idx) => (
                        <RadioItem key={idx}>
                            <input
                                type="checkbox"
                                checked={selectedValue === variant}
                                onChange={() =>
                                    handleChange(
                                        selectedValue === variant ? '' : variant
                                    )
                                }
                                id={`custom-radio-${productOptions.name}-${idx}`}
                            />
                            <OuterSquare $checked={selectedValue === variant}>
                                <InnerSquare $checked={selectedValue === variant} />
                            </OuterSquare>
                            <span>{variant}</span>
                        </RadioItem>
                    ))}
                </Dropdown>
            </DropdownWrapper>
        </SwitcherBlock>
    );
}

export default function OptionsSwitcher({switchers, selected, setSelected}: {
    switchers: ProductOptionsSwitcher[];
    selected: ProductOptionSelect[]
    setSelected: Dispatch<SetStateAction<ProductOptionSelect[]>>
}) {

    const handleSelect = (name: string, value: string) => {
        setSelected(prev => {
            const filtered = prev.filter(item => item.name !== name);
            return value ? [...filtered, { name, value }] : filtered;
        });
    };

    return (
        <SwitchersWrapper>
            {switchers.map((switcher, i) => {
                const current = selected.find(sel => sel.name === switcher.name);
                return (
                    <Switcher
                        key={`switcher-${i}`}
                        productOptions={switcher}
                        selectedValue={current?.value}
                        onSelect={handleSelect}
                    />
                );
            })}
        </SwitchersWrapper>
    );
}
