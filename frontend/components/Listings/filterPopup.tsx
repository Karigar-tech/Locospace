import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap'; 

interface FilterPopupProps {
  showFilters: boolean;
  toggleFilters: () => void;
  community: string;
  environmentIconMap: { [key: string]: React.ReactNode };
  facilitiesIconMap: { [key: string]: React.ReactNode };
  ageGroupIconMap: { [key: string]: React.ReactNode };
  onApplyFilters: (filters: {
    community: string;
    environments: string[];
    facilities: string[];
    ageGroups: string[];
  }) => void;
}

const FilterPopup: React.FC<FilterPopupProps> = ({
  showFilters,
  toggleFilters,
  community,
  environmentIconMap,
  facilitiesIconMap,
  ageGroupIconMap,
  onApplyFilters,
}) => {
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);

  const handleEnvironmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedEnvironments((prev) =>
      prev.includes(value)
        ? prev.filter((env) => env !== value)
        : [...prev, value]
    );
  };

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedFacilities((prev) =>
      prev.includes(value)
        ? prev.filter((fac) => fac !== value)
        : [...prev, value]
    );
  };

  const handleAgeGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedAgeGroups((prev) =>
      prev.includes(value)
        ? prev.filter((age) => age !== value)
        : [...prev, value]
    );
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      community,
      environments: selectedEnvironments,
      facilities: selectedFacilities,
      ageGroups: selectedAgeGroups,
    });
    toggleFilters();
  };

  return (
    <>
      {showFilters && (
        <div className="filter-popup">
          <div className="filter-header">
            <h4>Filter</h4>
            <button onClick={toggleFilters}>Close</button>
          </div>
          <div className="filter-content">
            <div className="filter-section">
              <h5>Environments</h5>
              {Object.entries(environmentIconMap).map(([key, icon]) => (
                <Form.Check
                  key={key}
                  type="checkbox"
                  id={`environment-${key}`}
                  value={key}
                  label={
                    <>
                      {icon} {key}
                    </>
                  }
                  onChange={handleEnvironmentChange}
                />
              ))}
            </div>
            <div className="filter-section">
              <h5>Facilities</h5>
              {Object.entries(facilitiesIconMap).map(([key, icon]) => (
                <Form.Check
                  key={key}
                  type="checkbox"
                  id={`facility-${key}`}
                  value={key}
                  label={
                    <>
                      {icon} {key}
                    </>
                  }
                  onChange={handleFacilityChange}
                />
              ))}
            </div>
            <div className="filter-section">
              <h5>Age Groups</h5>
              {Object.entries(ageGroupIconMap).map(([key, icon]) => (
                <Form.Check
                  key={key}
                  type="checkbox"
                  id={`ageGroup-${key}`}
                  value={key}
                  label={
                    <>
                      {icon} {key}
                    </>
                  }
                  onChange={handleAgeGroupChange}
                />
              ))}
            </div>
            <div className="filter-actions">
              <Button variant="secondary" onClick={toggleFilters}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterPopup;
