import { Row, Col } from "react-bootstrap";
import Link from "next/link";

const ImageTextContentThree = () => {
  return (
    <div className="image-text-banner-area">
      <Row className="no-gutters h-100">
        <Col lg={6}>
          <div className="single-image-text-banner h-100">
            <Row className="no-gutters h-100">
              <Col md={6}>
                <div
                  className="single-image-text-banner__media"
                  style={{
                    backgroundImage: `url("/assets/images/banners/banner-bg-1.png")`
                  }}
                />
              </Col>
              <Col md={6}>
                <div className="single-image-text-banner__content single-image-text-banner__content--yellow-bg">
                  <div className="image">
                    <img
                      src={
                        process.env.PUBLIC_URL + "/assets/images/icon/icon3.png"
                      }
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="text">
                    Social nightlife is just as lively and colorful as a
                    kaleidoscope.
                  </div>
                  <Link
                    href="/blog/grid-left-sidebar"
                    as={process.env.PUBLIC_URL + "/blog/grid-left-sidebar"}
                  >
                    <a className="blog-readmore-btn">READ MORE</a>
                  </Link>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col lg={6}>
          <div className="single-image-text-banner h-100">
            <Row className="no-gutters h-100">
              <Col md={6}>
                <div
                  className="single-image-text-banner__media"
                  style={{
                    backgroundImage: `url("/assets/images/banners/banner-bg-2.png")`
                  }}
                />
              </Col>
              <Col md={6}>
                <div className="single-image-text-banner__content single-image-text-banner__content--pink-bg">
                  <div className="image">
                    <img
                      src={
                        process.env.PUBLIC_URL + "/assets/images/icon/icon3.png"
                      }
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="text">
                    Social nightlife is just as lively and colorful as a
                    kaleidoscope.
                  </div>
                  <Link
                    href="/blog/grid-left-sidebar"
                    as={process.env.PUBLIC_URL + "/blog/grid-left-sidebar"}
                  >
                    <a className="blog-readmore-btn">READ MORE</a>
                  </Link>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ImageTextContentThree;
