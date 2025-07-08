"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import { COLORS } from "@/constants";
import { useSelector } from "react-redux";
import { selectLoader } from "@/redux/selectors";

const Overlay = styled.div<{ $visible: boolean }>`
  position: fixed;
  z-index: 9999;
  inset: 0;
  background-color: ${COLORS.CORPORATE_GRAY};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoaderVision = styled.div`
  width: 50px;
  aspect-ratio: 1;
  --_c: no-repeat radial-gradient(farthest-side, #EC008C 92%, #0000);
  background:
    var(--_c) top,
    var(--_c) left,
    var(--_c) right,
    var(--_c) bottom;
  background-size: 12px 12px;
  animation: l7 1s infinite;

  @keyframes l7 {
    to {
      transform: rotate(0.5turn);
    }
  }
`;

export default function Loader() {
  const loader = useSelector(selectLoader);
  console.log('Loader: ', loader)

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const visible = !mounted || loader;

  useEffect(() => {
    if (loader) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [loader]);

  if (!loader) return null;

  return (
    <Overlay $visible={visible}>
      <LoaderVision />
    </Overlay>
  );
}