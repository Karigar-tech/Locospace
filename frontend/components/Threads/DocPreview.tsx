import React, { useState } from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import { FaFileAlt } from 'react-icons/fa';
import DocumentModal from "./DocOpen"

interface DocumentPreviewProps {
  documentUrl: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ documentUrl }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const extractTitleFromUrl = (url: string) => {
    const match = url.match(/\/([^\/]+)\?alt=media/);
    if (match) {
      const filename = decodeURIComponent(match[1]);
      return filename.split('_').slice(1).join(' ').replace('.pdf', '');
    }
    return 'Document';
  };

  const documentTitle = extractTitleFromUrl(documentUrl);

  return (
    <>
      <Card style={{ width: '18rem', margin: '1rem' }}>
        <Card.Body>
       
        
          <Card.Title style = {{fontSize: "0.5rem !important"}}>   <FaFileAlt size={20} /> {documentTitle}</Card.Title>
          
          <Button variant="primary" onClick={handleOpenModal}>
            View
          </Button>
        </Card.Body>
      </Card>

      <DocumentModal
        show={showModal}
        handleClose={handleCloseModal}
        documentUrl={documentUrl}
      />
    </>
  );
};

export default DocumentPreview;
