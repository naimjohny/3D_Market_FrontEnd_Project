/** Форматирование величин: байты и компактные числа полигонов. */

const BYTES_IN_KB = 1024;
const COMPACT_THRESHOLD = 1000;

export const formatBytes = (bytes: number): string => {
  if (bytes < BYTES_IN_KB) return `${bytes} B`;
  const kb = bytes / BYTES_IN_KB;
  if (kb < BYTES_IN_KB) return `${kb.toFixed(1)} KB`;
  return `${(kb / BYTES_IN_KB).toFixed(1)} MB`;
};

export const formatCompact = (value: number): string => {
  if (value < COMPACT_THRESHOLD) return String(value);
  return `${(value / COMPACT_THRESHOLD).toFixed(1)}K`;
};
