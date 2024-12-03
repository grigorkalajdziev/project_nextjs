import Link from "next/link";
import { connect } from "react-redux";
import { getProducts } from "../../lib/product";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { ProductTab } from "../../components/ProductTab";
import { SectionTitleThree } from "../../components/SectionTitle";

const ProductTabs = ({ newProducts, popularProducts, saleProducts }) => {
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Product Tabs"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Product Tabs</li>
        </ul>
      </BreadcrumbOne>
      <div className="element-wrapper space-mt--r130 space-mb--r130">
        <SectionTitleThree
          title="Product Tabs"
          subtitle="This is where to find your satisfactory products"
        />
        {/* product tab */}
        <ProductTab
          newProducts={newProducts}
          popularProducts={popularProducts}
          saleProducts={saleProducts}
        />
      </div>
    </LayoutTwo>
  );
};

const mapStateToProps = (state) => {
  const products = state.productData;
  return {
    newProducts: getProducts(products, "decor", "new", 9),
    popularProducts: getProducts(products, "decor", "popular", 9),
    saleProducts: getProducts(products, "decor", "sale", 9)
  };
};

export default connect(mapStateToProps)(ProductTabs);
