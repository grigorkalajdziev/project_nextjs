import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useLocalization } from "../../context/LocalizationContext";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { auth } from "../api/register";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  FacebookAuthProvider,
} from "firebase/auth";
import { useToasts } from "react-toast-notifications";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

const LoginRegister = () => {
  const { t } = useLocalization();
  const { addToast } = useToasts();

  // State for login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);

  // State for register
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
  });

  const [registerPasswordVisible, setRegisterPasswordVisible] = useState(false);

  // Handle input change for login
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // Handle input change for register
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  // Toggle password visibility for login
  const toggleLoginPasswordVisibility = () => {
    setLoginPasswordVisible(!loginPasswordVisible);
  };

  // Toggle password visibility for register
  const toggleRegisterPasswordVisibility = () => {
    setRegisterPasswordVisible(!registerPasswordVisible);
  };

  // Login with email and password
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      const user = userCredential.user;

      // Check if the email is verified
      if (user.emailVerified) {
        addToast(t("login_success"), {
          appearance: "success",
          autoDismiss: true,
        });
        setTimeout(() => {
          window.location.href = "/other/my-account"; // Redirect after successful login
        }, 2000);
      } else {
        addToast(t("please_verify_email"), {
          appearance: "warning",
          autoDismiss: true,
        });
      }
    } catch (error) {
      addToast(error.message, { appearance: "error", autoDismiss: true });
    }
  };

  // Register with email and password
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerData.email,
        registerData.password
      );
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      addToast(t("registration_success"), {
        appearance: "success",
        autoDismiss: true,
      });
      setTimeout(() => {
        window.location.href = "/other/my-account";
      }, 2000);
    } catch (error) {
      addToast(error.message, { appearance: "error", autoDismiss: true });
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      addToast(t("login_success"), {
        appearance: "success",
        autoDismiss: true,
      });
      setTimeout(() => {
        window.location.href = "/other/my-account";
      }, 2000);
    } catch (err) {
      addToast(err.message, { appearance: "error", autoDismiss: true });
    }
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      addToast(t("login_success"), {
        appearance: "success",
        autoDismiss: true,
      });
      setTimeout(() => {
        window.location.href = "/other/my-account";
      }, 2000);
    } catch (err) {
      addToast(err.message, { appearance: "error", autoDismiss: true });
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

                    <Col lg={12} className="space-mb--30">
                      <input
                        type="email"
                        name="email"
                        placeholder={t("email_address")}
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                      />
                    </Col>
                    <Col lg={12} className="space-mb--50">
                      <input
                        type={loginPasswordVisible ? "text" : "password"}
                        name="password"
                        placeholder={t("password")}
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                      />
                      <span
                        onClick={toggleLoginPasswordVisibility}
                        className="password-visibility-toggle"
                      >
                        {loginPasswordVisible ? (
                          <AiOutlineEyeInvisible />
                        ) : (
                          <AiOutlineEye />
                        )}
                      </span>
                    </Col>

                    {/* Centering the Login button */}
                    <Col lg={12} className="text-center space-mb--30">
                      <button className="lezada-button lezada-button--medium">
                        {t("login")}
                      </button>
                    </Col>

                    {/* Google Sign-In Button - Centered */}
                    <Col lg={12} className="text-center">
                      <span>{t("or")}</span>
                    </Col>

                    <Col lg={12} className="text-center space-mt--30">
                      <button
                        onClick={handleGoogleSignIn}
                        className="lezada-button lezada-button--medium"                        
                      >
                        <FcGoogle size={24} style={{ marginRight: "10px" }} />
                        {t("continue_with_google")}
                      </button>
                    </Col>

                    {/* <Col lg={12} className="text-center space-mt--30">
                      <button
                        onClick={handleFacebookSignIn}
                        className="lezada-button lezada-button--medium"                        
                      >
                        <FaFacebook size={24} style={{ marginRight: "10px" }} />
                        {t("continue_with_facebook")}
                      </button>
                    </Col> */}
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
                        type={registerPasswordVisible ? "text" : "password"}
                        name="password"
                        placeholder={t("password_placeholder")}
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        required
                      />
                      <span
                        onClick={toggleRegisterPasswordVisibility}
                        className="password-visibility-toggle"
                      >
                        {registerPasswordVisible ? (
                          <AiOutlineEyeInvisible />
                        ) : (
                          <AiOutlineEye />
                        )}
                      </span>
                    </Col>

                    {/* Centering the Register button */}
                    <Col lg={12} className="text-center space-mb--30">
                      <button className="lezada-button lezada-button--medium">
                        {t("register")}
                      </button>
                    </Col>
                  </Row>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};

export default LoginRegister;
