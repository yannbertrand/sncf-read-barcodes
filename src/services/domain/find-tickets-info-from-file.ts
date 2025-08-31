import { findTicketInfoInImage } from "../infrastructure/find-ticket-info-in-image";
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
			const foundTicket = await findTicketInfoInImage(file);
			return foundTicket ? [foundTicket] : [];
		}
	}
}
