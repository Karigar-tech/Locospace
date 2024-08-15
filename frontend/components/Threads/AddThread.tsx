import React, { ChangeEvent, useRef, useState } from "react";
import style from "./addthread.module.css";
import Spinner from "../../utils/Spinner";
import DocumentPreview from "./DocPreview";
import {
  FaImage,
  FaPaperclip,
  FaPaperPlane,
  FaSmile,
  FaTimes,
} from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

interface AddThreadProps {
  isOpen: boolean;
  onClose: () => void;
  onAddThread: (formData: FormData) => void;
}

const AddThread: React.FC<AddThreadProps> = ({
  isOpen,
  onClose,
  onAddThread,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [DocFile, setDocFile] = useState<File | null>(null);
  const [ImageFile, setImageFile] = useState<File | null>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const docUploadRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    imageUploadRef.current?.click();
  };

  const handleDocClick = () => {
    docUploadRef.current?.click();
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("thread_title", title);
    formData.append("thread_description", description);

    if (ImageFile) {
      formData.append("image", ImageFile);
    }

    console.log("FormData Contents:");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    onAddThread(formData);
    setTitle("");
    setDescription("");
    setImageFile(null);
    onClose();
  };

  if (!isOpen) return null;
  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    setLoadingImage(true);
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(file);
        setLoadingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveImage = () => {
    setImageFile(null);
  };

  const handleDoc = (event: ChangeEvent<HTMLInputElement>) => {
    setLoadingDoc(true);
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const url = URL.createObjectURL(file);
      setDocFile(file);
      setLoadingDoc(false);
    }
  };
  const handleRemoveDoc = () => {
    setDocFile(null);
  };


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
        <div className="preview-container">
          {ImageFile && (
            <div className="preview-item">
              {loadingImage ? (
                <Spinner />
              ) : (
                <div className="preview-content">
                  <img
                    src={URL.createObjectURL(ImageFile)}
                    alt="Image Preview"
                    className="preview-image"
                  />
                  <button className="remove-btn" onClick={handleRemoveImage}>
                    <FaTimes size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          <button className={style.icon} onClick={handleImageClick}>
            <FaImage />
            <input
              type="file"
              accept="image/*"
              id="image-upload"
              onChange={handleImage}
              style={{ display: "none" }}
              ref={imageUploadRef}
            />
          </button>

          <button className={style.icon} onClick={handleDocClick}>
            <FaPaperclip />
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              id="doc-upload"
              onChange={handleDoc}
              style={{ display: "none" }}
              ref={docUploadRef}
            />
          </button>
        </div>
        <button className={style.modalSubmitButton} onClick={handleSubmit}>
          Add Thread
        </button>
      </div>
    </div>
  );
};

export default AddThread;
