import Link from "next/link";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useLocalization } from "../../context/LocalizationContext";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth, registerUser } from "../api/register";
import {
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,  
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
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
  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: "",
  });
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // State for register
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
  });
  const [registerErrors, setRegisterErrors] = useState({
    email: "",
    password: "",
  });
  const [registerPasswordVisible, setRegisterPasswordVisible] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // State for social login buttons
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  // --- Validation Functions ---
  // Login validations
  const validateLoginEmail = (email) => {
    if (!email) return t("please_enter_your_email_first");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return t("invalid_email_format");
    return "";
  };

  const validateLoginPassword = (password) => {
    if (!password) return t("please_enter_your_password");
    if (password.length < 6) return t("password_too_short");
    return "";
  };

  // Register validations
  const validateRegisterEmail = (email) => {
    if (!email) return t("please_enter_your_email_first");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return t("invalid_email_format");
    return "";
  };

  const validateRegisterPassword = (password) => {
    if (!password) return t("please_enter_your_password");
    if (password.length < 6) return t("password_too_short");
    return "";
  };

  // --- onBlur Handlers ---
  // Login
  const handleLoginEmailBlur = (e) => {
    const errorMsg = validateLoginEmail(e.target.value);
    setLoginErrors((prev) => ({ ...prev, email: errorMsg }));
  };

  const handleLoginPasswordBlur = (e) => {
    const errorMsg = validateLoginPassword(e.target.value);
    setLoginErrors((prev) => ({ ...prev, password: errorMsg }));
  };

  // Register
  const handleRegisterEmailBlur = (e) => {
    const errorMsg = validateRegisterEmail(e.target.value);
    setRegisterErrors((prev) => ({ ...prev, email: errorMsg }));
  };

  const handleRegisterPasswordBlur = (e) => {
    const errorMsg = validateRegisterPassword(e.target.value);
    setRegisterErrors((prev) => ({ ...prev, password: errorMsg }));
  };

  // --- Input Change Handlers ---
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  // --- Toggle Password Visibility ---
  const toggleLoginPasswordVisibility = () => {
    setLoginPasswordVisible(!loginPasswordVisible);
  };

  const toggleRegisterPasswordVisibility = () => {
    setRegisterPasswordVisible(!registerPasswordVisible);
  };

  // --- Submission Handlers ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Validate before submit
    const emailError = validateLoginEmail(loginData.email);
    const passwordError = validateLoginPassword(loginData.password);
    setLoginErrors({ email: emailError, password: passwordError });
    if (emailError || passwordError) return;

    setLoginLoading(true);
    try {
      await setPersistence(auth, browserSessionPersistence);
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
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Validate before submit
    const emailError = validateRegisterEmail(registerData.email);
    const passwordError = validateRegisterPassword(registerData.password);
    setRegisterErrors({ email: emailError, password: passwordError });
    if (emailError || passwordError) return;

    setRegisterLoading(true);
    try {
      const result = await registerUser(registerData.email, registerData.password);
      if (result.success) {
        await fetch("/api/sendRegistrationEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: registerData.email }),
        });
        addToast(t("registration_success"), { appearance: "success", autoDismiss: true });
        setRegisterData({ email: "", password: "" });
      } else {
        addToast(result.error, { appearance: "error", autoDismiss: true });
      }
    } catch (error) {
      addToast(error.message, { appearance: "error", autoDismiss: true });
    } finally {
      setRegisterLoading(false);
    }
  };

  // --- Social Login Handlers ---
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
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
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setFacebookLoading(true);
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
    } finally {
      setFacebookLoading(false);
    }
  };

  // --- Forgot Password Handler ---
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

  useEffect(() => {
    setLoginErrors({ email: "", password: "" });
    setRegisterErrors({ email: "", password: "" });
  }, [t]);
  
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
                        onBlur={handleLoginEmailBlur}                        
                      />
                      {loginErrors.email && (
                        <div style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
                          {loginErrors.email}
                        </div>
                      )}
                    </Col>
                    <Col lg={12} className="space-mb--50">
                      <div style={{ position: "relative" }}>
                        <input
                          type={loginPasswordVisible ? "text" : "password"}
                          name="password"
                          placeholder={t("password")}
                          value={loginData.password}
                          onChange={handleLoginChange}
                          onBlur={handleLoginPasswordBlur}                          
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
                      {loginErrors.password && (
                        <div style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
                          {loginErrors.password}
                        </div>
                      )}
                    </Col>
                    <Col lg={12} className="text-center space-mb--30">
                      <button
                        type="submit"
                        className="lezada-button lezada-button--medium"
                        disabled={loginLoading}
                      >
                        {loginLoading ? (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : (
                          t("login")
                        )}
                      </button>
                    </Col>
                    <Col lg={12} className="text-center">
                      <span>{t("or")}</span>
                    </Col>
                    <Col lg={12} className="text-center space-mt--30">
                      <button
                        onClick={handleGoogleSignIn}
                        className="lezada-button lezada-button--small"
                        disabled={googleLoading}
                      >
                        {googleLoading ? (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : (
                          <>
                            <FcGoogle size={24} style={{ marginRight: "10px" }} />
                            {t("continue_with_google")}
                          </>
                        )}
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
                        onBlur={handleRegisterEmailBlur}                        
                      />
                      {registerErrors.email && (
                        <div style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
                          {registerErrors.email}
                        </div>
                      )}
                    </Col>
                    <Col lg={12} className="space-mb--50">
                      <div style={{ position: "relative" }}>
                        <input
                          type={registerPasswordVisible ? "text" : "password"}
                          name="password"
                          placeholder={t("password_placeholder")}
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          onBlur={handleRegisterPasswordBlur}                          
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
                      {registerErrors.password && (
                        <div style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
                          {registerErrors.password}
                        </div>
                      )}
                    </Col>
                    <Col lg={12} className="text-center space-mb--30">
                      <button
                        type="submit"
                        className="lezada-button lezada-button--medium"
                        disabled={registerLoading}
                      >
                        {registerLoading ? (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : (
                          t("register")
                        )}
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
