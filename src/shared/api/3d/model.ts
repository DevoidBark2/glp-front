export type Category = {
    id: string;
    name: string

}

export type Item = {
    id: string
    modelPath: string
    price: number
    category: Category
}

