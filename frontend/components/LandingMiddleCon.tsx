"use client";

import React, { useState } from "react";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faFilter,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/main.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// Icons
import {
  FaBed,
  FaParking,
  FaRunning,
  FaTree,
  FaBuilding,
  FaHandsHelping,
  FaShieldAlt,
  FaMoneyBillWave,
  FaPaw,
  FaChild,
} from "react-icons/fa";
import { MdOutlineSecurity, MdElderly, MdOutlineHiking } from "react-icons/md";
import { FaPersonSwimming, FaPerson } from "react-icons/fa6";
import { CgGym } from "react-icons/cg";
import { GiBurningRoundShot } from "react-icons/gi";
import { GiPeaceDove } from "react-icons/gi";

const communities = [
  "DHA-1",
  "DHA-2",
  "Bahria Phase 1-6",
  "Bahria Phase 7-9",
  "Gulberg Greens",
  "PWD",
];

const environmentIconMap: Record<string, React.ReactElement> = {
  Busy: <FaRunning />,
  Peaceful: <GiPeaceDove />,
  Green: <FaTree />,
  Commercial: <FaBuilding />,
  Supportive: <FaHandsHelping />,
  Safe: <FaShieldAlt />,
  Affordable: <FaMoneyBillWave />,
  "Pet Friendly": <FaPaw />,
};

const facilitiesIconMap: Record<string, React.ReactElement> = {
  Gym: <CgGym />,
  "Swimming Pool": <FaPersonSwimming />,
  Parking: <FaParking />,
  Security: <MdOutlineSecurity />,
  Playground: <GiBurningRoundShot />,
};

const ageGroupIconMap: Record<string, React.ReactElement> = {
  Kids: <FaChild />,
  Teens: <FaPerson />,
  Adults: <MdOutlineHiking />,
  Seniors: <MdElderly />,
};

const LandingPageComp: React.FC = () => {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>(
    []
  );
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSell = () => {
    router.push("/SellerForm");
  };

  const handleApplyFilters = () => {
    const queryParams = new URLSearchParams();

    if (searchTerm) {
      queryParams.append("search", searchTerm);
    }

    if (selectedCommunity) {
      queryParams.append("community", selectedCommunity);
    }
    if (selectedEnvironments.length) {
      queryParams.append("environments", selectedEnvironments.join(","));
    }
    if (selectedFacilities.length) {
      queryParams.append("facilities", selectedFacilities.join(","));
    }
    if (selectedAgeGroups.length) {
      queryParams.append("ageGroups", selectedAgeGroups.join(","));
    }

    router.push(`/Listings?${queryParams.toString()}`);
  };

  const handleCheckboxChange = (
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleCommunityChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setSelectedCommunity(e.target.value);
    console.log("Selected Community:", e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    const queryParams = new URLSearchParams();

    if (searchTerm) {
      queryParams.append("search", searchTerm);
    }

    router.push(`/Communities?${queryParams.toString()}`);
  };

  const handleBuyClick = async () => {
    localStorage.removeItem("selectedCommunity");
    try {
      const response = await fetch(
        `http://localhost:5000/api/listings/type?keyword=buy`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        router.push("/Listings?keyword=buy");
      } else {
        console.error("Error fetching buy listings:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching buy listings:", error);
    }
  };

  const handleRentClick = async () => {
    localStorage.removeItem("selectedCommunity");
    router.push("/Listings?keyword=rent");
  };

  return (
    <Container fluid>
      <Row>
        <img
          src="LandingBackgroundnew.png"
          alt="Landing Background"
          style={{paddingLeft:"0rem"}}
          className={`${styles.backgroundimage}`}
        />
        <Col md={5} style={{ padding: "3rem" }}>
          <div>
            <div className={styles.bigtext}>
              Find your Community
              <br />
              not just a Property!
            </div>
            <div className={styles.smalltext}>
              Welcome to Locospace, your ultimate destination for finding the
              perfect home. Whether you&apos;re looking to rent or buy, our
              extensive listings cover everything from cosy apartments to
              spacious family homes.
            </div>
            <div className={styles.searchcontainer}>
              <div className={styles.buttonscontainer}>
                <Button
                  className={styles.searchbuttons}
                  variant="primary"
                  onClick={handleBuyClick}
                >
                  Buy
                </Button>
                <Button
                  className={styles.searchbuttons}
                  variant="primary"
                  onClick={handleSell}
                >
                  Sell
                </Button>
                <Button
                  className={styles.searchbuttons}
                  variant="primary"
                  onClick={handleRentClick}
                >
                  Rent
                </Button>
              </div>
              <Form>
                <InputGroup className="mb-5">
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Discover your perfect home"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Button variant="outline-secondary" onClick={toggleFilters}>
                    <FontAwesomeIcon icon={faFilter} />
                  </Button>
                  <Button
                    variant="primary"
                    id="button-search"
                    onClick={handleSearchClick}
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </InputGroup>
              </Form>
            </div>
          </div>
        </Col>

        <Col
          className="d-flex flex-column align-items-center"
          md={5}
          style={{ paddingLeft: "4rem", marginTop: "-9rem" }}
        >
          <img src="/object.svg" alt="Landing Image" width={500} height={500} />
          <Link href="/Communities" passHref>
            <Button className="mt-3">Explore Communities</Button>
          </Link>
        </Col>
      </Row>

      {/* Filter Popup */}
      {showFilters && (
        <div className={styles.filterpopup}>
          <div className={styles.filterpopupheader}>
            <Button variant="link" onClick={toggleFilters}>
              Close
            </Button>
          </div>
          <Form>
            <Form.Group controlId="filter">
              <Form.Label>Communities</Form.Label>
              <select
                value={selectedCommunity || ""}
                onChange={handleCommunityChange}
              >
                <option value="">Select a community</option>
                {communities.map((community, index) => (
                  <option key={index} value={community}>
                    {community}
                  </option>
                ))}
              </select>
              <hr />
              <Form.Label>Preferences</Form.Label>
              <div className={styles.filterpopupcontent}>
                <div className={styles.filterboxitem}>
                  <Form.Label>Environment</Form.Label>
                  {Object.entries(environmentIconMap).map(([label, icon]) => (
                    <Form.Check
                      key={label}
                      type="checkbox"
                      label={
                        <>
                          <span>
                            {icon} {label}
                          </span>
                        </>
                      }
                      checked={selectedEnvironments.includes(label)}
                      onChange={() =>
                        handleCheckboxChange(setSelectedEnvironments, label)
                      }
                    />
                  ))}
                </div>
                <div className={styles.filterboxitem}>
                  <Form.Label>Facilities</Form.Label>
                  {Object.entries(facilitiesIconMap).map(([label, icon]) => (
                    <Form.Check
                      key={label}
                      type="checkbox"
                      label={
                        <>
                          <span>
                            {icon} {label}
                          </span>
                        </>
                      }
                      checked={selectedFacilities.includes(label)}
                      onChange={() =>
                        handleCheckboxChange(setSelectedFacilities, label)
                      }
                    />
                  ))}
                </div>
                <div className={styles.filterboxitem}>
                  <Form.Label>Age Group</Form.Label>
                  {Object.entries(ageGroupIconMap).map(([label, icon]) => (
                    <Form.Check
                      key={label}
                      type="checkbox"
                      label={
                        <>
                          <span>
                            {icon} {label}
                          </span>
                        </>
                      }
                      checked={selectedAgeGroups.includes(label)}
                      onChange={() =>
                        handleCheckboxChange(setSelectedAgeGroups, label)
                      }
                    />
                  ))}
                </div>
              </div>
            </Form.Group>
          </Form>
          <div className={styles.filterpopupfooter}>
            <Button variant="primary" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default LandingPageComp;
