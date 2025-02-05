import { Button, Form, message, notification, Steps } from "antd"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { observer } from "mobx-react";
import { SelectCourse, General, SelectComponent } from "../Steps";
import { FormInstance } from "antd/lib";
import { useMobxStores } from "@/shared/store/RootStore";
import {SectionCourseItem} from "@/shared/api/section/model";

interface FormStepsProps {
    sectionCourseForm?: FormInstance<SectionCourseItem>,
}

export const FormSteps = observer(({ sectionCourseForm }: FormStepsProps) => {
    const { courseStore, courseComponentStore, sectionCourseStore } = useMobxStores();
    const [createSectionForm] = Form.useForm<SectionCourseItem>();
    const [current, setCurrent] = useState(0);
    const router = useRouter();

    const steps = [
        {
            title: "Выбор курса",
            content: <SelectCourse createSectionForm={sectionCourseForm ?? createSectionForm} />,
        },
        General(),
        SelectComponent({ createSectionForm: sectionCourseForm ? sectionCourseForm: createSectionForm })
    ];

    const next = async () => {
        if (current === 0 && !courseStore.selectedIdCourse) {
            message.warning("Выберите курс!")
            return;
        }

        if (current === 1) {
            await createSectionForm.validateFields(["name", "description", "parentSection"]);
            setCurrent(current + 1);
        } else {
            setCurrent(current + 1);
        }
    };
    const prev = () => setCurrent(current - 1);

    const onFinish = async () => {
        const values: SectionCourseItem = sectionCourseForm
            ? sectionCourseForm.getFieldsValue(true)
            : createSectionForm.getFieldsValue(true);

        if (!values.components || values.components.length === 0) {
            message.warning("Добавьте хотя бы один компонент в раздел!");
            return;
        }

        if (sectionCourseForm) {
            await sectionCourseStore.updateSection(values).then(response => {
                debugger
                notification.success({message: response.message})
            }).finally(() => {
                sectionCourseStore.setCreateSectionLoading(false);
            })
        }
        else {
            debugger
            sectionCourseStore.addSection(values).then((response) => {
                router.push("/control-panel/sections");
                notification.success({ message: response.message })
                courseStore.setSelectedCourse(null);
                courseComponentStore.setSearchResult([]);
                courseComponentStore.setSelectedComponent([]);
            }).catch(e => {
                notification.error({ message: e.response.data.message })
            }).finally(() => {
                sectionCourseStore.setCreateSectionLoading(false);
            })
        }
    };


    return (
        <Form form={sectionCourseForm ?? createSectionForm} onFinish={onFinish} layout="vertical">
            <Steps current={current}>
                {steps.map((item) => (
                    <Steps.Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className="steps-content mt-5">{steps[current].content}</div>
            <div className="steps-action mt-5 flex justify-end">
                {current > 0 && (
                    <Button style={{ marginRight: 8 }} onClick={() => prev()}>
                        Назад
                    </Button>
                )}
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        Далее
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" htmlType="submit" loading={sectionCourseStore.createSectionLoading}>
                        {sectionCourseForm ? "Изменить" : "Создать"}
                    </Button>
                )}
            </div>
        </Form>
    )
})