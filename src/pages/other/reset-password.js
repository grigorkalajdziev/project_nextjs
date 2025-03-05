import { verify } from "jsonwebtoken";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useLocalization } from "../../context/LocalizationContext";

const ResetPasswordPage = ({ tokenData, error }) => {
  const { t } = useLocalization();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    // Call your API to reset the password here
    // Example: await fetch('/api/reset-password', { method: 'POST', body: JSON.stringify({ email: tokenData.email, password }) });
    setMessage("Password has been reset successfully.");
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="my-account-area space-mt--r130 space-mb--r130">
      <Container>
        <div className="my-account-area__content">
          <h3>Reset your password for: <strong>{tokenData.email}</strong></h3>
          <div className="account-details-form">
            <form onSubmit={handleSubmit}>
              <fieldset>
                <legend>{t("password_change")}</legend>
                <Row>
                  <Col lg={6}>
                    {/* New Password Field with Toggle */}
                    <div className="single-input-item" style={{ position: 'relative' }}>
                      <label htmlFor="new-pwd" className="required">{t("new_password")}</label>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="new-pwd"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <span
                        onClick={toggleNewPasswordVisibility}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '35px',
                          cursor: 'pointer',
                        }}
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
                    {/* Confirm Password Field with Toggle */}
                    <div className="single-input-item" style={{ position: 'relative' }}>
                      <label htmlFor="confirm-pwd" className="required">{t("confirm_password")}</label>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirm-pwd"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <span
                        onClick={toggleConfirmPasswordVisibility}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '35px',
                          cursor: 'pointer',
                        }}
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
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    t("reset_password")
                  )}
                </button>
              </div>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      </Container>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  console.log("Query parameters:", query);

  const { token } = query;

  if (!token) {
    console.error("No token found in query parameters");
    return { props: { error: "No token provided" } };
  }

  try {
    console.log("JWT_SECRET from env:", process.env.JWT_SECRET);

    const tokenData = verify(token, process.env.JWT_SECRET);
    console.log("Decoded token data:", tokenData);
    return { props: { tokenData } };
  } catch (error) {
    console.error("Token verification error:", error);
    return { props: { error: "Invalid or expired token" } };
  }
}

export default ResetPasswordPage;
