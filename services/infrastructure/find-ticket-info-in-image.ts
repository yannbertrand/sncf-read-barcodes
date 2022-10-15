import { getInfoFromZxingResult } from './low-level/get-info-from-zxing-result';
import { decodeAztecCodeFromImage } from './low-level/decode-aztec-code-from-image';
import { createImageElement } from './low-level/image-utils';

const getImageElement = (
  imageBuffer: ArrayBuffer | HTMLImageElement
): HTMLImageElement =>
  imageBuffer instanceof HTMLImageElement
    ? imageBuffer
    : createImageElement(imageBuffer);

export async function findTicketInfoInImage(
  imageBuffer: ArrayBuffer | HTMLImageElement
) {
  try {
    const imageElement = getImageElement(imageBuffer);
    const result = await decodeAztecCodeFromImage(imageElement);

    return {
      info: getInfoFromZxingResult(result),
      imgSrcValue: imageElement.src,
    };
  } catch {}
}
