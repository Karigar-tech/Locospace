import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FaBed, FaBath, FaMapMarkerAlt } from 'react-icons/fa'; 
import { Listing } from '../../types';
import { useRouter } from 'next/navigation';
import styles from './listingbox.module.css'; // Import CSS module

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

  const formatBedroomText = (bedroom: number) => bedroom === 1 ? 'Bedroom' : 'Bedrooms';
  const formatBathText = (bath: number) => bath === 1 ? 'Bath' : 'Baths';


  const getFormattedAddress = (address: string) => {
    const parts = address.split(',').filter(part => part.trim() !== '');
    if (parts.length > 0) {
      return parts[0].trim();
    }
    return address;
  };

  return (
    <Card className={styles.listingBox}>
      <Card.Img 
        variant="top" 
        src={item.ListingPictures[0] || 'placeholder.png'} 
        alt={`Image of ${item.listing_type}`} 
        className={styles.listingImage} 
      />
      <Card.Body>
        <Card.Title className={`${styles.listingTitle} d-flex justify-content-between mb-2`}>
          <span>{item.listing_type === 'sell' ? 'For Sale' : 'For Rent'}</span>
          <span>{formatPrice(item.price)}</span>
        </Card.Title>

        <Col className={`${styles.listingRow} mb-2`}>
          <Col xs={6} className="d-flex align-items-center">
            <FaBed className={styles.icon} />
            <span className={styles.infoText}>{item.bedroom} {formatBedroomText(item.bedroom)}</span>
          </Col>
          <Col xs={6} className="d-flex align-items-center">
            <FaBath className={styles.icon} />
            <span className={styles.infoText}>{item.bath} {formatBathText(item.bath)}</span>
          </Col>
        </Col>
        <hr></hr>
        <Col className={`${styles.listingRow} mb-2`}>
          <Col xs={6} className="d-flex align-items-center">
            <FaMapMarkerAlt className={styles.navIcon} />
            <span className={styles.infoText}>{getFormattedAddress(item.location)}</span>
          </Col>
          <Col xs={6} className="d-flex align-items-center justify-content-end">
            <Button onClick={handleClick} variant="primary" className={styles.buttonListingView}>View</Button>
          </Col>
        </Col>
      </Card.Body>
    </Card>
  );
}

export default ListingBox;
