/** Скриншот WebGL-канваса: скачивает готовый dataURL как PNG-файл. */

export const downloadDataUrl = (dataUrl: string, fileName: string): void => {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
};
