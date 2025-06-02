import { Eye } from 'lucide-react';

interface TyreMetaInfoProps {
  createdDate: string;
  views: number;
  isActive: boolean;
  expiresDate?: string;
}

export const TyreMetaInfo = ({ createdDate, views, isActive, expiresDate }: TyreMetaInfoProps) => {
  return (
    <div className="mb-6 flex flex-wrap justify-between items-center gap-4 text-gray-500 text-sm select-none">
      <div>
        <span>Розміщено: </span>
        
        <time className="font-semibold">{createdDate}</time>
      </div>

      <div className="flex items-center gap-2">
        <Eye className="w-5 h-5" />
        <span>{views.toLocaleString()} переглядів</span>
      </div>

      {!isActive && (
        <div className="text-red-600 font-semibold">
          Статус: Видалена
          {expiresDate && <span className="ml-1 text-gray-400">до {expiresDate}</span>}
        </div>
      )}
    </div>
  );
};
