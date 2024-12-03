import Link from "next/link";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { Container, Row, Col } from "react-bootstrap";
import { FaCloudDownloadAlt, FaRegEdit } from "react-icons/fa";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";

const MyAccount = () => {
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="My Account"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/home/trending" as={process.env.PUBLIC_URL + "/home/trending"}>
              <a>Home</a>
            </Link>
          </li>

          <li>My Account</li>
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
                <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="orders">Orders</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="download">Download</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="payment">Payment</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="address">Address</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="accountDetails">Account Details</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="dashboard">
                <div className="my-account-area__content">
                  <h3>Dashboard</h3>
                  <div className="welcome">
                    <p>
                      Hello, <strong>John Doe</strong> (If Not{" "}
                      <strong>John !</strong>{" "}
                      <Link
                        href="/other/login-register"
                        as={process.env.PUBLIC_URL + "/other/login-register"}
                      >
                        <a className="logout">Logout</a>
                      </Link>
                      )
                    </p>
                  </div>
                  <p>
                    From your account dashboard. you can easily check &amp; view
                    your recent orders, manage your shipping and billing
                    addresses and edit your password and account details.
                  </p>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="orders">
                <div className="my-account-area__content">
                  <h3>Orders</h3>
                  <div className="myaccount-table table-responsive text-center">
                    <table className="table table-bordered">
                      <thead className="thead-light">
                        <tr>
                          <th>Order</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Aug 22, 2018</td>
                          <td>Pending</td>
                          <td>$3000</td>
                          <td>
                            <a href="#" className="check-btn sqr-btn ">
                              View
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>July 22, 2018</td>
                          <td>Approved</td>
                          <td>$200</td>
                          <td>
                            <a href="#" className="check-btn sqr-btn ">
                              View
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>June 12, 2017</td>
                          <td>On Hold</td>
                          <td>$990</td>
                          <td>
                            <a href="#" className="check-btn sqr-btn ">
                              View
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
                  <h3>Downloads</h3>
                  <div className="myaccount-table table-responsive text-center">
                    <table className="table table-bordered">
                      <thead className="thead-light">
                        <tr>
                          <th>Product</th>
                          <th>Date</th>
                          <th>Expire</th>
                          <th>Download</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Haven - Free Real Estate PSD Template</td>
                          <td>Aug 22, 2020</td>
                          <td>Yes</td>
                          <td>
                            <a href="#" className="check-btn sqr-btn ">
                              <FaCloudDownloadAlt /> Download File
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>HasTech - Portfolio Business Template</td>
                          <td>Sep 12, 2020</td>
                          <td>Never</td>
                          <td>
                            <a href="#" className="check-btn sqr-btn ">
                              <FaCloudDownloadAlt /> Download File
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
                  <h3>Payment Method</h3>
                  <p className="saved-message">
                    You Can't Saved Your Payment Method yet.
                  </p>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="address">
                <div className="my-account-area__content">
                  <h3>Billing Address</h3>
                  <address>
                    <p>
                      <strong>John Doe</strong>
                    </p>
                    <p>
                      1355 Market St, Suite 900 <br />
                      San Francisco, CA 94103
                    </p>
                    <p>Mobile: (123) 456-7890</p>
                  </address>
                  <a href="#" className="check-btn sqr-btn ">
                    <FaRegEdit /> Edit Address
                  </a>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="accountDetails">
                <div className="my-account-area__content">
                  <h3>Account Details</h3>
                  <div className="account-details-form">
                    <form>
                      <Row>
                        <Col lg={6}>
                          <div className="single-input-item">
                            <label htmlFor="first-name" className="required">
                              First Name
                            </label>
                            <input type="text" id="first-name" />
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="single-input-item">
                            <label htmlFor="last-name" className="required">
                              Last Name
                            </label>
                            <input type="text" id="last-name" />
                          </div>
                        </Col>
                      </Row>
                      <div className="single-input-item">
                        <label htmlFor="display-name" className="required">
                          Display Name
                        </label>
                        <input type="text" id="display-name" />
                      </div>
                      <div className="single-input-item">
                        <label htmlFor="email" className="required">
                          Email Address
                        </label>
                        <input type="email" id="email" />
                      </div>
                      <fieldset>
                        <legend>Password change</legend>
                        <div className="single-input-item">
                          <label htmlFor="current-pwd" className="required">
                            Current Password
                          </label>
                          <input type="password" id="current-pwd" />
                        </div>
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="single-input-item">
                              <label htmlFor="new-pwd" className="required">
                                New Password
                              </label>
                              <input type="password" id="new-pwd" />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="single-input-item">
                              <label htmlFor="confirm-pwd" className="required">
                                Confirm Password
                              </label>
                              <input type="password" id="confirm-pwd" />
                            </div>
                          </div>
                        </div>
                      </fieldset>
                      <div className="single-input-item">
                        <button>Save Changes</button>
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
