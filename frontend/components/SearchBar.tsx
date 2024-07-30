import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import styles from './seachBar.module.css';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <Form onSubmit={handleSearch} className={`d-flex ${styles.searchBarContainer}`}>
      <InputGroup className={styles.inputGroup}>
        <FormControl
          type="text"
          placeholder="Search listings"
          value={searchTerm}
          onChange={handleInputChange}
          className={styles.formControl}
        />
        <Button variant="primary" type="submit" className={styles.btn}>
          Search
        </Button>
      </InputGroup>
    </Form>
  );
};


export default SearchBar;
