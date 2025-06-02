// Значення ширини шин
export const TYRE_WIDTHS = [
  80,
  90,
  100,
  110,
  120,
  130, // мото
  135,
  145,
  155,
  165,
  175,
  185,
  195,
  205,
  215,
  225,
  235,
  245,
  255,
  265,
  275,
  285,
  295,
  305,
  315,
  325,
  335,
  345,
  355,
  365, // вантаж
];

export const TYRE_WIDTH_OPTIONS = TYRE_WIDTHS.map((value) => ({
  label: `${value}`,
  value: value.toString(),
}));

// Значення висоти шин
export const TYRE_HEIGHTS = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];

export const TYRE_HEIGHT_OPTIONS = TYRE_HEIGHTS.map((value) => ({
  label: `${value}`,
  value: value.toString(),
}));

// Значення діаметру (радіуса) шин
export const TYRE_RADIIS = [10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

export const TYRE_RADIUS_OPTIONS = TYRE_RADIIS.map((value) => ({
  label: `R${value}`,
  value: value.toString(),
}));

// Тип транспорту
export const VEHICLE_TYPES = ['Мото', 'Легковий', 'Вантажний'];

export const VEHICLE_TYPE_OPTIONS = VEHICLE_TYPES.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}));

// Сезон
export const SEASONS = ['Літо', 'Зима', 'Всесезонна'];

export const SEASON_OPTIONS = SEASONS.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}));

// Стан
export const CONDITIONS = ['Нова', 'Б/У'];

export const CONDITION_OPTIONS = CONDITIONS.map((value) => ({
  label: value.toUpperCase(),
  value,
}));

// Сортування
export const SORT_OPTIONS = [
  { label: 'Свіжіші', value: 'newest' },
  { label: 'Старіші', value: 'oldest' },
  { label: 'Дешевші', value: 'priceAsc' },
  { label: 'Дорожчі', value: 'priceDesc' },
];

export enum TyreFilterField {
  Width = 'width',
  Height = 'height',
  Radius = 'radius',
  Title = 'title',
  Season = 'season',
  Vehicle = 'vehicle',
  Condition = 'condition',
}

export const EMPTY_FILTERS: Record<TyreFilterField, string> = {
  [TyreFilterField.Width]: '',
  [TyreFilterField.Height]: '',
  [TyreFilterField.Radius]: '',
  [TyreFilterField.Title]: '',
  [TyreFilterField.Season]: '',
  [TyreFilterField.Vehicle]: '',
  [TyreFilterField.Condition]: '',
};