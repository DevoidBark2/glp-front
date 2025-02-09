import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Switch } from 'antd';
import { BulbOutlined, MoonOutlined } from '@ant-design/icons';

export default function ThemeSwitch() {
    const [mounted, setMounted] = useState(false);
    const { setTheme, resolvedTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    if (!mounted) return (
        <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full animate-pulse" />
    );

    return (
        <div className="flex items-center space-x-3 p-2 bg-gray-800 rounded-full shadow-lg">
            <Switch
                checkedChildren={<BulbOutlined className="text-yellow-400 text-xl" />}
                unCheckedChildren={<MoonOutlined className="text-blue-400 text-xl" />}
                checked={resolvedTheme === 'dark'}
                onChange={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="bg-gray-500"
            />
        </div>
    );
}