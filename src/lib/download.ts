import { getUrlDownloadAttachmentLink } from './updateApplication';

export default async function downloadFile(idAttachment: number) {
  try {
    const res = await getUrlDownloadAttachmentLink(idAttachment);
    const fileUrl = res.url;

    // Попытка 1: Скачивание через blob (работает с CORS)
    await downloadViaBlob(fileUrl, idAttachment);
  } catch (error) {
    console.error('Blob download failed, trying direct download:', error);

    // Попытка 2: Прямое скачивание
    try {
      const res = await getUrlDownloadAttachmentLink(idAttachment);
      downloadDirect(res.url);
    } catch (directError) {
      console.error('All download methods failed:', directError);
    }
  }
}

// Метод 1: Через blob (можно задать имя файла)
async function downloadViaBlob(url: string, id: number) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Fetch failed');

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = `attachment_${id}.${getFileExtension(url)}`;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }, 100);
}

// Метод 2: Прямое скачивание (работает без CORS)
function downloadDirect(url: string) {
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank'; // Открыть в новой вкладке
  a.rel = 'noopener noreferrer'; // Безопасность
  a.click();
}

function getFileExtension(url: string): string {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const extension = path.substring(path.lastIndexOf('.') + 1);
    return extension && extension.length < 10 ? extension : 'bin';
  } catch {
    return 'bin';
  }
}
