import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faBath,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../app/Listing/selectedlist.module.css";
import { Listing } from "../types";
import { useRouter } from 'next/navigation';

interface VerticalCardCarouselProps {
  listingId: string;
}

const VerticalCardCarousel: React.FC<VerticalCardCarouselProps> = ({ listingId }) => {
  const [data, setData] = useState<Listing[]>([]);
  const router = useRouter(); 

  useEffect(() => {
    const fetchNearbyListings = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/listings/nearby?id=${listingId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const listings: Listing[] = await response.json();
        console.log("nearby listings", listings);
        setData(listings);
      } catch (error) {
        console.error("Error fetching nearby listings:", error);
      }
    };    

    if (listingId) {
      fetchNearbyListings();
    }
  }, [listingId]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 2,
    vertical: true,
    verticalSwiping: true,
    arrows: true,
  };

  const formatPrice = (price: number) => {
    if (typeof price !== "number") {
      return "Invalid price";
    }
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(2)} crore`;
    } else {
      return `Rs. ${price.toLocaleString()}`;
    }
  };

  const handleClick = (id: string) => {
    router.push(`/Listing?id=${id}`);
  };

  return (
    <div className={styles.verticalCarouselWrapper}>
      <h4 className={styles.VCheading}>Properties Nearby</h4>
      <Slider {...settings} className={styles.verticalCarousel}>
        {data.map((item) => {
          const addressPart =
            item.location?.split(",")[0] || "Address not available";

          return (
            <Card key={item._id} className={`d-block ${styles.VCcardCustom}`}>
              <div className={styles.VCimageWrapper}>
                <Card.Img
                  variant="top"
                  src={item.ListingPictures[0] || "placeholder.png"}
                  alt={`Image of ${item.title}`}
                />
              </div>
              <Card.Body>
                <Card.Title>
                  <Row className="mb-2">
                    <Col>
                    <span> For {item.listing_type === 'sell' ? 'Sale' : 'Rent'}</span>
                    </Col>
                    <Col>
                      <span>{formatPrice(item.price)}</span>
                    </Col>
                  </Row>
                </Card.Title>
                <Row className="mb-2">
                  <Col>
                    <FontAwesomeIcon icon={faBed} /> {item.bedroom}
                  </Col>
                  <Col>
                    <FontAwesomeIcon icon={faBath} /> {item.bath}
                  </Col>
                </Row>
                <hr />
                <Row className="mb-2">
                  <Col>
                    <FontAwesomeIcon icon={faMapMarkerAlt}/>
                    <span style={{ marginLeft: "0.5rem" }}>{addressPart}</span>
                  </Col>
                </Row>
                <Button variant="primary"  onClick={() => handleClick(item._id.toString())}>
                  View
                </Button>
              </Card.Body>
            </Card>
          );
        })}
      </Slider>
    </div>
  );
};

export default VerticalCardCarousel;
