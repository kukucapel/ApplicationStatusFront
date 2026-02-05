import { getUrlDownloadAttachmentLink } from './updateApplication';

export default async function downloadFile(
  idAttachment: number,
  token?: string,
) {
  const res = await getUrlDownloadAttachmentLink(idAttachment, token);
  const fileUrl = res.url;

  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);
    const newTab = window.open(blobUrl, '_blank');

    if (!newTab) return;

    const a = newTab.document.createElement('a');
    a.href = blobUrl;
    a.download = 'file';
    newTab.document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      newTab.close();
      URL.revokeObjectURL(blobUrl);
    }, 10);
  } catch {}
}
