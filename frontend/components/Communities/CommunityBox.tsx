import React from 'react';
import "../../styles/main.css";
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faList } from '@fortawesome/free-solid-svg-icons';

interface CommunityBoxProps {
    name: string;
    members: number;
    listings: number;
    onClick: () => void;
}

const CommunityBox: React.FC<CommunityBoxProps> = ({ name, members, listings, onClick }) => {
  return (
    <Card className="d-block card-custom" onClick={onClick}>
      <div className="image-wrapper">
        <Card.Img variant="top" src='placeholder.png' alt={`Image of ${name}`} />
      </div>
      <Card.Body>
        <Card.Title>
          {name}
        </Card.Title>
        <Row className="mb-2">
          <Col><FontAwesomeIcon icon={faUsers} /> {members} Members</Col>
          <Col className="text-right"><FontAwesomeIcon icon={faList} /> {listings} Listings</Col>
        </Row>
        <hr />
        <Button variant="primary" onClick={onClick}>View Details</Button>
      </Card.Body>
    </Card>
  );
}

export default CommunityBox;
