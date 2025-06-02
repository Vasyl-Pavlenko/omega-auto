import logo from '../assets/logo.webp';

export interface ImageInfo {
  width: number;
  url: string;
  public_id?: string;
}

export function getImageUrls(image?: ImageInfo) {
  const baseUrl = process.env.REACT_APP_BASE_CLOUD_URL;
  const formats = [400, 800, 1200];

  if (!image || !baseUrl) {
    return {
      src: logo,
      srcSet: '',
      sizes: '100vw',
    };
  }

  let public_id = image.public_id;

  if (!public_id && image.url) {
    try {
      const urlObj = new URL(image.url);
      // /v1748594969/tyres/bcsmz1bakcevvy3xtamw.webp
      const parts = urlObj.pathname.split('/').filter(Boolean);
      // parts = ['v1748594969', 'tyres', 'bcsmz1bakcevvy3xtamw.webp']

      // Знайти папку tyres, і взяти всі сегменти після версії vXXXX
      const versionIndex = parts.findIndex((p) => p.startsWith('v'));
      if (versionIndex !== -1 && parts.length > versionIndex + 1) {
        // public_id = "tyres/bcsmz1bakcevvy3xtamw"
        const idParts = parts.slice(versionIndex + 1);
        // Останній сегмент без розширення
        idParts[idParts.length - 1] = idParts[idParts.length - 1].replace(/\.[^/.]+$/, '');
        public_id = idParts.join('/');
      }
    } catch {
      // якщо не вийшло - залишити public_id undefined
    }
  }

  if (!public_id) {
    return {
      src: logo,
      srcSet: '',
      sizes: '100vw',
    };
  }

  const srcSet = formats.map((w) => `${baseUrl}/w_${w}/${public_id}.webp ${w}w`).join(', ');

  const src = `${baseUrl}/w_800/${public_id}.webp`;

  return {
    src,
    srcSet,
    sizes: '(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 400px',
  };
}

export function getImageUrlsSet(images?: ImageInfo[]) {
  const firstImage = images?.[0];
  return getImageUrls(firstImage);
}
