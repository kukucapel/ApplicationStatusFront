import { getUrlDownloadAttachmentLink } from './updateApplication';

export default async function downloadFile(idAttachment: number) {
  const res = await getUrlDownloadAttachmentLink(idAttachment);
  window.open(res.url, '_blank');
}
