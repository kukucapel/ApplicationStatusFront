import { getUrlDownloadAttachmentLink } from './updateApplication';

export default async function downloadFile(idAttachment: number) {
  const res = await getUrlDownloadAttachmentLink(idAttachment);
  const url = res.url;

  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (!isSafari) {
    link.download = `file_${idAttachment}.${getFileExtension(url)}`;
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getFileExtension(url: string): string {
  const match = url.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/);
  return match ? match[1] : 'bin';
}
