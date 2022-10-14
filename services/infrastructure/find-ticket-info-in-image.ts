import { getInfoFromZxingResult } from './low-level/get-info-from-zxing-result';
import { decodeAztecCodeFromImage } from './low-level/decode-aztec-code-from-image';
import { getImageSrcValue } from './low-level/image-utils';

export async function findTicketInfoInImage(imageBuffer: ArrayBuffer) {
  try {
    const result = await decodeAztecCodeFromImage(imageBuffer);
    return {
      info: getInfoFromZxingResult(result),
      imgSrcValue: getImageSrcValue(imageBuffer),
    };
  } catch {}
}
