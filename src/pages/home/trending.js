import Link from "next/link";
import { useState } from "react";
import { connect } from "react-redux";
import { Container, Row, Spinner } from "react-bootstrap";
import { IoIosAdd } from "react-icons/io";
import { LayoutFive } from "../../components/Layout";
import { ShopInfo } from "../../components/Shop";
import { getProducts } from "../../lib/product";
import { HeroSliderTwo } from "../../components/HeroSlider";
import { CategorySlider } from "../../components/Category";
import { SectionTitleOne } from "../../components/SectionTitle";
import { ProductGridWrapper } from "../../components/ProductThumb";
import { BlogPostSlider } from "../../components/Blog";
import { useLocalization } from "../../context/LocalizationContext";

import categoryData from "../../data/categories/category-one.json";
import blogData from "../../data/blog-posts/blog-post-one.json";
import heroSliderData from "../../data/hero-sliders/hero-slider-two.json";

const Trending = ({ products }) => {
  const { t } = useLocalization();
  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();  

  const subtitle = t("find_your_style").replace(
    "{{year}}",
    currentYear
  );

  const handleSeeMoreClick = (e) => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <LayoutFive>
      {/* hero slider */}
      <HeroSliderTwo
        sliderData={heroSliderData}
        spaceBottomClass="space-mb--50"
      />
      {/* category slider */}
      <CategorySlider
        categoryData={categoryData}
        spaceBottomClass="space-mb--r100"
      />
      {/* products */}
      <SectionTitleOne
        key={t("spring_summer")}
        title={t("spring_summer")}
        subtitle={subtitle}
      />
      <div className="products-wrapper space-mb--r100">
        <Container className="wide">
          <Row className="five-column">
            <ProductGridWrapper
              products={products}
              bottomSpace="space-mb--r50"
            />
          </Row>
          <div className="text-center">
            <Link href="/shop/left-sidebar" legacyBehavior>
              <a
                className="lezada-loadmore-button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSeeMoreClick();

                  setTimeout(() => {
                    window.location.href = "/shop/left-sidebar";
                  }, 1200);
                }}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <>
                    <span>
                      <IoIosAdd />
                    </span>
                    {t("see_more")}
                  </>
                )}
              </a>
            </Link>
          </div>
        </Container>
      </div>
      {/* blog post slider */}
      <BlogPostSlider blogData={blogData} spaceBottomClass="space-mb--50" />
      {/*shop info*/}
      <ShopInfo />
    </LayoutFive>
  );
};

const mapStateToProps = (state) => {
  const products = state.productData;
  return {
    products: getProducts(products, ["makeup", "waxing"]).slice(0, 10),
  };
};

export default connect(mapStateToProps)(Trending);
