import React from 'react';
import { Form } from 'react-bootstrap';
import { Preferences } from '@/types';
import styles from './checkbox.module.css';  

interface CustomCheckboxProps {
    options: string[];
    IconMap: Record<string, React.ReactElement>;
    selectedOption: Record<keyof Preferences, string[]>;
    handleOptionSelect: (option: string, category: keyof Preferences) => void;
    activeCategory: keyof Preferences;
  }
  

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
    options,
    IconMap,
    handleOptionSelect,
    selectedOption,
    activeCategory, 
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
                checked={selectedOption[activeCategory]?.includes(option) || false}
                onChange={() => handleOptionSelect(option, activeCategory)}
            />
        ))}
    </div>
);

export default CustomCheckbox;
