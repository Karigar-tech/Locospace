import React, { useState } from 'react';
import style from './addthread.module.css';

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
    <div className={style.modalOverlay} onClick={onClose}>
      <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={style.modalCloseButton} onClick={onClose}>
          &times;
        </button>
        <h3 className={style.heading}>New Thread</h3>
        <input
          type="text"
          className={style.modalInput}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={style.modalTextArea}
          placeholder="Thread description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className={style.modalSubmitButton} onClick={handleSubmit}>
          Add Thread
        </button>
      </div>
    </div>
  );
};

export default AddThread;
