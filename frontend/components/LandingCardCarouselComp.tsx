'use client';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Listing } from '../types';
import styles from '../styles/main.module.css';

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
  const [data, setData] = useState<Listing[]>([]);
  // const [communities, setCommunities] = useState<Listing[]>([]);

  // console.log("this :" , typeof communities);

  useEffect(() => {
    fetch('http://localhost:5000/api/listings/alllistings')
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.error('Error fetching listings:', error);
      });

    // fetch('http://localhost:5000/api/community')
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data);
    //     setCommunities(data);
    //     console.log(communities)
    //   })
    //   .catch(error => {
    //     console.error('Error fetching communities:', error);
    //   });
  }, []);

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
    <div className={`${styles.carouselwrapper} mb-5`}>
      <h2 className={styles.heading}>Explore Available Listings</h2>
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={2000}
        containerClass={styles.carouselcontainer}
        itemClass="carousel-item-padding-40-px"
        showDots={false}
        customLeftArrow={<></>}
        customRightArrow={<></>}
      >
        {data.map((item, index) => (
          <Card key={index} className={`d-block ${styles.cardcustom}`}>
            <div className={styles.imagewrapper}>
              <Card.Img variant="top" src={item.ListingPictures[0] || 'placeholder.png'} alt={`Image of ${item.title}`} className={styles.cardimg}/>
            </div>
            <Card.Body className={styles.cardbody}>
              <Card.Title>
                <Row className="mb-4">
                  <Col><span>{item.listing_type === 'sell' ? 'For Sale' : 'For Rent'}</span></Col>
                  <Col className={styles.textright}><span>{formatPrice(item.price)}</span></Col>
                </Row>
              </Card.Title>
              <Row className="mb-3 mt-2">
                <Col><FontAwesomeIcon icon={faBed} /> {item.bedroom}</Col>
                <Col className={styles.textright}><FontAwesomeIcon icon={faBath} /> {item.bath}</Col>
              </Row>
              <hr />
              <Row className="mb-2">
                <Col md={5}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} />
                  <span style={{ marginLeft: '0.25rem' }}>{item.location.split(',')[0]}</span>, {item.area}
                </Col>
                <Col md={4} className={styles.textright}>
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
