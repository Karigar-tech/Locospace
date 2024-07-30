import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import '../../styles/profile.css';
import { Listing } from '../../types';

interface CardGridCompProps {
  data: Listing[];
}

const CardGridComp: React.FC<CardGridCompProps> = ({ data }) => {

  // Function to format price
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(2)} crore`;
    } else {
      return `Rs. ${price.toLocaleString()}`;
    }
  };

  return (
    <div className="card-grid-wrapper">
      <Row className="card-grid">
        {data.map((listing) => (
          <Col md={12} key={listing._id}>
            <Card className="card-custom">
              <div className="image-wrapper">
                <Card.Img variant="top" src={listing.ListingPictures[0] || 'placeholder.png'} />
              </div>
              <div className="card-body-wrapper">
                <Card.Body>
                  <Row className="mb-2">
                    <Col className="text-right"><span className="listing-type">{listing.listing_type}</span></Col>
                    <Col className="text-right"><span className="price">{formatPrice(listing.price)}</span></Col>
                  </Row>
                  <Row className="mb-3 mt-2">
                    <Col><FontAwesomeIcon icon={faBed} /> {listing.bedroom} Bedrooms</Col>
                    <Col><FontAwesomeIcon icon={faBath} /> {listing.bath} Bathrooms</Col>
                  </Row>
                  <hr />
                  <Row className="mb-2">
                    <Col md={7}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
                      <span style={{ marginLeft: '0.25rem' }}>{listing.location}</span>
                    </Col>
                    <Col md={5} className="text-right">
                      <Button variant="primary" href="#" style={{ width: '5rem' }}>View</Button>
                    </Col>
                  </Row>
                </Card.Body>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CardGridComp;
