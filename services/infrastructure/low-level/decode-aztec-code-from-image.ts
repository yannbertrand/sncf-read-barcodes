import { BrowserAztecCodeReader } from '@zxing/browser';
import { createImageElement } from './image-utils';
const codeReader = new BrowserAztecCodeReader();

export async function decodeAztecCodeFromImage(imageBuffer: ArrayBuffer) {
  try {
    return await codeReader.decodeFromImageElement(
      createImageElement(imageBuffer)
    );
  } catch (error) {
    throw new Error('Error while decoding', { cause: error });
  }
}
