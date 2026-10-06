/** Эффект «расшифровки» текста: случайные глифы постепенно складываются в строку. */

import { useEffect, useState } from 'react';

const GLYPHS = '!<>-_\\/[]{}=+*^?#АБВГДЕЖЗ0123456789';
const TICK_MS = 28;
const FRAMES_PER_CHAR = 2.4;

export const useScramble = (text: string, active: boolean): string => {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!active) {
      setDisplay(text);
      return;
    }
    let frame = 0;
    const totalFrames = Math.ceil(text.length * FRAMES_PER_CHAR);
    const interval = setInterval(() => {
      frame += 1;
      const revealed = frame / FRAMES_PER_CHAR;
      const next = text
        .split('')
        .map((char, index) => {
          if (char === ' ' || index < revealed) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');
      setDisplay(next);
      if (frame >= totalFrames) {
        setDisplay(text);
        clearInterval(interval);
      }
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [text, active]);

  return display;
};
