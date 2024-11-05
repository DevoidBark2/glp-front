const SupportPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                Поддержка
            </h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Как мы можем вам помочь?
                </h2>
                <textarea
                    className="w-full h-40 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    placeholder="Пожалуйста, введите здесь свое сообщение или вопрос..."
                />
                <div className="flex justify-end">
                    <button className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-blue-500 transition duration-300 text-sm">
                        Отправить
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SupportPage;
