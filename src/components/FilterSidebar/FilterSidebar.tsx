import React, { useState } from 'react';
import {
  TyreFilterField,
  CONDITION_OPTIONS,
  SEASON_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
  TYRE_WIDTH_OPTIONS,
  TYRE_HEIGHT_OPTIONS,
  TYRE_RADIUS_OPTIONS,
  SORT_OPTIONS,
} from '../../constants/tyreOptions';
import { SortOption } from '../../types/tyre';

interface FilterSidebarProps {
  filters: Record<TyreFilterField, string>;
  sortBy: SortOption;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  sortBy,
  onSortChange,
  onReset,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => setIsFilterOpen((prev) => !prev);

  const fieldWrapperClass =
    'flex flex-row md:flex-col items-center md:items-start gap-2 w-full md:w-auto';

  const inputClass =
    'border border-gray-300 p-2 rounded-lg w-full md:w-48 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500';

  const renderTextInput = (name: TyreFilterField, placeholder: string) => (
    <div className={fieldWrapperClass}>
      <label htmlFor={name} className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Пошук
      </label>

      <input
        id={name}
        name={name}
        value={filters[name]}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );

  const renderFilterSelect = <T extends string>(
    name: TyreFilterField,
    label: string,
    options: { label: string; value: T }[],
  ) => (
    <div className={fieldWrapperClass}>
      <label htmlFor={name} className="text-sm font-medium text-gray-700 whitespace-nowrap">
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={filters[name]}
        onChange={onChange}
        className={inputClass}
      >
        <option value="">Показати усі</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderSortSelect = (label: string, options: { label: string; value: string }[]) => (
    <div className={fieldWrapperClass}>
      <label htmlFor="sortBy" className="text-sm font-medium text-gray-700 whitespace-nowrap">
        {label}
      </label>

      <select
        id="sortBy"
        name="sortBy"
        value={sortBy}
        onChange={onSortChange}
        className={inputClass}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        aria-label={isFilterOpen ? 'Згорнути фільтри' : 'Показати фільтри'}
        onClick={toggleFilter}
        className="md:hidden w-full mb-4 px-4 py-2 bg-cyan-700 text-white rounded-lg shadow hover:bg-cyan-800 transition"
      >
        {isFilterOpen ? 'Згорнути фільтри' : 'Показати фільтри'}
      </button>

      {/* Filter Container */}
      <div
        className={`
          transition-all duration-500 ease-in-out overflow-hidden
          ${isFilterOpen ? 'max-h-[2000px] mb-4' : 'max-h-0 mb-0'}
          md:max-h-none md:mb-6 md:grid md:grid-cols-7 md:gap-4 md:items-end`
        }
      >
        <div className="flex flex-col gap-2 gap-x-3 md:flex-row md:flex-wrap md:col-span-7 p-1">
          {renderTextInput(TyreFilterField.Title, 'Пошук')}
          {renderFilterSelect(TyreFilterField.Width, 'Ширина', TYRE_WIDTH_OPTIONS)}
          {renderFilterSelect(TyreFilterField.Height, 'Висота', TYRE_HEIGHT_OPTIONS)}
          {renderFilterSelect(TyreFilterField.Radius, 'Радіус', TYRE_RADIUS_OPTIONS)}
          {renderFilterSelect(TyreFilterField.Condition, 'Стан', CONDITION_OPTIONS)}
          {renderFilterSelect(TyreFilterField.Season, 'Сезон', SEASON_OPTIONS)}
          {renderFilterSelect(TyreFilterField.Vehicle, 'Транспорт', VEHICLE_TYPE_OPTIONS)}
          {renderSortSelect('Сортування', SORT_OPTIONS)}

          <div className="relative w-full md:w-auto md:self-end">
            <button
              type="button"
              aria-label="Скинути фільтри"
              onClick={onReset}
              className="h-[38px] w-full md:w-48 px-4 mb-0 text-sm font-medium text-white btn-cyan rounded-lg transition outline-none"
            >
              🔄 Очистити фільтри
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
