import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";

const HoverBannerFour = ({ spaceBottomClass }) => {
  return (
    <div
      className={`hover-banner-area ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <Container className="wide">
        <Row>
          <Col lg={6} className="space-mb-mobile-only--30">
            <div className="single-banner single-banner--hoverborder">
              <Link
                href="/shop/left-sidebar"
                as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
              >
                <a className="banner-link" />
              </Link>
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/assets/images/banners/banner-special-1.jpg"
                }
                className="img-fluid"
                alt=""
              />
              <div className="banner-content banner-content--middle-white">
                <p>
                  <span className="bold-white">10%</span> off your
                  <span className="d-block">next purchase</span>
                </p>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="single-banner single-banner--hoverborder">
              <Link
                href="/shop/left-sidebar"
                as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
              >
                <a className="banner-link" />
              </Link>
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/assets/images/banners/banner-special-2.jpg"
                }
                className="img-fluid"
                alt=""
              />
              <div className="banner-content banner-content--black-left">
                <p>
                  <span className="big-text">Free shipping</span>
                  <span className="small-text d-block">
                    Free shipping on domestic orders
                  </span>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HoverBannerFour;
