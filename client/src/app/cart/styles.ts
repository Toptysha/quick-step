// app/cart/styles.ts
import styled, { css, keyframes } from 'styled-components';

export const PageWrap = styled.main`
  padding: 24px 0 64px;
  background: #fafafa;
  min-height: 100vh;
`;

export const Container = styled.div`
  width: min(1120px, 100%);
  margin: 0 auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const TitleRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 8px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.2px;
  }

  span {
    color: #6b7280;
    font-size: 14px;
  }
`;

export const LeftCol = styled.section`
  display: grid;
  gap: 16px;
`;

export const RightCol = styled.aside`
  position: sticky;
  top: 16px;
  align-self: start;

  @media (max-width: 960px) {
    position: static;
  }
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.08);
  padding: 8px 16px;
`;

export const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 160px;
  gap: 12px;
  padding: 12px 0;
  align-items: center;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

export const ItemInfo = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 12px;
  align-items: center;
`;

export const Thumb = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 12px;
  background: #f3f4f6;
  border: 1px solid #eef2ff;
  position: relative;
  overflow: hidden;
`;

export const ThumbImgWrap = styled.div`
  position: absolute;
  inset: 0;
  img { object-fit: cover; }
`;

/* Скелетон-заглушка для фото/текста */
const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

export const Skeleton = styled.div<{ width?: number; height?: number }>`
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  height: ${({ height }) => (height ? `${height}px` : '100%')};
  border-radius: 8px;
  background: #eee;
  background-image: linear-gradient(90deg, #eee 0px, #f5f5f5 40px, #eee 80px);
  background-size: 200px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

export const ItemTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

export const ItemMeta = styled.div`
  font-size: 13px;
  color: #6b7280;
`;

export const QtyWrap = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  height: 40px;
  width: max-content;

  @media (max-width: 720px) {
    justify-self: start;
  }
`;

export const QtyBtn = styled.button`
  width: 40px;
  height: 100%;
  background: #f9fafb;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  transition: background 0.15s ease;
  user-select: none;

  &:hover:not(:disabled) { background: #f3f4f6; }
  &:active:not(:disabled) { background: #e5e7eb; }
  &:disabled { cursor: not-allowed; opacity: 0.5; }
`;

export const QtyInput = styled.input`
  width: 56px;
  text-align: center;
  border: none;
  outline: none;
  font-size: 15px;
  padding: 0 6px;
`;

export const PriceCol = styled.div`
  justify-self: end;
  text-align: right;

  > div {
    font-weight: 600;
    color: #111827;
    margin-bottom: 6px;
  }

  @media (max-width: 720px) {
    justify-self: start;
    text-align: left;
  }
`;

export const RemoveBtn = styled.button`
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 13px;
  cursor: pointer;
  padding: 4px 0;

  &:hover { text-decoration: underline; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px dashed #e5e7eb;
  margin: 8px 0 4px;
`;

export const SummaryCard = styled(Card)`
  padding: 16px;
`;

export const SummaryTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 12px 0;
  letter-spacing: -0.2px;
`;

export const SummaryRow = styled.div<{ $strong?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 15px;
  color: #374151;

  ${(p) =>
    p.$strong &&
    css`
      font-weight: 700;
      color: #111827;
      font-size: 16px;
      padding-top: 10px;
    `}
`;

export const SummaryValue = styled.span`
  font-weight: 600;
  color: #111827;
`;

export const SummaryActions = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 16px;
`;

export const BaseBtn = styled.button`
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: transform 0.02s ease, box-shadow 0.15s ease, background 0.15s ease;

  &:active {
    transform: translateY(1px);
  }

  &[aria-disabled='true'],
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

export const PrimaryBtn = styled(BaseBtn)`
  background: #111827;
  color: white;

  &:hover { background: #0b1220; }
`;

export const GhostBtn = styled(BaseBtn)`
  background: white;
  border-color: #e5e7eb;
  color: #111827;

  &:hover { background: #f9fafb; }
`;

export const EmptyWrap = styled.div`
  grid-column: 1 / -1;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.08);
  padding: 32px;
  text-align: center;
`;

export const EmptyTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
`;

export const EmptyText = styled.div`
  color: #6b7280;
  margin-bottom: 16px;
`;
