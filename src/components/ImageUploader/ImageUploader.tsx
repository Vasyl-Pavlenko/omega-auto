import { useRef, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { SortableImage } from './SortableImage';

interface ImageInfo {
  width: number;
  url: string;
}

interface Props {
  onImagesChange: (images: ImageInfo[][] | ((prev: ImageInfo[][]) => ImageInfo[][])) => void;
  images: ImageInfo[][];
}

const MAX_IMAGES = 8;

export const ImageUploader = ({ onImagesChange, images }: Props) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    await readFiles(files);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  );

  const handleDragStart = (event: any) => {
    const isDragAllowed = !event?.active?.event?.target?.closest('[data-no-dnd]');

    if (!isDragAllowed) {
      event.cancel();
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((_, i) => i.toString() === active.id);
      const newIndex = images.findIndex((_, i) => i.toString() === over?.id);
      onImagesChange((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition relative"
      >
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((_, i) => i.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-wrap gap-2 mt-4 overflow-x-auto">
            {images.map((group, index) => (
              <SortableImage
                key={index}
                id={index.toString()}
                group={group}
                index={index}
                onDelete={handleDeleteImage}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
