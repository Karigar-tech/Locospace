import React from 'react';
import style from './communitybox.module.css'; 
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FaUsers, FaList } from 'react-icons/fa'; 

interface CommunityBoxProps {
  name: string;
  members: number;
  listings: number;
  picture: string;
  onClick: () => void;
}

const CommunityBox: React.FC<CommunityBoxProps> = ({ name, members, listings, picture, onClick }) => {
  return (
    <Card className={style.communityBox} onClick={onClick}>
      <div className={style.imageWrapper}>
        <Card.Img variant="top" src={picture} alt="Community" />
      </div>
      <Card.Body className = {style.commCardBody}>
        <Card.Title className={style.textStyle}>
          {name}
        </Card.Title>
        <Row className = {style.commRow}>
          <Col className={style.commIconText}>
            <FaUsers className={style.iconStyle} /> {members} Members
          </Col>
          <Col  className={style.commIconText}>
            <FaList className={style.iconStyle} /> {listings} {listings === 1 ? "listing" : "listings"}
          </Col>
        </Row>
        <hr />
        <Button className={style.exploreButton} onClick={onClick}>
          Explore
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CommunityBox;
