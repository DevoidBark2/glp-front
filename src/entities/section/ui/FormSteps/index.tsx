import { useMobxStores } from "@/stores/stores";
import { Button, Form, message, notification, Steps } from "antd"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { observer } from "mobx-react";
import { SelectCourse, General, SelectComponent } from "../Steps";
import { FormInstance } from "antd/lib";

interface FormStepsProps {
    sectionCourseForm?: FormInstance
}

export const FormSteps = observer(({sectionCourseForm}: FormStepsProps) => {
    const { courseStore, courseComponentStore, sectionCourseStore } = useMobxStores();
    const [createSectionForm] = Form.useForm();
    const [current, setCurrent] = useState(0);
    const router = useRouter();
    
    const steps = [
        {
            title: "Выбор курса",
            content: <SelectCourse createSectionForm={createSectionForm} />,
        },
        General(),
        SelectComponent({createSectionForm: createSectionForm})
    ];

    const next = async () => {
        if (current === 0 && !courseStore.selectedIdCourse) {
            message.warning("Выберите курс!")
            return;
        }

        if (current === 1) {
            await createSectionForm.validateFields(["name", "description","parentSection"]);
            setCurrent(current + 1);
        } else {
            setCurrent(current + 1);
        }
    };
    const prev = () => setCurrent(current - 1);

    const onFinish = () => {
        const values = createSectionForm.getFieldsValue(true)
        if (!values.components || values.components.length === 0) {
            message.warning("Добавь хотя бы один компонент в раздел!")
            return;
        }
        sectionCourseStore.addSection(values).then((response) => {
            router.push("/control-panel/sections");
            notification.success({ message: response.message })
            courseStore.setSelectedCourse(null);
            courseComponentStore.setSearchResult([]);
            courseComponentStore.setSelectedComponent([]);
        }).catch(e => {
            notification.error({message: e.response.data.message})
        }).finally(() => {
            sectionCourseStore.setCreateSectionLoading(false);
        })
    };

    return (
        <Form form={sectionCourseForm ?? createSectionForm} initialValues={sectionCourseForm} onFinish={onFinish} layout="vertical">
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
                        Создать
                    </Button>
                )}
            </div>
        </Form>
    )
})