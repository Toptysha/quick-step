"use client";

import { COLORS, WINDOW_WIDTH } from "@/constants";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SearchWrapper = styled.div`
  width: 450px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (${WINDOW_WIDTH.MOBILE}) {
    width: 250px;
  }
`;

const SearchIcon = styled.img`
  cursor: pointer;
  width: 25px;
  height: 25px;
  transform: scaleX(-1);
  padding: 0 0 0 5px;
  opacity: 0.7;
`;

const InputSearch = styled.input`
  width: 520px;
  height: 25px;
  border-radius: 6px;
  border: none;
  padding: 0 6px;
  background-color: ${COLORS.CORPORATE_GRAY};
  outline: none;

  &:focus {
    border: 1px solid ${COLORS.CORPORATE_BLUE};
    background: #fff;
  }

  @media (${WINDOW_WIDTH.MOBILE}) {
    width: 220px;
  }
`;

export default function SearchLine() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams()!;
  const [q, setQ] = useState("");

  // Синхронизируемся с URL, чтобы строка показывала текущий запрос
  useEffect(() => {
    const fromURL = params.get("q") || "";
    setQ(fromURL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, params?.toString()]);

  const go = () => {
    const qq = q.trim();
    const usp = new URLSearchParams({ q: qq });
    // сбрасываем страницу при новом поиске
    usp.set("page", "1");
    router.push(`/catalog?${usp.toString()}`);
  };

  return (
    <SearchWrapper>
      <SearchIcon
        src="/icons/search-icon.svg"
        alt="Search"
        onClick={go}
        title="Искать"
      />
      <InputSearch
        placeholder="Поиск по каталогу…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") go();
        }}
      />
    </SearchWrapper>
  );
}
