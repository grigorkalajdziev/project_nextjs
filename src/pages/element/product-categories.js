import Link from "next/link";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { SectionTitleThree } from "../../components/SectionTitle";
import {
  CategorySlider,
  CategoryGrid,
  CategoryGridTwo
} from "../../components/Category";
import categoryData from "../../data/categories/category-one.json";

const ProductCategories = () => {
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Product Categories"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Product Categories</li>
        </ul>
      </BreadcrumbOne>
      <div className="element-wrapper space-mt--r130 space-mb--r130">
        <SectionTitleThree
          title="Style 01"
          subtitle="This is where to find your satisfactory products"
        />
        {/* category grid */}
        <CategoryGridTwo spaceBottomClass="space-mb--r100" />

        {/* category slider */}
        <SectionTitleThree
          title="Style 02"
          subtitle="This is where to find your satisfactory products"
        />
        <CategorySlider
          categoryData={categoryData}
          spaceBottomClass="space-mb--r100"
        />

        {/* category grid */}
        <SectionTitleThree
          title="Style 03"
          subtitle="This is where to find your satisfactory products"
        />
        <CategoryGrid />
      </div>
    </LayoutTwo>
  );
};

export default ProductCategories;
