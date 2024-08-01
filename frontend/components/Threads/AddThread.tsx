import React, { useState } from 'react';
import '../../styles/main.css';

interface AddThreadProps {
  isOpen: boolean;
  onClose: () => void;
  onAddThread: (title: string, description: string) => void;
}

const AddThread: React.FC<AddThreadProps> = ({ isOpen, onClose, onAddThread }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (title.trim() && description.trim()) {
      onAddThread(title, description);
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Create New Thread</h3>
        <input
          type="text"
          className="modal-input"
          placeholder="Thread title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="modal-textarea"
          placeholder="Thread description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="modal-submit-button" onClick={handleSubmit}>
          Add Thread
        </button>
        <button className="modal-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AddThread;
