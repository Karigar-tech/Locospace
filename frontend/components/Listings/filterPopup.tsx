import React, { useState } from 'react';
import { Button, Form, Nav, Tab, Tabs } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import styles from './filterPop.module.css'

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
  const [activeTab, setActiveTab] = useState<string>('environments');

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
          <div className={styles.filterHeader}>
            <h4>Filter</h4>
            <button className={styles.closeButton} onClick={toggleFilters}>
              <FaTimes />
            </button>
          </div>
          <div className={styles.filterContent}>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || 'environments')}
              id="filter-tabs"
              className="mb-3"
            >
              <Tab eventKey="environments" title="Environments">
                <div className={styles.filterSection}>
                  {Object.entries(environmentIconMap).map(([key, icon]) => (
                    <Form.Check
                     className = {styles.popupformCheck}
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
              </Tab>
              <Tab eventKey="facilities" title="Facilities">
              <div className={styles.filterSection}>
                  {Object.entries(facilitiesIconMap).map(([key, icon]) => (
                    <Form.Check
                    className = {styles.popupformCheck}
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
              </Tab>
              <Tab eventKey="ageGroups" title="Age Groups">
              <div className={styles.filterSection}>
                  {Object.entries(ageGroupIconMap).map(([key, icon]) => (
                    <Form.Check
                    className = {styles.popupformCheck}
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
              </Tab>
            </Tabs>
            <div className="filter-actions">
             
              <Button variant="primary" onClick={handleApplyFilters} className={styles.applyFiltersPopup}>
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
