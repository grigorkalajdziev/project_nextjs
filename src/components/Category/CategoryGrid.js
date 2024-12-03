import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";

const CategoryGrid = ({ spaceBottomClass }) => {
  return (
    <div
      className={`product-category-container ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <Container>
        <Row className="row-5 space-mb--n10">
          <Col lg={6}>
            <Row className="row-5">
              <Col lg={12}>
                <div className="single-category single-category--three space-mb--10">
                  <div className="single-category__image single-category__image--three">
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "/assets/images/category/banner-women.jpg"
                      }
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="single-category__content single-category__content--three">
                    <div className="title">
                      <p>Women</p>
                      <Link
                        href="/shop/left-sidebar"
                        as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                      >
                        <a>+ Store</a>
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
              <Col md={6}>
                <div className="single-category single-category--three space-mb--10">
                  <div className="single-category__image single-category__image--three">
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "/assets/images/category/banner-shoes.jpg"
                      }
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="single-category__content single-category__content--three">
                    <div className="title">
                      <p>Shoes</p>
                      <Link
                        href="/shop/left-sidebar"
                        as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                      >
                        <a>+ Store</a>
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
              <Col md={6}>
                <div className="single-category single-category--three space-mb--10">
                  <div className="single-category__image single-category__image--three">
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "/assets/images/category/banner-sunglass.jpg"
                      }
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="single-category__content single-category__content--three">
                    <div className="title">
                      <p>Sunglass</p>
                      <Link
                        href="/shop/left-sidebar"
                        as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                      >
                        <a>+ Store</a>
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
          </Col>
          <Col lg={6}>
            <Row className="row-5">
              <Col lg={12}>
                <div className="single-category single-category--three space-mb--10">
                  <div className="single-category__image single-category__image--three">
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "/assets/images/category/banner-accessories.jpg"
                      }
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="single-category__content single-category__content--three">
                    <div className="title">
                      <p>Lookbook ss-20</p>
                      <Link
                        href="/shop/left-sidebar"
                        as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                      >
                        <a>+ Store</a>
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
              <Col lg={12}>
                <div className="single-category single-category--three space-mb--10">
                  <div className="single-category__image single-category__image--three">
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "/assets/images/category/banner-men.jpg"
                      }
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="single-category__content single-category__content--three">
                    <div className="title">
                      <p>Men</p>
                      <Link
                        href="/shop/left-sidebar"
                        as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                      >
                        <a>+ Store</a>
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
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CategoryGrid;
