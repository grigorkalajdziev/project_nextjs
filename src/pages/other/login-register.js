import Link from "next/link";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useLocalization } from "../../context/LocalizationContext";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaPhoneAlt, FaHome } from "react-icons/fa";
import {
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth, checkUserExists, registerGoogleUser, set, ref, database } from "../api/register";
import { useToasts } from "react-toast-notifications";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import Swal from "sweetalert2";

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

const Login = () => {
  const { t, currentLanguage } = useLocalization();
  const { addToast } = useToasts();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({ email: "", password: "" });
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // initialize invisible reCAPTCHA (only client-side)
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible", callback: () => {} },
        auth
      );
    }

    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setLoginData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateLoginEmail(loginData.email);
    const passwordError = validateLoginPassword(loginData.password);

    setLoginErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      if (emailError) addToast(emailError, { appearance: "error", autoDismiss: true });
      if (passwordError) addToast(passwordError, { appearance: "error", autoDismiss: true });
      return;
    }

    setLoginLoading(true);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const user = userCredential.user;

      // send login success email once per user (client-side throttle)
      if (!localStorage.getItem("loginSuccessEmailSent_" + user.uid)) {
        await fetch("/api/sendLoginSuccessEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: loginData.email,
            provider: "default",
            language: currentLanguage,
          }),
        });
        localStorage.setItem("loginSuccessEmailSent_" + user.uid, "true");
      }

      addToast(t("login_success"), { appearance: "success", autoDismiss: true });

      if (rememberMe) localStorage.setItem("rememberedEmail", loginData.email);
      else localStorage.removeItem("rememberedEmail");

      setTimeout(() => (window.location.href = "/other/my-account"), 1500);
    } catch (error) {
      const message = getFriendlyAuthMessage(error.code, t);
      addToast(message, { appearance: "error", autoDismiss: true });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await setPersistence(auth, browserSessionPersistence);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Client-side check if user exists in your DB
      const userExists = await checkUserExists(user.uid);
      if (!userExists) {
        // register first time google user
        const regResult = await registerGoogleUser(user);
        if (!regResult.success) throw new Error(regResult.error || "google_registration_failed");

        await fetch("/api/sendRegistrationEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            language: currentLanguage,
            coupon: regResult.coupon,
            userName: user.displayName || "User",
            provider: "google",
          }),
        });
      } else {
        // login-success email once
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

      addToast(t("login_success"), { appearance: "success", autoDismiss: true });
      setTimeout(() => (window.location.href = "/other/my-account"), 1500);
    } catch (err) {
      const message = err && err.code ? getFriendlyAuthMessage(err.code, t) : err.message || t("something_went_wrong");
      addToast(message, { appearance: "error", autoDismiss: true });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    try {
      const { value: phoneNumber } = await Swal.fire({
        title: t("enter_your_phone_number"),
        input: "tel",
        inputPlaceholder: "+38970123456",
        confirmButtonText: t("continue"),
        cancelButtonText: t("cancel"),
        showCancelButton: true,
        inputValidator: (value) => (!value ? t("please_enter_phone") : undefined),
      });

      if (!phoneNumber) return;

      setPhoneLoading(true);
      Swal.fire({ title: t("sending_sms"), text: t("please_wait"), allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      auth.languageCode = currentLanguage === "mk" ? "mk" : "en";
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);

      Swal.close();

      const { value: code } = await Swal.fire({
        title: t("enter_verification_code"),
        input: "text",
        inputPlaceholder: "123456",
        confirmButtonText: t("verify"),
        cancelButtonText: t("cancel"),
        showCancelButton: true,
        inputValidator: (value) => (!value ? t("please_enter_code") : undefined),
      });

      if (!code) return;

      const result = await confirmationResult.confirm(code);
      const user = result.user;

      addToast(t("login_success"), { appearance: "success", autoDismiss: true });

      // if new user - create basic profile in your DB
      const userExists = await checkUserExists(user.uid);
      if (!userExists) {
        await set(ref(database, `users/${user.uid}`), {
          displayName: "",
          firstName: "",
          lastName: "",
          billingInfo: { address: "", city: "", phone: user.phoneNumber, zipCode: "" },
          role: "guest",
          coupon: "",
        });
      }

      setTimeout(() => (window.location.href = "/other/my-account"), 1000);
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: t("something_went_wrong"), text: error.message });
    } finally {
      setPhoneLoading(false);
    }
  };

  return (
    <LayoutTwo>
      <BreadcrumbOne pageTitle={t("customer_login")} backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.webp">
        <ul className="breadcrumb__list">
          <li><Link href="/home/trending" aria-label={t("home")}>
              <FaHome size={16} />
            </Link></li>
          <li>{t("customer_login")}</li>
        </ul>
      </BreadcrumbOne>

      <div className="login-area space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            <Col lg={6} className="offset-lg-3">
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
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        onBlur={(e) => setLoginErrors((p) => ({ ...p, email: validateLoginEmail(e.target.value) }))}
                      />
                    </Col>

                    <Col lg={12} className="space-mb--50">
                      <div style={{ position: "relative" }}>
                        <input
                          type={loginPasswordVisible ? "text" : "password"}
                          name="password"
                          placeholder={t("password")}
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          onBlur={(e) => setLoginErrors((p) => ({ ...p, password: validateLoginPassword(e.target.value) }))}
                          style={{ width: "100%", paddingRight: "70px" }}
                        />
                        <span onClick={() => setLoginPasswordVisible((s) => !s)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}>
                          {loginPasswordVisible ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
                        </span>
                      </div>

                      <div className="col-12">
                        <div className="single-method remember-container d-flex justify-content-between align-items-center" style={{ marginTop: "10px" }}>
                          <div className="remember-me d-flex align-items-center">
                            <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                            <label htmlFor="rememberMe" style={{ cursor: "pointer", fontSize: "12px" }}>{t("remember_me")}</label>
                          </div>

                          <button type="button" onClick={() => { if (!loginData.email) return addToast(t("please_enter_your_email_first"), { appearance: "error", autoDismiss: true }); window.fetch && fetch("/api/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: loginData.email, language: currentLanguage }) }).then(r => r.json()).then(() => addToast(t("reset_email_sent"), { appearance: "success", autoDismiss: true })).catch(e => addToast(e.message, { appearance: "error", autoDismiss: true })); }} style={{ background: "none", border: "none", color: "blue", padding: 0, cursor: "pointer", fontSize: "12px", textDecoration: "underline" }}>
                            {t("forgot_password")}
                          </button>
                        </div>
                      </div>
                    </Col>

                    <Col lg={12} className="text-center space-mb--30">
                      <button type="submit" className="lezada-button lezada-button--medium" disabled={loginLoading}>
                        {loginLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : t("login")}
                      </button>
                    </Col>

                    <Col lg={12} className="text-center">
                      <span>{t("or")}</span>
                    </Col>

                    <Row className="justify-content-center space-mt--30">
                      <Col lg={12} className="d-flex flex-column gap-3 align-items-center">
                        <button onClick={handleGoogleSignIn} className="lezada-button lezada-button--small w-100 d-flex align-items-center justify-content-center" disabled={googleLoading} style={{ minHeight: "45px" }}>
                          {googleLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : (<><FcGoogle size={24} style={{ marginRight: "10px" }} />{t("continue_with_google")}</>)}
                        </button>
                        
                        <div id="recaptcha-container" style={{ opacity: 0, position: "absolute", left: 0 }}></div>

                        <button type="button" onClick={handlePhoneSignIn} className="lezada-button lezada-button--small w-100 d-flex align-items-center justify-content-center" style={{ minHeight: "45px" }} disabled={phoneLoading}>
                          {phoneLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : (<><FaPhoneAlt size={22} style={{ marginRight: "10px" }} />{t("continue_with_phone")}</>)}
                        </button>
                        <div className="text-center mt-3">
                            <p className="mb-0">
                              {t("dont_have_account")}{" "}
                              <Link href="/other/register" className="fw-bold">
                                {t("register")}
                              </Link>
                            </p>
                          </div>
                      </Col>
                    </Row>
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

export default Login;
