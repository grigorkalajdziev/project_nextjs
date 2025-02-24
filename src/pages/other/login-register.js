import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useLocalization } from "../../context/LocalizationContext";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../api/register";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail, // <-- Import sendPasswordResetEmail
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

      if (!localStorage.getItem("loginSuccessEmailSent_" + user.uid)) {
        await fetch("/api/sendLoginSuccessEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: loginData.email }),
        });
        localStorage.setItem("loginSuccessEmailSent_" + user.uid, "true");
      }

      addToast(t("login_success"), {
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

  // Register with email and password
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(
        auth,
        registerData.email,
        registerData.password
      );

      await fetch("/api/sendRegistrationEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: registerData.email }),
      });

      addToast(t("registration_success"), {
        appearance: "success",
        autoDismiss: true,
      });
      setTimeout(() => {
        window.location.href = "/other/login-register";
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

  // Facebook Sign-In
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

  // Forgot Password Handler
  const handleForgotPassword = async () => {
    if (!loginData.email) {
      addToast(t("please_enter_your_email_first"), {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, loginData.email);
      addToast(t("reset_email_sent"), {
        appearance: "success",
        autoDismiss: true,
      });
    } catch (error) {
      addToast(error.message, { appearance: "error", autoDismiss: true });
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
            <Link href="/home/trending">{t("home")}</Link>
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
                      <div style={{ position: "relative" }}>
                        <input
                          type={loginPasswordVisible ? "text" : "password"}
                          name="password"
                          placeholder={t("password")}
                          value={loginData.password}
                          onChange={handleLoginChange}
                          required
                          style={{ width: "100%", paddingRight: "70px" }}
                        />
                        <span
                          onClick={toggleLoginPasswordVisibility}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                        >
                          {loginPasswordVisible ? (
                            <AiOutlineEyeInvisible />
                          ) : (
                            <AiOutlineEye />
                          )}
                        </span>
                      </div>
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          style={{
                            background: "none",
                            border: "none",
                            color: "blue",
                            padding: 0,
                            cursor: "pointer",
                            fontSize: "12px",
                            marginTop: "5px",
                          }}
                        >
                          {t("forgot_password")}
                        </button>
                      </div>
                    </Col>

                    <Col lg={12} className="text-center space-mb--30">
                      <button className="lezada-button lezada-button--medium">
                        {t("login")}
                      </button>
                    </Col>
                    <Col lg={12} className="text-center">
                      <span>{t("or")}</span>
                    </Col>
                    <Col lg={12} className="text-center space-mt--30">
                      <button
                        onClick={handleGoogleSignIn}
                        className="lezada-button lezada-button--small"
                      >
                        <FcGoogle size={24} style={{ marginRight: "10px" }} />
                        {t("continue_with_google")}
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
                      <div style={{ position: "relative" }}>
                        <input
                          type={registerPasswordVisible ? "text" : "password"}
                          name="password"
                          placeholder={t("password_placeholder")}
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          required
                          style={{ width: "100%", paddingRight: "50px" }}
                        />
                        <span
                          onClick={toggleRegisterPasswordVisibility}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                        >
                          {registerPasswordVisible ? (
                            <AiOutlineEyeInvisible />
                          ) : (
                            <AiOutlineEye />
                          )}
                        </span>
                      </div>
                    </Col>
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
