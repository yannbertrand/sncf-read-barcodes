import { findTicketInfoInImage } from "./find-ticket-info-in-image";
import { convertPdfToImageBlob } from "./low-level/convert-pdf-to-image-blob";

export async function findTicketsInfoInPdf(file: File) {
	const imageBlobs = await convertPdfToImageBlob(file);

	const ticketsInfo = [];
	for (const imageBlob of imageBlobs) {
		const ticketInfo = await findTicketInfoInImage(imageBlob);
		if (ticketInfo) {
			ticketsInfo.push(ticketInfo);
		}
	}
	return ticketsInfo;
}
