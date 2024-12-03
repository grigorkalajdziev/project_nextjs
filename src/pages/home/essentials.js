import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { getProducts } from "../../lib/product";
import { LayoutSeven } from "../../components/Layout";
import { HeroSliderThree } from "../../components/HeroSlider";
import { SectionTitleOne } from "../../components/SectionTitle";
import { CategoryGrid } from "../../components/Category";
import { CountdownTimerFive } from "../../components/Countdown";
import { ProductTabTwo } from "../../components/ProductTab";
import { BlogPostSlider } from "../../components/Blog";
import blogData from "../../data/blog-posts/blog-post-one.json";
import heroSliderData from "../../data/hero-sliders/hero-slider-three.json";

const Essentials = ({ newProducts, popularProducts, saleProducts }) => {
  return (
    <LayoutSeven>
      {/* hero slider */}
      <HeroSliderThree
        sliderData={heroSliderData}
        spaceBottomClass="space-mb--r100"
      />

      {/* category grid */}
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
          <Row>
            <div className="col-lg-12">
              <SectionTitleOne title="Spring 2020 collection" />
            </div>
          </Row>
        </Container>
      </div>
      <CategoryGrid spaceBottomClass="space-mb--r100" />

      {/* countdown timer */}
      <CountdownTimerFive
        title="Deal of the day"
        backgroundImage="/assets/images/countdown/bg-countdown-2.jpg"
        dateTime="July 07, 2020 12:12:00"
        url="/shop/left-sidebar"
        buttonText="Only $39"
        spaceBottomClass="space-mb--r100"
      />

      {/* product tab */}
      <ProductTabTwo
        newProducts={newProducts}
        popularProducts={popularProducts}
        saleProducts={saleProducts}
      />

      {/* blog post slider */}
      <BlogPostSlider blogData={blogData} spaceBottomClass="space-mb--r100" />
    </LayoutSeven>
  );
};

const mapStateToProps = (state) => {
  const products = state.productData;
  return {
    newProducts: getProducts(products, "fashion", "new", 8),
    popularProducts: getProducts(products, "fashion", "popular", 8),
    saleProducts: getProducts(products, "fashion", "sale", 8)
  };
};

export default connect(mapStateToProps)(Essentials);
