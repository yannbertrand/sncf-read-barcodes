import { PDFDocument, PDFRawStream, PDFName } from 'pdf-lib';
import { PNG } from 'pngjs/browser';
import { inflate } from 'pako/dist/pako_inflate';

const PngColorTypes = {
  Grayscale: 0,
  Rgb: 2,
  GrayscaleAlpha: 4,
  RgbAlpha: 6,
};
const ComponentsPerPixelOfColorType = {
  [PngColorTypes.Rgb]: 3,
  [PngColorTypes.Grayscale]: 1,
  [PngColorTypes.RgbAlpha]: 4,
  [PngColorTypes.GrayscaleAlpha]: 2,
};

const readBitAtOffsetOfByte = (byte, bitOffset) => {
  const bit = (byte >> bitOffset) & 1;
  return bit;
};

const readBitAtOffsetOfArray = (uint8Array, bitOffsetWithinArray) => {
  const byteOffset = Math.floor(bitOffsetWithinArray / 8);
  const byte = uint8Array[uint8Array.length - byteOffset];
  const bitOffsetWithinByte = Math.floor(bitOffsetWithinArray % 8);
  return readBitAtOffsetOfByte(byte, bitOffsetWithinByte);
};

const savePng = (image) =>
  new Promise((resolve, reject) => {
    const isGrayscale = image.colorSpace === PDFName.of('DeviceGray');
    const colorPixels = inflate(image.data);
    const alphaPixels = image.alphaLayer
      ? inflate(image.alphaLayer.data)
      : undefined;

    const colorType =
      isGrayscale && alphaPixels
        ? PngColorTypes.GrayscaleAlpha
        : !isGrayscale && alphaPixels
        ? PngColorTypes.RgbAlpha
        : isGrayscale
        ? PngColorTypes.Grayscale
        : PngColorTypes.Rgb;

    const colorByteSize = 1;
    const width = image.width * colorByteSize;
    const height = image.height * colorByteSize;
    const inputHasAlpha = [
      PngColorTypes.RgbAlpha,
      PngColorTypes.GrayscaleAlpha,
    ].includes(colorType);

    const pngData = new PNG({
      width,
      height,
      colorType,
      inputColorType: colorType,
      inputHasAlpha,
    });

    const componentsPerPixel = ComponentsPerPixelOfColorType[colorType];
    pngData.data = new Uint8Array(width * height * componentsPerPixel);

    let colorPixelIdx = 0;
    let pixelIdx = 0;

    while (pixelIdx < pngData.data.length) {
      if (colorType === PngColorTypes.Rgb) {
        pngData.data[pixelIdx++] = colorPixels[colorPixelIdx++];
        pngData.data[pixelIdx++] = colorPixels[colorPixelIdx++];
        pngData.data[pixelIdx++] = colorPixels[colorPixelIdx++];
      } else if (colorType === PngColorTypes.RgbAlpha) {
        pngData.data[pixelIdx++] = colorPixels[colorPixelIdx++];
        pngData.data[pixelIdx++] = colorPixels[colorPixelIdx++];
        pngData.data[pixelIdx++] = colorPixels[colorPixelIdx++];
        pngData.data[pixelIdx++] = alphaPixels[colorPixelIdx - 1];
      } else if (colorType === PngColorTypes.Grayscale) {
        const bit =
          readBitAtOffsetOfArray(colorPixels, colorPixelIdx++) === 0
            ? 0x00
            : 0xff;
        pngData.data[pngData.data.length - pixelIdx++] = bit;
      } else if (colorType === PngColorTypes.GrayscaleAlpha) {
        const bit =
          readBitAtOffsetOfArray(colorPixels, colorPixelIdx++) === 0
            ? 0x00
            : 0xff;
        pngData.data[pngData.data.length - pixelIdx++] = bit;
        pngData.data[pngData.data.length - pixelIdx++] =
          alphaPixels[colorPixelIdx - 1];
      } else {
        throw new Error(`Unknown colorType=${colorType}`);
      }
    }

    const buffer = [];
    pngData
      .pack()
      .on('data', (data) => buffer.push(...data))
      .on('end', () => resolve(Uint8Array.from(buffer)))
      .on('error', (err) => reject(err));
  });

export async function extractImagesFromPdf(pdfBytes: ArrayBuffer) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const enumeratedIndirectObjects = pdfDoc.context.enumerateIndirectObjects();
  const imagesInDoc = [];
  let objectIdx = 0;
  enumeratedIndirectObjects.forEach(async ([pdfRef, pdfObject], ref) => {
    objectIdx += 1;

    if (!(pdfObject instanceof PDFRawStream)) return;

    const { dict } = pdfObject;

    const smaskRef = dict.get(PDFName.of('SMask'));
    const colorSpace = dict.get(PDFName.of('ColorSpace'));
    const subtype = dict.get(PDFName.of('Subtype'));
    const width = dict.get(PDFName.of('Width'));
    const height = dict.get(PDFName.of('Height'));
    const name = dict.get(PDFName.of('Name'));
    const bitsPerComponent = dict.get(PDFName.of('BitsPerComponent'));
    const filter = dict.get(PDFName.of('Filter'));

    if (subtype == PDFName.of('Image')) {
      console.log(subtype);
      const imageType = filter === PDFName.of('DCTDecode') ? 'jpg' : 'png';

      imagesInDoc.push({
        ref,
        smaskRef,
        colorSpace,
        name: name ? name.key : `Object${objectIdx}`,
        width: width.numberValue,
        height: height.numberValue,
        bitsPerComponent: bitsPerComponent.numberValue,
        data: pdfObject.contents,
        type: imageType,
      });
    }
  });

  const imagesBuffers = [];
  for (let image of imagesInDoc) {
    const imageBuffer =
      image.type === 'jpg' ? image.data : await savePng(image);
    imagesBuffers.push(imageBuffer);
  }
  return imagesBuffers;
}
