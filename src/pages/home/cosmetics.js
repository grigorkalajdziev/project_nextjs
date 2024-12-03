import { Fragment } from "react";
import Link from "next/link";
import Head from "next/head";
import { connect } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { IoIosAdd } from "react-icons/io";
import { LayoutTwo } from "../../components/Layout";
import { HeroSliderNine } from "../../components/HeroSlider";
import { getProducts } from "../../lib/product";
import { SectionTitleThree } from "../../components/SectionTitle";
import { CategoryGridFive } from "../../components/Category";
import { ImageTextContentTwo } from "../../components/About";
import { ProductGridWrapper } from "../../components/ProductThumb";
import { TestimonialTwo } from "../../components/Testimonial";
import { ImageSliderTwo } from "../../components/ImageSlider";

import heroSliderData from "../../data/hero-sliders/hero-slider-nine.json";
import testimonialTwoData from "../../data/testimonials/testimonial-two.json";
import imageSliderData from "../../data/image-sliders/image-slider-one.json";

const Cosmetics = ({ products }) => {
  return (
    <Fragment>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Allura&display=swap"
          rel="stylesheet"
        />
      </Head>
      {/* hero slider */}
      <HeroSliderNine sliderData={heroSliderData} />
      <LayoutTwo aboutOverlay={false}>
        {/* image text content */}
        <ImageTextContentTwo />
        {/* category */}
        <CategoryGridFive />
        {/* testimonial */}
        <TestimonialTwo
          testimonialData={testimonialTwoData}
          backgroundImage="/assets/images/backgrounds/testimonials-bg.png"
        />
        {/* product grid */}
        <div className="element-wrapper space-mt--r130 space-mb--r130">
          <SectionTitleThree title="Customer favorites" />
          <Container>
            <Row>
              <ProductGridWrapper
                products={products}
                column={4}
                bottomSpace="space-mb--r50"
              />
              <Col lg={12} className="text-center">
                <Link
                  href="/shop/left-sidebar"
                  as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                >
                  <a className="lezada-loadmore-button">
                    <IoIosAdd /> SEE MORE ...
                  </a>
                </Link>
              </Col>
            </Row>
          </Container>
        </div>
        {/* image slider */}
        <ImageSliderTwo imageSliderData={imageSliderData} />
      </LayoutTwo>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  const products = state.productData;
  return {
    products: getProducts(products, "cosmetics", "popular", 8)
  };
};

export default connect(mapStateToProps)(Cosmetics);
