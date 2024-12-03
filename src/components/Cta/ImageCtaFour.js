import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";

const ImageCtaFour = () => {
  return (
    <div
      className="banner-cta space-mb--r130 bg-img"
      style={{
        backgroundImage: `url("${
          process.env.PUBLIC_URL + "/assets/images/backgrounds/cta-bg.jpg"
        }")`
      }}
    >
      <Container className="wide">
        <Row>
          <Col lg={7} xl={5}>
            <div className="banner-cta-content">
              <h4 className="banner-cta-content__title">THE ESSENTIALS</h4>
              <h2 className="banner-cta-content__subtitle">
                Women are like the most precious pieces of jewelry.
              </h2>
              <Link
                href="/shop/left-sidebar"
                as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
              >
                <a className="banner-cta-content__button">SHOP NOW </a>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ImageCtaFour;
