import Link from "next/link";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useLocalization } from "../../context/LocalizationContext";
import { useState } from "react";
import { FaHome } from "react-icons/fa";
import { registerUser } from "../api/register";
import { useToasts } from "react-toast-notifications";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

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

const Register = () => {
  const { t, currentLanguage } = useLocalization();
  const { addToast } = useToasts();

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerPasswordVisible, setRegisterPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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
    if (!regex.test(password))
      return t("password_must_contain_letter_and_number");
    return "";
  };

  const validateRegisterFirstName = (name) => {
    if (!name.trim()) return t("please_enter_your_first_name");
    if (name.trim().length < 2) return t("first_name_too_short");
    return "";
  };

  const validateRegisterLastName = (name) => {
    if (!name.trim()) return t("please_enter_your_last_name");
    if (name.trim().length < 2) return t("last_name_too_short");
    return "";
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) return t("please_confirm_your_password");
    if (confirmPassword !== registerData.password)
      return t("passwords_do_not_match");
    return "";
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const firstNameError = validateRegisterFirstName(registerData.firstName);
    const lastNameError = validateRegisterLastName(registerData.lastName);
    const emailError = validateRegisterEmail(registerData.email);
    const passwordError = validateRegisterPassword(registerData.password);
    const confirmError = validateConfirmPassword();

    if (
      firstNameError ||
      lastNameError ||
      emailError ||
      passwordError ||
      confirmError
    ) {
      if (firstNameError)
        addToast(firstNameError, { appearance: "error", autoDismiss: true });
      if (lastNameError)
        addToast(lastNameError, { appearance: "error", autoDismiss: true });
      if (emailError)
        addToast(emailError, { appearance: "error", autoDismiss: true });
      if (passwordError)
        addToast(passwordError, { appearance: "error", autoDismiss: true });
      if (confirmError)
        addToast(confirmError, { appearance: "error", autoDismiss: true });
      return;
    }

    if (!termsAccepted) {
      addToast(t("please_accept_terms"), {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    setRegisterLoading(true);
    try {
      const result = await registerUser(
        registerData.email,
        registerData.password,
        registerData.firstName,
        registerData.lastName
      );
      if (result.success) {
        // send registration email (coupon included)
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

        setRegisterData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        });
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

  return (
    <LayoutTwo>
      <BreadcrumbOne
        pageTitle={t("register")}
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.webp"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/home/trending" aria-label={t("home")}>
              <FaHome size={16} />
            </Link>
          </li>
          <li>{t("register")}</li>
        </ul>
      </BreadcrumbOne>

      <div className="login-area space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            <Col lg={6} className="offset-lg-3">
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
                        type="text"
                        name="firstName"
                        placeholder={t("first_name_placeholder")}
                        value={registerData.firstName}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            firstName: e.target.value,
                          })
                        }
                        onBlur={(e) => {
                          const err = validateRegisterFirstName(e.target.value);
                          if (err)
                            addToast(err, {
                              appearance: "error",
                              autoDismiss: true,
                            });
                        }}
                      />
                    </Col>

                    <Col lg={12} className="space-mb--30">
                      <input
                        type="text"
                        name="lastName"
                        placeholder={t("last_name_placeholder")}
                        value={registerData.lastName}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            lastName: e.target.value,
                          })
                        }
                        onBlur={(e) => {
                          const err = validateRegisterLastName(e.target.value);
                          if (err)
                            addToast(err, {
                              appearance: "error",
                              autoDismiss: true,
                            });
                        }}
                      />
                    </Col>

                    <Col lg={12} className="space-mb--30">
                      <input
                        type="email"
                        name="email"
                        placeholder={t("email_placeholder")}
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        onBlur={(e) => {
                          const err = validateRegisterEmail(e.target.value);
                          if (err)
                            addToast(err, {
                              appearance: "error",
                              autoDismiss: true,
                            });
                        }}
                      />
                    </Col>

                    <Col lg={12} className="space-mb--30">
                      <div style={{ position: "relative" }}>
                        <input
                          type={registerPasswordVisible ? "text" : "password"}
                          name="password"
                          placeholder={t("password_placeholder")}
                          value={registerData.password}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              password: e.target.value,
                            })
                          }
                          onBlur={(e) => {
                            const err = validateRegisterPassword(
                              e.target.value
                            );
                            if (err)
                              addToast(err, {
                                appearance: "error",
                                autoDismiss: true,
                              });
                          }}
                          style={{ width: "100%", paddingRight: "50px" }}
                        />
                        <span
                          onClick={() => setRegisterPasswordVisible((s) => !s)}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                        >
                          {registerPasswordVisible ? (
                            <AiOutlineEye size={20} />
                          ) : (
                            <AiOutlineEyeInvisible size={20} />
                          )}
                        </span>
                      </div>
                    </Col>

                    <Col lg={12} className="space-mb--15">
                      <div style={{ position: "relative" }}>
                        <input
                          type={confirmPasswordVisible ? "text" : "password"}
                          name="confirmPassword"
                          placeholder={t("confirm_password")}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onBlur={() => {
                            const err = validateConfirmPassword();
                            if (err)
                              setTimeout(
                                () =>
                                  addToast(err, {
                                    appearance: "error",
                                    autoDismiss: true,
                                  }),
                                0
                              );
                          }}
                          style={{ width: "100%", paddingRight: "50px" }}
                        />
                        <span
                          onClick={() => setConfirmPasswordVisible((s) => !s)}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                        >
                          {confirmPasswordVisible ? (
                            <AiOutlineEye size={20} />
                          ) : (
                            <AiOutlineEyeInvisible size={20} />
                          )}
                        </span>
                      </div>
                    </Col>

                    <Col lg={12} className="space-mb--30">
                      <div
                        className="single-method remember-container d-flex align-items-center"
                        style={{ marginTop: "10px", justifyContent: "center" }}
                      >
                        <div className="remember-me d-flex align-items-center">
                          <input
                            type="checkbox"
                            id="termsAccepted"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            style={{ marginRight: "8px" }}
                          />
                          <label
                            htmlFor="termsAccepted"
                            style={{
                              cursor: "pointer",
                              fontSize:
                                window?.innerWidth < 376 ? "7px" : "10px",
                            }}
                          >
                            {t("i_accept")}{" "}
                            <Link
                              href="/other/terms-of-service"
                              target="_blank"
                              style={{
                                textDecoration: "underline",
                                color: "blue",
                              }}
                            >
                              {t("terms_of_service_register")}
                            </Link>{" "}
                            {t("and")}{" "}
                            <Link
                              href="/other/privacy-policy"
                              target="_blank"
                              style={{
                                textDecoration: "underline",
                                color: "blue",
                              }}
                            >
                              {t("privacy_policy")}
                            </Link>
                          </label>
                        </div>
                      </div>
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

                    <Col lg={12} className="text-center">
                      <p className="mb-0">
                        {t("already_have_account")}{" "}
                        <Link href="/other/login-register" className="fw-bold">
                          {t("login")}
                        </Link>
                      </p>
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

export default Register;
