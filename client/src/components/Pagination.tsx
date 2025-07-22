'use client';

import styled from "styled-components";
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";

const PaginationWrapper = styled.div`
    // border: 1px solid black;
    width: 100%;
    height: 100px;
    margin: 20px 0 0 0;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (${WINDOW_WIDTH.MOBILE}) {
        margin: 10px 0 0 0;
        justify-content: center;
    }
`;

const PageItem = styled.div<{ $active?: boolean; $arrow?: boolean }>`
    box-sizing: border-box;
    cursor: pointer;
    min-width: 36px;
    height: 36px;
    border-radius: 50%;
    margin: 0 5px;
    padding: ${({ $arrow }) => ($arrow ? '0 0 4px 0' : '0')};
    background-color: ${({ $active }) => ($active ? COLORS.CORPORATE_BLUE : COLORS.CORPORATE_GRAY)};
    color: ${({ $active }) => ($active ? COLORS.CORPORATE_GRAY : COLORS.CORPORATE_BLUE)};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${({ $arrow }) => ($arrow ? '24px' : '14px')};
    ${WIX_MADEFOR_TEXT_WEIGHT('500')};
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
    user-select: none;


    transition: background-color 0.4s, color 0.4s;

    ${({ $arrow }) =>
        $arrow &&
        `
        &:hover {
            background-color: ${COLORS.CORPORATE_BLUE};
            color: ${COLORS.CORPORATE_GRAY};
        }
    `}
`;

const Ellipsis = styled.div`
    min-width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
`;

export default function PaginationComponent({
    allPages,
    currentPage,
    onPageChange,
}: {
    allPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}) {
    const pages = [];

    // ← prev button
    pages.push(
    <PageItem
        key="prev"
        $arrow
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
    >
        ‹
    </PageItem>
);

    // Always show first page
    pages.push(
        <PageItem key={1} $active={currentPage === 1} onClick={() => onPageChange(1)}>
            1
        </PageItem>
    );

    // Left ellipsis
    if (currentPage > 4) {
        pages.push(<Ellipsis key="left-ellipsis">...</Ellipsis>);
    }

    // Pages around current
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(allPages - 1, currentPage + 2);

    for (let i = start; i <= end; i++) {
        pages.push(
            <PageItem key={i} $active={i === currentPage} onClick={() => onPageChange(i)}>
                {i}
            </PageItem>
        );
    }

    // Right ellipsis
    if (currentPage < allPages - 3) {
        pages.push(<Ellipsis key="right-ellipsis">...</Ellipsis>);
    }

    // Always show last page
    if (allPages > 1) {
        pages.push(
            <PageItem key={allPages} $active={currentPage === allPages} onClick={() => onPageChange(allPages)}>
                {allPages}
            </PageItem>
        );
    }

    // → next button
    pages.push(
    <PageItem
        key="next"
        $arrow
        onClick={() => currentPage < allPages && onPageChange(currentPage + 1)}
    >
        ›
    </PageItem>
);

    return <PaginationWrapper>{pages}</PaginationWrapper>;
}