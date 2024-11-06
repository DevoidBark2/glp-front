import { createFaq, deleteFaq, getAllFaq, updateFaq } from "@/shared/api/faq";
import { Faq } from "@/shared/api/faq/model";
import { action, makeAutoObservable } from "mobx";


class FaqStore {
    constructor() {
        makeAutoObservable(this);
    }

    faqs: Faq[] = [];
    loading: boolean = false;

    setLoading = action((value:boolean) => {
        this.loading = value;
    })

    getAll = action(async () => {
        this.setLoading(true);
        const data = await getAllFaq();
        this.faqs = data;
        this.setLoading(false);
    })

    create = action(async (faq: Faq) => {
        const data = await createFaq(faq);
        this.faqs = [...this.faqs, data];
    })

    updatedFaq = action(async (faq: Faq) => {
        const data = await updateFaq(faq)
        this.faqs = this.faqs.map((item) => {
            if (item.id === faq.id) {
                return { ...item, ...data }
            }
            else {
                return item;
            }
        })
    })

    delete = action(async (id: number) => {
        await deleteFaq(id);
        this.faqs = this.faqs.filter(item => item.id !== id);
    })
}

export default FaqStore;