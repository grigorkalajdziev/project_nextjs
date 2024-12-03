import { connect } from "react-redux";
import { getProducts } from "../../lib/product";
import { LayoutOne } from "../../components/Layout";
import { HeroSliderEleven } from "../../components/HeroSlider";
import { HoverBannerFour } from "../../components/Banner";
import { ProductsWithBannerOne } from "../../components/ProductsWithBanner";
import { ImageCta } from "../../components/Cta";

import heroSliderData from "../../data/hero-sliders/hero-slider-eleven.json";
import imageCtaData from "../../data/image-cta/image-cta-two.json";

const Special = ({ menProducts, womenProducts }) => {
  return (
    <LayoutOne>
      {/* hero slider */}
      <HeroSliderEleven
        sliderData={heroSliderData}
        spaceBottomClass="space-mb--r80"
      />
      {/* products with banner */}
      <ProductsWithBannerOne
        products={womenProducts}
        bannerImage="/assets/images/banners/women.png"
        bannerTitle="#women"
        bannerUrl="/shop/left-sidebar"
        bannerPosition="left"
      />

      {/* banner */}
      <HoverBannerFour spaceBottomClass="space-mb--r130" />

      {/* products with banner */}
      <ProductsWithBannerOne
        products={menProducts}
        bannerImage="/assets/images/banners/men.png"
        bannerTitle="#men"
        bannerUrl="/shop/left-sidebar"
      />
      {/* image cta */}
      <ImageCta
        image={imageCtaData.image}
        tags={imageCtaData.tags}
        title={imageCtaData.title}
        url={imageCtaData.url}
      />
    </LayoutOne>
  );
};

const mapStateToProps = (state) => {
  const products = state.productData;
  return {
    menProducts: getProducts(products, "men", "popular", 6),
    womenProducts: getProducts(products, "women", "popular", 6)
  };
};

export default connect(mapStateToProps)(Special);
