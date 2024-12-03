import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";

const CategoryGridSix = () => {
  return (
    <div className="product-category-area">
      <Container>
        <Row>
          <Col lg={12}>
            <div className="product-category-text-content text-center space-pt--r100 space-pb--r100">
              <div>
                <div className="image">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/assets/images/icon/logo-circle.png"
                    }
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <h3 className="title">
                  Living out every single day <br /> and be brave to show off
                  your own true colors
                </h3>
                <p className="text">
                  Take part in our summer parties, drink out from shiny glasses
                  with juicy fresh smoothies specially made just for you. Bring
                  out the wildest part in your self.
                </p>
                <Link
                  href="/shop/left-sidebar"
                  as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                >
                  <a>SHOP NOW</a>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Container className="wide">
        <Row>
          <Col lg={12}>
            <div className="section-title-container text-center space-mb--50">
              <h4 className="section-title--style-four">
                <span>CHOOSE A TYPE</span>
              </h4>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={12} className="space-mb--50">
            <div className="product-category-list">
              <div className="single-product-category text-center">
                <div className="single-product-category__image">
                  <Link
                    href="/shop/left-sidebar"
                    as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                  >
                    <a>
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/assets/images/category/swimsuit-1.png"
                        }
                        className="img-fluid"
                        alt=""
                      />
                    </a>
                  </Link>
                </div>
                <Link
                  href="/shop/left-sidebar"
                  as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                >
                  <a className="single-product-category__title">
                    Bikini <span>( 7 items )</span>
                  </a>
                </Link>
              </div>
              <div className="single-product-category text-center">
                <div className="single-product-category__image">
                  <Link
                    href="/shop/left-sidebar"
                    as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                  >
                    <a>
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/assets/images/category/swimsuit-2.png"
                        }
                        className="img-fluid"
                        alt=""
                      />
                    </a>
                  </Link>
                </div>
                <Link
                  href="/shop/left-sidebar"
                  as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                >
                  <a className="single-product-category__title">
                    Sport Suit <span>( 6 items )</span>
                  </a>
                </Link>
              </div>
              <div className="single-product-category text-center">
                <div className="single-product-category__image">
                  <Link
                    href="/shop/left-sidebar"
                    as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                  >
                    <a>
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/assets/images/category/swimsuit-3.png"
                        }
                        className="img-fluid"
                        alt=""
                      />
                    </a>
                  </Link>
                </div>
                <Link
                  href="/shop/left-sidebar"
                  as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                >
                  <a className="single-product-category__title">
                    One Piece <span>( 5 items )</span>
                  </a>
                </Link>
              </div>
              <div className="single-product-category text-center">
                <div className="single-product-category__image">
                  <Link
                    href="/shop/left-sidebar"
                    as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                  >
                    <a>
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/assets/images/category/swimsuit-4.png"
                        }
                        className="img-fluid"
                        alt=""
                      />
                    </a>
                  </Link>
                </div>
                <Link
                  href="/shop/left-sidebar"
                  as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                >
                  <a className="single-product-category__title">
                    Wet Suits <span>( 4 items )</span>
                  </a>
                </Link>
              </div>
              <div className="single-product-category text-center">
                <div className="single-product-category__image">
                  <Link
                    href="/shop/left-sidebar"
                    as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                  >
                    <a>
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/assets/images/category/swimsuit-5.png"
                        }
                        className="img-fluid"
                        alt=""
                      />
                    </a>
                  </Link>
                </div>
                <Link
                  href="/shop/left-sidebar"
                  as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                >
                  <a className="single-product-category__title">
                    Boyshort Bottoms <span>( 3 items )</span>
                  </a>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CategoryGridSix;
