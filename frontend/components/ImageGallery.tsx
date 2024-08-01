"use client";

import React, { useState } from 'react';
import { Modal, Carousel } from 'react-bootstrap';
import '../styles/selectedlist.css';
import Image from 'next/image';

const ImageGallery: React.FC<{ images: string[] }> = ({ images }) => {
    const [showModal, setShowModal] = useState(false);
    const [carouselIndex, setCarouselIndex] = useState(0);

    const handleThumbnailClick = (index: number) => {
        setCarouselIndex(index);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    // Handle case where images might be empty
    const thumbnails = images.length > 0 ? images.slice(0, 6) : [];

    return (
        <div className="image-gallery">
            {images.length > 0 ? (
                <>
                    <div className="main-image">
                        <Image
                            src={images[0]} 
                            width={100}
                            height={100}
                            alt="Main" 
                            className="img-fluid" 
                            onClick={() => handleThumbnailClick(0)} 
                        />
                    </div>
                    <div className="thumbnail-row d-flex mt-1">
                        {thumbnails.map((image, index) => (
                            <div key={index} className="thumbnail" onClick={() => handleThumbnailClick(index)}>
                                <Image src={image} alt={`Thumbnail ${index}`} className="img-thumbnail" width={100} height={100} />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p>No images available</p>
            )}

            <Modal show={showModal} onHide={handleClose} size="lg" centered>
                <Modal.Body>
                    <Carousel 
                        activeIndex={carouselIndex} 
                        onSelect={(selectedIndex) => setCarouselIndex(selectedIndex)} 
                        interval={null}
                    >
                        {images.map((image, index) => (
                            <Carousel.Item key={index}>
                                <Image className="d-block w-100" src={image} alt={`Slide ${index}`} />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ImageGallery;
