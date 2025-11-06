import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import { getImageUrlsSet, ImageInfo } from "../../utils/getImageUrl";
import { CSS } from '@dnd-kit/utilities';

export function SortableImage({
  id,
  group,
  index,
  onDelete,
}: {
  id: string;
  group: ImageInfo[];
  index: number;
  onDelete: (i: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const { src, srcSet, sizes } = getImageUrlsSet(group);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-xl overflow-hidden w-24 h-24 border">
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={`img-${index}`}
        className="w-full h-full object-cover"
      />

      {/* Порядок */}
      <span className="absolute top-1 left-1 bg-black bg-opacity-60 text-white rounded-full px-1 text-xs">
        {index + 1}
      </span>

      {/* Помітний drag handle */}
      <span
        {...listeners}
        {...attributes}
        title="Перетягнути"
        className="absolute bottom-1 left-1 p-1 bg-black bg-opacity-50 text-white rounded cursor-grab hover:bg-opacity-80 active:cursor-grabbing transition-opacity opacity-0 group-hover:opacity-100">
        <GripVertical size={16} />
      </span>

      {/* Delete button */}
      <button
        type="button"
        title="Видалити фото"
        aria-label="Видалити фото"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
        }}
        className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition">
        ✖
      </button>
    </div>
  );
}
