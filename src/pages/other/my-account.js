import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../api/register"; // Import Firebase auth
import {
  onAuthStateChanged,
  signOut,  
  updatePassword,
} from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import Link from "next/link";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { FaCloudDownloadAlt, FaRegEdit } from "react-icons/fa";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useLocalization } from "../../context/LocalizationContext";
import { useToasts } from "react-toast-notifications";

const MyAccount = () => {
  const { t } = useLocalization();
  const { addToast } = useToasts();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [orders, setOrders] = useState([]);
  const [downloads, setDownloads] = useState([]);

  // --- Password Visibility Toggle States ---
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Toggle Functions for Each Password Field ---
  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // --- Fetch User Data on Auth State Change ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setDisplayName(user.displayName || "");
        setEmail(user.email || "");

        if (user.displayName) {
          const nameParts = user.displayName.split(" ");
          setFirstName(nameParts[0] || "");
          setLastName(nameParts[1] || "");
        }

        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);

        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setFirstName(userData.firstName || "");
            setLastName(userData.lastName || "");
            setDisplayName(userData.displayName || "");
            setAddress(userData.billingInfo?.address || "");
            setCity(userData.billingInfo?.city || "");
            setZipCode(userData.billingInfo?.zipCode || "");
            setPhone(userData.billingInfo?.phone || "");
            setCurrentPassword(userData.password || "");
          } else {
            console.log("No additional user data found in database.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        setOrders([]); // or setOrders(fetchedOrders)
        setDownloads([]); // or setDownloads(fetchedDownloads)
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // --- Logout Handler ---
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      addToast(t("logout_success"), {
        appearance: "info",
        autoDismiss: true,
      });
      setTimeout(() => {
        router.push("/other/login-register");
      }, 2000);
    } catch (error) {
      addToast(error.message, { appearance: "error", autoDismiss: true });
      console.error("Logout Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Save Profile Handler ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}`);

    try {
      // If new password is provided, update it in Auth and then save in the Realtime Database
      if (newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          addToast(t("password_mismatch"), { appearance: "error", autoDismiss: true });
          setIsLoading(false);
          return;
        }
        if (newPassword.length < 6) {
          addToast(t("password_strength"), { appearance: "error", autoDismiss: true });
          setIsLoading(false);
          return;
        }
        try {
          // const credential = EmailAuthProvider.credential(user.email, currentPassword);
          // await reauthenticateWithCredential(user, credential);
          await updatePassword(user, newPassword);
          // Save the new password in Realtime Database
          await set(userRef, {
            firstName,
            lastName,
            displayName,
            email,
            password: newPassword, // saving new password here
            billingInfo: {
              address,
              city,
              zipCode,
              phone,
            },
          });
          addToast(t("password_changed_success"), { appearance: "success", autoDismiss: true });
          // Clear password fields
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } catch (error) {
          addToast(error.message, { appearance: "error", autoDismiss: true });
          console.error("Password change error:", error);
          setIsLoading(false);
          return;
        }
      } else {
        // If no new password provided, update with the current password value
        await set(userRef, {
          firstName,
          lastName,
          displayName,
          email,
          password: currentPassword,
          billingInfo: {
            address,
            city,
            zipCode,
            phone,
          },
        });
      }

      addToast(t("profile_updated"), {
        appearance: "success",
        autoDismiss: true,
      });

      setTimeout(() => {
        router.reload();
      }, 1500);
    } catch (error) {
      addToast(error.message, { appearance: "error", autoDismiss: true });
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LayoutTwo>
      <BreadcrumbOne
        pageTitle={t("my_account")}
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/home/trending" as={process.env.PUBLIC_URL + "/home/trending"}>
              {t("home")}
            </Link>
          </li>
          <li>{t("my_account")}</li>
        </ul>
      </BreadcrumbOne>
      <div className="my-account-area space-mt--r130 space-mb--r130">
        <Container>
          <Tab.Container defaultActiveKey="dashboard">
            <Nav variant="pills" className="my-account-area__navigation space-mb--r60">
              <Nav.Item>
                <Nav.Link eventKey="dashboard">{t("dashboard")}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="orders">{t("orders")}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="download">{t("download")}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="payment">{t("payment")}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="accountDetails">{t("account_details")}</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="dashboard">
                <div className="my-account-area__content">
                  <h3>{t("dashboard")}</h3>
                  <div className="welcome">
                    <p>
                      {t("hello")},{" "}
                      <strong>{displayName || user?.email || ""}</strong> (
                      {t("if_not")}{" "}
                      <strong>{displayName || user?.email || ""}!</strong>)
                    </p>
                    <button onClick={handleLogout} className="btn btn-danger" disabled={isLoading}>
                      {isLoading ? (
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      ) : (
                        t("logout")
                      )}
                    </button>
                  </div>
                  <p className="mt-2">{t("dashboard_welcome")}</p>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="orders">
                <div className="my-account-area__content">
                  <h3>{t("orders")}</h3>
                  {orders.length === 0 ? (
                    <div className="saved-message">
                      <p>{t("you_have_not_made_any_order_yet")}</p>
                    </div>
                  ) : (
                    <div className="myaccount-table table-responsive text-center">
                      <table className="table table-bordered">
                        <thead className="thead-light">
                          <tr>
                            <th>{t("order")}</th>
                            <th>{t("date")}</th>
                            <th>{t("status")}</th>
                            <th>{t("total")}</th>
                            <th>{t("action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order, index) => (
                            <tr key={index}>
                              <td>{order.id}</td>
                              <td>{order.date}</td>
                              <td>{order.status}</td>
                              <td>{order.total}</td>
                              <td>
                                <a href="#" className="check-btn sqr-btn">
                                  {t("view")}
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="download">
                <div className="my-account-area__content">
                  <h3>{t("download")}</h3>
                  {downloads.length === 0 ? (
                    <div className="saved-message">
                      <p>{t("you_have_not_downloaded_any_file_yet")}</p>
                    </div>
                  ) : (
                    <div className="myaccount-table table-responsive text-center">
                      <table className="table table-bordered">
                        <thead className="thead-light">
                          <tr>
                            <th>{t("product")}</th>
                            <th>{t("date")}</th>
                            <th>{t("expire")}</th>
                            <th>{t("download")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {downloads.map((download, index) => (
                            <tr key={index}>
                              <td>{download.product}</td>
                              <td>{download.date}</td>
                              <td>{download.expire}</td>
                              <td>
                                <a href="#" className="check-btn sqr-btn">
                                  <FaCloudDownloadAlt /> {t("download_file")}
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="payment">
                <div className="my-account-area__content">
                  <h3>{t("payment_method")}</h3>
                  <p className="saved-message">{t("no_payment_saved")}</p>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="accountDetails">
                <div className="my-account-area__content">
                  <h3>{t("account_details")}</h3>
                  <div className="account-details-form">
                    <form onSubmit={handleSave}>
                      <Row>
                        <Col lg={6}>
                          <div className="single-input-item">
                            <label htmlFor="first-name" className="required">
                              {t("first_name")}
                            </label>
                            <input
                              type="text"
                              id="first-name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="single-input-item">
                            <label htmlFor="last-name" className="required">
                              {t("last_name")}
                            </label>
                            <input
                              type="text"
                              id="last-name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </div>
                        </Col>
                      </Row>
                      <div className="single-input-item">
                        <label htmlFor="display-name" className="required">
                          {t("display_name")}
                        </label>
                        <input
                          type="text"
                          id="display-name"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                        />
                      </div>
                      <div className="single-input-item">
                        <label htmlFor="email" className="required">
                          {t("email_address")}
                        </label>
                        <input type="email" id="email" value={email} readOnly />
                      </div>
                      <div className="my-account-area__content">
                        <h3>{t("billing_address")}</h3>
                        <div className="account-details-form">
                          <Row>
                            <Col lg={6}>
                              <div className="single-input-item">
                                <label htmlFor="address" className="required">
                                  {t("address")}
                                </label>
                                <input
                                  type="text"
                                  id="address"
                                  className="form-control"
                                  value={address}
                                  onChange={(e) => setAddress(e.target.value)}
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={6}>
                              <div className="single-input-item">
                                <label htmlFor="city" className="required">
                                  {t("city_label")}
                                </label>
                                <input
                                  type="text"
                                  id="city"
                                  className="form-control"
                                  value={city}
                                  onChange={(e) => setCity(e.target.value)}
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="single-input-item">
                                <label htmlFor="zip-code" className="required">
                                  {t("zip_label")}
                                </label>
                                <input
                                  type="text"
                                  id="zip-code"
                                  className="form-control"
                                  value={zipCode}
                                  onChange={(e) => setZipCode(e.target.value)}
                                />
                              </div>
                            </Col>
                          </Row>
                          <div className="single-input-item">
                            <label htmlFor="phone">{t("mobile")}</label>
                            <input
                              type="text"
                              id="phone"
                              className="form-control"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <fieldset>
                        <legend>{t("password_change")}</legend>
                        {/* Current Password Field with Toggle */}
                        <div className="single-input-item" style={{ position: "relative" }}>
                          <label htmlFor="current-pwd" className="required">
                            {t("current_password")}
                          </label>
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            id="current-pwd"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                          <span
                            onClick={toggleCurrentPasswordVisibility}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "35px",
                              cursor: "pointer",
                            }}
                          >
                            {showCurrentPassword ? (
                              <AiOutlineEye size={20} color="#000" />
                            ) : (
                              <AiOutlineEyeInvisible size={20} color="#000" />
                            )}
                          </span>
                        </div>
                        <div className="row">
                          <div className="col-lg-6">
                            {/* New Password Field with Toggle */}
                            <div className="single-input-item" style={{ position: "relative" }}>
                              <label htmlFor="new-pwd" className="required">
                                {t("new_password")}
                              </label>
                              <input
                                type={showNewPassword ? "text" : "password"}
                                id="new-pwd"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                              <span
                                onClick={toggleNewPasswordVisibility}
                                style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "35px",
                                  cursor: "pointer",
                                }}
                              >
                                {showNewPassword ? (
                                  <AiOutlineEye size={20} color="#000" />
                                ) : (
                                  <AiOutlineEyeInvisible size={20} color="#000" />
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            {/* Confirm Password Field with Toggle */}
                            <div className="single-input-item" style={{ position: "relative" }}>
                              <label htmlFor="confirm-pwd" className="required">
                                {t("confirm_password")}
                              </label>
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirm-pwd"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                              />
                              <span
                                onClick={toggleConfirmPasswordVisibility}
                                style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "35px",
                                  cursor: "pointer",
                                }}
                              >
                                {showConfirmPassword ? (
                                  <AiOutlineEye size={20} color="#000" />
                                ) : (
                                  <AiOutlineEyeInvisible size={20} color="#000" />
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                      <p>{t("password_note")}</p>
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
                            t("save_changes")
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </div>
    </LayoutTwo>
  );
};

export default MyAccount;
