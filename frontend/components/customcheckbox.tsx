import React from 'react';
import { Form } from 'react-bootstrap';
import styles from './checkbox.module.css';  

interface CustomCheckboxProps {
    options: string[];
    IconMap: { [key: string]: JSX.Element };
    selectedOption: string[];
    handleOptionSelect: (option: string) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
    options,
    IconMap,
    handleOptionSelect,
    selectedOption,
}) => (
    <div className={styles.customCheckbox}>
        {options.map((option) => (
            <Form.Check className= {styles.formCheck}
                key={option}
                type="checkbox"
                id={`checkbox-${option}`}
                label={
                    <div className={styles.checkboxLabel}>
                        {IconMap[option]}
                        <span className={styles.optionText}>{option}</span>
                        <span className={styles.addSign}>+</span>
                    </div>
                }
                checked={selectedOption.includes(option)}
                onChange={() => handleOptionSelect(option)}
            />
        ))}
    </div>
);

export default CustomCheckbox;
