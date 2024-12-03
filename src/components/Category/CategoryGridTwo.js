import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";

const CategoryGridTwo = ({ spaceBottomClass }) => {
  return (
    <div
      className={`product-category-container ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <Container className="wide">
        <Row>
          <Col lg={3} md={6}>
            <div className="single-category single-category--one">
              <div className="single-category__image single-category__image--one">
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/category/category-women.jpg"
                  }
                  className="img-fluid"
                  alt=""
                />
              </div>
              <div className="single-category__content single-category__content--one space-mt--25 space-mb--25">
                <div className="title">
                  <p>Women</p>
                  <Link
                    href="/shop/left-sidebar"
                    as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                  >
                    <a>+ Online store</a>
                  </Link>
                </div>
                <p className="product-count">999</p>
              </div>
              <Link
                href="/shop/left-sidebar"
                as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
              >
                <a className="banner-link" />
              </Link>
            </div>
          </Col>
          <Col lg={3} md={6}>
            <div className="single-category single-category--one">
              <div className="single-category__content single-category__content--one space-mt--25 space-mb--25">
                <div className="title">
                  <p>Shoes</p>
                  <Link
                    href="/shop/left-sidebar"
                    as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                  >
                    <a>+ Online store</a>
                  </Link>
                </div>
                <p className="product-count">222</p>
              </div>

              <div className="single-category__image single-category__image--one">
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/category/category-shoes.jpg"
                  }
                  className="img-fluid"
                  alt=""
                />
              </div>

              <Link
                href="/shop/left-sidebar"
                as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
              >
                <a className="banner-link" />
              </Link>
            </div>
          </Col>
          <Col lg={3} md={6}>
            <div className="single-category single-category--one">
              <div className="single-category__image single-category__image--one">
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/category/category-bags.jpg"
                  }
                  className="img-fluid"
                  alt=""
                />
              </div>
              <div className="single-category__content single-category__content--one space-mt--25 space-mb--25">
                <div className="title">
                  <p>Bags</p>
                  <Link
                    href="/shop/left-sidebar"
                    as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                  >
                    <a>+ Online store</a>
                  </Link>
                </div>
                <p className="product-count">4</p>
              </div>
              <Link
                href="/shop/left-sidebar"
                as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
              >
                <a className="banner-link" />
              </Link>
            </div>
          </Col>
          <Col lg={3} md={6}>
            <div className="single-category single-category--one">
              <div className="single-category__content single-category__content--one space-mt--25 space-mb--25">
                <div className="title">
                  <p>Men</p>
                  <Link
                    href="/shop/left-sidebar"
                    as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                  >
                    <a>+ Online store</a>
                  </Link>
                </div>
                <p className="product-count">4</p>
              </div>

              <div className="single-category__image single-category__image--one">
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/category/category-men.jpg"
                  }
                  className="img-fluid"
                  alt=""
                />
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

export default CategoryGridTwo;
