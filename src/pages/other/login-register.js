import Link from "next/link";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useLocalization } from "../../context/LocalizationContext";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth, registerUser, registerGoogleUser } from "../api/register";
import {
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  browserLocalPersistence,
} from "firebase/auth";
import { useToasts } from "react-toast-notifications";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

const LoginRegister = () => {
  const { t, currentLanguage } = useLocalization();
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
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // State for social login buttons
  const [googleLoading, setGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setLoginData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true); // optional: show checkbox as checked
    }
  }, []);

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

    const regex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
    if (!regex.test(password)) return t("password_must_contain_letter_and_number");
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

  const toggleConfirmPasswordVisible = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // --- Submission Handlers ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Validate before submit
    const emailError = validateLoginEmail(loginData.email);
    const passwordError = validateLoginPassword(loginData.password);

    if (emailError) {
      addToast(emailError, { appearance: "error", autoDismiss: true });
    }

    if (passwordError) {
      addToast(passwordError, { appearance: "error", autoDismiss: true });
    }

    if (emailError || passwordError) return;

    setLoginLoading(true);
    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
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
          body: JSON.stringify({
            email: loginData.email,
            provider: "default",
            language: currentLanguage,
          }),
        });
        localStorage.setItem("loginSuccessEmailSent_" + user.uid, "true");
      }

      addToast(t("login_success"), {
        appearance: "success",
        autoDismiss: true,
      });

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", loginData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      setTimeout(() => {
        window.location.href = "/other/my-account";
      }, 2000);
    } catch (error) {
      const message = getFriendlyAuthMessage(error.code, t);
      addToast(message, { appearance: "error", autoDismiss: true });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateRegisterEmail(registerData.email);
    const passwordError = validateRegisterPassword(registerData.password);
    const confirmError = validateConfirmPassword();

    if (emailError) {
      addToast(emailError, { appearance: "error", autoDismiss: true });
    }

    if (passwordError) {
      addToast(passwordError, { appearance: "error", autoDismiss: true });
    }

    if (confirmError) {
      addToast(confirmError, { appearance: "error", autoDismiss: true });
    }

    if (emailError || passwordError || confirmError) return;

    setRegisterLoading(true);
    try {
      const result = await registerUser(
        registerData.email,
        registerData.password
      );
      if (result.success) {
        await fetch("/api/sendRegistrationEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: registerData.email,
            language: currentLanguage,
            coupon: result.coupon,
          }),
        });
        addToast(t("registration_success"), {
          appearance: "success",
          autoDismiss: true,
        });
        setRegisterData({ email: "", password: "" });
        setConfirmPassword("");
      } else {
        const message = getFriendlyAuthMessage(
          result.error || "something_went_wrong",
          t
        );
        addToast(message, { appearance: "error", autoDismiss: true });
      }
    } catch (error) {
      const message = getFriendlyAuthMessage(error.code, t);
      addToast(message, { appearance: "error", autoDismiss: true });
    } finally {
      setRegisterLoading(false);
    }
  };

  // --- Social Login Handlers ---
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      await setPersistence(auth, browserSessionPersistence);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // If this is the user's first sign-in with Google, register them and send the registration email (with coupon)
      if (user.metadata.creationTime === user.metadata.lastSignInTime) {
        const regResult = await registerGoogleUser(user);
        if (!regResult.success) {
          throw new Error(regResult.error || "google_registration_failed");
        }

        // Send the same registration email as handleRegisterSubmit (includes coupon if provided)
        await fetch("/api/sendRegistrationEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            language: currentLanguage,
            coupon: regResult.coupon ?? null,
            userName: user.displayName || "User",
            provider: "google",
          }),
        });
      } else {
        // Optional: for returning users, send a login-success email once per user (mirrors email/password flow)
        if (!localStorage.getItem("loginSuccessEmailSent_" + user.uid)) {
          await fetch("/api/sendLoginSuccessEmail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              provider: "google",
              userName: user.displayName || "User",
              language: currentLanguage,
            }),
          });
          localStorage.setItem("loginSuccessEmailSent_" + user.uid, "true");
        }
      }

      addToast(t("login_success"), {
        appearance: "success",
        autoDismiss: true,
      });

      setTimeout(() => {
        window.location.href = "/other/my-account";
      }, 2000);
    } catch (err) {
      // Prefer friendly auth messages when available; otherwise show the raw message
      const message =
        err && err.code
          ? getFriendlyAuthMessage(err.code, t)
          : err && err.message
            ? err.message
            : t("something_went_wrong");
      addToast(message, { appearance: "error", autoDismiss: true });
    } finally {
      setGoogleLoading(false);
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
      // await sendPasswordResetEmail(auth, loginData.email);
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.email,
          language: currentLanguage,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }
      addToast(t("reset_email_sent"), {
        appearance: "success",
        autoDismiss: true,
      });
      setLoginData((prev) => ({ ...prev, email: "" }));
    } catch (error) {
      addToast(error.message, { appearance: "error", autoDismiss: true });
    }
  };

  const getFriendlyAuthMessage = (code, t) => {
    const errorMap = {
      "auth/invalid-login-credentials": "invalid_credentials",
      "auth/wrong-password": "invalid_credentials",
      "auth/user-not-found": "user_not_found",
      "auth/email-already-in-use": "email_in_use",
      "auth/too-many-requests": "too_many_requests",
      "auth/network-request-failed": "network_error",
    };

    return t(errorMap[code] || "something_went_wrong");
  };

  useEffect(() => {
    setLoginErrors({ email: "", password: "" });
    setRegisterErrors({ email: "", password: "" });
  }, [t]);

  useEffect(() => {
    if (loginErrors.email || loginErrors.password) {
      const timer = setTimeout(() => {
        setLoginErrors({ email: "", password: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loginErrors]);

  useEffect(() => {
    if (registerErrors.email || registerErrors.password) {
      const timer = setTimeout(() => {
        setRegisterErrors({ email: "", password: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [registerErrors]);

  // --- Add Confirm Password Validation ---
  const validateConfirmPassword = () => {
    if (!confirmPassword) return t("please_confirm_your_password");
    if (confirmPassword !== registerData.password)
      return t("passwords_do_not_match");
    return "";
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
                        onBlur={handleLoginEmailBlur}
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
                            <AiOutlineEye size={20} color="#000" />
                          ) : (
                            <AiOutlineEyeInvisible size={20} color="#000" />
                          )}
                        </span>
                      </div>

                      <div className="col-12">
                        <div
                          className="single-method remember-container d-flex justify-content-between align-items-center"
                          style={{ marginTop: "10px" }}
                        >
                          <div className="remember-me d-flex align-items-center">
                            <input
                              type="checkbox"
                              id="rememberMe"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="rememberMe">{t("remember_me")}</label>
                          </div>

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
                              textDecoration: "underline",
                            }}
                          >
                            {t("forgot_password")}
                          </button>
                        </div>
                      </div>
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
                    <Row className="justify-content-center space-mt--30">
                      <Col
                        lg={12}
                        className="d-flex flex-column gap-3 align-items-center"
                      >
                        <button
                          onClick={handleGoogleSignIn}
                          className="lezada-button lezada-button--small w-100 d-flex align-items-center justify-content-center"
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
                              <FcGoogle
                                size={24}
                                style={{ marginRight: "10px" }}
                              />
                              {t("continue_with_google")}
                            </>
                          )}
                        </button>
                      </Col>
                    </Row>
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

                    {/* Email */}
                    <Col lg={12} className="space-mb--30">
                      <input
                        type="email"
                        name="email"
                        placeholder={t("email_placeholder")}
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        onBlur={handleRegisterEmailBlur}
                      />
                    </Col>

                    {/* Password */}
                    <Col lg={12} className="space-mb--30">
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
                            <AiOutlineEye size={20} color="#000" />
                          ) : (
                            <AiOutlineEyeInvisible size={20} color="#000" />
                          )}
                        </span>
                      </div>
                    </Col>

                    {/* Confirm Password */}
                    <Col lg={12} className="space-mb--50">
                      <div style={{ position: "relative" }}>
                        <input
                          type={confirmPasswordVisible ? "text" : "password"}
                          name="confirmPassword"
                          placeholder={t("confirm_password")}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onBlur={() =>
                            setConfirmPasswordError(validateConfirmPassword())
                          }
                          style={{ width: "100%", paddingRight: "50px" }}
                        />
                        <span
                          onClick={toggleConfirmPasswordVisible}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                        >
                          {confirmPasswordVisible ? (
                            <AiOutlineEye size={20} color="#000" />
                          ) : (
                            <AiOutlineEyeInvisible size={20} color="#000" />
                          )}
                        </span>
                      </div>
                    </Col>

                    {/* Submit Button */}
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
