import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";

const Faqs = () => {
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="F.A.Qs"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>F.A.Qs</li>
        </ul>
      </BreadcrumbOne>
      <div className="element-wrapper space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            <Col lg={6}>
              <div className="single-faq space-mb-mobile-only--50">
                <h2 className="faq-title space-mb--20">Accordion</h2>
                <Accordion defaultActiveKey="0">
                  <Card className="single-my-account space-mb--20">
                    <Card.Header className="panel-heading">
                      <Accordion.Toggle variant="link" eventKey="0">
                        <h3 className="panel-title">
                          What Shipping Methods are Available?
                        </h3>
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                      <Card.Body>
                        <p>
                          Depending on the item(s) you purchase here and the
                          location to which the item(s) will be delivered,
                          different shipping methods will be available. At
                          checkout, you will be prompted to choose a variety of
                          shipping methods.
                        </p>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>

                  <Card className="single-my-account space-mb--20">
                    <Card.Header className="panel-heading">
                      <Accordion.Toggle variant="link" eventKey="1">
                        <h3 className="panel-title">
                          Do You Ship Internationally?
                        </h3>
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                      <Card.Body>
                        <p>
                          At the moment, we only ship to Canada and the United
                          States. For international orders, please contact
                          internationalorders@dynamite.ca. If you have any
                          questions, please don’t hesitate to contact our
                          Customer Experience Department by mail or by phone at
                          1-888-882-1138 (Canada) and 1-888-342-7243 (USA).
                        </p>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>

                  <Card className="single-my-account space-mb--20">
                    <Card.Header className="panel-heading">
                      <Accordion.Toggle variant="link" eventKey="2">
                        <h3 className="panel-title">How to Track My Order?</h3>
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="2">
                      <Card.Body>
                        <p>
                          Once your order has been shipped, you will receive an
                          email with your tracking and shipping information.
                          Simply click on the link in the email or select the
                          ‘track order’ option here and enter your order number
                          and email address or sign into your account.
                        </p>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>

                  <Card className="single-my-account space-mb--20">
                    <Card.Header className="panel-heading">
                      <Accordion.Toggle variant="link" eventKey="3">
                        <h3 className="panel-title">
                          How Long Will It Take To Get My Package?
                        </h3>
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="3">
                      <Card.Body>
                        <p>
                          We ship only on business days. Business days are from
                          Monday to Friday, excluding holidays. Any order placed
                          after 12 P.M. ET will be processed the following
                          business day. Due to a high volume period, your order
                          may take longer than anticipated. For remote
                          locations, please add an additional 2-5 business day
                          to each shipping method’s expected delivery time. If
                          you are not sure whether your location is remote,
                          please click here for all the details.
                        </p>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </div>
            </Col>
            <Col lg={6}>
              <div className="single-faq">
                <h2 className="faq-title space-mb--20">Toggles</h2>
                <Accordion defaultActiveKey="0">
                  <Card className="single-my-account space-mb--20">
                    <Card.Header className="panel-heading">
                      <Accordion.Toggle variant="link" eventKey="0">
                        <h3 className="panel-title">
                          How do I place an Order?
                        </h3>
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                      <Card.Body>
                        <p>
                          Click on a Product Photo or Product Name to see more
                          detailed information. To place your order, choose the
                          specification you want and enter the quantity, and
                          click ‘Buy Now’.Please enter the required information
                          such as Delivery Address, Quantity Type etc. Before
                          clicking “Place Order”, please check your Order
                          Details carefully. If you want to add a new Delivery
                          Address, click ” Add a new address”. If you want to
                          edit a current Delivery Address, click ‘Edit this
                          address’. After confirming your Order, you will be
                          automatically taken to the Payment page
                        </p>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>

                  <Card className="single-my-account space-mb--20">
                    <Card.Header className="panel-heading">
                      <Accordion.Toggle variant="link" eventKey="1">
                        <h3 className="panel-title">
                          How Can I Cancel Or Change My Order?
                        </h3>
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                      <Card.Body>
                        <p>
                          Go to Your Orders. Click Cancel Items. Note: Select
                          the checkbox next to each item you wish to remove from
                          the order. If you want to cancel the entire order,
                          select all of the items. Click Cancel checked items
                          when finished.
                        </p>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>

                  <Card className="single-my-account space-mb--20">
                    <Card.Header className="panel-heading">
                      <Accordion.Toggle variant="link" eventKey="2">
                        <h3 className="panel-title">
                          Who Should I Contact If I Have Any Queries?
                        </h3>
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="2">
                      <Card.Body>
                        <p>
                          You can contact our customer support team by provided
                          email or mobile phone. In case, it’s not convenient to
                          talk, you can come to our store to make your request.
                        </p>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};

export default Faqs;
