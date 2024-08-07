import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa'; 
import styles from './searchBar.module.css';

interface SearchBarProps {
  searchedTerm?: string; 
}

const SearchBar: React.FC<SearchBarProps> = ({ searchedTerm }) => {
  const [searchInput, setSearchInput] = useState(searchedTerm || '');
  const [searchResult, setSearchResult] = useState('');

  const handleSearch = () => {
    setSearchResult(searchInput);
  };

  return (
    <div className={styles.searchBarContainer}>
      <InputGroup className={styles.searchIcon}>
        
          <FaSearch />
       
        <Form.Control
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={styles.searchInput}
        />
        <Button
          variant="primary"
          id="button-search"
          onClick={handleSearch}
          className={styles.searchButton}
        >
          <FaSearch />
        </Button>
      </InputGroup>

      {searchResult && (
        <div className={styles.searchResult}>
          <p>Search Result: {searchResult}</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
