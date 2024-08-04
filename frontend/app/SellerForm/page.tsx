"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from 'next/navigation';
import {
  Button,
  Col,
  Form,
  Row,
  Modal,
  InputGroup,
  FormControl,
  Nav,
  Tab,
} from "react-bootstrap";

//Icons
import {
  FaParking,
  FaRunning,
  FaTree,
  FaBuilding,
  FaHandsHelping,
  FaShieldAlt,
  FaMoneyBillWave,
  FaPaw,
  FaChild,
  FaInfoCircle 
} from "react-icons/fa";
import { MdOutlineSecurity, MdElderly, MdOutlineHiking } from "react-icons/md";
import { FaPersonSwimming, FaPerson } from "react-icons/fa6";
import { CgGym } from "react-icons/cg";
import { GiBurningRoundShot } from "react-icons/gi";
import { GiPeaceDove } from "react-icons/gi";
//IconsEnd

import { Listing, Preferences } from "@/types";
import styles from "./sellerform.module.css";
import CustomCheckbox from "@/components/customcheckbox";

//navbar
import NavBar from "@/components/NavBar";

//message pop up
import Notification from '../../components/Seller/MessageComp';

//file
import ImageUploadSection from "../../components/Seller/FileComp";

const SellerForm: React.FC = () => {
  const [formData, setFormData] = useState<Listing>({
    _id: 0,
    ListingPictures: [],
    title: "",
    numberOfStories:0,
    Description: "",
    location: "",
    bedroom: 0,
    bath: 0,
    kitchen: 0,
    price: 0,
    listing_type: "",
    areasize: 0,
    areaunit: "",
    area: "",
    preferences: {
      environment: [],
      facilities: [],
      ageGroup: [],
    },
    community: "",
    user: {
      _id:0,
      username: "",
      address: "",
      contact: "",
      email: "",
      name: "",
      profilePicture: {
        filePath: "",
        url: "",
      },
    },
  });
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("environment");
  const [searchQueries, setSearchQueries] = useState({
    environment: "",
    facilities: "",
    ageGroup: ""
  });

  const [selectedOptions, setSelectedOptions] = useState<Record<keyof Preferences, string[]>>({
    environment: [],
    facilities: [],
    ageGroup: [],
  });
  
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('')
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isHomeIconVisible, setIsHomeIconVisible] = useState(true);
  
  const options = {
    environment: [
      "Busy",
      "Peaceful",
      "Green",
      "Commercial",
      "Supportive",
      "Safe",
      "Affordable",
      "Pet Friendly",
    ],
    facilities: ["Gym", "Swimming Pool", "Parking", "Security", "Playground"],
    ageGroup: ["Kids", "Teens", "Adults", "Seniors"],
  };
  const [filteredOptions, setFilteredOptions] = useState({
    environment: options.environment,
    facilities: options.facilities,
    ageGroup: options.ageGroup
  });
  const communities = [
   'DHA-1', 'DHA-2', 'Bahria Phase 1-6', 'Bahria Phase 7-9', 'Gulberg Greens', 'PWD'
];
  const area = ["Marla", "Kanal", "Square Feet", "Acres"];
  //images on the sell rent buttons
  const SELL_IMAGE = "/buy-home.png";
  const RENT_IMAGE = "/key.png";
  const ACTIVE_SELL_IMAGE = "/white-buy-home.png"; 
  const ACTIVE_RENT_IMAGE = "/white-key.png"; 
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleListingTypeChange = (type: string) => {
    setFormData((prev) => ({ ...prev, listing_type: type }));
  };

  const handleArea = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const newFormData = { ...prevData, [name]: value };
      if (name === "areaunit" || name === "areasize") {
        newFormData.area =
          `${newFormData.areaunit} ${newFormData.areasize}`.trim();
      }
      console.log(newFormData);
      return newFormData;
    });
  };

  const handleIncrement = (field: keyof Listing) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: (prevFormData[field] as number) + 1,
    }));
  };

  const handleDecrement = (field: keyof Listing) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: Math.max((prevFormData[field] as number) - 1, 0),
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles) {
      const fileArray = Array.from(newFiles);
      if (imagePreviews.length + fileArray.length > 5) {
        alert("You can only upload up to 5 images.");
        return;
      }
  
      //creatingg previews for new files
      const previews = fileArray.map(file => URL.createObjectURL(file));
  
      let updatedPreviews = [...imagePreviews];
      let updatedFiles = [...files];
  
      if (selectedImageIndex !== null) {
        //updatinf the selected
        updatedPreviews[selectedImageIndex] = previews[0];
        updatedFiles[selectedImageIndex] = fileArray[0];
  
        //main update
        if (selectedImageIndex === 0) {
          setMainImage(previews[0]);
        }
      } else {
        //more imgs
        updatedPreviews = [...updatedPreviews, ...previews];
        updatedFiles = [...updatedFiles, ...fileArray];

        if (!mainImage && updatedPreviews.length > 0) {
          setMainImage(previews[0]);
        }
      }
  
     
      setImagePreviews(updatedPreviews);
      setFiles(updatedFiles);
      setIsHomeIconVisible(updatedPreviews.length === 0);
      setSelectedImageIndex(null);
    }
  };
  
  
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    document.getElementById('fileInput')?.click();
  };

  const handleMainImageChange = () => {
    setSelectedImageIndex(0);
    document.getElementById('fileInput')?.click();
  };

  const handleAddMoreClick = () => {
    document.getElementById('fileInput')?.click();
  };

  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
   
    if (!mainImage && (!files || files.length === 0)) {
      setNotificationMessage("Please upload at least one image.");
      setShowNotification(true);
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("listing_type", formData.listing_type);
    formDataToSubmit.append("price", formData.price.toString());
    formDataToSubmit.append("title", formData.title);
    formDataToSubmit.append("Description", formData.Description);
    formDataToSubmit.append("location", formData.location);
    formDataToSubmit.append("bedroom", formData.bedroom.toString());
    formDataToSubmit.append("bath", formData.bath.toString());
    formDataToSubmit.append("kitchen", formData.kitchen.toString());
    formDataToSubmit.append("area", formData.area.toString());
    formDataToSubmit.append("numberOfStories", formData.numberOfStories.toString());
    formDataToSubmit.append("community", formData.community);
    
  Object.keys(formData.preferences).forEach((category) => {
    const prefs = formData.preferences[category as keyof Preferences];
    prefs.forEach((pref) => formDataToSubmit.append(`preferences[${category}][]`, pref));
  });
    
    if (files) {
      Array.from(files).forEach((f) => {
        formDataToSubmit.append("ListingPictures", f);
      });
    }

    setFormData(prevState => ({
      ...prevState,
      ListingPictures: [
        ...prevState.ListingPictures,
        ...Array.from(files).map(file => URL.createObjectURL(file))
      ]
    }));

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/listings/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSubmit,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Done", data.message);
      setNotificationMessage(data.message);
      setShowNotification(true);

      setTimeout(() => {
        router.push(`/Listing/?id=${data.listing_id}`);
      }, 2000);

      
    } catch (error) {
      
      console.error("Error:", error);
    }
  };

  const handleOptionSelect = (option: string, category: keyof Preferences) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [category]: prev[category]?.includes(option)
        ? prev[category].filter((o) => o !== option)
        : [...(prev[category] || []), option],
    }));
  };
  
  

  const handleConfirmSelection = () => {
    setFormData((prevFormData) => {
      //creating a new object with updated preferences
      const updatedPreferences = { ...prevFormData.preferences };
  
      //diff by cat
      Object.keys(selectedOptions).forEach((category) => {
        const key = category as keyof Preferences;
        updatedPreferences[key] = Array.from(new Set([
          ...(prevFormData.preferences[key] || []),
          ...(selectedOptions[key] || []),
        ]));
      });
  
      return {
        ...prevFormData,
        preferences: updatedPreferences,
      };
    });
  
    setShowModal(false);
    setSelectedOptions({
      environment: [],
      facilities: [],
      ageGroup: [],
    });
  };
   
  
  const handleCloseNotification = () => {
    setShowNotification(false);
  };
  

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim().replace(/\s+/g, " ").toLowerCase();
    
    setSearchQueries(prevQueries => ({
      ...prevQueries,
      [activeTab]: query
    }));
  
    const currentOptions = options[activeTab as keyof typeof options];
    const filtered = currentOptions.filter(option =>
      option.toLowerCase().includes(query)
    );
    
    setFilteredOptions(prevOptions => ({
      ...prevOptions,
      [activeTab]: filtered
    }));
  }
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
  const handleRemoveOption = (option: string, type: 'environment' | 'facilities' | 'ageGroup') => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      preferences: {
        ...prevFormData.preferences,
        [type]: prevFormData.preferences[type].filter((item) => item !== option),
      },
    }));
  };
  

  useEffect(() => {
    if (showModal) {
      document.body.classList.add(styles.modalOpen);
    } else {
      document.body.classList.remove(styles.modalOpen);
    }
    return () => document.body.classList.remove(styles.modalOpen);
  }, [showModal]);


  return (
    <div>
      <NavBar/>
      <img src="/Sellerform.png" alt="Logo" className={styles.imgFluid} />
    <div className={styles.sellerFormUuterdiv}>
    <div className="container-fluid">
      <Form onSubmit={handleSubmit} className="mb-5">
        <div className="card p-3" style={{ border: "none" }}>
          <Row>
            <Col s={6} md={6}>
              <Form.Group>
                <h4 className = {styles.fontStyle}>Purpose</h4>
                <div className="d-flex mt-3">
                <button
                      className={`${styles.button} ${formData.listing_type === "sell" ? styles.active : styles.inactive}`}
                      onClick={() => handleListingTypeChange("sell")}
                    >
                      <img
                        src={formData.listing_type === "sell" ? ACTIVE_SELL_IMAGE : SELL_IMAGE}
                        alt="Sell Icon"
                        className={styles.image}
                      />
                      Sell
                  </button>
                  <button
                      className={`${styles.button} ${formData.listing_type === "rent" ? styles.active : styles.inactive}`}
                      onClick={() => handleListingTypeChange("rent")}
                    >
                      <img
                         src={formData.listing_type === "rent" ? ACTIVE_RENT_IMAGE : RENT_IMAGE}
                         alt="Rent Icon"
                         className={styles.image}
                      />
                      Rent
                  </button>
    
                </div>
              </Form.Group>
              <Form.Group>
                <h4 className ={styles.labels}>Address</h4>
                <Form.Control
                  as="textarea"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter your full address"
                  className = {styles.AddressField}
                  required
                />
           
              </Form.Group>
            </Col>
            <Col
             
              className={`d-flex justify-content-end align-items-center ${styles.imageAligment}`}
            >
               <ImageUploadSection
                 mainImage={mainImage}
                 imagePreviews={imagePreviews}
                 isHomeIconVisible={isHomeIconVisible}
                 onMainImageChange={handleMainImageChange}
                 onImageClick={handleImageClick}
                 onAddMoreClick={handleAddMoreClick}
                 onFileChange={handleFileChange}
                />
       
            </Col>
          </Row>
          <Row>
           
            <Col md={5} className="mt-3">
              <Form.Group>
                <h4 className = {styles.fontStyle}>Area Size</h4>
                <Form.Control
                  type="Number"
                  name="areaunit"
                  value={formData.areaunit}
                  onChange={handleArea}
                  placeholder="Enter Area Size"
                  required
                  className = {`mb-4 w-50 ${styles.AreaField}`}
                  min="1"
                />
                <Form.Control
                  as="select"
                  name="areasize"
                  value={formData.areasize}
                  onChange={handleArea}
                  required
                  className= {`w-50 ${styles.AreaField}`}
                >
                  <option value="">Select Area Unit</option>
                  {area.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={5} className="mt-3">
            <Form.Group className={styles.paddingLeft}>
              <h4 className = {styles.fontStyle}>{formData.listing_type === "rent" ? "Amount per month" : "Price"}</h4>
                <Form.Control
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder={`Enter the ${formData.listing_type === "rent" ? "amount per month" : "price"}`}
                  required
                  className={`w-50 ${styles.AreaField}`}
                />
               {formData.listing_type === "rent" && (
                      <Form.Group className="mt-3">
                        <h4 className = {styles.fontStyle}>Number of Stories</h4>
                        <Form.Control
                          type="number"
                          name="numberOfStories"
                          value={formData.numberOfStories}
                          onChange={handleChange}
                          placeholder="Enter number of stories"
                          required
                          className={`w-50 ${styles.AreaField}`}
                           min="1"
                        />
                      </Form.Group>
                )}
              </Form.Group>
            </Col>
          </Row>
        </div>
        <div className="card mb-1 p-3" style={{ border: "none" }}>
          <Row>
            <Col md={6} className="">
              <Form.Group>
                <h4 className = {styles.fontStyle}>Title</h4>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter title for your property"
                  required
                  className={`${styles.AddressField} mb-2 w-90`}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="">
            <Form.Group >
              <h4 className = {styles.fontStyle}>Community</h4>
                <Form.Control
                    as="select"
                    name="community"
                    value={formData.community}
                    onChange={handleChange}
                    className={`${styles.AddressField} mb-2 w-90`}
                >
                    <option value="">Select Community</option>
                    {communities.map((community) => (
                        <option key={community} value={community}>
                            {community}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            </Col>
            <Col md={11}>
              <Form.Group>
                <h4 className ={styles.labels}>Description</h4>
                <Form.Control
                  as="textarea"
                  name="Description"
                  value={formData.Description}
                  onChange={handleChange}
                  placeholder="Provide a captivating description highligting key features and environment factors that will appeal to potential buyers or renters."
                  required
                  className={`${styles.DescField}`}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>

        <div className="card mb-4 p-3" style={{ border: "none" }}>
          <Row>
            <Col xs={6} md={6}>
            <h4 className={styles.fontStyle}>Features</h4>
              <ul className={styles.featuresList}>
                <li className={styles.featuresListItem}>
                  <label  className= {styles.stylesFeatures} >Bedrooms:</label>
                  <div className={styles.qty}>
                    <span
                      className={styles.minus}
                      onClick={() => handleDecrement("bedroom")}
                    >
                      -
                    </span>
                    <input
                      type="text"
                      name="bedroom"
                      value={formData.bedroom}
                      readOnly
                      className={styles.count}
                    />
                    <span
                      className={styles.plus}
                      onClick={() => handleIncrement("bedroom")}
                    >
                      +
                    </span>
                  </div>
                </li>
                <li className={styles.featuresListItem}>
                  <label className= {styles.stylesFeatures}>Kitchen:</label>
                  <div className={styles.qty}>
                    <span
                      className={styles.minus}
                      onClick={() => handleDecrement("kitchen")}
                    >
                      -
                    </span>
                    <input
                      type="text"
                      name="kitchen"
                      value={formData.kitchen}
                      readOnly
                      className={styles.count}
                    />
                    <span
                      className={styles.plus}
                      onClick={() => handleIncrement("kitchen")}
                    >
                      +
                    </span>
                  </div>
                </li>
                <li className={styles.featuresListItem}>
                  <label className= {styles.stylesFeatures} >Bathrooms:</label>
                  <div className={styles.qty}>
                    <span
                      className={styles.minus}
                      onClick={() => handleDecrement("bath")}
                    >
                      -
                    </span>
                    <input
                      type="text"
                      name="bath"
                      value={formData.bath}
                      readOnly
                      className={styles.count}
                    />
                    <span
                      className={styles.plus}
                      onClick={() => handleIncrement("bath")}
                    >
                      +
                    </span>
                  </div>
                </li>
              </ul>

            </Col>
            <Col xs={6} md={5}>
              <h4 className = {styles.fontStyle}>Preferences</h4>
              <div>
                <Button
                  
                  className= {styles.preferenceButton}
                  onClick={() => {
                    setShowModal(true);
                    setActiveTab("environment");
                  }}
                >
                  + Add Preferences
                </Button>
                <div className={styles.selectedOptionsContainer}>
                  
                  {formData.preferences.environment.length > 0 && (
                    <div className={styles.categorySection}>
                     
                      {formData.preferences.environment.map((env, index) => (
                        <span
                          key={index}
                          className={`${styles.selectedOption} ${styles.environment}`}
                        >
                          {environmentIconMap[env] || null} 
                          <span className={styles.optionText}>{env}</span>
                          <span
                            className={styles.removeOption}
                            onClick={() => handleRemoveOption(env, 'environment')}
                          >
                            ×
                          </span>
                        </span>
                      ))}
                      <hr className={styles.separator} />
                    </div>
                  )}

                  {formData.preferences.facilities.length > 0 && (
                    <div className={styles.categorySection}>
                      
                      {formData.preferences.facilities.map((fac, index) => (
                        <span
                          key={index}
                          className={`${styles.selectedOption} ${styles.facilities}`}
                        >
                          {facilitiesIconMap[fac] || null}
                          <span className={styles.optionText}>{fac}</span>
                          <span
                            className={styles.removeOption}
                            onClick={() => handleRemoveOption(fac, 'facilities')}
                          >
                            ×
                          </span>
                        </span>
                      ))}
                      <hr className={styles.separator} />
                    </div>
                  )}

                  {formData.preferences.ageGroup.length > 0 && (
                    <div className={styles.categorySection}>
                      
                      {formData.preferences.ageGroup.map((age, index) => (
                        <span
                          key={index}
                          className={`${styles.selectedOption} ${styles.ageGroup}`}
                        >
                          {ageGroupIconMap[age] || null}
                          <span className={styles.optionText}>{age}</span>
                          <span
                            className={styles.removeOption}
                            onClick={() => handleRemoveOption(age, 'ageGroup')}
                          >
                            ×
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </Col>
          </Row>
        </div>

        <div className= {styles.textEnd}>
          <Button type="submit" className="me-2 btn-primary rounded-3 px-4">
            Publish
          </Button>
          <Button
            type="button"
            variant="primary"
            className={`${styles.btnCancel} rounded-3 px-4`}
          >
            Cancel
          </Button>
        </div>
      </Form>
    
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered
        className={`{${styles.modalDialogFixedHeight} .modal-content}`}
        dialogClassName={styles.modalDialogFixedHeight} 
        contentClassName={styles.modalContent}
        >
         
        <Modal.Header closeButton className = {styles.modalCustom}>
          <Modal.Title>Choose the Preferences</Modal.Title>
        </Modal.Header>
       
        <Modal.Body className={styles.modalBodyFixedHeight} >
          <Tab.Container activeKey={activeTab}>
            <Nav variant="pills">
              <Nav.Item>
                <Nav.Link
                  eventKey="environment"
                  onClick={() => setActiveTab("environment")}
                >
                  Environment
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="facilities"
                  onClick={() => setActiveTab("facilities")}
                >
                  Facilities
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="ageGroup"
                  onClick={() => setActiveTab("ageGroup")}
                >
                  Age Group
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="environment">
                <InputGroup className="mb-3 mt-3">
                  <FormControl
                    placeholder="Search Environment..."
                    value={searchQueries.environment}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
                <CustomCheckbox 
                  options={filteredOptions.environment}
                  IconMap={environmentIconMap}
                  selectedOption={selectedOptions}
                  handleOptionSelect={(option) => handleOptionSelect(option,'environment')}
                  activeCategory="environment"
                />
              </Tab.Pane>

              <Tab.Pane eventKey="facilities">
                <InputGroup className="mb-3 mt-3">
                  <FormControl
                    placeholder="Search Facilities..."
                    value={searchQueries.facilities}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
                <CustomCheckbox
                  options={filteredOptions.facilities}
                  IconMap={facilitiesIconMap}
                  selectedOption={selectedOptions}
                  handleOptionSelect={(option) => handleOptionSelect(option,'facilities')}
                  activeCategory="facilities"
                />
              </Tab.Pane>
              <Tab.Pane eventKey="ageGroup">
                <InputGroup className="mb-3 mt-3">
                  <FormControl
                    placeholder="Search Age Group..."
                    value={searchQueries.ageGroup}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
                <CustomCheckbox
                  options={filteredOptions.ageGroup}
                  IconMap={ageGroupIconMap}
                  selectedOption={selectedOptions}
                  handleOptionSelect={(option) => handleOptionSelect(option,'ageGroup')}
                   activeCategory="ageGroup"
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
        
        <Modal.Footer className = {styles.modelFooter}>
          <Button variant="primary" onClick={handleConfirmSelection}>
            Confirm
          </Button>
        </Modal.Footer>
       
      </Modal>

      {showNotification && (
        <Notification
          message={notificationMessage}
          onClose={handleCloseNotification}
        />
      )}
      </div>
    </div>
   
    </div>

  );
};

export default SellerForm;
