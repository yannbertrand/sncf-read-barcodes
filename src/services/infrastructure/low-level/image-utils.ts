export const createImageElement = (file: File): HTMLImageElement => {
	const imgElement = document.createElement("img");
	imgElement.setAttribute("src", URL.createObjectURL(file));
	return imgElement;
};
