import { findTicketInfoInImage } from './find-ticket-info-in-image';
import { extractImagesFromPdf } from './low-level/extract-images-from-pdf';

export async function findTicketsInfoInPdf(pdfBuffer: ArrayBuffer) {
  const imagesBuffers = await extractImagesFromPdf(pdfBuffer);
  const ticketsInfo = [];
  for (let imageBuffer of imagesBuffers) {
    const ticketInfo = await findTicketInfoInImage(imageBuffer);
    if (ticketInfo) {
      ticketsInfo.push(ticketInfo);
    }
  }
  return ticketsInfo;
}
