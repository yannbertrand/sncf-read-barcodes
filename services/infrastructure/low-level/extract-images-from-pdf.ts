import PDFJs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

PDFJs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const parsePage = async (page, pageInfo) => {
  const scale = 1.5;
  const viewport = page.getViewport({ scale });

  pageInfo.svg = {
    w: viewport.width,
    h: viewport.height,
    doc: '',
  };

  // SVG rendering by PDF.js
  const opList = await page.getOperatorList();
  const svgGfx = new PDFJs.SVGGraphics(page.commonObjs, page.objs);
  const svg = await svgGfx.getSVG(opList, viewport);
  svg.children[1].querySelectorAll('image').forEach(async (svgImgElement) => {
    const imgSrc = svgImgElement.getAttribute('xlink:href');
    const imgElement = document.createElement('img');
    imgElement.setAttribute('src', imgSrc);

    pageInfo.images.push(imgElement);
  });

  pageInfo.svg.doc = svg;
  return pageInfo;
};

export async function extractImagesFromPdf(
  pdfBytes: ArrayBuffer
): Promise<HTMLImageElement[]> {
  try {
    const doc = await PDFJs.getDocument(pdfBytes).promise;
    const pages = [];
    const images = [];
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const pageInfo = await parsePage(page, {
        number: p,
        images: [],
        svg: {},
      });
      pages.push(pageInfo);
      images.push(...pageInfo.images);
    }
    return images;
  } catch (error) {
    throw new Error('Failed parsing .pdf doc', { cause: error });
  }
}
