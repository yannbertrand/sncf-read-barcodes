import { BrowserAztecCodeReader } from "@zxing/browser";

const codeReader = new BrowserAztecCodeReader();

export async function decodeAztecCodeFromImage(imageElement: HTMLImageElement) {
	try {
		return await codeReader.decodeFromImageElement(imageElement);
	} catch (error) {
		throw new Error("Error while decoding", { cause: error });
	}
}
