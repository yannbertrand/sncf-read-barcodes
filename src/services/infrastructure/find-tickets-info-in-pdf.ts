import { findTicketInfoInImage } from "./find-ticket-info-in-image";
import { extractImagesFromPdf } from "./low-level/extract-images-from-pdf";

export async function findTicketsInfoInPdf(pdfBuffer: ArrayBuffer) {
	const imagesElements = await extractImagesFromPdf(pdfBuffer);
	const ticketsInfo = [];
	for (const imageElement of imagesElements) {
		const ticketInfo = await findTicketInfoInImage(imageElement);
		if (ticketInfo) {
			ticketsInfo.push(ticketInfo);
		}
	}
	return ticketsInfo;
}
