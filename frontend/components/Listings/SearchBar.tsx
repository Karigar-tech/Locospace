import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../../styles/listings.css';

const SearchBar = () => {

    const [searchInput, setSearchInput] = useState('')
    const [searchResult, setSearchResult] = useState('');

    const handleSearch = () => {
        setSearchResult(searchInput)
    }

    return (
        <div className='search-bar'>
            <div className="search-container"> 
                <Form>
                    <InputGroup>
                        <Form.Control 
                        type="text" 
                        placeholder="Search..." 
                        value={searchInput} 
                        onChange={(e) => setSearchInput(e.target.value)}
                         />
                        <Button variant="primary" id="button-search" onClick={handleSearch}>
                            <FontAwesomeIcon icon={faSearch} />
                        </Button>
                    </InputGroup>
                </Form>
            </div>

            {searchResult && (
                <div className="search-result">
                    <p>Search Result: {searchResult}</p>
                </div>
            )}

        </div>
    );
}

export default SearchBar;
