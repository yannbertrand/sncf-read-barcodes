import type { TicketInfo } from "../domain/ticket-info";
import { decodeAztecCodeFromImage } from "./low-level/decode-aztec-code-from-image";

export async function findTicketsInfoInImage(
	file: File,
): Promise<TicketInfo[]> {
	return await decodeAztecCodeFromImage(file);
}
