import React, { useState } from 'react';
import "../../styles/main.css";
import { Card, Button, Row, Col, Carousel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Listing } from '../../types';
import { useRouter } from 'next/navigation';

interface ListingBoxProps {
  item: Listing;
}

const ListingBox: React.FC<ListingBoxProps> = ({ item }) => {
  const [showCarousel, setShowCarousel] = useState(false);

  const formatPrice = (price: number) => {
    if (typeof price !== 'number') {
      return 'Invalid price';
    }
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(2)} crore`;
    } else {
      return `Rs. ${price.toLocaleString()}`;
    }
  };

  const handleMouseEnter = () => {
    setShowCarousel(true);
  };

  const handleMouseLeave = () => {
    setShowCarousel(false);
  };

  return (
    <Card className="listing-box" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="image-wrapper">
        {showCarousel ? (
          <Carousel>
            {item.ListingPictures.slice(0, 5).map((picture, index) => (
              <Carousel.Item key={index}>
                <img className="d-block w-100" src={picture} alt={`Slide ${index}`} />
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <Card.Img variant="top" src={item.ListingPictures[0]} alt={`Image of ${item.listing_type}`} />
        )}
      </div>
      <Card.Body>
        <Card.Title>
          <Row className="mb-2">
            <Col><span>{item.listing_type}</span></Col>
            <Col className="text-right"><span>{formatPrice(item.price)}</span></Col>
          </Row>
        </Card.Title>
        <Row className="mb-2">
          <Col><FontAwesomeIcon icon={faBed} /> {item.bedroom}</Col>
          <Col className="text-right"><FontAwesomeIcon icon={faBath} /> {item.bath}</Col>
        </Row>
        <hr />
        <Row className="mb-2">
          <Col>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
            <span style={{ marginLeft: '0.5rem' }}>{item.location}</span>, {item.area}
          </Col>
        </Row>
        <Button variant="primary" href="#">View</Button>
      </Card.Body>
    </Card>
  );
}

export default ListingBox;
