
import React from 'react';
import { Form } from 'react-bootstrap';
import '../styles/checkbox.css';  

interface customCheckboxProps {
    options: string[];
    IconMap: { [key: string]: JSX.Element };
    selectedOption: string[];
    handleOptionSelect: (Option: string) => void;
}

const CustomCheckbox: React.FC<customCheckboxProps> = ({ options, IconMap , handleOptionSelect , selectedOption
 }) => (
    <div>
        {options.map((option) => (
            <Form.Check
            key={option}
            type="checkbox"
            id={`checkbox-${option}`}
            label={
                <>
                  {IconMap[option]}
                  <span style={{ marginLeft: '10px' }}>{option}</span>
                </>
              }
            checked={selectedOption.includes(option)}
            onChange={() => handleOptionSelect(option)}
            className="custom-checkbox"

        />
        
        ))}
    </div>
    
);

export default CustomCheckbox;