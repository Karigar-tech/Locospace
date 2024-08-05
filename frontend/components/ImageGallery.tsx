"use client";

import React, { useState } from 'react';
import { Modal, Carousel } from 'react-bootstrap';
import styles from '../app/Listing/selectedlist.module.css';
import Image from 'next/image';

const ImageGallery: React.FC<{ images: string[] }> = ({ images }) => {
    const [showModal, setShowModal] = useState(false);
    const [carouselIndex, setCarouselIndex] = useState(0);

    const handleThumbnailClick = (index: number) => {
        // Adjust index for the main image and thumbnails
        setCarouselIndex(index);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    // Adjust thumbnails to start from the second image
    const thumbnails = images.length > 1 ? images.slice(1, 7) : [];

    return (
        <div className={styles.SLimageGallery}>
            {images.length > 0 ? (
                <>
                    <div className={styles.SLmainImage}>
                        <Image
                            src={images[0]} 
                            width={90}
                            height={90}
                            alt="Main" 
                            className="img-fluid" 
                            onClick={() => handleThumbnailClick(0)} 
                        />
                    </div>
                    <div className={`${styles.SLthumbnailRow} d-flex mt-1`}>
                        {thumbnails.map((image, index) => (
                            <div key={index} className={styles.SLthumbnail} onClick={() => handleThumbnailClick(index + 1)}>
                                <Image src={image} alt={`Thumbnail ${index}`} className={styles.SLimgThumbnail} width={100} height={100} />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p>No images available</p>
            )}

            <Modal show={showModal} onHide={handleClose} size="lg" centered contentClassName={styles.IGContainer}>
                <Modal.Body >
                    <Carousel 
                        activeIndex={carouselIndex} 
                        onSelect={(selectedIndex) => setCarouselIndex(selectedIndex)} 
                        interval={null}
                    >
                        {images.map((image, index) => (
                            <Carousel.Item key={index}>
                                <Image 
                                    width={100} 
                                    height={100} 
                                    className={styles.VCCarouselImage} 
                                    src={image} 
                                    alt={`Slide ${index}`} 
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ImageGallery;
