import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/main.css';

interface CSVData {
  url: string;
  title: string;
  type: string;
  price: number;
  area: string;
  city: string;
  address: string;
  bedrooms: string;
  baths: string;
}

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  }
};

const CardCarouselComp: React.FC = () => {
  const [data, setData] = useState<CSVData[]>([]);

  useEffect(() => {
    fetch('/zameen.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse<CSVData>(csvText, {
          header: true,
          complete: (results) => {
            setData(results.data);
          }
        });
      });
  }, []);

  console.log(data)

  // Function to format price
  const formatPrice = (price: number) => {
    // Example conversion logic
    if (price >= 10000000) { // If price is 10 million or more
      return `${(price / 10000000).toFixed(2)} crore`; // Convert to crore
    } else {
      return `Rs. ${price.toLocaleString()}`; // Default format with commas for thousands
    }
  };

  return (
    <div className="carousel-wrapper">
      <h2 className="heading">Explore Available Listings</h2>
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={2000}
        containerClass="carousel-container"
        itemClass="carousel-item-padding-40-px"
        showDots={false}
        customLeftArrow={<></>}
        customRightArrow={<></>}
      >
        {data.slice(0, 10).map((item, index) => (
          <Card key={index} className="d-block card-custom">
            <div className="image-wrapper">
              <Card.Img variant="top" src='placeholder.png' alt={`Image of ${item.title}`} />
            </div>
            <Card.Body>
              <Card.Title><Row className="mb-2">
                <Col><span>{item.type}</span></Col>
                <Col className="text-right"><span>{formatPrice(item.price)}</span></Col>
              </Row></Card.Title>
              <Row className="mb-3 mt-2">
                <Col><FontAwesomeIcon icon={faBed} /> {item.bedrooms}</Col>
                <Col className="text-right"><FontAwesomeIcon icon={faBath} /> {item.baths}</Col>
              </Row>
              <hr />
              <Row className="mb-2">
                <Col md={5}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
                  <span style={{ marginLeft: '0.25rem' }}>{item.address.split(',')[0]}</span>, {item.city}
                </Col>
                <Col md={4} className="text-right">
                  <Button variant="primary" href="#" style={{ width: '5rem' }}>View</Button>
                </Col>                
              </Row>
            </Card.Body>
          </Card>
        ))}
      </Carousel>
    </div>
  );
};

export default CardCarouselComp;
