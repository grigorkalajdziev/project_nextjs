import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useLocalization } from "../../context/LocalizationContext";
import { useState } from "react";
import axios from "axios";

const LoginRegister = () => {
  const { t } = useLocalization();
  const { addToast } = useToasts();

  // State for login
  const [loginData, setLoginData] = useState({
    usernameOrEmail: "",
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

  // Submit handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/api/login", loginData);
      setSuccess(t("login_success"));
    } catch (error) {
      setError(t("login_failed"));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

     try {
      const response = await axios.post("/api/register", registerData);
      addToast(t("registration_success"), { appearance: "success", autoDismiss: true });

      if (response.data.redirect) {
        window.location.href = response.data.redirect;
      }
    } catch (error) {
      addToast(t("registration_failed"), { appearance: "error", autoDismiss: true });
    }
  };  

  return (
    (<LayoutTwo>
      <BreadcrumbOne
        pageTitle={t("customer_login")}
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/home/trending">
              {t("home")}
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
                        type="text"
                        name="usernameOrEmail"
                        placeholder={t("username_or_email")}
                        value={loginData.usernameOrEmail}
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
                      <label htmlFor="regEmail">
                        {t("email_address")} <span className="required">*</span>{" "}
                      </label>
                      <input
                        type="text"
                        id="regEmail"
                        name="email"
                        placeholder={t("email_placeholder")}
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                      />
                    </Col>
                    <Col lg={12} className="space-mb--50">
                      <label htmlFor="regPassword">
                        {t("password")} <span className="required">*</span>{" "}
                      </label>
                      <input
                        type="password"
                        id="regPassword"
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
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>)
  );
};

export default LoginRegister;
