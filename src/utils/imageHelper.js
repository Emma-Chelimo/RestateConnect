// Works whether `img` is a remote URL string (e.g. 'https://...')
// or a locally bundled image reference (e.g. require('../assets/images/foo.jpg')).
// This means property data can mix-and-match local and remote images freely.
export const resolveImage = (img) => {
  if (typeof img === 'string') {
    return { uri: img };
  }
  return img;
};
