export const createImageElement = (file: File | Blob): HTMLImageElement => {
	const imgElement = document.createElement("img");
	imgElement.setAttribute("src", URL.createObjectURL(file));
	return imgElement;
};
