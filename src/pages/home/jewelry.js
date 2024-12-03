import Head from "next/head";
import { connect } from "react-redux";
import { getProducts } from "../../lib/product";
import { LayoutTen } from "../../components/Layout";
import { HeroSliderEight } from "../../components/HeroSlider";
import { VideoIconContent, ImageTextContent } from "../../components/About";
import { ProductSliderThree } from "../../components/ProductSlider";
import { BrandLogoTwo } from "../../components/BrandLogo";
import { ImageCtaFour } from "../../components/Cta";
import { ImageSliderOne } from "../../components/ImageSlider";

import heroSliderData from "../../data/hero-sliders/hero-slider-eight.json";
import brandLogoData from "../../data/brand-logos/brand-logo-one.json";
import imageSliderData from "../../data/image-sliders/image-slider-one.json";

const jewelry = ({ products }) => {
  return (
    <LayoutTen>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Spectral:300,300i,400,400i,500,500i,600,600i,700,700i&display=swap"
          rel="stylesheet"
        />
      </Head>
      {/* hero slider */}
      <HeroSliderEight
        sliderData={heroSliderData}
        spaceBottomClass="space-mb--30"
      />
      {/* video icon content */}
      <VideoIconContent />

      {/* product slider */}
      <ProductSliderThree products={products} />

      {/* image text content */}
      <ImageTextContent />

      {/* brand logo */}
      <BrandLogoTwo brandLogoData={brandLogoData} />

      {/* cta */}
      <ImageCtaFour />

      {/* image slider */}
      <ImageSliderOne imageSliderData={imageSliderData} />
    </LayoutTen>
  );
};

const mapStateToProps = (state) => {
  const products = state.productData;
  return {
    products: getProducts(products, "jewelry", "popular", 9)
  };
};

export default connect(mapStateToProps)(jewelry);
