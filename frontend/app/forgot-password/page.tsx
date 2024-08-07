'use client';

import React, { useState } from 'react';
import styles from '../../styles/forgotPassword.module.css'; // Import local styles
import Link from 'next/link'; // Import Link for navigation
import { useRouter } from 'next/navigation'; // Import useRouter for page navigation
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS (consider if needed)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome for icons
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import icons for password visibility

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState(''); // State for email input
  const [newPassword, setNewPassword] = useState(''); // State for new password input
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password input
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [error, setError] = useState(''); // State for error messages
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const router = useRouter(); // Router for navigation

  // Function to handle password reset
  const handleResetPassword = async () => {
    setLoading(true); // Set loading state to true
    setError(''); // Clear previous errors
    try {
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match"); // Check if passwords match
      }

      // Make API call to reset password
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }), // Send email and new password
      });

      if (response.ok) {
        router.push('/Login'); // Navigate to login page on success
      } else {
        throw new Error('Reset password failed: ' + response.statusText); // Handle API errors
      }
    } catch (error) {
      console.error('Reset password error:', error); // Log error
      setError('An error occurred. Please try again.'); // Set error message
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className={styles.background}> {/* Container with background styling */}
      <img src="Logo.png" alt="Logo" className={styles.logo} /> {/* Logo image */}
      <div className={styles.resetBox}> {/* Box for the reset form */}
        <h2 className={styles.heading} style={{ color: '#007bff' }}>Reset Password</h2> {/* Heading */}
        {error && <div className={styles.error}>{error}</div>} {/* Display error message */}
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission
            handleResetPassword(); // Call password reset function
          }}
        >
          <div className={styles.inputBox}> {/* Email input box */}
            <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Email</label>
          </div>
          <div className={styles.inputBox}> {/* New password input box */}
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label>New Password</label>
            <span
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          <div className={styles.inputBox}> {/* Confirm password input box */}
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label>Confirm Password</label>
            <span
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          <button
            className="btn btn-primary" // Bootstrap primary button class
            type="submit"
            disabled={loading} // Disable button while loading
            style={{ width: '100px' }} // Custom button width
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
              </>
            ) : (
              'Done!'
            )}
          </button>
          <div className={styles.backToLogin}> {/* Link to go back to login */}
            <Link href="/Login">Back to login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
