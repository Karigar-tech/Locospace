"use client";
import React, { useEffect, useState } from "react";
import styles from "../../styles/login.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "@/context/authContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [homeButtonLoading, setHomeButtonLoading] = useState(false);
  const [createAccountLoading, setCreateAccountLoading] = useState(false);
  const router = useRouter();
  const { authUser, setAuthUser } = useAuthContext();
  const [triggerLogin, setTriggerLogin] = useState(false);

  useEffect(() => {
    const handleLogin = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );

        if (response.ok) {
          const { token, userId } = await response.json();
          localStorage.setItem("token", token);
          localStorage.setItem("userID", userId);
          setAuthUser(token);
          setTimeout(() => {
            router.push("/");
          }, 1000);
        } else {
          throw new Error("Login failed: " + response.statusText);
        }
      } catch (error) {
        console.error("Login error:", error);
        setError("An error occurred during login. Please try again.");
      } finally {
        // Make sure to set loading to false after the delay
        setTimeout(() => {
          setLoading(false);
        }, 500); // Same delay as above
      }
    };

    if (triggerLogin) {
      handleLogin();
      setTriggerLogin(false); // Reset the trigger
    }
  }, [triggerLogin, email, password, router]);

  const handleHomeButtonClick = () => {
    setHomeButtonLoading(true);
    setTimeout(() => {
      setHomeButtonLoading(false);
      router.push("/");
    }, 2000);
  };

  const handleCreateAccountClick = () => {
    setCreateAccountLoading(true);
    setTimeout(() => {
      router.push("/Signup");
    }, 2000);
  };

  return (
    <div className={styles.background}>
      <div className={styles.homeButton} onClick={handleHomeButtonClick}>
        Locospace
      </div>
      {homeButtonLoading && (
        <div className={styles.loadingIndicator}>
          <div
            className="spinner-border spinner-border-sm text-secondary"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <div
            className="spinner-grow spinner-grow-sm text-secondary"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <img src="Logo.png" alt="Logo" className={styles.logo} />
      <div className={styles.loginBox}>
        <h2 className={styles.loginHeading} style={{ color: "#007bff" }}>
          Sign in
        </h2>
        {error && <div className={styles.error}>{error}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setTriggerLogin(true);
          }}
        >
          <div className={styles.inputBox}>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>
          <div className={styles.inputBox}>
            <input
              type={showPassword ? "text" : "password"}
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
          <div className={styles.forgotPassword}>
            <Link href="/forgot-password">Forgot password?</Link>
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: "100px" }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading...
              </>
            ) : (
              "Login"
            )}
          </button>
          <div className={styles.accountPrompt}>
            <span>Don&apos;t have an account? </span>
            <div
              className={styles.createAccountLink}
              onClick={handleCreateAccountClick}
              style={{ cursor: "pointer" }}
            >
              {createAccountLoading ? (
                <div className={styles.loadingIndicator}>
                  <div
                    className="spinner-border spinner-border-sm text-secondary"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div
                    className="spinner-grow spinner-grow-sm text-secondary"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                "Create new account"
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
