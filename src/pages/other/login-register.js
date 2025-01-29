// login-register.js

import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useLocalization } from "../../context/LocalizationContext";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../api/register";  // Import auth from register.js
import firebase from "firebase/app";
import { useToasts } from 'react-toast-notifications';

const LoginRegister = () => {
  const { t } = useLocalization();
  const { addToast } = useToasts();

  // State for login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // State for register
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
  });

  // Error and success states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input change for login
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    setError(""); // Clear error on new input
  };

  // Handle input change for register
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
    setError(""); // Clear error on new input
  };

  // Login with email and password
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(loginData.email, loginData.password);
      addToast(t("login_success"), { appearance: 'success', autoDismiss: true });  // Show success toast
      setTimeout(() => {
        window.location.href = "/other/my-account";  // Redirect after toast
      }, 2000);  // Wait for 2 seconds before redirecting
    } catch (error) {
      addToast(error.message, { appearance: 'error', autoDismiss: true });  // Show error toast
    }
  };

  // Register with email and password
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await auth.createUserWithEmailAndPassword(registerData.email, registerData.password);
      addToast(t("registration_success"), { appearance: 'success', autoDismiss: true });  // Show success toast
      setTimeout(() => {
        window.location.href = "/other/my-account";  // Redirect after toast
      }, 2000);  // Wait for 2 seconds before redirecting
    } catch (error) {
      addToast(error.message, { appearance: 'error', autoDismiss: true });  // Show error toast
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.signInWithPopup(provider);
      addToast("Successfully signed in with Google", { appearance: 'success', autoDismiss: true });  // Show success toast
      setTimeout(() => {
        window.location.href = "/other/my-account";  // Redirect after toast
      }, 2000);  // Wait for 2 seconds before redirecting
    } catch (err) {
      addToast(err.message, { appearance: 'error', autoDismiss: true });  // Show error toast
    }
  };

  return (
    <LayoutTwo>
      <BreadcrumbOne
        pageTitle={t("customer_login")}
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/home/trending">
              <a>{t("home")}</a>
            </Link>
          </li>
          <li>{t("customer_login")}</li>
        </ul>
      </BreadcrumbOne>

      <div className="login-area space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            {/* Login Section */}
            <Col lg={6} className="space-mb-mobile-only--50">
              <div className="lezada-form login-form">
                <form onSubmit={handleLoginSubmit}>
                  <Row>
                    <Col lg={12}>
                      <div className="section-title--login text-center space-mb--50">
                        <h2 className="space-mb--20">{t("login")}</h2>
                        <p>{t("welcome_back")}</p>
                      </div>
                    </Col>

                    {/* Error and Success Messages */}
                    {error && (
                      <Col lg={12}>
                        <p className="error-text">{error}</p>
                      </Col>
                    )}
                    {success && (
                      <Col lg={12}>
                        <p className="success-text">{success}</p>
                      </Col>
                    )}

                    <Col lg={12} className="space-mb--60">
                      <input
                        type="email"
                        name="email"
                        placeholder={t("email_address")}
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                      />
                    </Col>
                    <Col lg={12} className="space-mb--60">
                      <input
                        type="password"
                        name="password"
                        placeholder={t("password")}
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                      />
                    </Col>
                    <Col lg={12} className="space-mb--30">
                      <button className="lezada-button lezada-button--medium">
                        {t("login")}
                      </button>
                    </Col>
                  </Row>
                </form>
              </div>
            </Col>

            {/* Register Section */}
            <Col lg={6}>
              <div className="lezada-form login-form--register">
                <form onSubmit={handleRegisterSubmit}>
                  <Row>
                    <Col lg={12}>
                      <div className="section-title--login text-center space-mb--50">
                        <h2 className="space-mb--20">{t("register")}</h2>
                        <p>{t("no_account_register")}</p>
                      </div>
                    </Col>

                    {/* Error and Success Messages */}
                    {error && (
                      <Col lg={12}>
                        <p className="error-text">{error}</p>
                      </Col>
                    )}
                    {success && (
                      <Col lg={12}>
                        <p className="success-text">{success}</p>
                      </Col>
                    )}

                    <Col lg={12} className="space-mb--30">
                      <input
                        type="email"
                        name="email"
                        placeholder={t("email_placeholder")}
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                      />
                    </Col>
                    <Col lg={12} className="space-mb--50">
                      <input
                        type="password"
                        name="password"
                        placeholder={t("password_placeholder")}
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        required
                      />
                    </Col>
                    <Col lg={12} className="text-center">
                      <button className="lezada-button lezada-button--medium">
                        {t("register")}
                      </button>
                    </Col>
                  </Row>
                </form>

                <div className="text-center space-mt--30">
                  <span>{t("or")}</span>
                </div>

                {/* Google Sign-In Button */}
                <Col lg={12} className="text-center space-mt--30">
                  <button onClick={handleGoogleSignIn} className="lezada-button lezada-button--medium google-signin-btn">
                    <FcGoogle size={24} style={{ marginRight: "10px" }} /> 
                    {t("continue_with_google")} 
                  </button>
                </Col>                
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};

export default LoginRegister;
