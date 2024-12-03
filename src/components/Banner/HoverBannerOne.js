import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";

const HoverBannerOne = ({ spaceBottomClass }) => {
  return (
    <div
      className={`hover-banner-area ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <Container className="wide">
        <Row className="space-mb--m30">
          <Col md={4} className="space-mb--30">
            <div className="single-category single-category--three">
              <div className="single-category__image single-category__image--three single-category__image--three--creativehome single-category__image--three--banner">
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/banners/banner-furniture-1.jpg"
                  }
                  className="img-fluid"
                  alt=""
                />
              </div>
              <div className="single-category__content single-category__content--three single-category__content--three--creativehome  single-category__content--three--banner space-mt--25 space-mb--25">
                <div className="title">
                  <p>
                    <Link
                      href="/shop/left-sidebar"
                      as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                    >
                      <a>
                        Wooden <span>Chair</span>
                      </a>
                    </Link>
                  </p>
                  <Link
                    href="/shop/left-sidebar"
                    as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                  >
                    <a>Shop Now</a>
                  </Link>
                </div>
              </div>
              <Link
                href="/shop/left-sidebar"
                as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
              >
                <a className="banner-link" />
              </Link>
            </div>
          </Col>
          <Col md={4} className="space-mb--30">
            <div className="single-category single-category--three">
              <div className="single-category__image single-category__image--three single-category__image--three--creativehome single-category__image--three--banner">
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/banners/banner-furniture-2.jpg"
                  }
                  className="img-fluid"
                  alt=""
                />
              </div>
              <div className="single-category__content single-category__content--three single-category__content--three--creativehome  single-category__content--three--banner space-mt--25 space-mb--25">
                <div className="title">
                  <p>
                    <Link
                      href="/shop/left-sidebar"
                      as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                    >
                      <a>
                        Thumbler <span>Alarm Clock</span>
                      </a>
                    </Link>
                  </p>
                  <Link
                    href="/shop/left-sidebar"
                    as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                  >
                    <a>Shop Now</a>
                  </Link>
                </div>
              </div>
              <Link
                href="/shop/left-sidebar"
                as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
              >
                <a className="banner-link" />
              </Link>
            </div>
          </Col>
          <Col md={4} className="space-mb--30">
            <div className="single-category single-category--three">
              <div className="single-category__image single-category__image--three single-category__image--three--creativehome single-category__image--three--banner">
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/banners/banner-furniture-3.jpg"
                  }
                  className="img-fluid"
                  alt=""
                />
              </div>
              <div className="single-category__content single-category__content--three single-category__content--three--creativehome  single-category__content--three--banner space-mt--25 space-mb--25">
                <div className="title">
                  <p>
                    <Link
                      href="/shop/left-sidebar"
                      as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                    >
                      <a>
                        Home <span>Decoration</span>
                      </a>
                    </Link>
                  </p>
                  <Link
                    href="/shop/left-sidebar"
                    as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                  >
                    <a>Shop Now</a>
                  </Link>
                </div>
              </div>
              <Link
                href="/shop/left-sidebar"
                as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
              >
                <a className="banner-link" />
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HoverBannerOne;
