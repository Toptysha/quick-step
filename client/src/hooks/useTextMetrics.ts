import { Metrics } from "@/types";
import { useEffect, useRef, useState } from "react";

export const useTextMetrics = (
  texts: string[],
  fontSize: number = 44,
  maxWidth: number = 500,
  imgWidth: number = 60
): [React.MutableRefObject<(HTMLDivElement | null)[]>, Metrics[]] => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [metrics, setMetrics] = useState<Metrics[]>(
    new Array(texts.length).fill(0).map(() => ({ width: 0, bgCount: 0, lineCount: 1 }))
  );

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.font = `${fontSize}px WIXMadeforText`;

    const newMetrics = texts.map((text, index) => {
      const words = text.split(' ');
      let currentLine = '';
      let lineCount = 1;
      let maxLineWidth = 0;

      for (let word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const width = ctx.measureText(testLine).width;

        if (width > maxWidth) {
          lineCount++;
          maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width);
      const bgCount = Math.floor(maxLineWidth / imgWidth);

      return {
        width: maxLineWidth,
        lineCount,
        bgCount,
      };
    });

    setMetrics(newMetrics);
  }, [texts.length, fontSize, maxWidth, imgWidth]);

  return [refs, metrics];
};