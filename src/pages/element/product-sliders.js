import Link from "next/link";
import { connect } from "react-redux";
import { getProducts } from "../../lib/product";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { ProductSliderTwo } from "../../components/ProductSlider";

const ProductSliders = ({ products }) => {
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Product Sliders"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Product Sliders</li>
        </ul>
      </BreadcrumbOne>
      <div className="element-wrapper space-mt--r130 space-mb--r130">
        {/* product slider */}
        <ProductSliderTwo products={products} />
      </div>
    </LayoutTwo>
  );
};

const mapStateToProps = (state) => {
  const products = state.productData;
  return {
    products: getProducts(products, "decor", "popular", 9)
  };
};

export default connect(mapStateToProps)(ProductSliders);
