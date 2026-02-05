import { getUrlDownloadAttachmentLink } from './updateApplication';

export default async function downloadFile(
  idAttachment: number,
  token?: string,
) {
  const res = await getUrlDownloadAttachmentLink(idAttachment, token);
  const fileUrl = res.url;

  const link = document.createElement('a');
  link.href = fileUrl;
  link.target = '_blank'; // если нужно открыть в новой вкладке
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// export default async function downloadFile(
//   idAttachment: number,
//   token?: string,
// ) {
//   try {
//     const res = await getUrlDownloadAttachmentLink(idAttachment, token);
//     const fileUrl = res.url;
//     const fileName = `file_${idAttachment}.${getFileExtension(fileUrl)}`;

//     // 1. Пробуем скачать через blob для контроля имени файла
//     await downloadViaBlob(fileUrl, fileName);
//   } catch (blobError) {
//     console.warn('Blob download failed, trying direct method:', blobError);

//     // 2. Fallback: Прямое открытие ссылки
//     try {
//       const res = await getUrlDownloadAttachmentLink(idAttachment);
//       downloadDirect(res.url);
//     } catch (directError) {
//       console.error('All download methods failed:', directError);
//     }
//   }
// }

// // Метод 1: Улучшенное скачивание через Blob (работает с CORS)
// async function downloadViaBlob(url: string, fileName: string) {
//   const response = await fetch(url);
//   if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

//   const blob = await response.blob();
//   const blobUrl = URL.createObjectURL(blob);

//   // Ключевое отличие для Safari: правильное создание и активация ссылки
//   const a = document.createElement('a');
//   a.href = blobUrl;
//   a.download = fileName;
//   a.style.display = 'none';
//   document.body.appendChild(a);

//   // Используем dispatchEvent для надежности
//   const clickEvent = new MouseEvent('click', {
//     view: window,
//     bubbles: true,
//     cancelable: false,
//   });
//   a.dispatchEvent(clickEvent);

//   // Даем время на начало скачивания перед очисткой
//   setTimeout(() => {
//     document.body.removeChild(a);
//     URL.revokeObjectURL(blobUrl);
//   }, 1000); // Увеличено время для Safari
// }

// // Метод 2: Прямое открытие (не требует CORS, но не задает имя файла)
// function downloadDirect(url: string) {
//   // Используем стандартное окно без манипуляций
//   window.open(url, '_blank');
// }

// // Вспомогательная функция для получения расширения файла
// function getFileExtension(url: string): string {
//   try {
//     const urlObj = new URL(url);
//     const path = urlObj.pathname;
//     const extension = path.substring(path.lastIndexOf('.') + 1);
//     return extension && extension.length < 10 ? extension : 'bin';
//   } catch {
//     return 'bin';
//   }
// }
