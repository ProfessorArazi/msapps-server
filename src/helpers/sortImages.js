const sortImages = (images) => {
  // sorting images by id
  return images.sort((imageA, imageB) => imageA.id - imageB.id);
};

module.exports = { sortImages };
