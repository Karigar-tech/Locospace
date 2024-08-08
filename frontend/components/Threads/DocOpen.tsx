import React, {useState, useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from '../../utils/Spinner'

interface DocumentModalProps {  
  show: boolean;
  handleClose: () => void;
  documentUrl: string;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ show, handleClose, documentUrl }) => {

  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (show) {
      const loadDocument = async () => {
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        setLoading(false);
      };

      loadDocument();
    } else {
      setLoading(true);
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="document-modal-title" centered contentClassName='DocModal'>
      <Modal.Header closeButton>
        <Modal.Title id="document-modal-title">Document Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? <Spinner/> :
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(documentUrl)}&embedded=true`}
          style={{ width: '100%', height: '450px' }}
          title="Document Preview"
          onLoad={() => setLoading(false)}
         
        />
        }
      </Modal.Body>
     
    </Modal>
  );
};

export default DocumentModal;
