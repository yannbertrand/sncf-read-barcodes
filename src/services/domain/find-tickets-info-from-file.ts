import { findTicketsInfoInImage } from "../infrastructure/find-tickets-info-in-image";
import { findTicketsInfoInPdf } from "../infrastructure/find-tickets-info-in-pdf";
import type { TicketInfo } from "./ticket-info";

export async function findTicketsInfoFromFile(
	file: File,
): Promise<TicketInfo[]> {
	switch (file.type) {
		case "application/pdf":
			return await findTicketsInfoInPdf(file);
		case "image/png":
		default: {
			return await findTicketsInfoInImage(file);
		}
	}
}
