import React from 'react';
import "../../styles/main.css";
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faList } from '@fortawesome/free-solid-svg-icons';
import { faBed, faBath, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import {Listing} from '../../types'
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
        router.push(`/Listing?id=${item._id}`); 
      };
    return (
    <Card className="listing-box" >
      <div className="image-wrapper">
        <Card.Img variant="top" src={item.ListingPictures[0]} alt={`Image of ${name}`} />
      </div>
      <Card.Body>
                <Card.Title>
                  <Row className="mb-2">
                    <Col><span>House</span></Col>
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
                <Button onClick={handleClick} variant="primary" href="#">View</Button>
              </Card.Body>
    </Card>
  );
}

export default ListingBox;
