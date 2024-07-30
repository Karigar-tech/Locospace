// ListingBox.tsx
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
    <Card key={index} className="d-block card-custom">
              <div className="image-wrapper">
                <Card.Img variant="top" src='placeholder.png' alt={`Image of ${item.title}`} />
              </div>
              <Card.Body>
                <Card.Title>
                  <Row className="mb-2">
                    <Col><span>{item.type}</span></Col>
                    <Col className="text-right"><span>{formatPrice(item.price)}</span></Col>
                  </Row>
                </Card.Title>
                <Row className="mb-2">
                  <Col><FontAwesomeIcon icon={faBed} /> {item.bedrooms}</Col>
                  <Col className="text-right"><FontAwesomeIcon icon={faBath} /> {item.baths}</Col>
                </Row>
                <hr />
                <Row className="mb-2">
                  <Col>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
                    <span style={{ marginLeft: '0.5rem' }}>{addressPart}</span>, {item.city}
                  </Col>
                </Row>
                <Button variant="primary" href="#">View</Button>
              </Card.Body>
            </Card>
  );
}

export default ListingBox;
