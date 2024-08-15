import { useState } from 'react';

const useSelectedRows = () => {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    return { selectedRows, setSelectedRows };
};

export default useSelectedRows;
