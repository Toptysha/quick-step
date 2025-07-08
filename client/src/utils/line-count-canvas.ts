'use client';

type TextMetricsResult = {
  lineCount: number;
  maxLineWidth: number;
}

export function lineCountCanvas(text: string, fontSize: number, maxWidth: number = 500): TextMetricsResult {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.font = `${fontSize}px WIXMadeforText`;

  const words = text.split(' ');
  let currentLine = '';
  let lineCount = 1;
  let maxLineWidth = 0;

  for (let word of words) {
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const { width } = ctx.measureText(testLine);

    if (width > maxWidth) {
      lineCount++;
      maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width);

  return {
    lineCount,
    maxLineWidth,
  };
}