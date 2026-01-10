export const getFriendlyAuthMessage = (code, t) => {
  const errorMap = {
    "auth/invalid-login-credentials": "invalid_credentials",
    "auth/wrong-password": "invalid_credentials",
    "auth/user-not-found": "user_not_found",
    "auth/email-already-in-use": "email_in_use",
    "auth/too-many-requests": "too_many_requests",
    "auth/network-request-failed": "network_error",
    "auth/invalid-email": "invalid_email_format",
    "auth/weak-password": "password_too_short",
    "auth/operation-not-allowed": "operation_not_allowed",
    "auth/popup-closed-by-user": "popup_closed",
    "auth/cancelled-popup-request": "popup_cancelled",
    "google_registration_failed": "google_registration_failed",
    "something_went_wrong": "something_went_wrong",
  };

  return t(errorMap[code] || "something_went_wrong");
};

// Email validation helper
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const validatePasswordStrength = (password) => {
  if (!password || password.length < 6) return false;
  const regex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
  return regex.test(password);
};

// Name validation helper
export const validateName = (name) => {
  return name && name.trim().length >= 2;
};