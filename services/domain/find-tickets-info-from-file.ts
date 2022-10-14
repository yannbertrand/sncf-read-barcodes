import { findTicketInfoInImage } from '../infrastructure/find-ticket-info-in-image';
import { findTicketsInfoInPdf } from '../infrastructure/find-tickets-info-in-pdf';
import { TicketInfo } from './ticket-info';

export async function findTicketsInfoFromFile(
  file: File
): Promise<TicketInfo[]> {
  const data = await file.arrayBuffer();
  switch (file.type) {
    case 'application/pdf':
      return await findTicketsInfoInPdf(data);
    case 'image/png':
    default:
      return [await findTicketInfoInImage(data)];
  }
}
