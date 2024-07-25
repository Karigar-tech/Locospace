import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import Papa from 'papaparse';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/selectedlist.css';

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

const VerticalCardCarousel: React.FC = () => {
  const [data, setData] = useState<CSVData[]>([]);

  useEffect(() => {
    fetch('/zameen.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse<CSVData>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log('Parsed data:', results.data);
            setData(results.data);
          }
        });
      });
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    vertical: true,
    verticalSwiping: true,
    arrows: true,
    
  };

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

  return (
    <div className="vertical-carousel-wrapper">
      <h4 className="heading">Properties Near By</h4>
      <Slider {...settings} className="vertical-carousel">
        {data.map((item, index) => {
          const addressPart = item.address?.split(',')[0] || 'Address not available';

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
        })}
      </Slider>
    </div>
  );
};

export default VerticalCardCarousel;
