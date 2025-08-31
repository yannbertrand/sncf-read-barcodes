import type { TicketInfo } from "../domain/ticket-info";
import { decodeAztecCodeFromImage } from "./low-level/decode-aztec-code-from-image";
import { getInfoFromZxingResult } from "./low-level/get-info-from-zxing-result";
import { createImageElement } from "./low-level/image-utils";

export async function findTicketInfoInImage(
	imageBlob: Blob,
): Promise<TicketInfo | undefined> {
	try {
		const imageElement = createImageElement(imageBlob);
		const result = await decodeAztecCodeFromImage(imageElement);

		return {
			info: getInfoFromZxingResult(result),
			imgSrcValue: imageElement.src,
		};
	} catch {}
}
