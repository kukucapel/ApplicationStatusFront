import { getUrlDownloadAttachmentLink } from './updateApplication';

export default async function downloadFile(
  idAttachment: number,
  token?: string,
) {
  const res = await getUrlDownloadAttachmentLink(idAttachment, token);
  const fileUrl = res.url;
  window.open(fileUrl);
}
