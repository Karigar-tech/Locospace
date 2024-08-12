'use client';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {FaRulerCombined}from "react-icons/fa";
import { faBed, faBath, faMapMarkerAlt, faRuler } from '@fortawesome/free-solid-svg-icons';
import { Listing } from '../types';
import {useRouter} from 'next/navigation'
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
  const router = useRouter();
  const [data, setData] = useState<Listing[]>([]);
  // const [communities, setCommunities] = useState<Listing[]>([]);

  // console.log("this :" , typeof communities);

  

  const handleClick = (id: number) => {
    router.push(`/Listing?id=${id}`);
  };  

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/listings/alllistings`)
      .then(response => response.json())
      .then(data => {
        setData(data);
        console.log('landing',data)
      })
      .catch(error => {
        console.error('Error fetching listings:', error);
      });


  }, []);

  // Function to format price
  const formatPrice = (price: number) => {
    // Example conversion logic
    if(price > 100000 && price < 10000000){
      return `Rs ${(price/100000).toFixed(1)}  lakh`
    }
    if (price >= 10000000) { // If price is 10 million or more
      return `Rs ${(price / 10000000).toFixed(2)} crore`; // Convert to crore
    } else {
      return `Rs ${price.toLocaleString()}`; // Default format with commas for thousands
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
                  <Col md={4}><span>{item.listing_type === 'sell' ? 'For Sale' : 'For Rent'}</span></Col>
                  <Col className={styles.textright} md={6}><span>{formatPrice(item.price)}</span></Col>
                </Row>
              </Card.Title>
              <Row className="mb-3 mt-2"> 
                <Col md={2}><FontAwesomeIcon icon={faBed} /> {item.bedroom}</Col>
                <Col md={2}><FontAwesomeIcon icon={faBath} /> {item.bath}</Col>
                <Col md={4}><FaRulerCombined/> {item.area} </Col>
              </Row>
              <hr/>
              <Row className="mb-2">
                <Col md={6}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} />
                  <span >{item.location.split(',')[0]}</span>
                </Col>
                <Col md={3}>
                  <Button onClick={() => handleClick(item._id)}variant="primary" style={{ width: '3rem' , marginLeft:"2rem" }}>View</Button>
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
