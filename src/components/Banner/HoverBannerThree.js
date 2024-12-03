import Link from "next/link";
import { Row, Col } from "react-bootstrap";

const HoverBannerThree = () => {
  return (
    <div className="hover-banner-area">
      <Row>
        <Col lg={12} className="space-mb--40">
          <div className="single-banner single-banner--hoverzoom">
            <Link
              href="/shop/left-sidebar"
              as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
            >
              <a>
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/banners/banner-cosmetic-1.jpg"
                  }
                  className="img-fluid"
                  alt=""
                />
                <span className="banner-content banner-content--product-type banner-content--product-type--bigtitle">
                  <span className="name">
                    Perfumes <span>for women</span>
                  </span>
                  <span className="price">$19.00</span>
                </span>
              </a>
            </Link>
          </div>
        </Col>
        <Col lg={12}>
          <div className="single-banner single-banner--hoverzoom">
            <Link
              href="/shop/left-sidebar"
              as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
            >
              <a>
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/banners/banner-cosmetic-2.jpg"
                  }
                  className="img-fluid"
                  alt=""
                />
                <span className="banner-content banner-content--product-type banner-content--product-type--bigtitle">
                  <span className="name">
                    Rose Hibiscus <span>Hydrating Face Mist</span>
                  </span>
                  <span className="price">$19.00</span>
                </span>
              </a>
            </Link>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HoverBannerThree;
