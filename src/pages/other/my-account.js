import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../api/register"; // Import Firebase auth
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { Container, Row, Col } from "react-bootstrap";
import { FaCloudDownloadAlt, FaRegEdit } from "react-icons/fa";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useLocalization } from "../../context/LocalizationContext";
import { useToasts } from "react-toast-notifications";

const MyAccount = () => {
  const { t } = useLocalization();
  const { addToast } = useToasts();

  const router = useRouter();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");

  // Check for user authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);      
      
      addToast(t("logout_success"), {
        appearance: "info",
        autoDismiss: true,
      });
  
      // Delay the redirect
      setTimeout(() => {
        router.push("/other/login-register");
      }, 2000);
    } catch (error) {
      addToast(error.message, { appearance: "error", autoDismiss: true });
      console.error("Logout Error:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Update Firebase Auth user info (like displayName)
    try {
      if (user) {
        // Update Firebase Auth with new displayName
        await user.updateProfile({
          displayName: displayName,
        });

        // Now you can also update Firestore for address details if needed
        // Assuming you have Firestore setup for storing address details

        const userRef = firestore.collection("users").doc(user.uid);
        await userRef.update({
          address: address,
          city: city,
          zipCode: zipCode,
          phone: phone,
        });

        alert(t("address_updated"));
      }
    } catch (error) {
      console.error("Error updating address", error);
    }
  };

  return (
    <LayoutTwo>
      {/* breadcrumb */}
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
              <a>{t("home")}</a>
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
              {/* <Nav.Item>
                <Nav.Link eventKey="address">{t("address")}</Nav.Link>
              </Nav.Item> */}
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
                      <strong>{user ? user.displayName || " " : " "}</strong> (
                      {t("if_not")}{" "}
                      <strong>
                        {user?.email ? user?.displayName || " " : " "}!
                      </strong>
                      )
                    </p>
                    {/* Logout Button */}
                    <button onClick={handleLogout} className="btn btn-danger">
                      {t("logout")}
                    </button>
                  </div>
                  <p className="mt-2">{t("dashboard_welcome")}</p>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="orders">
                <div className="my-account-area__content">
                  <h3>{t("orders")}</h3>
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
                        <tr>
                          <td>1</td>
                          <td>Aug 22, 2018</td>
                          <td>Pending</td>
                          <td>$3000</td>
                          <td>
                            <a href="#" className="check-btn sqr-btn">
                              {t("view")}
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>July 22, 2018</td>
                          <td>Approved</td>
                          <td>$200</td>
                          <td>
                            <a href="#" className="check-btn sqr-btn">
                              {t("view")}
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>June 12, 2017</td>
                          <td>On Hold</td>
                          <td>$990</td>
                          <td>
                            <a href="#" className="check-btn sqr-btn">
                              {t("view")}
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="download">
                <div className="my-account-area__content">
                  <h3>{t("download")}</h3>
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
                        <tr>
                          <td>Haven - Free Real Estate PSD Template</td>
                          <td>Aug 22, 2020</td>
                          <td>Yes</td>
                          <td>
                            <a href="#" className="check-btn sqr-btn">
                              <FaCloudDownloadAlt /> {t("download_file")}
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>HasTech - Portfolio Business Template</td>
                          <td>Sep 12, 2020</td>
                          <td>Never</td>
                          <td>
                            <a href="#" className="check-btn sqr-btn">
                              <FaCloudDownloadAlt /> {t("download_file")}
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="payment">
                <div className="my-account-area__content">
                  <h3>{t("payment_method")}</h3>
                  <p className="saved-message">{t("no_payment_saved")}</p>
                </div>
              </Tab.Pane>
              {/* <Tab.Pane eventKey="address">
                
              </Tab.Pane> */}

              <Tab.Pane eventKey="accountDetails">
                <div className="my-account-area__content">
                  <h3>{t("account_details")}</h3>
                  <div className="account-details-form">
                    <form>
                      <Row>
                        <Col lg={6}>
                          <div className="single-input-item">
                            <label htmlFor="first-name" className="required">
                              {t("first_name")}
                            </label>
                            <input
                              type="text"
                              id="first-name"
                              defaultValue={
                                user?.displayName?.split(" ")[0] || ""
                              }
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
                              defaultValue={
                                user?.displayName?.split(" ")[1] || ""
                              }
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
                          defaultValue={user?.displayName || ""}
                        />
                      </div>
                      <div className="single-input-item">
                        <label htmlFor="email" className="required">
                          {t("email_address")}
                        </label>
                        <input
                          type="email"
                          id="email"
                          defaultValue={user?.email || ""}
                          readOnly
                        />
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
                        <div className="single-input-item">
                          <label htmlFor="current-pwd" className="required">
                            {t("current_password")}
                          </label>
                          <input type="password" id="current-pwd" />
                        </div>
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="single-input-item">
                              <label htmlFor="new-pwd" className="required">
                                {t("new_password")}
                              </label>
                              <input type="password" id="new-pwd" />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="single-input-item">
                              <label htmlFor="confirm-pwd" className="required">
                                {t("confirm_password")}
                              </label>
                              <input type="password" id="confirm-pwd" />
                            </div>
                          </div>
                        </div>
                      </fieldset>
                      <div className="single-input-item">
                        <button>{t("save_changes")}</button>
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
