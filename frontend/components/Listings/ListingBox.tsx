import React from 'react';
import "../../styles/main.css";
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Listing } from '../../types';
import { useRouter } from 'next/navigation';

interface ListingBoxProps {
  item: Listing;
}

const ListingBox: React.FC<ListingBoxProps> = ({ item }) => {
  const router = useRouter();

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

  const handleClick = () => {
    router.push(`/Listing?id=${item._id}`); // Use the correct property for listing ID
  };

  return (
    <Card className="listing-box">
      <Card.Img 
        variant="top" 
        src={item.ListingPictures[0] || 'placeholder.png'} 
        alt={`Image of ${item.listing_type}`} 
        className="listing-image" 
      />
      <Card.Body>
        <Card.Title className="d-flex justify-content-between mb-2">
          <span>{item.listing_type}</span>
          <span>{formatPrice(item.price)}</span>
        </Card.Title>
        
        <Col className="d-flex justify-content-between mb-2">
          <Row><FontAwesomeIcon icon={faBed} /> {item.bedroom} Beds</Row>
          <Row className="text-right"><FontAwesomeIcon icon={faBath} /> {item.bath} Baths</Row>
        </Col>
        <hr />
        <Row className="mb-1">
          <Col>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
            <span style={{ marginLeft: '0.25rem' }} className='listing-address'>{item.location}</span>
          </Col>
        </Row>
        <Button onClick={handleClick} variant="primary">View</Button>
      </Card.Body>
    </Card>
  );
}

export default ListingBox;
