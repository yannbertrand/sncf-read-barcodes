export const getImageSrcValue = (imageBuffer: ArrayBuffer): string => {
  return URL.createObjectURL(new Blob([imageBuffer], { type: `image/png` }));
};

export const createImageElement = (
  imageBuffer: ArrayBuffer
): HTMLImageElement => {
  const imgElement = document.createElement('img');
  imgElement.setAttribute('src', getImageSrcValue(imageBuffer));
  return imgElement;
};
