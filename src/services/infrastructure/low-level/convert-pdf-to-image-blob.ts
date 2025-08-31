import * as PDFJs from "pdfjs-dist";

PDFJs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

const parsePage = async (page: any, pageInfo: any) => {
	const scale = 1.5;
	const viewport = page.getViewport({ scale });

	const canvas = document.createElement("canvas");
	canvas.width = viewport.width;
	canvas.height = viewport.height;
	const ctx = canvas.getContext("2d");

	await page.render({ canvasContext: ctx, viewport }).promise;

	const blob = await new Promise((resolve) =>
		canvas.toBlob(resolve, "image/png"),
	);

	return { ...pageInfo, image: blob };
};

export async function convertPdfToImageBlob(file: File): Promise<Blob[]> {
	try {
		const pdfBytes = await file.arrayBuffer();
		const doc = await PDFJs.getDocument(pdfBytes).promise;
		const pages = [];
		const images = [];
		for (let p = 1; p <= doc.numPages; p++) {
			const page = await doc.getPage(p);
			const pageInfo = await parsePage(page, {
				number: p,
				image: null,
			});
			pages.push(pageInfo);
			images.push(pageInfo.image);
		}
		return images;
	} catch (error) {
		throw new Error("Failed parsing .pdf doc", { cause: error });
	}
}
