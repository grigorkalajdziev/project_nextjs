import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../api/register"; // Import Firebase auth
import { onAuthStateChanged, signOut, updatePassword } from "firebase/auth";
import { getDatabase, ref, set, get, update, remove } from "firebase/database";
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
import { Badge } from "react-bootstrap";

const MyAccount = () => {
  const { t, currentLanguage } = useLocalization();
  const { addToast } = useToasts();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest");

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
  const [errors, setErrors] = useState({});

  // --- Password Visibility Toggle States ---
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvc, setCvc] = useState("");

  const conversionRate = 61.5;

  const formatTotal = (mkdTotal) => {
    const mkd = parseFloat(mkdTotal) || 0;
    if (currentLanguage === "mk") {
      return `${mkd.toFixed(2)} ден.`;
    }
    const eur = (mkd / conversionRate).toFixed(2);
    return `€ ${eur}`;
  };

  const grandTotalMKD = orders.reduce(
    (sum, order) => sum + (parseFloat(order.total) || 0),
    0
  );

  const db = getDatabase();

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

  const deleteOrder = async (orderId) => {
    if (!user) {
      console.error("Cannot delete before user loaded");
      addToast(t("delete_error"), { appearance: "error", autoDismiss: true });
      return;
    }
    const uid =
      role === "admin"
        ? orders.find((o) => o.id === orderId)?.userId
        : user.uid;
    if (!uid) {
      console.error("Missing userId for delete", orderId);
      addToast(t("delete_error"), { appearance: "error", autoDismiss: true });
      return;
    }
    try {
      await remove(ref(db, `orders/${uid}/${orderId}`));
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      addToast(t("order_deleted"), {
        appearance: "success",
        autoDismiss: true,
      });
    } catch (err) {
      console.error("Error deleting order:", err);
      addToast(`${t("delete_error")}: ${err.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const updateOrder = async (orderId, userId, newStatus) => {
    try {
      // Find the correct userId based on the current orders array
      const matchingOrder = orders.find((o) => o.id === orderId);
      if (!matchingOrder) throw new Error("Order not found");

      const { userId } = matchingOrder;

      // Update only the status field at the correct location
      await update(ref(db, `orders/${userId}/${orderId}`), {
        status: newStatus,
      });

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

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
            setNameOnCard(userData.billingInfo?.nameOnCard || "");
            setCardNumber(userData.billingInfo?.cardNumber || "");
            setExpiration(userData.billingInfo?.expiration || "");
            setCvc(userData.billingInfo?.cvc || "");
            setRole(userData.role || "guest");
          } else {
            console.log("No additional user data found in database.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        setDownloads([]);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !role) return;

      try {
        const ordersRef =
          role === "admin" ? ref(db, "orders") : ref(db, `orders/${user.uid}`);
        const snap = await get(ordersRef);

        if (!snap.exists()) {
          setOrders([]);
          return;
        }

        const raw = snap.val();
        let orderList = [];

        if (role === "admin") {
          Object.entries(raw).forEach(([uid, userOrders]) => {
            Object.entries(userOrders).forEach(([id, order]) => {
              orderList.push({ userId: uid, id, ...order });
            });
          });
        } else {
          orderList = Object.entries(raw).map(([id, order]) => ({
            id,
            ...order,
          }));
        }

        setOrders(orderList);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [user, role]);

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

  const isValidNameOnCard = (name) => {
    const trimmed = name.trim();
    return (
      trimmed.length >= 2 &&
      trimmed.length <= 30 &&
      /^[a-zA-Z\s]+$/.test(trimmed)
    );
  };

  const isValidCardNumber = (cardNum) => {
    const cleaned = cardNum.replace(/\D/g, "");
    if (cleaned.length < 13 || cleaned.length > 19) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  };

  const isValidExpiration = (exp) => {
    if (exp.length !== 5 || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) {
      return false;
    }
    const [monthStr, yearStr] = exp.split("/");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // two-digit year
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }
    return true;
  };

  const formatExpiration = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length === 0) return "";
    if (cleaned.length < 2) return cleaned;
    if (cleaned.length === 2) return cleaned + "/";
    return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
  };

  // Validate CVC: must be 3 or 4 digits.
  const isValidCVC = (value) => {
    return value.length >= 3 && value.length <= 4 && /^\d{3,4}$/.test(value);
  };

  const validatePaymentFields = () => {
    if (!nameOnCard && !cardNumber && !expiration && !cvc) {
      setErrors({});
      return true;
    }

    const newErrors = {};

    if (!isValidNameOnCard(nameOnCard)) {
      newErrors.nameOnCard = t("nameOnCard");
    }
    if (!isValidCardNumber(cardNumber)) {
      newErrors.cardNumber = t("cardNumber");
    }
    if (!isValidExpiration(expiration)) {
      newErrors.expiration = t("invalid_expiration");
    }
    if (!isValidCVC(cvc)) {
      newErrors.cvc = t("invalid_cvc");
    }

    // Display each error message as a toast
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((msg) => {
        addToast(msg, { appearance: "error", autoDismiss: true });
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Save Profile Handler ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!validatePaymentFields()) {
      return;
    }

    setIsLoading(true);
    const userRef = ref(db, `users/${user.uid}`);

    try {
      // If new password is provided, update it in Auth and then save in the Realtime Database
      if (newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          addToast(t("password_mismatch"), {
            appearance: "error",
            autoDismiss: true,
          });
          setIsLoading(false);
          return;
        }
        if (newPassword.length < 6) {
          addToast(t("password_strength"), {
            appearance: "error",
            autoDismiss: true,
          });
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
              nameOnCard,
              cardNumber,
              expiration,
              cvc,
            },
            role: "guest",
          });
          addToast(t("password_changed_success"), {
            appearance: "success",
            autoDismiss: true,
          });
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
            nameOnCard,
            cardNumber,
            expiration,
            cvc,
          },
          role: "guest",
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
            <Link
              href="/home/trending"
              as={process.env.PUBLIC_URL + "/home/trending"}
            >
              {t("home")}
            </Link>
          </li>
          <li>{t("my_account")}</li>
        </ul>
      </BreadcrumbOne>
      <div className="my-account-area space-mt--r130 space-mb--r130">
        <Container>
          <Tab.Container defaultActiveKey="dashboard">
            <Nav
              variant="pills"
              className="my-account-area__navigation space-mb--r60"
            >
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
                <Nav.Link eventKey="accountDetails">
                  {t("account_details")}
                </Nav.Link>
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
                    <button
                      onClick={handleLogout}
                      className="btn btn-danger"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
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
                            <th>{t("date_of_reservation")}</th>
                            <th>{t("time_of_reservation")}</th>
                            <th>{t("status")}</th>
                            <th>{t("total")}</th>
                            <th>{t("action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id}>
                              <td>{order.orderNumber}</td>
                              <td>{order.date}</td>
                              <td>{order.reservationDate}</td>
                              <td>{order.reservationTime}</td>
                              <td>
                                {role === "admin" &&
                                order.status === "pending" ? (
                                  <select
                                    value={order.status}
                                    onChange={(e) =>
                                      updateOrder(
                                        order.id,
                                        user.uid,
                                        e.target.value
                                      )
                                    }
                                    className="form-select"
                                  >
                                    <option value="pending">
                                      {t("pending")}
                                    </option>
                                    <option value="confirmed">
                                      {t("confirmed")}
                                    </option>
                                    <option value="cancelled">
                                      {t("cancelled")}
                                    </option>
                                  </select>
                                ) : (
                                  <Badge
                                    pill
                                    bg={
                                      order.status === "pending"
                                        ? "warning"
                                        : order.status === "confirmed"
                                          ? "success"
                                          : order.status === "cancelled"
                                            ? "danger"
                                            : "secondary"
                                    }
                                    className="fs-6 p-2"
                                  >
                                    {t(order.status)}
                                  </Badge>
                                )}
                              </td>
                              <td>{formatTotal(order.total)}</td>
                              <td>
                                <Link href="#" className="btn btn-primary me-2">
                                  {t("view")}
                                </Link>
                                <button
                                  onClick={() => deleteOrder(order.id)}
                                  className="btn btn-outline-danger"
                                >
                                  {t("delete")}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td
                              colSpan={5}
                              className="text-end font-weight-bold"
                            >
                              {t("grand_total_label")}
                            </td>
                            <td>{formatTotal(grandTotalMKD)}</td>
                            <td />
                          </tr>
                        </tfoot>
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
                  {orders.length > 0 ? (
                    <div className="myaccount-table table-responsive text-center">
                      <table className="table table-bordered">
                        <thead className="thead-light">
                          <tr>
                            <th>{t("order")}</th>
                            <th>{t("payment_method")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order, index) => (
                            <tr key={index}>
                              <td>{order.orderNumber}</td>
                              <td>{t(order.paymentMethod)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="saved-message">{t("no_payment_saved")}</p>
                  )}
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
                          <div className="single-input-item">
                            <h3>{t("payment_information")}</h3>
                            <label>{t("name_on_card")}</label>
                            <input
                              type="text"
                              value={nameOnCard}
                              onChange={(e) => setNameOnCard(e.target.value)}
                              placeholder={t("enter_name_on_card")}
                            />
                          </div>
                          <div className="single-input-item">
                            <label>{t("card_number")}</label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => {
                                const formatted = formatCardNumber(
                                  e.target.value
                                );
                                setCardNumber(formatted);
                              }}
                              placeholder="**** **** **** ****"
                              maxLength="19"
                            />
                          </div>
                          <Row>
                            <Col md={6}>
                              <div className="single-input-item">
                                <label>{t("expiration")}</label>
                                <input
                                  type="text"
                                  value={expiration}
                                  onChange={(e) => {
                                    const formatted = formatExpiration(
                                      e.target.value
                                    );
                                    setExpiration(formatted);
                                  }}
                                  placeholder={t("MM_YY")}
                                  maxLength="5"
                                />
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="single-input-item">
                                <label>{t("cvc").toUpperCase()}</label>
                                <input
                                  type="text"
                                  value={cvc}
                                  onChange={(e) => setCvc(e.target.value)}
                                  placeholder={t("enter_cvc")}
                                  maxLength="3"
                                />
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                      <fieldset>
                        <legend>{t("password_change")}</legend>
                        {/* Current Password Field with Toggle */}
                        <div
                          className="single-input-item"
                          style={{ position: "relative" }}
                        >
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
                            <div
                              className="single-input-item"
                              style={{ position: "relative" }}
                            >
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
                                  <AiOutlineEyeInvisible
                                    size={20}
                                    color="#000"
                                  />
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            {/* Confirm Password Field with Toggle */}
                            <div
                              className="single-input-item"
                              style={{ position: "relative" }}
                            >
                              <label htmlFor="confirm-pwd" className="required">
                                {t("confirm_password")}
                              </label>
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirm-pwd"
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
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
                                  <AiOutlineEyeInvisible
                                    size={20}
                                    color="#000"
                                  />
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
