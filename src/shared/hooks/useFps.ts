/** Счётчик FPS на requestAnimationFrame: кадры суммируются, значение публикуется раз в секунду. */

import { useEffect, useState } from 'react';

const SAMPLE_INTERVAL_MS = 1000;
const DEFAULT_FPS = 60;

export const useFps = (): number => {
  const [fps, setFps] = useState(DEFAULT_FPS);

  useEffect(() => {
    let frames = 0;
    let windowStart = performance.now();
    let frameId = 0;

    const tick = (now: number): void => {
      frames += 1;
      const elapsed = now - windowStart;
      if (elapsed >= SAMPLE_INTERVAL_MS) {
        setFps(Math.round((frames * SAMPLE_INTERVAL_MS) / elapsed));
        frames = 0;
        windowStart = now;
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return fps;
};
