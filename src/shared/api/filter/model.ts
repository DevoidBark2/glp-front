export interface FilterOption {
    type: string; // Тип фильтра (например, "level", "less", "range", "sort")
    value: string | number | { min: number; max: number }; // Значение фильтра
    label: string; // Отображаемый текст
}

export interface FilterValues {
    searchString: string;
    categories: number[]; // Список выбранных категорий (по ID)
    levels: number[]; // Список выбранных уровней сложности
    durations: FilterOption[]; // Список выбранных продолжительностей
    sortOption: FilterOption | null; // Выбранный вариант сортировки
}