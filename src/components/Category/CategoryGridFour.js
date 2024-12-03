import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";

const CategoryGridFour = ({ spaceBottomClass }) => {
  return (
    <div
      className={`banner-category-area ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <Container>
        <Row className="space-mb--m30">
          <Col md={4}>
            <div className="single-banner single-banner--hoverzoom space-mb--30">
              <Link
                href="/shop/left-sidebar"
                as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
              >
                <a>
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/assets/images/banners/category-smart-3.jpg"
                    }
                    className="img-fluid"
                    alt=""
                  />
                  <span className="banner-content banner-content--product-type">
                    <span className="name">Tumbler Alarm Clock</span>
                    <span className="price">$19.00</span>
                  </span>
                </a>
              </Link>
            </div>
          </Col>
          <Col md={8}>
            <div className="single-banner single-banner--hoverzoom space-mb--30">
              <Link
                href="/shop/left-sidebar"
                as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
              >
                <a>
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/assets/images/banners/category-smart-1.jpg"
                    }
                    className="img-fluid"
                    alt=""
                  />
                  <span className="banner-content banner-content--banner-type banner-content--banner-type--top-right">
                    <span className="name">
                      Prismatic <span>Table</span>
                    </span>
                    <span className="lezada-button-link">SHOP NOW</span>
                  </span>
                </a>
              </Link>
            </div>
          </Col>
          <Col md={8}>
            <div className="single-banner single-banner--hoverzoom space-mb--30">
              <Link
                href="/shop/left-sidebar"
                as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
              >
                <a>
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/assets/images/banners/category-smart-2.jpg"
                    }
                    className="img-fluid"
                    alt=""
                  />
                  <span className="banner-content banner-content--banner-type banner-content--banner-type--top-left">
                    <span className="name">
                      Wooden <span>birds decor</span>{" "}
                    </span>
                    <span className="lezada-button-link">SHOP NOW</span>
                  </span>
                </a>
              </Link>
            </div>
          </Col>
          <Col md={4}>
            <div className="single-banner single-banner--hoverzoom space-mb--30">
              <Link
                href="/shop/left-sidebar"
                as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
              >
                <a>
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/assets/images/banners/category-smart-4.jpg"
                    }
                    className="img-fluid"
                    alt=""
                  />
                  <span className="banner-content banner-content--product-type">
                    <span className="name">Rocking chair</span>
                    <span className="price">$19.00</span>
                  </span>
                </a>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CategoryGridFour;
