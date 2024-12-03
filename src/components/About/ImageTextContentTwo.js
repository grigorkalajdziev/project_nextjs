import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";

const ImageTextContentTwo = () => {
  return (
    <div className="image-text-content-area space-mb--50">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <div className="cosmetics-home-intro mb-4 mb-md-0">
              <p className="label">NEW COLLECTION /</p>
              <h2 className="title">
                Professional <br /> skin care for you
              </h2>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur cing elit. Suspe ndisse
                suscipit sagittis leo sit met condimentum estibulum issim Lorem
                ipsum dolor sit amet, consectetur cing elit.
              </p>
              <Link
                href="/other/about"
                as={process.env.PUBLIC_URL + "/other/about"}
              >
                <a className="lezada-shop-link">LEARN MORE</a>
              </Link>
            </div>
          </Col>
          <Col md={6}>
            <div className="single-banner-image text-center text-md-right">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/assets/images/banners/banner-cosmetic-5.jpg"
                }
                className="img-fluid"
                alt=""
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ImageTextContentTwo;
