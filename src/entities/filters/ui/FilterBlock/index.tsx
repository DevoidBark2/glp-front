import { FilterOption, FilterValues } from "@/shared/api/filter/model";
import { useMobxStores } from "@/shared/store/RootStore";
import {Button, Checkbox, Radio, Form, Collapse, Divider} from "antd";
import { observer } from "mobx-react";

const { Panel } = Collapse;

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
            className="w-full bg-gray-50 p-4 rounded-lg shadow mb-6 md:sticky top-20"
            style={{ height: "fit-content" }}
        >
            <h2 className="text-xl font-bold mb-4 text-center">Фильтры</h2>
            <Divider/>

            <Collapse defaultActiveKey={['1']} className="block md:hidden">
                <Panel header={<label>Фильтры</label>} key="1">
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
                        <Form.Item name="categories" label={<label className="text-lg font-semibold">Категории</label>}>
                            <Checkbox.Group className="flex flex-col gap-2">
                                {nomenclatureStore.categories.map((category, index) => (
                                    <Checkbox key={index} value={category.id}>
                                        {category.name}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Form.Item>
                        <Divider/>
                        <Form.Item name="levels" label={<label className="text-lg font-semibold">Уровень сложности</label>}>
                            <Checkbox.Group className="flex flex-col gap-2">
                                {filters.levels.map((level, index) => (
                                    <Checkbox key={index} value={level.value}>
                                        {level.label}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Form.Item>
                        <Divider/>
                        <Form.Item name="durations" label={<label className="text-lg font-semibold">Продолжительность</label>}>
                            <Checkbox.Group className="flex flex-col gap-2">
                                {filters.durations.map((duration, index) => (
                                    <Checkbox key={index} value={duration.value}>
                                        {duration.label}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Form.Item>
                        <Divider/>
                        <Form.Item name="sortOption" label={<label className="text-lg font-semibold">Сортировка</label>}>
                            <Radio.Group className="flex flex-col gap-2">
                                {filters.sortOptions.map((option, index) => (
                                    <Radio key={index} value={option.value}>
                                        {option.label}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </Form.Item>

                        <Button color="default" variant="solid" htmlType="submit" block>
                            Применить фильтры
                        </Button>
                    </Form>
                </Panel>
            </Collapse>

            <div className="hidden md:block">
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
                    <Form.Item name="categories" label={<label className="text-lg font-semibold">Категории</label>}>
                        <Checkbox.Group className="flex flex-col gap-2">
                            {nomenclatureStore.categories.map((category, index) => (
                                <Checkbox key={index} value={category.id}>
                                    {category.name}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </Form.Item>

                    <Divider/>

                    <Form.Item name="levels" label={<label className="text-lg font-semibold">Уровень сложности</label>}>
                        <Checkbox.Group className="flex flex-col gap-2">
                            {filters.levels.map((level, index) => (
                                <Checkbox key={index} value={level.value}>
                                    {level.label}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </Form.Item>

                    <Divider/>

                    <Form.Item name="durations" label={<label className="text-lg font-semibold">Продолжительность</label>}>
                        <Checkbox.Group className="flex flex-col gap-2">
                            {filters.durations.map((duration, index) => (
                                <Checkbox key={index} value={duration.value}>
                                    {duration.label}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </Form.Item>

                    <Divider/>

                    <Form.Item name="sortOption" label={<label className="text-lg font-semibold">Сортировка</label>}>
                        <Radio.Group className="flex flex-col gap-2" style={{display:"flex"}}>
                            {filters.sortOptions.map((option, index) => (
                                <Radio key={index} value={option.value}>
                                    {option.label}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </Form.Item>

                    <Button color="default" variant="solid" htmlType="submit" block>
                        Применить фильтры
                    </Button>
                </Form>
            </div>
        </div>
    );
});

export default FilterBlock;
