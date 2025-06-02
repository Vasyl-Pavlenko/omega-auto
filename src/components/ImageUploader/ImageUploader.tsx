import { useRef, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

import { getImageUrlsSet } from '../../utils/getImageUrl';

interface ImageInfo {
  width: number;
  url: string;
}

interface Props {
  onImagesChange: (images: ImageInfo[][] | ((prev: ImageInfo[][]) => ImageInfo[][])) => void;
  images: ImageInfo[][];
}

export const ImageUploader = ({ onImagesChange, images }: Props) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 8;

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    await readFiles(files);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    await readFiles(files);
  };

  const readFiles = async (files: File[]) => {
    if (images.length >= MAX_IMAGES) {
      toast.warning(`Ви досягли максимальної кількості (${MAX_IMAGES}) зображень.`);
      return;
    }

    const availableSlots = MAX_IMAGES - images.length;
    const filesToUpload = files.slice(0, availableSlots);

    setUploading(true);

    try {
      const uploadedImages = await Promise.all(
        filesToUpload.map(async (file) => {
          const formData = new FormData();

          formData.append('image', file);

          const response = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            toast.error('Помилка завантаження');

            return null;
          }

          const data = await response.json();

          return data.images as ImageInfo[];
        }),
      );

      const filtered = uploadedImages.filter(
        (group): group is ImageInfo[] => Array.isArray(group) && group.length > 0,
      );

      onImagesChange((prev) => [...prev, ...filtered]);
    } catch (error) {
      console.error(error);

      toast.error('Сталася помилка при завантаженні зображень. Спробуйте пізніше.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = (index: number) => {
    onImagesChange((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition relative">
        {uploading ? (
          <div className="flex justify-center items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin w-5 h-5" />
            <span>Завантаження зображень...</span>
          </div>
        ) : (
          <>
            <Plus className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Перетягніть або натисніть для завантаження — максимум {MAX_IMAGES} зображень
            </p>
          </>
        )}
        <input
          multiple
          type="file"
          ref={inputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-4 overflow-x-auto">
        {images.map((group, i) => {
          if (!group || group.length === 0 || !group[0]?.url) {
            return null;
          }

          const { src, srcSet, sizes } = getImageUrlsSet(group);

          return (
            <div key={i} className="relative group">
              <img
                src={src}
                srcSet={srcSet}
                sizes={sizes}
                alt={`img-${i}`}
                className="w-24 h-24 object-cover rounded-xl border"
              />
              <button
                type="button"
                title="Видалити фото"
                aria-label="Видалити фото"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteImage(i);
                }}
                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition">
                ✖
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
