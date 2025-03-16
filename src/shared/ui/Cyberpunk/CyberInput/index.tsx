import React from "react";
import { Input } from "antd";

interface CyberInputProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
}

const CyberInput: React.FC<CyberInputProps> = ({placeholder,value, onChange,disabled}) => (
        <Input
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="h-12 rounded-md transition-all duration-300"
            style={{
                background: 'transparent', // Прозрачный фон
                border: '2px solid transparent', // Прозрачный бордер по умолчанию
                borderRadius: '8px', // Закругленные углы для футуристического вида
                padding: '10px', // Отступы
                color: '#fff', // Белый цвет текста
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.6)', // Легкое неоновое свечение
                transition: 'all 0.3s ease', // Плавный переход
            }}
            onFocus={(e) => {
                e.target.style.border = '2px solid #00bcd4'; // Светящийся бордер при фокусе
                e.target.style.boxShadow = '0 0 15px 5px rgba(0, 188, 212, 0.6)'; // Яркое свечение при фокусе
            }}
            onBlur={(e) => {
                e.target.style.border = '2px solid transparent'; // Убираем свечение после фокуса
                e.target.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.6)'; // Легкое свечение по умолчанию
            }}
        />
    );

export default CyberInput;
