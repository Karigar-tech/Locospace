import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import styles from '../../styles/profile.module.css'; // Import CSS Module
import { Listing } from '../../types';
import { useRouter } from 'next/navigation';
import { MdDeleteForever } from "react-icons/md";

interface CardGridCompProps {
  data: Listing[];
  onDeleteListing?: (id: number) => void;
  showActions?: boolean;
}

const CardGridComp: React.FC<CardGridCompProps> = ({ data = [], onDeleteListing, showActions = true }) => {
  const router = useRouter();

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(2)} crore`;
    } else {
      return `${price.toLocaleString()}`;
    }
  };

  const handleClick = (id: number) => {
    router.push(`/Listing?id=${id}`);
  };

  const handleSeller = () => {
    router.push(`/SellerForm`);
  };

  return (
    <div className={styles.cardGridWrapper}>
      <Row style={{ gap: "20px" }}>
        {data && data.map((listing) => (
          <Col md={12} key={listing._id}>
            <Card className={styles.cardCustomProf}>
              <div className={styles.imageWrapperProf}>
                <Card.Img variant="top" src={listing.ListingPictures[0] || 'placeholder.png'} />
              </div>
              <div className={styles.cardBodyWrapperProf}>
                <Card.Body>
                  <Row className="mb-2">
                    <Col className="text-right"><span className={styles.listingType}>{listing.listing_type === 'sell' ? 'For Sale' : 'For Rent'}</span></Col>
                    <Col className="text-right"><span className={styles.price}>Rs. {formatPrice(listing.price)}</span></Col>
                  </Row>
                  <Row className="mb-3 mt-2">
                    <Col><FontAwesomeIcon icon={faBed} /> {listing.bedroom} {listing.bedroom === 1 ? 'Bedroom' : 'Bedrooms'}</Col>
                    <Col><FontAwesomeIcon icon={faBath} /> {listing.bath} {listing.bath === 1 ? 'Bath' : 'Baths'}</Col>
                  </Row>
                  <hr />
                  <Row className="mb-2">
                    <Col md={7}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} />
                      <span style={{ marginLeft: '0.25rem' }}>{listing.location}</span>
                    </Col>
                    <Col md={5} className={styles.textRightProf}>
                      {showActions && onDeleteListing && (
                        <MdDeleteForever onClick={() => onDeleteListing(listing._id)} size={24} style={{ marginBottom: "10px" }} className={styles.deleteButton} />
                      )}
                      <Button onClick={() => handleClick(listing._id)} className={styles.profViewButton} variant="primary" style={{ width: '5rem' }}>View</Button>
                    </Col>
                  </Row>
                </Card.Body>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      {showActions && data.length <= 1 && (
        <Button onClick={handleSeller} className={styles.profCreateButton} variant="primary" style={{ width: '12rem' }}>
          + Create Listing
        </Button>
      )}
    </div>
  );
};

export default CardGridComp;
