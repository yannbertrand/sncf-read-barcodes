import { BrowserAztecCodeReader } from "@zxing/browser";
import { readBarcodes } from "zxing-wasm/reader";
import type { TicketInfo } from "@/services/domain/ticket-info.js";
import { getInfoFromZxingResult } from "./get-info-from-zxing-result.ts";
import { createImageElement } from "./image-utils.ts";

export async function decodeAztecCodeFromImage(
	file: File,
): Promise<TicketInfo[]> {
	const zxingWasmResult = await decodeCodeUsingZxingWasm(file);
	if (zxingWasmResult.length > 0) {
		return zxingWasmResult;
	}

	const zxingBrowserResult = await decodeCodeUsingZxingBrowser(file);
	if (zxingBrowserResult.length > 0) {
		return zxingBrowserResult;
	}

	return [];
}

export async function decodeCodeUsingZxingWasm(
	file: File,
): Promise<TicketInfo[]> {
	try {
		const results = await readBarcodes(file, {
			tryHarder: true,
			maxNumberOfSymbols: 2,
		});
		if (results.length === 0) {
			console.warn("zxing-wasm - No barcode found");
			return [];
		}

		const zxingResults: TicketInfo[] = [];
		for (const result of results) {
			const zxingResult = getInfoFromZxingResult(result.text, file);
			if (
				zxingResults.find(
					(r) => r.info.eTicketNumber === zxingResult.info.eTicketNumber,
				)
			) {
				continue;
			}
			zxingResults.push(zxingResult);
		}

		return zxingResults;
	} catch (error) {
		console.error("zxing-wasm - Unknown error:", error);
	}

	return [];
}

export async function decodeCodeUsingZxingBrowser(
	file: File,
): Promise<TicketInfo[]> {
	try {
		const codeReader = new BrowserAztecCodeReader();
		const imageElement = createImageElement(file);

		const result = await codeReader.decodeFromImageElement(imageElement);
		return [getInfoFromZxingResult(result.getText(), file)];
	} catch (error: unknown) {
		if (error instanceof Error && error.name === "NotFoundException2") {
			console.warn("@zxing/browser - No barcode found");
		} else if (error instanceof Error && error.name === "FormatException2") {
			console.warn("@zxing/browser - Barcode format not found");
		} else {
			console.error("@zxing/browser - Unknown error:", error);
		}

		return [];
	}
}
