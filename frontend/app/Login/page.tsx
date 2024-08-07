// frontend/app/Login/page.tsx
'use client'
import React, { useContext, useState } from 'react';
import '../../styles/login.css'; // Adjust the path based on your folder structure
import Link from 'next/link'; // Import Link from Next.js for client-side navigation
import useAuth from '../../authStore';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import { useAuthContext } from '../../context/authContext';



const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setToken = useAuth(state => state.setToken);
  const router = useRouter();
  const {authUser ,setAuthUser} = useAuthContext();
  


  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const { token ,userId} = await response.json();
        localStorage.setItem('token',token);
        localStorage.setItem("userID", userId);
        setToken(token);
        setAuthUser(token);
        router.push(authUser ? '/' : '/Login');
      } else {
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Login error:');
    }
  };

  return (
    <div className="background">
      <Link href="/">
        <div className="homeButton">Locospace</div>
      </Link>
      
      <Link href="/">
        <Image src="/logo.png" alt="Logo" className="logo" width={80} height={80} />
      </Link>

      <div className="loginBox">
        <h2>Sign in</h2> 
          <form onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}>
            <div className="inputBox">
              <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <label>Email</label>
            </div>
            <div className="inputBox">
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <label>Password</label>
            </div>
            <button className="loginButton">Login</button> 
            <div className="accountPrompt">
              <span>Don&apos;t have an account? </span>
              <Link href="/Signup">
                <div className="createAccountLink">Create new account</div>
              </Link>
            </div>
          </form>
        
      </div>
    </div>
  );
};

export default Login;
