import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { getProducts } from "../../lib/product";
import { LayoutEight } from "../../components/Layout";
import { HeroSliderFour } from "../../components/HeroSlider";
import { ProductTabThree } from "../../components/ProductTab";
import { CountdownTimerSix } from "../../components/Countdown";
import { HoverBannerTwo, HoverBannerThree } from "../../components/Banner";
import { BlogPostSlider } from "../../components/Blog";
import blogData from "../../data/blog-posts/blog-post-one.json";
import heroSliderData from "../../data/hero-sliders/hero-slider-four.json";

const Perfumes = ({ newProducts, popularProducts, saleProducts }) => {
  return (
    <LayoutEight>
      {/* hero slider with banner */}
      <div className="hero-slider-area space-mb--r100">
        <Container className="wide">
          <Row>
            <Col lg={6} className="space-mb-mobile-only--40">
              {/* hero slider */}
              <HeroSliderFour sliderData={heroSliderData} />
            </Col>

            <Col lg={6}>
              {/* banner */}
              <HoverBannerThree />
            </Col>
          </Row>
        </Container>
      </div>
      {/* countdown timer */}
      <div className="section-title-container">
        <Container>
          <Row className="space-mb--50">
            <Col xs={6}>
              <div className="section-title__label">
                <p>
                  SS-2020 <span className="line">84</span>
                </p>
              </div>
            </Col>
            <Col xs={6} className="text-right">
              <div className="section-title__label">
                <p>
                  INNOVATIVE <br /> DESIGN
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <CountdownTimerSix
        title="Deal of the day"
        image="/assets/images/countdown/countdown-5.jpg"
        dateTime="July 07, 2020 12:12:00"
        url="/shop/left-sidebar"
        buttonText="Only $39"
        spaceBottomClass="space-mb--r100"
      />

      {/* product tab */}
      <ProductTabThree
        newProducts={newProducts}
        popularProducts={popularProducts}
        saleProducts={saleProducts}
      />

      {/* banner */}
      <HoverBannerTwo spaceBottomClass="space-mb--r100" />

      {/* blog post slider */}
      <BlogPostSlider blogData={blogData} spaceBottomClass="space-mb--r100" />
    </LayoutEight>
  );
};

const mapStateToProps = (state) => {
  const products = state.productData;
  return {
    newProducts: getProducts(products, "perfumes", "new", 10),
    popularProducts: getProducts(products, "perfumes", "popular", 10),
    saleProducts: getProducts(products, "perfumes", "sale", 10)
  };
};

export default connect(mapStateToProps)(Perfumes);
