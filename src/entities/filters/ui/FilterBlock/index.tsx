import { FilterOption, FilterValues } from "@/shared/api/filter/model";
import { useMobxStores } from "@/shared/store/RootStore";
import { Button, Checkbox, Radio, Form } from "antd";
import { observer } from "mobx-react";

const FilterBlock = observer(() => {
    const { nomenclatureStore, courseStore } = useMobxStores();
    const [form] = Form.useForm<FilterValues>();

    const filters: {
        levels: FilterOption[];
        durations: FilterOption[];
        sortOptions: FilterOption[];
    } = {
        levels: [
            { type: "level", value: "beginner", label: "Начинающий" },
            { type: "level", value: "intermediate", label: "Средний" },
            { type: "level", value: "advanced", label: "Высокий" },
        ],
        durations: [
            { type: "less", value: 5, label: "До 5 часов" },
            { type: "range", value: { min: 5, max: 10 }, label: "5-10 часов" },
            { type: "greater", value: 10, label: "Более 10 часов" },
        ],
        sortOptions: [
            { type: "sort", value: "popularity", label: "По популярности" },
            { type: "sort", value: "newest", label: "По новизне" },
            { type: "sort", value: "rating", label: "По рейтингу" },
        ],
    };

    const handleFilterCourse = (values: FilterValues) => {
        const formattedFilters = {
            categories: values.categories || [],
            levels: values.levels || [],
            durations: values.durations || [],
            sortOption: values.sortOption || null,
        };

        // Отправляем данные через MobX экшн
        courseStore.searchCourseByFilter(formattedFilters);
    };

    return (
        <div
            className="w-1/5 bg-gray-50 p-4 rounded-lg shadow"
            style={{ position: "sticky", top: "20px", height: "fit-content" }}
        >
            <h2 className="text-lg font-semibold mb-4">Фильтры</h2>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleFilterCourse}
                initialValues={{
                    categories: [],
                    levels: [],
                    durations: [],
                    sortOption: null,
                }}
            >
                {/* Категории */}
                <Form.Item name="categories" label="Категории">
                    <Checkbox.Group className="flex flex-col gap-2">
                        {nomenclatureStore.categories.map((category, index) => (
                            <Checkbox key={index} value={category.id}>
                                {category.name}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </Form.Item>

                {/* Уровень сложности */}
                <Form.Item name="levels" label="Уровень сложности">
                    <Checkbox.Group className="flex flex-col gap-2" disabled>
                        {filters.levels.map((level, index) => (
                            <Checkbox key={index} value={level}>
                                {level.label}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </Form.Item>

                {/* Продолжительность */}
                <Form.Item name="durations" label="Продолжительность">
                    <Checkbox.Group className="flex flex-col gap-2">
                        {filters.durations.map((duration, index) => (
                            <Checkbox key={index} value={duration}>
                                {duration.label}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </Form.Item>

                {/* Сортировка */}
                <Form.Item name="sortOption" label="Сортировка">
                    <Radio.Group className="flex flex-col gap-2">
                        {filters.sortOptions.map((option, index) => (
                            <Radio key={index} value={option}>
                                {option.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                    Применить фильтры
                </Button>
            </Form>
        </div>
    );
});

export default FilterBlock;
