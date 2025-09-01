import { findTicketsInfoInImage } from "./find-tickets-info-in-image";
import { convertPdfToImageBlob } from "./low-level/convert-pdf-to-image-blob";

export async function findTicketsInfoInPdf(file: File) {
	const imageBlobs = await convertPdfToImageBlob(file);

	const ticketsInfo = [];
	for (const imageBlob of imageBlobs) {
		const foundTicketsInfo = await findTicketsInfoInImage(
			new File([imageBlob], "blob.png"),
		);
		if (foundTicketsInfo.length > 0) {
			for (const ticketInfo of foundTicketsInfo) {
				ticketsInfo.push(ticketInfo);
			}
		}
	}
	return ticketsInfo;
}
