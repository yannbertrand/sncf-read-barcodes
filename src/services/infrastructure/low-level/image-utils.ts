export const createImageElement = (imageBlob: Blob): HTMLImageElement => {
	const imgElement = document.createElement("img");
	imgElement.setAttribute("src", URL.createObjectURL(imageBlob));
	return imgElement;
};
