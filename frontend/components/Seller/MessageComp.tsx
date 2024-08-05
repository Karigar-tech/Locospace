import React from 'react';
import styles from './Notification.module.css'; // Import the CSS module

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  return (
    <>
      <div className={styles.overlay}></div>
      <div className={styles.notificationContainer}>
        <div className={styles.notificationMessage}>
          {message}
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
      </div>
    </>
  );
};

export default Notification;
