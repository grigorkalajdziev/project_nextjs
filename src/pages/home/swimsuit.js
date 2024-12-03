import Head from "next/head";
import { connect } from "react-redux";
import { Container, Row } from "react-bootstrap";
import { getProducts } from "../../lib/product";
import { ProductGridWrapper } from "../../components/ProductThumb";
import { LayoutTwo } from "../../components/Layout";
import { HeroSliderTen } from "../../components/HeroSlider";
import { CategoryGridSix } from "../../components/Category";
import { BrandLogoThree } from "../../components/BrandLogo";
import { ImageTextContentThree } from "../../components/About";
import { TestimonialThree } from "../../components/Testimonial";
import { ImageSliderThree } from "../../components/ImageSlider";

import heroSliderData from "../../data/hero-sliders/hero-slider-ten.json";
import brandLogoData from "../../data/brand-logos/brand-logo-one.json";
import testimonialOneData from "../../data/testimonials/testimonial-one.json";
import imageSliderData from "../../data/image-sliders/image-slider-one.json";

const Swimsuit = ({ products }) => {
  return (
    <LayoutTwo aboutOverlay={false} footerBgClass="bg-color--blue-two">
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Spectral:300,300i,400,400i,500,500i,600,600i,700,700i&display=swap"
          rel="stylesheet"
        />
      </Head>
      {/* hero slider */}
      <HeroSliderTen sliderData={heroSliderData} />
      {/* category */}
      <CategoryGridSix />
      {/* product grid */}
      <div className="products-wrapper space-pt--r130 space-pb--r130 space-mb--r130 bg-color--green">
        <Container>
          <div className="section-title-container space-mb--r80 text-center">
            <h2 className="section-title section-title--style-three">
              Shop Hottest Deals
            </h2>
          </div>
          <Row>
            <ProductGridWrapper
              products={products}
              column={4}
              bottomSpace="space-mb--r50"
            />
          </Row>
        </Container>
      </div>
      {/* brand logo */}
      <BrandLogoThree brandLogoData={brandLogoData} />
      {/* image text content */}
      <ImageTextContentThree />
      {/* testimonial */}
      <TestimonialThree testimonialData={testimonialOneData} />
      {/* image slider */}
      <ImageSliderThree imageSliderData={imageSliderData} />
    </LayoutTwo>
  );
};

const mapStateToProps = (state) => {
  const products = state.productData;
  return {
    products: getProducts(products, "swimsuit", "popular", 8)
  };
};

export default connect(mapStateToProps)(Swimsuit);
