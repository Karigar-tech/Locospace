'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/signup.module.css';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '@/context/authContext';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [homeButtonLoading, setHomeButtonLoading] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);
  const { authUser, setAuthUser } = useAuthContext();

  const handleSignup = async () => {
    setLoading(true);
    setAuthUser(localStorage.getItem('token'));
    if(authUser){
      router.push('/');
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, name, email, contact }),
      });

      if (!response.ok) {
        throw new Error('User not created');
        
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Sign Up Error:', error);
      setError('An error occurred during sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleHomeButtonClick = () => {
    setHomeButtonLoading(true);
    setTimeout(() => {
      setHomeButtonLoading(false);
      router.push('/');
    }, 2000);
  };

  const handleSignInClick = () => {
    setSignInLoading(true);
    setTimeout(() => {
      setSignInLoading(false);
      router.push('/Login');
    }, 2000);
  };

  return (
    <div className={styles.background}>
      <div 
        className={styles.homeButton} 
        onClick={handleHomeButtonClick}
      >
        Locospace
      </div>
      {homeButtonLoading && (
        <div className={styles.loadingIndicator}>
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow spinner-grow-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <Link href="/">
        <img src="Logo.png" alt="Logo" className={styles.logo} />
      </Link>
      <div className={styles.signUpBox}>
        <h2 className={styles.signUpHeading} style={{ color: '#007bff' }}>Sign up</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password !== confirmPassword) {
              setError('Passwords do not match');
              return;
            } else {
              handleSignup();
            }
          }}
        >
          <div className={styles.formContainer}>
            <div className={styles.leftInputs}>
              <div className={styles.inputBox}>
                <input type="text" name="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                <label>Username</label>
              </div>
              <div className={styles.inputBox}>
                <input type="text" name="name" required value={name} onChange={(e) => setName(e.target.value)} />
                <label>Name</label>
              </div>
              <div className={styles.inputBox}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label>Password</label>
                <span
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              <div className={styles.inputBox}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label>Confirm Password</label>
                <span
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </span>
              </div>
            </div>
            <div className={styles.rightInputs}>
              <div className={styles.inputBox}>
                <input type="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Email</label>
              </div>
              <div className={styles.inputBox}>
                <input type="text" name="contact" required value={contact} onChange={(e) => setContact(e.target.value)} />
                <label>Contact</label>
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100px', marginTop: '-4px' }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
              </>
            ) : (
              'sign up'
            )}
          </button>
          <div className={styles.accountPrompt}>
            <span>
              Already have an account?{' '}
              <div
               style={{ cursor: 'pointer' }}
                className={styles.createAccountLink}
                onClick={handleSignInClick}
              >
                Sign in
                
              </div>
            </span>
          </div>
        </form>
      </div>
      {signInLoading && (
        <div className={styles.loadingIndicator}>
          <div className="spinner-border spinner-border-sm text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow spinner-grow-sm text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
