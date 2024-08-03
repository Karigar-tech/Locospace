import React, { ChangeEvent } from "react";
import styles from "../../app/SellerForm/sellerform.module.css";
import { FaInfoCircle } from "react-icons/fa";

interface ImageUploadSectionProps {
  mainImage: string | null;
  imagePreviews: string[];
  isHomeIconVisible: boolean;
  onMainImageChange: () => void;
  onImageClick: (index: number) => void;
  onAddMoreClick: () => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  mainImage,
  imagePreviews,
  isHomeIconVisible,
  onMainImageChange,
  onImageClick,
  onAddMoreClick,
  onFileChange,
}) => {
 
  const handleImageClick = (index: number) => () => {
    onImageClick(index);
  };

  return (
    <div className={styles.container}>
      <div className={styles.imagePreviewWrapper}>
       
        {mainImage && (
          <div className={styles.mainImageContainer}>
            <img
              src={mainImage}
              alt="Main"
              className={styles.mainImage}
              onClick={onMainImageChange}
            />
            <input
              type="file"
              id="fileInput"
              accept=".jpeg,.png,.jpg"
              name="files[]"
              multiple
              style={{ display: "none" }}
              onChange={onFileChange}
            />
          </div>
        )}
        <div className={styles.imagePreviewContainer}>
          {imagePreviews.slice(1, 6).map((preview, index) => (
            <div
              key={index}
              className={styles.imagePreviewItem}
              onClick={handleImageClick(index + 1)}
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className={`${styles.imagePreview} ${styles.dottedBorder}`}
                
              />
              <input
              type="file"
              id="fileInput"
              accept=".jpeg,.png,.jpg"
              name="files[]"
              multiple
              style={{ display: "none" }}
              onChange={onFileChange}
            />
            </div>
          ))}
          {!isHomeIconVisible && imagePreviews.length < 5 && (
            <div className={styles.addMoreButton} onClick={onAddMoreClick}>
              <p>+ Add More</p>
              <input
              type="file"
              id="fileInput"
              accept=".jpeg,.png,.jpg"
              name="files[]"
              multiple
              style={{ display: "none" }}
              onChange={onFileChange}
            />
            </div>
          )}
        </div>
        {isHomeIconVisible && (
          <div className={styles.iconContainer}>
            <button
              type="button"
              className={styles.iconButton}
              onClick={onAddMoreClick}
            >
              <img
                src="/home-icon.png"
                alt="Home Icon"
                className={styles.iconImage}
              />
            </button>
            <input
              type="file"
              id="fileInput"
              accept=".jpeg,.png,.jpg"
              name="files[]"
              multiple
              style={{ display: "none" }}
              onChange={onFileChange}
            />
            <div className={styles.infoBox}>
              <FaInfoCircle className={styles.infoIcon} />
              Upload up to 5 property pictures. The first one will be featured in your listing.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadSection;
