import { Tyre, TyreForm } from '../types/tyre';
import { ImageInfo } from '../utils/getImageUrl';

function convertToNewImagesFormat(oldImages: string[] | ImageInfo[][] | undefined): ImageInfo[][] {
  if (!oldImages) {
    return [];
  }

  if (Array.isArray(oldImages) && oldImages.length > 0 && Array.isArray(oldImages[0])) {
    return oldImages as ImageInfo[][];
  }

  if (Array.isArray(oldImages)) {
    return (oldImages as string[]).map((url) => [{ url, width: 500 }]);
  }

  return [];
}

export const mapTyreToTyreForm = (tyre: Tyre): TyreForm => ({
  brand: tyre.brand,
  model: tyre.model,
  width: String(tyre.width ?? ''),
  height: String(tyre.height ?? ''),
  radius: String(tyre.radius ?? ''),
  quantity: String(tyre.quantity ?? ''),
  season: tyre.season,
  vehicle: tyre.vehicle,
  year: String(tyre.year ?? ''),
  treadDepth: String(tyre.treadDepth ?? ''),
  treadPercent: String(tyre.treadPercent ?? ''),
  city: tyre.city,
  condition: tyre.condition,
  price: String(tyre.price ?? ''),
  contact: tyre.contact ?? '',
  description: tyre.description ?? '',
  images: convertToNewImagesFormat(tyre.images),
});
