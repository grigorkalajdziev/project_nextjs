import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";

const OrderTracking = () => {
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Order Tracking"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/home/trending" as={process.env.PUBLIC_URL + "/home/trending"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Order Tracking</li>
        </ul>
      </BreadcrumbOne>
      <div className="order-tracking-area space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            <Col lg={6} md={10} className="ml-auto mr-auto">
              <div className="order-tracking-box">
                <p className="info-text space-mb--20">
                  To track your order please enter your Order ID in the box
                  below and press the "Track" button. This was given to you on
                  your receipt and in the confirmation email you should have
                  received.
                </p>
                <div className="lezada-form order-tracking-form">
                  <form>
                    <Row>
                      <Col lg={12} className="space-mb--20">
                        <label htmlFor="orderId">Order ID</label>
                        <input
                          type="text"
                          id="orderId"
                          placeholder="Found in your order confirmation email"
                        />
                      </Col>
                      <Col lg={12}>
                        <label htmlFor="orderEmail">Billing email</label>
                        <input
                          type="text"
                          id="orderEmail"
                          placeholder="Email you used during checkout"
                        />
                      </Col>
                      <Col
                        lg={12}
                        className="col-lg-12 text-center space-mt--40"
                      >
                        <button className="lezada-button lezada-button--medium order-tracking-button">
                          track
                        </button>
                      </Col>
                    </Row>
                  </form>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};

export default OrderTracking;
