import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useLocalization } from "../../context/LocalizationContext";
import { verify } from "jsonwebtoken";

const ResetPasswordPage = ({ tokenData, error }) => {
  const { t } = useLocalization();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [isLoading, setIsLoading] = useState(false);
  
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const validatePassword = (password) => {
    if (!password) return t("please_enter_your_password");
    if (password.length < 6) return t("password_too_short");
    return "";
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setMessage(passwordError);
      setMessageType("error");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage(t("passwords_do_not_match"));
      setMessageType("error");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the update-password API endpoint with the token and new password
      const res = await fetch("/api/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: tokenData.token, // The original token received in the email
          newPassword: newPassword,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error);
        setMessageType("error");
      } else {
        setMessage(t("password_reset_success"));
        setMessageType("success");

        setTimeout(() => {
          router.push("/other/login-register");
        }, 3000);
      }
    } catch (err) {
      console.error("Error during password reset:", err);
      setMessage(err.message);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (message && messageType === "error") {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, messageType]);
  
  if (error) {
    return <div>{error}</div>;
  }
  
  return (
    <div className="my-account-area space-mt--r130 space-mb--r130">
      <Container>
        <div className="my-account-area__content">
          <h3>
            {t("reset_password_for")} <strong>{tokenData.email}</strong>
          </h3>
          <div className="account-details-form">
            <form onSubmit={handleSubmit}>
              <fieldset>
                <legend>{t("password_change")}</legend>
                <Row>
                  <Col lg={6}>
                    <div className="single-input-item" style={{ position: "relative" }}>
                      <label htmlFor="new-pwd" className="required">
                        {t("new_password")}
                      </label>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="new-pwd"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <span
                        onClick={toggleNewPasswordVisibility}
                        style={{ position: "absolute", right: "10px", top: "35px", cursor: "pointer" }}
                      >
                        {showNewPassword ? (
                          <AiOutlineEye size={20} color="#000" />
                        ) : (
                          <AiOutlineEyeInvisible size={20} color="#000" />
                        )}
                      </span>
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="single-input-item" style={{ position: "relative" }}>
                      <label htmlFor="confirm-pwd" className="required">
                        {t("confirm_password")}
                      </label>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirm-pwd"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <span
                        onClick={toggleConfirmPasswordVisibility}
                        style={{ position: "absolute", right: "10px", top: "35px", cursor: "pointer" }}
                      >
                        {showConfirmPassword ? (
                          <AiOutlineEye size={20} color="#000" />
                        ) : (
                          <AiOutlineEyeInvisible size={20} color="#000" />
                        )}
                      </span>
                    </div>
                  </Col>
                </Row>
              </fieldset>
              <div className="single-input-item">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  ) : (
                    t("reset_password")
                  )}
                </button>
              </div>
            </form>
            {message && (
              <p style={{ color: messageType === "success" ? "green" : "red" }}>
                {message}
              </p>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const { token } = query;
  if (!token) {
    return { props: { error: "No token provided" } };
  }
  try {
    // Verify token and pass both parsed token data and the original token to the component
    const tokenData = verify(token, process.env.JWT_SECRET);
    if (!tokenData.email) throw new Error("Invalid token");
    return { props: { tokenData: { ...tokenData, token } } };
  } catch (error) {
    return { props: { error: "Invalid or expired token" } };
  }
}

export default ResetPasswordPage;
