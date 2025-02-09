export const BottomNavigation = () => {
    const categories = [
        { id: 1, name: "Голова" },
        { id: 1, name: "Прическа" },
        { id: 1, name: "Лицо" },
        { id: 1, name: "Глаза" },
        { id: 2, name: "Уши" },
        { id: 3, name: "Нос" },
        { id: 4, name: "Прическа" },
        { id: 5, name: "Одежда" },
        { id: 6, name: "Аксессуары" },
    ];

    return (
        <div className="fixed z-10 bottom-10 left-1/2 transform -translate-x-1/2 bg-white shadow-lg p-2 rounded-2xl flex space-x-4">
            {categories.map((category) => (
                <div
                    key={category.id}
                    className="px-4 py-2 bg-gray-100 rounded-lg text-gray-800 font-medium cursor-pointer transition-all duration-300 hover:bg-gray-200 hover:shadow-md"
                >
                    {category.name}
                </div>
            ))}
        </div>
    );
};
